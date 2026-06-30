# Frame & Field — Image Gallery

A responsive photo gallery built with vanilla HTML, CSS, and JavaScript.

## Features
- Masonry-style responsive grid (4 columns desktop → 1 column mobile)
- Category filter pills (Nature, Architecture, Travel, Wildlife) — bonus requirement
- Full-screen lightbox with Next / Prev navigation, keyboard arrows, Esc to close
- Filmstrip thumbnail rail inside the lightbox for quick jumping between images
- Hover effects (image zoom, caption reveal, index badge) with smooth CSS transitions
- Touch swipe support for mobile lightbox navigation
- Accessible: focus states, aria labels, keyboard operable gallery tiles

## Files
- `index.html` — page structure
- `style.css` — design system, layout, animations, responsive rules
- `script.js` — gallery rendering, filtering, lightbox logic
- `gallery-data.js` — image metadata (title, category, file path)
- `images/` — 20 generated placeholder photographs (4 categories × 5 images)

## Run it
Just open `index.html` in a browser — no build step or server required.
(Some browsers restrict `loading="lazy"` images on `file://`; if images don't
load, serve the folder locally, e.g. `python3 -m http.server` then visit
`http://localhost:8000`.)

## Swap in real photos
Replace files in `images/` and update `gallery-data.js` with matching
`src`, `title`, `category`, and `label` fields — no other code changes needed.
