# St George Youth Upgrade Pack — Deployment Guide

## What this ZIP does
- Adds a responsive four-page PWA shell and shared navigation.
- Preserves recovered management, community, Snake and racing HTML as original modules.
- Adds manifest, SVG icon, service worker, install prompt and mobile navigation.
- Shell files use relative URLs and can be hosted on GitHub Pages.

## Important honest status
This is a source-preserving integration package, not a certified production backend. The recovered management/community modules still use their original API settings and local/device behaviors. The shell cannot make member data portable by itself. No secure election backend or KinTrack location integration is activated by this ZIP. Those require the Apps Script project, spreadsheet schema, authorization model, and live deployment tests.

## Publish to GitHub Pages
1. Back up the current repository and branch before replacing anything.
2. Unzip this folder and review `SOURCE_AUDIT.md`.
3. Upload the package contents to a dedicated test branch or separate repository first.
4. In GitHub: Settings → Pages → deploy from branch; select `main` and `/ (root)`.
5. Wait for Pages build, then open the URL over HTTPS.
6. On Android: Chrome menu → Install app / Add to Home screen. On iOS: Safari → Share → Add to Home Screen.
7. Verify each module on desktop and phone; test offline after the first successful load.

## Files
- `index.html`: cover / navigation
- `page1.html`: management wrapper
- `page2.html`: community wrapper
- `page3.html`: games launcher
- `management-original.html`, `community-original.html`, `snake-original.html`, `racing-original.html`: recovered originals
- `css/styles.css`, `js/app.js`, `manifest.json`, `sw.js`: PWA shell

## Next backend phase (required for portability/security)
- Create Apps Script Web App endpoints with authentication and role checks.
- Establish canonical MemberID, central member/attendance/event/chat/status schemas.
- Add device-safe export/restore and cloud backup with versioned schema.
- Implement server-side election eligibility, duplicate-vote prevention (LockService), closed/open states and audit records. Secret ballots must separate identity eligibility from ballot contents.
- Upload media to Drive with access controls; store metadata/file IDs, not blobs in Sheets.
- Add opt-in, time-limited missionary location-sharing with visible active state, access restrictions, and automatic stop; asset records with QR labels and custody history.

## Test checklist
- All 4 shell pages load; navigation works.
- Original management/community pages open from wrappers and direct links.
- Snake touch/keyboard and racing controls tested.
- Install on Android/iOS; safe-area layouts.
- Load once, airplane mode, verify shell and cached modules.
- Verify API/auth failures are visible; never assume cloud sync.
