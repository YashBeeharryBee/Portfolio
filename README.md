# Yash Beeharry — Developer Portfolio

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-success)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

A dependency-free, single-page portfolio site built with vanilla HTML, CSS, and JavaScript. No framework, no bundler, no build step — every effect (cursor tracking, scroll reveals, canvas particles, tab switching) is hand-rolled with the native DOM and Canvas APIs.

**[Live Demo](#)** · **[Report an Issue](#)**

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Implementation Notes](#architecture--implementation-notes)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Performance Considerations](#performance-considerations)
- [Customization Guide](#customization-guide)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

This repository contains the source for a personal portfolio site, structured as a single static HTML page composed of seven sections: Hero, Skills, Experience, Portfolio (tabbed), Education, Languages, and Contact. The site is intentionally built without a framework to keep the deliverable lightweight, fast to load, and trivially deployable to any static host.

| | |
|---|---|
| **Type** | Static single-page site (SPA-style scroll, no routing) |
| **Build step** | None — ship the files as-is |
| **Runtime dependencies** | None — only a Google Fonts `<link>` |
| **Browser APIs used** | `IntersectionObserver`, `Canvas 2D`, `requestAnimationFrame`, CSS `:has()` |

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Markup | Semantic HTML5 | Accessible section landmarks, no JS required for content to render |
| Styling | CSS3 with custom properties | Centralized theme tokens (`--accent`, `--bg`, `--text`, etc.) for fast re-skinning |
| Typography | Google Fonts — Syne (display) & Space Mono (mono/UI) | Visual contrast between headings and UI/meta text |
| Interactivity | Vanilla JavaScript (ES6+) | No virtual DOM overhead; direct, predictable DOM mutation for a content site this size |
| Animation | `requestAnimationFrame` + CSS transitions | GPU-friendly, no animation library overhead |

## Project Structure

```
.
├── index.html              # Page markup — all 7 sections, semantically sectioned and commented
├── style.css               # Design tokens, layout, responsive rules, keyframe animations
├── script.js               # Cursor engine, scroll-reveal observer, tab controller, particle system
├── _hintrc                 # Editor/linting config (IDE only — not shipped/rendered)
└── src/
    └── PpImages/            # Project screenshots referenced by the Portfolio section
    └── WpImages/            # Project screenshots referenced by the Portfolio section
```

## Architecture & Implementation Notes

A breakdown of the non-trivial logic in `script.js`, for anyone maintaining or extending it:

**Custom cursor (dot + ring).** Raw mouse coordinates are captured on `mousemove` and written directly to the dot. The ring trails behind using linear interpolation (`rx += (mx - rx) * 0.12`) inside its own `requestAnimationFrame` loop, decoupling cursor rendering from the event loop's mousemove frequency.

**Scroll-reveal system.** A single shared `IntersectionObserver` (12% visibility threshold) handles all `.reveal`, `.timeline-item`, and `.lang-card` elements. On intersect, it adds a `.visible` class (animated in CSS) and, if present, expands `.lang-bar-fill` elements to their `data-width` value — then unobserves the element to avoid redundant work on re-scroll.

**Tab controller.** Project tabs are plain show/hide via class toggling rather than re-rendering markup. On tab switch, newly visible `.reveal` cards have their `visible` class stripped and are re-registered with the observer (with a forced reflow via `el.offsetHeight`) so they replay their entrance animation instead of appearing statically.

**Canvas particle field.** A self-contained IIFE owns a `Particle` class (position, velocity, depth-based parallax via `z`, radius, color, opacity). Each frame: clear canvas → draw a faint background grid → draw inter-particle connection lines for any pair within 120px → update and draw all particles. Particle-to-particle distance checks are O(n²) (75 particles ⇒ ~2,775 pair checks/frame), which is acceptable at this particle count but is the first thing to optimize (e.g., spatial partitioning) if the count is ever increased significantly.

## Deployment

The site is a static bundle and deploys identically to any static host. A few common options:

- **GitHub Pages** — push to a repo and enable Pages on the `main` branch (root). The existing project links already point to `github.io` URLs, suggesting this is the current hosting target.
- **Netlify / Vercel** — drag-and-drop the folder or connect the repo; no build command is needed (leave the build command blank, publish directory `/`).
- **Any static bucket** (S3 + CloudFront, Cloudflare Pages, etc.) — upload the three core files plus `src/`.

## Browser Support

Built against modern evergreen browsers (Chrome, Edge, Firefox, Safari — current and previous major version). Notable dependency: the hover-state cursor scaling relies on the CSS `:has()` selector, which is supported in all major browsers from late 2023 onward but will silently no-op in older engines (graceful degradation — the cursor simply won't scale on link hover).

## Performance Considerations

- All animation is driven by `requestAnimationFrame`, not `setInterval`, so it automatically pauses in backgrounded tabs.
- The particle system and cursor each run their own animation loop; on lower-end devices, reducing `COUNT` in `script.js` (currently `75`) is the most effective lever for frame-rate headroom.
- Images in the Portfolio section are not currently lazy-loaded — adding `loading="lazy"` to `.project-screenshot` elements is a low-effort win if more projects/screenshots are added.

## Customization Guide

| Want to change... | Edit... |
|---|---|
| Color palette / fonts | CSS custom properties at the top of `style.css` (`--accent`, `--accent2`, `--bg`, `--font-display`, `--font-mono`) |
| Copy / bio / links | The relevant `<section>` in `index.html` (each is clearly commented) |
| Add a project card | Duplicate a `.project-card` (Personal tab) or `.cms-card` (Webmaster tab) block and update image, links, title, description, tags |
| Particle density/color | `COUNT`, `C1`, `C2` constants in the canvas IIFE in `script.js` |
| Reveal animation timing | `.reveal` transition rules in `style.css` and the `IntersectionObserver` threshold in `script.js` |

## Roadmap

- [ ] Replace placeholder CMS project cards with real client screenshots and links
- [ ] Add `loading="lazy"` to project screenshots
- [ ] Add a `<meta name="description">` and Open Graph tags for link-preview support
- [ ] Consider extracting repeated card markup into a small templating step if the project count grows significantly

## License

MIT — feel free to fork the structure for your own portfolio; please don't reuse the personal content/branding as-is.
