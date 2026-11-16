# Ziskare.dev

Static Ziskare World homepage. HTML, CSS and vanilla JavaScript; no install or build required.

## Features
- Search all 14 curated projects by name, technology and description.
- Combine category filtering with search; sort alphabetically or restore featured order.
- Result counts, an empty state and one-click filter reset.
- Responsive navigation with Escape/outside-click closing and accessible expanded state.
- Keyboard focus styles, skip link, reduced-motion support and functional GitHub contact link.
- Projects and navigation remain available if JavaScript is disabled.

## Preview
Run `python3 -m http.server 8080` and open http://localhost:8080.

## Netlify
Connect `ziskare-world/ziskare-dev`, production branch `main`.
Base directory: blank. Build command: blank. Publish directory: `.`.
The netlify.toml file provides the publish directory. Commits to main deploy automatically when continuous deployment is enabled in Netlify.

## Editing
Edit copy and project cards in index.html. Categories use the data-category attribute. Update filtering and navigation in site.js. Commit to main to publish via the connected Netlify site.

## External dependencies
Google Fonts and the original Google AdSense script require network access. No backend, API key or package dependencies are required. Project listings are curated, not fetched live from GitHub.
