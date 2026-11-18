# St George Youth — Recovered Source Collection

Recovered from prior ChatGPT Library files for the St George Youth projects. This is a source-recovery pack, not the final unified PWA.

## Included source files

- `st-george-youth-fixed.html` — Dashboard / management hub. Contains member registration, member directory, attendance, finance, Bible trivia, awards, elections, choir planner, and events calendar. Embedded JS scripts passed `node --check`; this does **not** mean backend/API workflows are fully tested. The file includes an inline navigation/PWA helper.
- `index(4).html` — A newer/expanded dashboard copy. It contains Git merge-conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in HTML/JS and fails JavaScript syntax checking. Preserve for reference only; do not deploy as-is.
- `index(5).html` — Community interface for chat, profiles and statuses/stories. Embedded JavaScript passed `node --check`. Backend behavior still requires a live test.
- `st_george_youth_games_hub.html` — Snake Classic game, including keyboard/touch controls and local high score. Embedded JavaScript passed `node --check`.
- `st_george_youth_racing_game(1).html` — Road to Greatness racing game. Embedded JavaScript passed `node --check`.

## Feature mapping for planned 4-page PWA

1. `index.html` — new app cover / navigation hub.
2. `page1.html` — calendar + membership registration and member tools (extracted from the management dashboard; calendar and registration currently live inside the dashboard rather than separate HTML files).
3. `page2.html` — community chat + statuses, based on `index(5).html`.
4. `page3.html` — games page integrating Snake and racing. Keep the two game mechanics intact while removing duplicate page chrome and making controls accessible.

## Deployment cautions

- The recovered dashboard's Google Apps Script endpoint previously returned 401 and CORS/network failures in the user's console logs. The cloud API deployment/access settings must be tested and fixed separately; the PWA shell alone will not resolve it.
- The dashboard loads Chart.js from a CDN, and Snake loads Bootstrap CSS/icons from CDNs. These dependencies need to be replaced, bundled locally, or given graceful offline fallbacks for robust offline operation.
- Preserve existing backend IDs, keys, spreadsheet schemas, endpoint URLs and event handlers during extraction. Avoid redesign-only rewrites that remove features.
- Check membership registration and calendar flows on the deployed site before migration. No standalone registration or calendar HTML file was recovered; both are embedded in the dashboard source.

## Current GitHub repository files verified (18 Nov 2026)

These links point to the live repositories' current files. The archive contains recovered Library copies, not every current remote version.

Main project repo:
- Main dashboard: https://github.com/classassistLiam/stGeorge-Youthcalendar/blob/main/index.html
- Separate calendar: https://github.com/classassistLiam/stGeorge-Youthcalendar/blob/main/Youth%20calendar.html
- Calendar/finance Apps Script backend: https://github.com/classassistLiam/stGeorge-Youthcalendar/blob/main/Code.gs
- Existing service worker: https://github.com/classassistLiam/stGeorge-Youthcalendar/blob/main/service-worker.js
- Current racing game: https://github.com/classassistLiam/stGeorge-Youthcalendar/blob/main/st_george_youth_racing_game.html

Community/chat project repo:
- Community page (headings include Status, Youth Channels, Community Feed): https://github.com/NyotaProjectLaikipia2026cohort8/church-youth-app/blob/main/church.html
- Root index: https://github.com/NyotaProjectLaikipia2026cohort8/church-youth-app/blob/main/index.html

Verified current file metadata (GitHub default branch):
- Main dashboard `index.html`: 196,999 characters; SHA `603e9574317fd7126dadb89a2e368e6e23d279b3`.
- `Youth calendar.html`: 43,959 characters; SHA `6925d13a6389a0c96dd42d98fcf2c0b38be37657`.
- `Code.gs`: 5,165 characters; SHA `300b012fe1d60601d88baf0bd83a310976c0d310`.
- `service-worker.js`: 1,742 characters; SHA `a5b89306f4d48eb44648cd45b166da2c5d527d1b`.
- Racing game: 16,523 characters; SHA `dbed99c85f791c1e613cdab68331197abcee75d7`.
- Community page `church.html`: 436,639 characters; SHA `cfb2554b0af2c0c868ebe11cc083305104d71397`.

The remote `Youth calendar.html` contains calendar timeline, event details, scripture, Sunday contribution and youth-account areas. The current main dashboard includes member registration and management sections. The community `church.html` is a separate very large interface, so it should be reviewed for feature overlap before we decide whether to integrate it or link/embed it.
