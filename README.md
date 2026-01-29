# TFLTimeChecker  # TfL Finder

Small client-side app that shows live arrival times for Ilford rail (Elizabeth line) and nearby buses using the TfL Unified API.

## Features
- Live train and bus arrival lists (auto-refresh every 60s).
- Peak / off-peak visual mode (body class flips styling).
- Offline caching via localStorage and an "Offline" banner when using cached data.
- Flashy UI with glass-card layout, badges and an inline SVG TfL Finder badge.
- Minimal, dependency-free client-side code.

## Files
- `tfl.html` — main HTML with embedded logo and container markup.
- `tfl.css` — styles (glassy cards, animations, responsive).
- `tfl.js` — fetches TfL API, renders lists, caching, refresh loop.
- `README.md` — this file.

## Setup
1. Place the project folder on your machine (already in workspace).
2. Provide a TfL API key:
   - Edit `tfl.js` and set `const APP_KEY = "<YOUR_APP_KEY>";`.
   - The app uses the TfL Unified API — register for a key if required and follow TfL terms.

3. Serve the folder with a simple static server (recommended to avoid CORS/file:// problems). From the project folder run (Windows / PowerShell / CMD):
   - Python: `python -m http.server 8000`
   - Node (if installed): `npx http-server -p 8000`
   Then open: `http://localhost:8000/tfl.html`

You can also open `tfl.html` directly in a browser, but some browsers may block fetches from `file://`.

## Configuration
- `tfl.js` constants:
  - `APP_KEY` — TfL API key.
  - `ILFORD_RAIL_ID` — station stopPoint id (default `910GILFORD`).
  - `LAT`, `LON` — centre point for nearby bus stops.
  - `REFRESH_INTERVAL` — milliseconds between refreshes (default 60000).

## Customization
- Replace the inline SVG (in `tfl.html`) with an image if you have a licensed TfL logo.
- Tweak colors / animations in `tfl.css`.
- Increase/decrease number of results by modifying `.slice(0, 6)` in `tfl.js`.

## Troubleshooting
- "Unable to load…" — check network, API key, and browser console for CORS or rate-limit errors.
- If data persists offline, clear `localStorage` for the page.

## Notes
- Respect TfL API usage terms and rate limits.
- This project is provided as-is for local use and experimentation.

