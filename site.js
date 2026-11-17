"use strict";
(() => {
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const feedback = $("#feedback");
  let feedbackTimer;
  const notify = message => {
    clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.hidden = false;
    feedbackTimer = setTimeout(() => { feedback.hidden = true; }, 5000);
  };
  $("#year").textContent = String(new Date().getFullYear());

  // Storage is optional: blocked storage must not break browsing.
  const readStorage = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const writeStorage = (key, value) => {
    try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
  };
  const themeButton = $("#theme-toggle");
  const syncTheme = () => {
    const light = document.documentElement.dataset.theme === "light";
    themeButton.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} theme`);
    $("meta[name=theme-color]").content = light ? "#f6f7f2" : "#0a1015";
  };
  themeButton.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    writeStorage("ziskare-theme", next);
    syncTheme();
  });
  syncTheme();
  themeButton.hidden = false;

  const menu = $(".menu-button");
  const nav = $("#primary-nav");
  const setMenu = (open, restoreFocus = false) => {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menu.firstElementChild.textContent = open ? "×" : "☰";
    nav.classList.toggle("is-open", open);
    if (restoreFocus) menu.focus();
  };
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;
    setMenu(false);
    // Move keyboard focus to the section instead of a now-hidden mobile link.
    const section = document.querySelector(link.getAttribute("href"));
    if (section) { section.setAttribute("tabindex", "-1"); section.focus({ preventScroll: true }); }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".navigation")) setMenu(false);
  });
  document.addEventListener("focusin", event => {
    if (!event.target.closest(".navigation")) setMenu(false);
  });
  const mobileQuery = window.matchMedia("(max-width: 900px)");
  mobileQuery.addEventListener("change", () => setMenu(false));
  document.documentElement.classList.add("menu-ready");
  menu.hidden = false;

  const grid = $("#project-grid");
  const cards = [...grid.children];
  const knownIds = new Set(cards.map(card => card.dataset.project));
  const filters = all("[data-filter]");
  const validCategories = new Set(filters.map(button => button.dataset.filter));
  const validSorts = new Set(["featured", "az", "za"]);
  const search = $("#project-search");
  const sort = $("#project-sort");
  const savedToggle = $("#saved-toggle");
  const dialog = $("#project-dialog");
  let saved = new Set();
  try {
    const parsed = JSON.parse(readStorage("ziskare-saved-projects") || "[]");
    if (Array.isArray(parsed)) saved = new Set(parsed.filter(id => knownIds.has(id)));
  } catch (_) { /* A damaged preference falls back to an empty list. */ }
  let category = "all";
  let onlySaved = false;
  let searchTimer;
  const loadView = () => {
    const params = new URL(window.location.href).searchParams;
    category = validCategories.has(params.get("category")) ? params.get("category") : "all";
    search.value = params.get("q") || "";
    sort.value = validSorts.has(params.get("sort")) ? params.get("sort") : "featured";
  };
  const viewURL = () => {
    const url = new URL(window.location.href);
    const values = { q: search.value.trim(), category: category === "all" ? "" : category, sort: sort.value === "featured" ? "" : sort.value };
    Object.entries(values).forEach(([key, value]) => { if (value) url.searchParams.set(key, value); else url.searchParams.delete(key); });
    return url;
  };
  const updateURL = () => {
    try { history.replaceState(null, "", viewURL()); } catch (_) { /* Local previews may restrict history. */ }
  };
  const syncSaved = () => {
    $("#saved-count").textContent = String(saved.size);
    savedToggle.setAttribute("aria-pressed", String(onlySaved));
    cards.forEach(card => {
      const button = card.querySelector("[data-save]");
      const isSaved = saved.has(card.dataset.project);
      button.setAttribute("aria-pressed", String(isSaved));
      button.setAttribute("aria-label", `${isSaved ? "Unsave" : "Save"} ${card.querySelector("h3").textContent}`);
    });
  };
  const render = (syncURL = true) => {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const ordered = [...cards];
    if (sort.value !== "featured") {
      ordered.sort((a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent, "en") * (sort.value === "za" ? -1 : 1));
    }
    let count = 0;
    ordered.forEach(card => {
      const searchable = [card.querySelector("h3").textContent, card.querySelector(".project-description").textContent, card.querySelector(".tags").textContent, card.querySelector(".category-label").textContent].join(" ").toLowerCase();
      const matches = (category === "all" || card.dataset.category === category) && terms.every(term => searchable.includes(term)) && (!onlySaved || saved.has(card.dataset.project));
      card.hidden = !matches;
      if (matches) count++;
      grid.append(card);
    });
    filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
    $("#project-count").textContent = `${count} of ${cards.length} projects${onlySaved ? " · saved only" : ""}`;
    $("#empty-state").hidden = count > 0;
    $("#empty-title").textContent = onlySaved && !saved.size ? "Your collection starts here" : "No matching projects";
    $("#empty-description").textContent = onlySaved && !saved.size ? "Use the bookmark button on a project to save it in this browser." : "Try a different search, category or saved-project filter.";
    syncSaved();
    if (syncURL) updateURL();
    if (!$("#share-panel").hidden) { const url = viewURL(); url.hash = "work"; $("#share-url").value = url.href; }
  };
  const reset = () => {
    clearTimeout(searchTimer);
    category = "all";
    onlySaved = false;
    search.value = "";
    sort.value = "featured";
    render();
    search.focus({ preventScroll: true });
  };
  filters.forEach(button => button.addEventListener("click", () => { clearTimeout(searchTimer); category = button.dataset.filter; render(); }));
  search.addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(render, 120); });
  sort.addEventListener("change", () => { clearTimeout(searchTimer); render(); });
  savedToggle.addEventListener("click", () => { clearTimeout(searchTimer); onlySaved = !onlySaved; render(); });
  $("#reset-projects").addEventListener("click", reset);
  $("#empty-reset").addEventListener("click", reset);
  window.addEventListener("popstate", () => { clearTimeout(searchTimer); loadView(); render(false); });

  let dialogOpener;
  cards.forEach(card => {
    const save = card.querySelector("[data-save]");
    save.hidden = false;
    save.addEventListener("click", () => {
      const id = card.dataset.project;
      const removing = saved.has(id);
      if (removing) saved.delete(id); else saved.add(id);
      const persisted = writeStorage("ziskare-saved-projects", JSON.stringify([...saved]));
      render();
      if (card.hidden) savedToggle.focus();
      notify(persisted ? (removing ? "Project removed from saved." : "Project saved in this browser.") : "Updated for this visit. Browser storage is unavailable.");
    });
    const details = card.querySelector("[data-details]");
    if (typeof dialog.showModal === "function") {
      details.hidden = false;
      details.addEventListener("click", () => {
        dialogOpener = details;
        $("#dialog-title").textContent = card.querySelector("h3").textContent;
        $("#dialog-category").textContent = card.querySelector(".category-label").textContent;
        $("#dialog-description").textContent = card.querySelector(".project-description").textContent;
        $("#dialog-tags").replaceChildren(...[...card.querySelector(".tags").children].map(tag => tag.cloneNode(true)));
        $("#dialog-source").href = card.querySelector(".repo-link").href;
        dialog.showModal();
      });
    }
  });
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => { if (dialogOpener && !dialogOpener.closest("article").hidden) dialogOpener.focus(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") setMenu(false, true);
    const editing = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true]");
    if (event.key === "/" && !editing && !dialog.open && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); search.focus(); }
  });
  const sharePanel = $("#share-panel");
  $("#share-view").addEventListener("click", () => {
    sharePanel.hidden = !sharePanel.hidden;
    if (!sharePanel.hidden) {
      const url = viewURL(); url.hash = "work";
      $("#share-url").value = url.href;
      $("#share-url").focus();
      $("#share-url").select();
    }
  });
  $("#copy-view").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText($("#share-url").value);
      notify("Search link copied.");
    } catch (_) {
      $("#share-url").focus(); $("#share-url").select();
      notify("Select and copy the link shown above.");
    }
  });
  // Highlight the section in view without depending on IntersectionObserver.
  if ("IntersectionObserver" in window) {
    const links = all("#primary-nav a");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    ["work", "about", "capabilities", "contact"].forEach(id => observer.observe(document.getElementById(id)));
  }
  loadView();
  render(false);
  $(".project-tools").hidden = false;
})();
