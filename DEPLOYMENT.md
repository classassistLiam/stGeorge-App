# St George Youth — Design & PWA Upgrade

## What changed
- Reworked the home page into a public-facing landing page plus a clear four-module youth hub.
- Added a polished responsive visual system: forest green, warm ivory, soft lime and restrained gold; mobile bottom navigation; reduced-motion and keyboard-focus support.
- Kept the existing module destinations and original HTML files intact.
- Corrected the install controller to register the actual `sw.js` filename (the previous controller registered `sw.js` only in the latest pack's intended setup; confirm this matches the deployed file).
- Improved offline caching so an unavailable optional file does not prevent the service worker from installing.
- Added update detection without forcibly refreshing a page or interrupting work.

## Preserved modules
- `management-original.html`
- `community-original.html`
- `snake-original.html`
- `racing-original.html`

The wrappers `page1.html`, `page2.html`, and `page3.html` continue to open those originals. Their backend logic, data keys, event handlers and game mechanics were not rewritten.

## Important limitations
This is a front-end design/PWA-shell upgrade. It does not make local/device data cloud-synchronised, authenticate members, secure elections, or add new Apps Script endpoints. The source audit notes previous API authorization/CORS issues; verify the deployed Apps Script web app separately.

The management and community modules are preserved as recovered in this ZIP. The `SOURCE_AUDIT.md` identifies newer live GitHub files that are larger/different from some recovered copies. Before replacing the production repository, compare the current remote versions and merge carefully.

## Publish safely
1. Keep a backup of the current production repository.
2. Upload this package to a separate test branch first.
3. Check that all four module pages load and test registration, finance, attendance, calendar, chat, status, and both games.
4. Test on a phone and desktop. Check browser console/network errors.
5. Confirm the service worker controls the site after a second visit.
6. Load once, go offline, and verify the shell and cached modules open.
7. Only merge to `main` after confirming backend-dependent actions still work.

## GitHub Pages
Set GitHub Pages to deploy from the chosen branch and `/ (root)`. The app requires HTTPS for service worker and install support.
