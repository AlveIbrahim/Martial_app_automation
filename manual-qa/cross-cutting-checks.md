# Cross-Cutting (Non-Functional) Checks (XC)

> **Read [`00-start-here.md`](00-start-here.md) first.** It covers your test accounts, how to run two roles at once in two windows, the screen-size and language matrices, the status tags, and the do-not-file list. This sheet does not repeat any of that.

These checks are not tied to one role. They apply across every role and most pages: language, screen sizes, install, offline, live updates, and the things that only work on a real phone. Pick any seeded role account to run them with unless a scenario says it needs a specific role. When a scenario needs two people at once (the live-update ones), use one normal window and one incognito window as described in START-HERE.

## Index

| ID | Title | Status |
|---|---|---|
| XC-001 | Switch English and French and sweep for broken layout | FUNCTIONAL |
| XC-002 | Responsive layout across phone, the 768px boundary, and desktop | FUNCTIONAL |
| XC-003 | Install to home screen, run standalone, and update | FUNCTIONAL |
| XC-004 | Offline: app shell loads, your data needs a connection | PARTIAL |
| XC-005 | Live updates over the connection (the realtime battery) | FUNCTIONAL |
| XC-006 | Things that need a real phone (battery) | FUNCTIONAL |
| XC-007 | Library content matches the account's tier and belt | FUNCTIONAL |

---

### XC-001 - Switch English and French and sweep for broken layout

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Any one seeded account (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** Language selector in the left sidebar (under the user profile) / settings; every main page. Language is remembered for your account; there is no `/en` or `/fr` in the web address.
- **Goal:** Prove the whole app switches cleanly between English and French and that the longer French text does not overflow or break any layout.

**Preconditions / setup** (the same tester does all of this):
1. Log in as any seeded account (Session A).
2. Note where the language selector is: a small EN / FR control in the left sidebar under the user profile details (and in Settings).

**Steps** (each step = one action and its own expected result):
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the dashboard in English. Confirm the language control reads "EN". | Page loads in English. The language control shows EN. |
| 2 | Click the language control and choose Français (FR). | A short "language changed" confirmation appears, then the page reloads by itself in French. The control now shows FR. |
| 3 | Stay in French. Open the dashboard. | All visible labels, menus, buttons, and card titles are in French (a few words like "Martial Apps", "admin", "sensei" stay the same on purpose). Nothing is still in English by mistake. |
| 4 | Still in French, open the move library, then a single move's detail page. | French throughout. Long French labels wrap or fit inside their buttons and cards. No text spills outside a card, gets cut off with "...", or pushes a button off screen. |
| 5 | Still in French, open the club calendar, then the members list, then a club's overview. | French throughout. Calendar event chips, table headers, and stat labels all fit. No overlapping text, no broken table columns. |
| 6 | Still in French, open Settings, then your profile, then the notifications page. | French throughout. Setting rows, toggles, and section headings line up; nothing overflows. |
| 7 | Switch the language back to English (EN) from the same control. | Confirmation, then the page reloads in English. Everything is back in English. |

**Screen-size check:** Run the French sweep (steps 3 to 6) at a phone width as well as a desktop width. French strings are longest and most likely to overflow on the narrow phone width, so watch the phone size most closely for cut-off labels and wrapped buttons.

**Edge cases to try:**
- On the QR scan-attendance page in French, force a camera error (deny the camera, or open it on a device with no camera). The three camera messages (camera not supported, permission denied, camera not found) will show in English even in French mode. Expected, known limitation, do not file. Everything else on that page should still be French.
- Switch language while you are deep inside a club page (for example the calendar), not on the dashboard. Expected: it reloads the page you are on, still in the new language, and does not throw you back to the dashboard or log you out.
- Reload the browser after switching to French. Expected: it stays French (your choice is remembered for the account, not just the tab).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-001`):

---

### XC-002 - Responsive layout across phone, the 768px boundary, and desktop

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Any one seeded account (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** The main navigation and the key pages, at three widths. The app is built for phone, tablet, laptop, AND desktop, not phone only. The biggest layout change happens at the 768px width.
- **Goal:** Prove the app re-arranges itself correctly as the screen gets wider, with no broken layout at any of the three sizes or right at the 768px boundary.

**Preconditions / setup:**
1. Log in as any seeded account (Session A).
2. Set the screen size using Chrome DevTools device mode (press F12, then click the phone/tablet icon, then drag the width or pick a device). You will use three widths: a phone width under 640, right around 768, and a desktop width of 1024 or wider.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Set the width to a phone size (about 375 to 390). Open the dashboard. | A bottom menu bar shows along the bottom of the screen. There is no side menu. Buttons are reachable by thumb and nothing is cut off at the edges. |
| 2 | Slowly drag the width up toward 768. Watch the menu as you cross 768. | At 768 the bottom menu bar disappears and a side menu appears on the left. The main content shifts over to make room for the side menu. Nothing overlaps or jumps in a broken way during the switch. |
| 3 | Sit right at about 768 and open the members list and the calendar. | Tables, charts, and event chips fit at this width. No column is squashed unreadably, no chip text is cut off, nothing overflows the page. This is the highest-risk width, so look closely. |
| 4 | Set the width to a desktop size (1280). Open the dashboard. | The side menu shows on the left. Panels are wider. Some screens that showed one panel on the phone now show two side by side. |
| 5 | At the desktop width, open Messages. | Messaging shows two panels side by side: the conversation list on the left and the open chat on the right. |
| 6 | Shrink the width back down below 768 with Messages open. | Messaging collapses to a single full-screen panel: you see either the list or one open chat at a time, not both at once. The bottom menu bar comes back. |

**Screen-size check:** This whole scenario IS the screen-size check. The one boundary that matters most is 768px, where the bottom menu becomes a side menu and single-panel screens become two-panel. Ultra-wide widths beyond desktop do not add a new layout, so you do not need to test those separately.

**Edge cases to try:**
- Open a long page (for example the members list with many members) at the phone width and scroll to the very bottom. Expected: the bottom menu bar stays fixed and reachable, and the last row is not hidden behind it.
- Rotate a real phone from portrait to landscape. Expected: the layout reflows without breaking; the bottom menu stays usable.
- Open a screen that uses two panels on desktop, then refresh the page while at the phone width. Expected: it comes back as a single panel, not a broken half-and-half.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-002`):

---

### XC-003 - Install to home screen, run standalone, and update

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Any one seeded account (Session A) on a real phone, plus a desktop Chrome for the update part
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** Install prompt and iOS add-to-home-screen hint in the header; standalone (full-screen app) mode; the update prompt. This needs a real device for the install part.
- **Goal:** Prove the app installs to the home screen, runs as its own full-screen app, and offers an update when a new version is available.

**Preconditions / setup:**
1. Use a real phone. The web address must be served over a secure (https) connection, the same one your team uses for the test environment.
2. Log in as any seeded account.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On an Android phone in Chrome: open the app and look for the install option in the header (an "Add to Home Screen" / install affordance). Tap it. | The browser's own install dialog appears. After you confirm, the app icon is added to the home screen. |
| 2 | On an iPhone in Safari: open the app. The header shows an iOS hint instead of a one-tap install. Use Safari's Share button, then "Add to Home Screen". | The app icon (Martial Apps) appears on the iPhone home screen. Note: iPhone does not offer a one-tap install dialog, so the hint plus the Share menu is the expected path, not a bug. |
| 3 | Open the app from the new home-screen icon. | The app opens full screen as its own app: no browser address bar or browser tabs around it. The Martial Apps name and icon show. |
| 4 | While running from the home-screen icon, navigate around (dashboard, a club, library). | It behaves like the normal app. You are still logged in. The install prompt no longer nags you, because you are already installed. |
| 5 | (Update flow, easier on desktop Chrome.) With the installed/open app running, have the team deploy a newer build, or simulate one. Keep the app open and wait, or reopen it. | When a newer version is ready in the background, an "update available" prompt appears in the app. |
| 6 | Accept the update prompt. | The app applies the update and reloads itself once on the new version. You are not logged out. |

**Screen-size check:** Installed standalone mode is phone-first and runs at the phone width. Confirm the bottom menu bar and all controls are reachable with a thumb in standalone mode, the same as in the browser at phone width.

**Edge cases to try:**
- Dismiss the install banner. Expected: it goes away and does not reappear immediately on every page (it stays dismissed for a while). Do not file the banner reappearing after several days.
- Already-installed check: open the app in the browser after installing. Expected: it does not keep pushing the install prompt, because it detects it is already installed.
- Decline the update when the update prompt appears. Expected: you keep running the current version with no crash; the prompt may offer the update again later.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-003`):

---

### XC-004 - Offline: app shell loads, your data needs a connection

- **Status:** PARTIAL (the app shell and static files load offline; your live data does NOT, by design)
- **Role(s) & sessions:** Any one seeded account (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** Offline behavior. Only the app shell and static files (the look of the app, its scripts, styles, and already-seen images) are saved for offline. There is no offline copy of your clubs, messages, calendar, or any live data.
- **Goal:** Prove the app shell still loads with no connection, while confirming that live data correctly needs a connection (so testers do not file "my data disappeared offline").

**Preconditions / setup:**
1. Log in as any seeded account while online, and open a few pages first (dashboard, a club, library) so the shell and any images get saved.
2. You will switch the network off using Chrome DevTools: press F12, open the Network tab, and set the throttling dropdown to "Offline" (or turn the device's wifi off on a real phone).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | While still online, load the dashboard fully so it is cached. | Dashboard loads normally with your live data. |
| 2 | Set the network to Offline. | No visible change yet; you are now offline. |
| 3 | Reload the app while offline. | The app shell still loads: the frame, menus, fonts, styling, and the app logo appear instead of the browser's "no internet" error page. The app does not look completely dead. |
| 4 | Try to open a data page while offline (your clubs list, messages, or the calendar). | The live data does not load. You see a loading state, an empty state, or a "could not load / check your connection" message. This is correct and expected: there is no offline data. Do NOT file "my clubs are gone" or "my messages disappeared". |
| 5 | Turn the network back on (set throttling back to "Online" / wifi back on). | The connection returns. |
| 6 | Reload or revisit the data page. | Your live data loads again normally. |

**Screen-size check:** Offline shell behavior is the same at every width. Just confirm at phone width that the offline shell still shows the bottom menu bar rather than a blank page.

**Edge cases to try:**
- Go offline and try to send a message or save a change. Expected: it fails clearly (it does not silently pretend to succeed), because writes need the connection. Do not file the failure itself; just confirm the app does not lie about saving.
- Visit a page you never opened while online, now offline. Expected: a branded "You're offline" page appears, with a retry button, and it auto-reloads on its own once the connection comes back. If you instead land on the login screen or a generic browser error, file it. Note: there is still no offline copy of your actual data (clubs/messages/etc.) - only the shell and this fallback page are cached, so this is not a contradiction of step 4 above.
- Clear the browser cache, go offline, then reload. Expected: with nothing cached yet, the shell may not load offline. That is fine: caching only helps after you have visited online first.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-004`):

---

### XC-005 - Live updates over the connection (the realtime battery)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Two accounts that share the same club: Session A (normal window) and Session B (incognito window). For the support-ticket part you also need a staff reply, which an admin posts from the admin panel (your QA lead arranges this).
- **Solo or 2 testers:** 2 testers recommended. Solo fallback: run Session A in a normal window and Session B in an incognito window, side by side, and do each step in one window then watch the other react without touching it.
- **Route(s) / feature:** Messages, the notification bell and notifications page, and support tickets. The point of this scenario is to confirm things update live, without a manual refresh, while both windows are open.
- **Goal:** Prove that messages, typing indicators, edits, deletes, read receipts, club broadcasts, and support replies all reach the other open window live, and that the connection recovers after a brief network drop.

**Preconditions / setup** (the same tester builds all of this):
1. Confirm two accounts are members of the SAME club. One of them should be staff (owner or sensei) so it can send a club broadcast in step 6. If not set up, assign roles on the members page first (reference OWP-012).
2. Session A: log in as account 1 (normal window). Session B: log in as account 2 (incognito window).
3. In both sessions open Messages and start (or open) a direct chat between the two accounts. Place the two windows side by side so you can watch both at once.
4. IMPORTANT: do not refresh either window during the steps below. The whole test is whether updates arrive on their own. If you have to refresh to see something, that is the finding.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Session A: send a new message in the open chat. | Without any refresh, Session B's chat list updates (the conversation moves up / shows the new message) AND the open thread in Session B shows the new message. |
| 2 | Session A: start typing in the message box but do not send. | Session B shows a "typing" indicator for account A within a second or two. |
| 3 | Stop typing in Session A and wait a few seconds without sending. | Session B's typing indicator clears on its own after about 3 seconds. You did not have to do anything. |
| 4 | Session A: edit a message you already sent. Then delete another message you sent. | Session B shows the edited message updated in place (marked as edited) and shows the deleted message removed, both without a refresh. |
| 5 | Session B: open the thread and read A's message. Then look at Session A. | Session A's read indicator updates to show the message was read, without a refresh. |
| 6 | Session A (must be staff): send a club broadcast / announcement to the club. Watch Session B. | Session B's notification bell updates live (a new-notification mark / count) without a refresh, and the broadcast also appears when Session B opens the notifications page. |
| 7 | Support reply: Session B opens a support ticket (or has one open). An admin posts a reply from the admin panel (your QA lead does this). Watch Session B's ticket thread. | Session B's ticket thread updates live with the admin reply, and the ticket status change shows, without a refresh. |
| 8 | Reconnect test: in Session A, set the network to Offline for about 10 seconds (DevTools Network tab), then set it back to Online. Then send a message from Session B. | After the connection returns, Session A reconnects on its own and the message from Session B arrives. You do not have to refresh or log in again to recover. |

**Screen-size check:** Run at least the message-arrives part (steps 1 to 3) at desktop width, where Messages shows the list and the chat side by side, so you can watch both panels react at once. At phone width you would only see one panel at a time, which makes the live list-versus-thread update harder to observe.

**Edge cases to try:**
- Send several messages quickly from Session A. Expected: they all arrive in order in Session B, none dropped, no duplicates.
- In step 3, start typing again right before the 3-second clear. Expected: the typing indicator stays up and the timer resets; it only clears after you actually stop.
- For step 7, the support reply and ticket status come from an admin in the admin panel, not from the user app on its own. If nothing changes, confirm an admin actually replied before filing anything.
- After the reconnect in step 8, also confirm the bell and ticket updates still work, to prove the live connection fully recovered, not just messages.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-005`). Cross-reference the full journeys: live DM is CR-007, broadcast-to-bell is CR-008, support thread is CR-016. This scenario tests the live behaviors themselves; those CR journeys test the end-to-end flows.

---

### XC-006 - Things that need a real phone (battery)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Roles vary per item (see each row). Run on a real phone with a working rear camera, over the secure (https) test address.
- **Solo or 2 testers:** Solo-with-tabs for most. The QR scan needs a member's QR to point the camera at, which you can show on a second screen.
- **Route(s) / feature:** The handful of features that cannot be tested with the desktop DevTools device mode and genuinely need real phone hardware: camera, install, touch gestures.
- **Goal:** Confirm the phone-only features work on real hardware, since the desktop device-mode simulator cannot exercise the camera or touch gestures.

**Preconditions / setup:**
1. A real phone with a rear camera, on the secure test address, logged in as a seeded account. For the scan item, the account must be a role allowed to take attendance (owner or sensei), not a secretary, and you need a member's QR to point at (show it on a second device or window).

**Steps** (each row is its own quick check on the real phone):
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | QR scan-attendance: as owner or sensei, open the club and open Scan Attendance. Allow the camera. Point the rear camera at a member's QR. | The live rear-camera view opens (no "access restricted" block, since only the secretary is blocked here). Scanning the QR marks that member present. Note: a member scanning to register themselves only works on the actual class day; staff scanning has no day limit. |
| 2 | Camera-based photo/video upload: go to a place that uploads media (your profile avatar, or library media if your role can manage it) and choose to take a photo or video with the camera. | The phone camera opens, you can capture, and the captured image or video uploads and shows. |
| 3 | PWA install: covered in detail in XC-003. Quick confirm here that the install / add-to-home-screen affordance shows on the real phone. | The install option (Android) or the add-to-home-screen hint (iPhone) is present in the header. |
| 4 | Pull-to-refresh: on a scrollable page at the top, pull down with your finger and release. | A refresh indicator appears and the page reloads its data. |
| 5 | Swipe gestures: on a screen that supports swiping, swipe left or right with your finger. | The swipe is recognized and does what that screen expects (for example moving between panels or items), smoothly, with no stuck or half-finished state. |

**Screen-size check:** Everything here is phone-first by nature. Confirm all camera and touch controls are reachable by thumb and that the camera view and capture buttons fill the phone screen without anything cut off.

**Edge cases to try:**
- QR scan with the camera denied: the page shows a camera-error message. In French, three of these camera messages stay in English. Expected, known limitation, do not file (see START-HERE section 6).
- Pull-to-refresh when you are NOT at the top of the page. Expected: it scrolls normally and does not accidentally trigger a refresh.
- Camera upload then cancel before capturing. Expected: it returns cleanly with nothing uploaded.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-006`):

---

### XC-007 - Library content matches the account's tier and belt

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Two contrasting accounts (Session A and Session B). To see the limited view you need a genuinely FREE, lower-belt account, because new accounts default to premium and the founder is auto-set to black belt. Your QA lead sets up a free, lower-belt account for this.
- **Solo or 2 testers:** Solo-with-tabs (compare the two accounts in two windows).
- **Route(s) / feature:** The master move library and master warmup library. What each account sees here is decided on the server based on that account's subscription tier and belt rank. It is not "everyone sees everything".
- **Goal:** Confirm the master move and warmup libraries show the right amount of content for the account's tier and belt, and that a free or lower-belt account correctly sees fewer items than a premium or black-belt account.

**Preconditions / setup:**
1. Session A: log in as a free, lower-belt (beginner) account.
2. Session B: log in as a premium account, or an account whose member is a black belt (for example a club owner, who is auto black belt).
3. Make sure the master library actually has content seeded across beginner and advanced levels, or both views will look empty for an unrelated reason.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Session A (free, lower belt): open the global move library. | You see beginner-level moves only. The most advanced (highest "Dan") moves are NOT in the list. The list is genuinely shorter, not the full catalog. |
| 2 | Session B (premium / black belt): open the same global move library. | You see more of the catalog, including the advanced and highest "Dan" moves that Session A did not see. |
| 3 | Compare the two lists side by side. | Session B's list is a superset: it contains items that Session A's list does not. The difference is the tier-and-belt gating, working as intended. |
| 4 | Session A (free): open the global warmup library. | Free users get the basic warmups. The premium-only master warmups are not available to this free account. |
| 5 | Session B (premium): open the global warmup library. | Session B can access the premium master warmups that Session A could not. |
| 6 | (Sanity check, not gated.) In a club either account belongs to, open that club's own custom library content. | A club's own custom moves and warmups are shown or hidden by the club's own setting, not by your subscription tier. So this is NOT expected to differ by tier the way the master library does. Do not file a tier difference here. |

**Screen-size check:** The library lists stack in a single column at phone width and show as a wider grid at desktop width. Confirm the (shorter) free list and the (longer) premium list both lay out cleanly at both widths.

**Edge cases to try:**
- Session A (free) tries to open a single advanced move directly (for example by its link), not just the list. Expected: the server still blocks it for the free/lower-belt account; it does not slip through just because the list was bypassed. Do not file the block; it is the intended gate.
- Empty-looking library: if BOTH accounts see nothing, the master library was probably not seeded. That is a setup gap, not a gating bug. Confirm seeding before filing.
- Do not file "free user can see premium content" for a CLUB's custom content (that is a separate, non-tier setting), and do not file "free user sees fewer moves" as a bug, because fewer moves is the correct, intended behavior.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp per START-HERE section 9, quoting `XC-007`):
