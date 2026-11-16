"use strict";
(() => {
  document.getElementById("year").textContent = new Date().getFullYear();
  const menu = document.querySelector(".menu");
  const nav = document.getElementById("primary-nav");
  document.querySelector(".nav").classList.add("js-menu");
  menu.hidden = false;
  const setMenu = open => {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  };
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", event => { if (event.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { setMenu(false); menu.focus(); }
  });
  document.addEventListener("click", event => { if (!event.target.closest(".nav")) setMenu(false); });
  window.matchMedia("(max-width: 800px)").addEventListener("change", () => setMenu(false));
  const grid = document.getElementById("project-grid");
  const cards = [...grid.children];
  const search = document.getElementById("project-search");
  const sort = document.getElementById("project-sort");
  const buttons = [...document.querySelectorAll("[data-filter]")];
  let category = "all";
  const render = () => {
    const query = search.value.trim().toLowerCase();
    const ordered = [...cards];
    if (sort.value !== "featured") ordered.sort((a,b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent) * (sort.value === "za" ? -1 : 1));
    let count = 0;
    ordered.forEach(card => {
      card.hidden = !(category === "all" || card.dataset.category === category) || !card.textContent.toLowerCase().includes(query);
      if (!card.hidden) count++;
      grid.append(card);
    });
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
    document.getElementById("project-count").textContent = `${count} of ${cards.length} projects`;
    document.getElementById("empty-state").hidden = count !== 0;
  };
  buttons.forEach(button => button.addEventListener("click", () => { category = button.dataset.filter; render(); }));
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  document.getElementById("reset-projects").addEventListener("click", () => { category = "all"; search.value = ""; sort.value = "featured"; render(); search.focus(); });
  render();
  document.querySelector(".project-tools").hidden = false;
})();
