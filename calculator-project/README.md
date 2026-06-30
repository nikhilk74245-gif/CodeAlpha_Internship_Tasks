# CL-7 — Desk Calculator

A basic calculator built with vanilla HTML, CSS, and JavaScript, styled like a
retro desk calculator with an LCD-style display.

## Features
- All four arithmetic operations: addition, subtraction, multiplication, division
- Chained operations (e.g. `2 + 3 × 4 =`) and percent (`%`)
- Live expression line above the result, updated as you type
- Clear (`AC`) and backspace (`⌫`)
- Division-by-zero and overflow are caught and shown as `Error`
- Bonus: full keyboard support (`0-9`, `.`, `+ - * /`, `Enter`/`=`, `Backspace`, `Esc`, `%`)
- Bonus: tactile button styling — 3D bevels, press-down animation, hover glow,
  active-operator highlight, comma-formatted numbers

## Files
- `index.html` — markup
- `style.css` — design system, button states, responsive layout
- `script.js` — calculator engine + keyboard bindings

## Run it
Open `index.html` directly in any browser — no build step or server required.
