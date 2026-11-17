# Ziskare World

The website for [ziskare.dev](https://ziskare.dev): a responsive, dependency-free project directory and studio homepage.

## What is included

- Refreshed responsive design with dark and light themes.
- Fourteen curated projects with multi-word search, five categories and alphabetical sorting.
- Saved projects, stored locally in the visitor's browser; no account or server required.
- Shareable search/category/sort URLs and a manual-copy fallback.
- Project detail dialogs with direct GitHub source links.
- Mobile navigation, keyboard focus styles, a skip link, `/` search shortcut, reduced-motion support and native Escape-to-close dialogs.
- Accessible empty states and live result counts.
- Custom 404 page, SVG favicon, canonical/social metadata, robots.txt and sitemap.xml.
- All project content and source links remain available with JavaScript disabled.

## Run locally

From this directory:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. No npm install or build is needed. Use a local HTTP server rather than opening index.html directly because asset URLs start at the site root.

## Netlify deployment

| Setting | Value |
| --- | --- |
| Repository | `ziskare-world/ziskare-dev` |
| Production branch | `main` |
| Base directory | Leave blank |
| Build command | Leave blank |
| Publish directory | `.` |

`netlify.toml` defines the publish directory. Enable continuous deployment for automatic publishing after commits to `main`. Add `ziskare.dev` to the Netlify project's custom domains if it is not already configured. The custom `404.html` is served for unknown paths; this is not a single-page application and does not need a wildcard rewrite.

## Editing

- **index.html:** page copy and project cards. Every project has a stable `data-project` value and a `data-category` value (`web`, `ai`, `communication`, `mobile`, or `tools`). Keep project IDs unique.
- **styles.css:** design tokens, light theme and responsive layouts.
- **site.js:** theme preference, navigation, filters, sorting, local saved projects, share links and dialogs.
- **favicon.svg:** small vector brand mark.
- **404.html**, **robots.txt**, **sitemap.xml:** error page and crawler configuration. Update canonical URLs if changing the domain.

Project descriptions are curated; the site does not fetch live repository activity or claim real-time statistics. To add or remove cards, also review the directory's no-JavaScript result text and this README.

## Privacy and dependencies

Theme and saved projects use localStorage on the visitor's device. They are not sent to a server; private browsing or cleared site data may remove them. Search links include only the search text, category and sort order, not the saved-project collection. Clipboard failures provide a selectable link instead.

No framework, package install, external fonts or API key is required. The original Google AdSense script is retained; it remains a third-party network dependency and may be blocked by an ad blocker. Netlify may inject its own hosting badge depending on the project's settings.

## Verification checklist

1. Search `python`, combine with the Mobile category, and check the empty state.
2. Reset, sort A–Z / Z–A, and restore featured order.
3. Save a project, enable Saved, reload, and confirm the bookmark persists.
4. Share a filtered view and open that URL in a new tab.
5. Open and close project details with keyboard focus returning to its button.
6. Switch themes and reload. Test at narrow mobile and desktop widths.
7. Disable JavaScript: all 14 source links and navigation remain usable.
8. Visit an unknown path to check the 404 page.
