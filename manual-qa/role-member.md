# Role: Club Member (free-tier student) - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** an ordinary student in a martial arts club. You train, you check your own belt progress, you look at the calendar and the move library, you message the people who run the club. You do NOT run the club: you cannot create classes, approve members, change roles, or see the club's analytics. Most of your screens are view-only.

**The free-tier catch (read this once):** a few tests below check what a FREE account can and cannot do (mainly in messaging and in the move/warmup library). New accounts are created as PAYING ("premium") by default, so those free-tier limits only show on an account a platform admin or the seed tool has explicitly set to FREE. Each test that depends on this says so at the top, and tells you what to record if your account turns out to be premium (in which case the limit will NOT show, and that is correct, not a bug).

**Sessions:** Club Member is a single role. Unless a step says otherwise, you work in **Session A only** (one normal window, logged in as the member). The `ONB-` tests at the top start from a brand-new account and build a fresh membership; they tell you so.

**Before the MEM tests:** log in as the seeded free Member account (START-HERE §3) and make sure you are inside the test club. You reach a club from the **My Club** area, or by opening the club from your dashboard.

**How you move around as a member:** you have the normal app menu (Dashboard, Belts, Library, Messages, Notifications, Support, Settings) plus a club you belong to. Inside a club, the red tab bar at the top shows fewer tabs than an owner sees, and the management pages (Analytics, History, Settings, Teachers, Scan Attendance) are not offered to you at all. Several "blocked" tests ask you to try to open those anyway by typing the page address, and to confirm you are turned away.

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| ONB-010 | Sign up as a new student | FUNCTIONAL |
| ONB-011 | Join a club via a share / QR link | FUNCTIONAL |
| ONB-012 | Discover and request a club inside the app | FUNCTIONAL |
| MEM-001 | Dashboard loads for a plain member | FUNCTIONAL |
| MEM-002 | Personal belt reference | FUNCTIONAL |
| MEM-003 | Personal progression | FUNCTIONAL |
| MEM-004 | Progress within a club | FUNCTIONAL |
| MEM-005 | View club overview (member view) | FUNCTIONAL |
| MEM-006 | View club calendar (read-only) | FUNCTIONAL |
| MEM-007 | BLOCKED: View members list | FUNCTIONAL (expected: turned away) |
| MEM-008 | Browse sites and rooms (read-only) | FUNCTIONAL |
| MEM-009 | Global move library and a move detail | FUNCTIONAL |
| MEM-010 | Global and club warmups | FUNCTIONAL |
| MEM-011 | Club library view (read-only) | FUNCTIONAL |
| MEM-012 | Notification center and mark read | FUNCTIONAL |
| MEM-013 | Messaging: free tier can contact staff | FUNCTIONAL |
| MEM-014 | Submit an exit request | FUNCTIONAL |
| MEM-015 | Self-enroll / self-unenroll a curriculum | FUNCTIONAL |
| MEM-016 | Help center and an article | FUNCTIONAL |
| MEM-017 | Open a support ticket and view the thread | FUNCTIONAL |
| MEM-018 | Edit own profile and avatar | FUNCTIONAL |
| MEM-019 | Account / security / language settings | FUNCTIONAL (billing pane currently hidden) |
| MEM-020 | Forced complete-profile / change-password | FUNCTIONAL |
| MEM-021 | File a bug / feedback in-app | FUNCTIONAL |
| MEM-022 | Library shows content for your tier and belt | FUNCTIONAL (tier + belt gated on purpose) |
| MEM-023 | Group messaging | FUNCTIONAL |
| MEM-024 | Urgent / audible messages | FUNCTIONAL |
| MEM-040 | BLOCKED: starting a chat with a plain member | FUNCTIONAL (expected: cannot start it) |
| MEM-041 | BLOCKED: analytics / history / settings / teachers | FUNCTIONAL (expected: turned away) |
| MEM-042 | BLOCKED: create an event / manage members | FUNCTIONAL (expected: no such controls) |
| MEM-043 | NOTE: the subscription / billing pane | STUB (do not file) |
| MEM-044 | NOTE: the Portal page is a placeholder | STUB (do not file) |

---

## Onboarding (from scratch)

> These three build a brand-new student account and get it into a club. Use a real email inbox you control. Trick: `you+student1@gmail.com` still lands in `you@gmail.com` (START-HERE §3). The basic sign-up steps mirror ONB-001 to ONB-003 on the owner sheet; here the focus is the JOIN flow, which is the member's real onboarding.

### ONB-010 - Sign up as a new student

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Brand-new visitor (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/register`, `/verify-email`, `/login`
- **Goal:** Prove a new student can register, verify their email, and log in, ending on the dashboard with no club yet.

**Preconditions / setup:**
1. Not logged in. If you are, log out or use a fresh Incognito window.
2. Have a real email inbox open in another tab to read the verification code.
3. TIME-SENSITIVE: the emailed code expires in about 10 minutes. Read your inbox promptly.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/register`, type a new email and a password, tick the adult checkbox, tap "Get Started" | A success message, then after about a second you land on the verify-email page with your email carried over. |
| 2 | Open your inbox, read the 6-digit code, type it into the six boxes, tap "Verify" | A success screen, then you are taken into the app. |
| 3 | If you are not already on it, open `/dashboard` | The dashboard loads. It shows that you are not part of any club yet (an empty / "join a club" state), with no club management anywhere. |

**Screen-size check:** On a phone (<640px) the register and verify forms fill the screen and the main button is reachable by thumb; the six code boxes stay on one row.

**Edge cases to try:**
- Type a bad email (e.g. `abc@`) -> inline "invalid email" error, no submit.
- Type a wrong 6-digit code -> "invalid code" error, you stay on the page.
- Let the code countdown reach `0:00`, then refresh -> it should STILL show expired, not restart at ~10:00. A fresh timer after expiry IS a bug.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE §9):

---

### ONB-011 - Join a club via a share / QR link

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** New or existing student (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/join/[clubId]/[[...slug]]`
- **Goal:** Prove a student who opens a club's share link (or scans its QR) can request to join, and the request goes to club staff for review.

**Preconditions / setup:**
1. You have a student account (from ONB-010, or the seeded member).
2. You have a club's share link or QR code. The owner generates this on the club overview (owner test OWP-002). The link looks like `/join/<clubId>/<club-name-slug>`.
3. To test the QR specifically, open the link as a QR code on one device and scan it with a real phone (camera needs a real device). The plain link works on any device.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club's join link (or scan its QR) while NOT logged in | A small card appears titled "Join [club name]" asking you to log in or sign up first, with a "Log In" button and a "Sign up" link. |
| 2 | Tap "Log In", log in, then return to the join link (the app remembers where you were headed) | You come back to the join card, now showing the join form. |
| 3 | Read the join card: title "Join [club name]" and a line saying a staff member will review your request | The card shows a terms checkbox ("I agree to the club's terms and conditions...") and a "Join Club" button that is greyed out until you tick the box. |
| 4 | Tick the agreement checkbox | The "Join Club" button becomes active. |
| 5 | Tap "Join Club" | The button shows "Submitting...", then a success card appears: "Request Submitted!" saying your request to join [club name] has been sent and staff will review it, with a "Go to Dashboard" button. |
| 6 | Tap "Go to Dashboard" | You land on the dashboard. You are NOT a full member yet; you are waiting for approval (an owner approves you in OWP-010 / CR-002). |

**Screen-size check:** The join card is a single centered panel; on a phone (<640px) it fills the width with the button reachable by thumb; nothing is cut off at the tablet (~768px) width.

**Edge cases to try:**
- Tap "Join Club" without ticking the box -> a short "please agree to the terms" message, nothing submitted.
- Submit, then open the SAME join link again and try to join the same club twice -> an "Unable to Join" card with a clear reason (e.g. you already have a pending request). This is expected, not a bug.
- Open a join link for a club you are already a member of -> an "Unable to Join" style message, not a crash.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### ONB-012 - Discover and request a club inside the app

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Logged-in student (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/clubs`
- **Goal:** Prove a student can search for a club inside the app and send a join request, picking a belt as part of the request.

**Preconditions / setup:**
1. Logged in as a student who is NOT already a member of the club you will request.
2. At least one club exists to find (the seeded test club).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Discover area at `/dashboard/clubs` | The page loads under a heading like "Discover and join clubs in your area", with a search box ("Search by club names") and a list of clubs. |
| 2 | Type part of the test club's name in the search box | The list filters to matching clubs as you type. If nothing matches, a "No clubs found" message shows; with no clubs at all, "No clubs available". |
| 3 | Tap the test club to open its "Request to Join Club" form | A form appears, including the line "Join [club name] and train with experienced instructors" and a belt picker labelled "Select your belt level" / "Current Belt Level", plus an optional message box and a "Send Request" button. |
| 4 | WITHOUT picking a belt, tap "Send Request" | It does not submit; a "Please select your belt level" message appears. Picking a belt is required to request a club. |
| 5 | Pick a belt level (if you have never trained, choose the lowest belt, as the hint suggests), then tap "Send Request" | A success message ("Request sent" / "Successfully joined..."), and your request goes to club staff for approval (same place an owner approves in OWP-010). |

**Screen-size check:** The club list is a single column on a phone and a grid on desktop; the join form opens as a panel/modal that stays usable at the tablet (~768px) width.

**Edge cases to try:**
- Search for a club name that does not exist -> "No clubs found matching..." message, no crash.
- Open the join form, then close it without sending -> no request is created.
- If the page also offers an "Have an invitation code?" box, leaving it empty and using the normal request flow should still work (the code box is a separate shortcut).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Member scenarios

### MEM-001 - Dashboard loads for a plain member

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard`
- **Goal:** Prove the member's home dashboard loads the right cards (your clubs, recent activity, usage, announcements) and offers no club management.

**Preconditions / setup:**
1. Logged in as the seeded Member, already approved into the test club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard` | The dashboard loads with cards for your clubs, recent activity, your usage, and announcements. The club you belong to appears. |
| 2 | Look across the whole page | There are NO management actions (no approve-member, no create-class, no analytics). Everything offered is "view" or "go to my progress / library / club". |
| 3 | Tap your club card | You open that club's overview as a member (MEM-005). |

**Screen-size check:** Cards stack in one column on a phone (<640px) and spread into a grid on desktop; nothing overflows at the ~768px boundary.

**Edge cases to try:**
- A brand-new member with no activity yet -> empty cards show friendly "nothing yet" states, not blank boxes or errors.
- Refresh mid-load -> cards re-fetch cleanly, no stuck spinners.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-002 - Personal belt reference

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/belts`
- **Goal:** Prove the member can view the belt reference (the master belts and their club's belts).

**Preconditions / setup:**
1. Logged in as the Member, in the test club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/belts` | The belt reference loads, showing belt levels with their names, colors and order. |
| 2 | Look through the Kyu Ranks and Dan Ranks sections | Your club's belts are listed under both, matching what the owner defined (OWP-016). This page shows the CLUB's belts only - there is no master belt list on it. |
| 3 | If your account belongs to more than one club, open the club selector top right and switch | The belts for the club you picked load. With only one club the selector does not render. |

**Screen-size check:** Belt rows/cards stay readable on a phone and line up in a grid on desktop.

**Edge cases to try:**
- A club with no belts defined -> the Kyu Ranks and Dan Ranks headings still render, with no belts under them and no error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-003 - Personal progression

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/progress`
- **Goal:** Prove the member can see their own belt progress toward the next belt.

**Preconditions / setup:**
1. Logged in as the Member, in the test club. Some attendance history makes the bars more meaningful (use CR-001 setup if you want data).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/progress` | Your progression loads: your current belt, the next belt, and how far along you are (classes attended versus required, a progress bar or percentage). |
| 2 | Read the numbers | They reflect your real attendance/curriculum, not placeholder values. With no activity, the progress reads near zero, not blank. |
| 3 | Compare the total attendance count at the top against the sum of the per-curriculum/class-type breakdown further down | The two should match. If they disagree, file it. |

**Screen-size check:** Progress bars/charts stack vertically on a phone (<640px) and sit side by side on desktop.

**Edge cases to try:**
- A member with zero attendance -> a clean "no progress yet" / 0% state.
- Refresh mid-load -> re-fetch, no stale empty chart.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-004 - Progress within a club

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]/progress`
- **Goal:** Prove the member can see their progression scoped to one specific club.

**Preconditions / setup:**
1. Logged in as the Member, viewing the test club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | From the club, open your club-scoped progress page | Your progress for THIS club loads (belt, next belt, classes done versus required). |
| 2 | Compare with `/progress` | The club-scoped page reflects the same club's numbers; if you belong to more than one club, this page is about this one only. |
| 3 | As in MEM-003 step 3, check the total attendance count against the per-curriculum breakdown | They should match. |

**Screen-size check:** Same as MEM-003: charts stack on phone, side by side on desktop.

**Edge cases to try:**
- Open this page for a club you just joined with no attendance -> a 0% / "no progress yet" state.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-005 - View club overview (member view)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]`
- **Goal:** Prove the member sees the club overview WITHOUT any management controls.

**Preconditions / setup:**
1. Logged in as the Member, approved into the test club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the test club overview | The club banner, basic stats and a members preview load. |
| 2 | Look at the top tab bar and the page body | You see fewer tabs than an owner does. There is NO "generate QR / share link", NO "create class", NO approve/manage member controls, NO settings tab for you. |
| 3 | Scroll the whole overview | Everything you can tap is a "view" action (open calendar, open library, see your progress). No button changes club data. |

**Screen-size check:** The overview is single-column on a phone; the tab bar fits without horizontal scrolling at ~768px.

**Edge cases to try:**
- Compare side by side with an owner's overview (open the owner sheet OWP-001) -> confirm the management buttons that the owner has are simply absent for you, not just greyed out.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-006 - View club calendar (read-only)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]/calendar`
- **Goal:** Prove the member can view the club calendar and its events but cannot create or edit any.

**Preconditions / setup:**
1. Logged in as the Member, in the test club. The club should have at least one class/event on the calendar (an owner adds these in OWP-006).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club calendar | The calendar loads with the club's real classes/events shown on their dates. |
| 2 | Tap an event | You can see its details (time, room, type). |
| 3 | Look for a "create event" / "add class" button | There is none for you. You cannot add, edit, cancel or reschedule events. |

**Screen-size check:** The calendar switches to a compact / list-style view on a phone and a full grid on desktop; check the ~768px boundary does not clip days.

**Edge cases to try:**
- Try tapping an empty day -> nothing should offer to create an event for you (unlike staff, who get a create dialog).
- A club with no events -> an empty calendar, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-007 - BLOCKED: View members list

- **Status:** FUNCTIONAL (expected: turned away)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]/members`
- **Goal:** Prove a plain member cannot reach the club members page, even by typing the page address directly.

**Preconditions / setup:**
1. Logged in as the Member, in the test club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Type the club's members page address directly in the browser | An "Access Restricted" screen appears with a message that you don't have permission to access the members page, and a "Go Back" button. You do NOT see the members roster. |
| 2 | Tap "Go Back" | You return to the previous page. |

**Screen-size check:** The Access Restricted screen renders cleanly on phone, tablet, and desktop.

**Edge cases to try:**
- Refresh on the blocked screen: you stay blocked, you do not slip through on reload.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-008 - Browse sites and rooms (read-only)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]/site`, site detail, room detail
- **Goal:** Prove the member can view the club's physical sites and rooms but cannot add or edit them.

**Preconditions / setup:**
1. Logged in as the Member, in a club that has at least one site and room (an owner adds these in OWP-003 / OWP-004).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club's Site area | The list of sites loads. |
| 2 | Open a site, then a room inside it | You can read the site address and the room details. |
| 3 | Look for add/edit/delete controls | There are none for you. |

**Screen-size check:** Sites and rooms list in a single column on phone and a grid on desktop.

> Note on the room page: if you open the in-room "create a class" dialog anywhere, the teacher names it offers are placeholder names. That is a known limitation (START-HERE §8 #6), and as a member you should not be creating classes there at all. Do not file it.

**Edge cases to try:**
- A club with no rooms yet -> an empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-009 - Global move library and a move detail

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/library`, `/library/[id]`
- **Goal:** Prove the member can browse the global move library and open a move's detail with its video.

**Preconditions / setup:**
1. Logged in as the Member. The library should have some seeded moves with media.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/library` | The move library loads with a grid/list of moves. |
| 2 | Tap a move | Its detail page opens with the description and a video. |
| 3 | Play the video | It plays as a plain video file (no quality / resolution switcher). The missing quality switcher is expected (START-HERE §8 #2), do not file it. |

> Important: which moves you see depends on your subscription tier and belt rank. Whether you "see everything" or only beginner moves is checked separately in MEM-022. For THIS test, just confirm the library loads and a move you CAN see opens and plays.

**Screen-size check:** The grid is fewer columns on a phone and more on desktop; the video player fits the screen width at every size.

**Edge cases to try:**
- An empty library -> a friendly "no moves" state, not an error.
- Open a move detail then go back -> the list is preserved, no full reload jank.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-010 - Global and club warmups

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/library/warmup`, `/dashboard/myClub/[clubID]/library/warmup`
- **Goal:** Prove the member can view warmup exercises (global and the club's own).

**Preconditions / setup:**
1. Logged in as the Member, in the test club with some seeded warmups.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/library/warmup` | The global warmup list loads. |
| 2 | Open a warmup | Its detail/media shows. |
| 3 | From the club, open the club's warmup library | The club's own warmups load. |

> As with moves, which GLOBAL (master) warmups you see depends on your tier; that gating is checked in MEM-022. The club's OWN warmups are not tier-gated.

**Screen-size check:** Warmup cards/list reflow from one column on phone to a grid on desktop.

**Edge cases to try:**
- No warmups seeded -> empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-011 - Club library view (read-only)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]/library`
- **Goal:** Prove the member can view the club's own move library but cannot manage it.

**Preconditions / setup:**
1. Logged in as the Member, in a club whose owner has added some library content (OWP-026).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club's library | The club's moves load. |
| 2 | Open a move | Its detail and media show. |
| 3 | Look for "manage" / "add" / "edit" controls | There are none for you. |

**Screen-size check:** Grid reflows phone-to-desktop as in MEM-009.

**Edge cases to try:**
- A club with no custom library content -> an empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-012 - Notification center and mark read

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/notifications`
- **Goal:** Prove the member can see club notifications and mark them as read.

**Preconditions / setup:**
1. Logged in as the Member, in the test club. At least one notification exists (an owner can broadcast one in OWP-029, or join-approval creates one).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/notifications` | Your notifications load, newest first, with unread ones visibly marked. |
| 2 | Open / tap an unread notification (or the "mark read" control) | It changes to read; the unread count on the bell drops accordingly. |
| 3 | Open the bell icon in the top bar | It mirrors the same notifications. |

**Screen-size check:** The notification list is a single column on phone; the bell dropdown opens without going off-screen on small widths.

**Edge cases to try:**
- No notifications -> a clean "you're all caught up" state.
- Mark one read, then refresh -> it stays read.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-013 - Messaging: free tier can contact staff

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/messages`
- **Goal:** Prove a free member can start a message to club staff (owner / sensei / secretary).

**Preconditions / setup:**
1. Logged in as the Member, sharing the test club with at least one staff account.
2. FREE-ACCOUNT NOTE: this test reads the same whether your account is free or premium, because BOTH can message staff. The free LIMIT is what MEM-040 checks. Here, just confirm staff can be reached.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/messages` | The messaging screen loads (your conversation list, empty if you have none yet). |
| 2 | Tap "New Message" | A "New Message" panel opens with a "Search Members" box and a list of people you can contact. |
| 3 | Look at who is listed | Staff (owner / sensei / secretary) of your club appear and can be picked. (If your account is FREE, ONLY staff appear here; if premium, plain members appear too. Either is expected at this step.) |
| 4 | Pick a staff member and type a message, then send | The message sends and a conversation thread opens with your message in it. |

**Screen-size check:** On a phone the messaging is a single full-screen pane (list, then the open thread); at ~768px and up it splits into a list on the left and the chat on the right. Check the switch around 768px.

**Edge cases to try:**
- If you belong to no clubs at all, "New Message" shows a "You are not part of any club yet" prompt with a "Join a Club" button instead of a contact list. That is expected.
- Send an empty message -> the send button stays disabled until you type something.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-023 - Group messaging

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A); ideally a second account (Session B, incognito) to be added to a group
- **Solo or 2 testers:** Solo-with-tabs, or 2 testers for the live add/receive part
- **Route(s) / feature:** `/dashboard/messages`
- **Goal:** Prove group chats work, and that only paying/staff members can CREATE a group (any member can be added to one).

**Preconditions / setup:**
1. Logged in as the Member, inside the test club.
2. FREE-ACCOUNT NOTE: creating a group needs a paying or staff account. If your account is free, the create step in this test should fail; that failure IS the expected result for step 2 below. Use a premium/staff account to test successful creation, and a free account to confirm the block.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/messages` and look for a "create group" control | The control is present regardless of your tier (there is no visual free-tier lock on this button - the block, if any, happens after you try). |
| 2 | As a FREE, non-staff member: try to create a group (name it, add at least one other club member) | The attempt fails. RECORD the exact message you see - it is likely a generic error rather than a clear "upgrade to create groups" message. That generic-error behavior is expected for now; do not file it as a missing message, just record it happened. |
| 3 | As a PAYING or STAFF member: create a group the same way | The group is created; you land in its thread. |
| 4 | Add a club member (including a free, non-staff one) to the group you created | They are added successfully - any member can be added to an existing group, even if they couldn't create one themselves. |
| 5 | Send a message in the group | It appears in the thread for you; if you have a second session logged in as an added member, confirm it arrives there live. |
| 6 | Open the group's info panel | You can see the member list and, if you created it, options to manage the group. |
| 7 | Leave the group (or remove a member, if you manage it) | The action completes and the group list/membership updates. |

**Screen-size check:** The group thread and its info panel behave the same as a 1:1 DM across phone/tablet/desktop (see MEM-013's split-pane note at 768px).

**Edge cases to try:**
- Try creating a group with no members added: expect a validation block, not an empty group.
- As a free member already ADDED to a group by staff, confirm you CAN still send/read messages in it (the tier gate only blocks creating a new group, not participating in one).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-024 - Urgent / audible messages

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A); a second account (Session B, incognito) to receive
- **Solo or 2 testers:** 2 testers (or one tester with two logged-in sessions) to see the receiving side
- **Route(s) / feature:** `/dashboard/messages` (DM thread composer)
- **Goal:** Prove any member can mark a direct message "urgent" and that the receiver gets a stronger, audible/vibrating push notification for it.

**Preconditions / setup:**
1. Logged in as the Member (Session A) with a DM thread open to a second account (Session B).
2. This test is easiest on a real phone or an installed PWA with notifications allowed - a plain desktop browser tab may not show the full push behavior. If you cannot test push, still confirm the composer control and the in-app beep/toast (step 3) while Session B is foregrounded.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | In a DM thread, look at the message composer | A red bell / "send as urgent" toggle is available to you (this is NOT staff-only in a 1:1 DM - every member sees it here). |
| 2 | Turn urgent ON and send a message | The message sends normally in the thread; there is no special marker stored on the message itself afterward (urgent only affects the push at send time, not the message history). |
| 3 | With Session B's app open/foregrounded, watch it as you send from Session A | Session B plays an in-app beep and shows a toast for the urgent message, on top of the normal live-arrival behavior. |
| 4 | With Session B's app backgrounded or closed (real device/PWA), send another urgent message | Session B's device gets a push notification that is harder to miss than a normal one: it requires interaction to dismiss, vibrates more, and plays a sound even if the phone is on silent-for-apps style settings. |
| 5 | Send a NON-urgent message with the toggle off | Session B still gets a push, but a normal, quieter one - not the urgent treatment from step 4. |

**Screen-size check:** The urgent toggle in the composer is reachable by thumb on a <640px screen.

**Edge cases to try:**
- Try the same urgent toggle inside a GROUP chat as a non-staff member: the toggle should not even be shown to you there (urgent-in-groups is staff-only), unlike the 1:1 DM case above.
- iOS note: a custom urgent sound needs the PWA added to the Home Screen; a plain Safari tab won't get the full audible treatment. Record which platform you tested on.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-014 - Submit an exit request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/settings` (Membership tab)
- **Goal:** Prove a member can ask to leave the club, and the request goes to staff to process.

**Preconditions / setup:**
1. Logged in as the Member, an active member of the test club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Settings page at `/settings` and click the **Membership** tab | Under the **Leave a Club** section, the active clubs you belong to are listed with a **"Request to Leave"** button next to each. |
| 2 | Tap **"Request to Leave"** next to the target club | A dialog opens asking for a reason. Notice that the **"Reason for Leaving"** field has a red asterisk (`*`) indicating it is required. |
| 3 | Type a reason (required) and confirm | A success message; your exit request is now submitted and pending. |
| 4 | Stop here | Whether you are actually removed is decided by an owner approving or denying it (OWP-015 / CR-011); that part is out of your hands. |

**Screen-size check:** The Settings tabs and the Leave a Club dialog are reachable and readable on a phone; the dialog does not overflow at ~768px.

**Edge cases to try:**
- Try to submit without typing a reason -> validation stops submission.
- Submit an exit request, then try to submit a second one -> only one pending exit is allowed; the second should be blocked or simply show the existing pending state, not a crash.
- Cancel the dialog without confirming -> no request is created.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-015 - Self-enroll / self-unenroll a curriculum

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]/curricula`
- **Goal:** Prove a member can enroll themselves into an available curriculum and unenroll from one.

**Preconditions / setup:**
1. Logged in as the Member, in the test club. The club has at least one curriculum/class definition available for self-enrollment (an owner builds these in OWP-017).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | From the Club Overview page, click the **"View Curriculum"** card (or open `/dashboard/myClub/[clubID]/curricula` directly) | You see the curricula you are enrolled in and any you can join, with "Enroll" / "Unenroll" controls. |
| 2 | Tap **"Enroll"** on an available curriculum | A success message; that curriculum now shows as "Active" and the button changes to "Unenroll". |
| 3 | Tap **"Unenroll"** on a curriculum you are enrolled in | A confirm, then a success message; it moves back to "available" / the button reverts to "Enroll". |

**Screen-size check:** The enroll/unenroll buttons are reachable by thumb on a phone; the list stays readable at ~768px.

**Edge cases to try:**
- Unenroll then re-enroll the same curriculum -> works both ways, no error.
- A club with no curricula offered -> an empty "nothing to enroll in" state.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-016 - Help center and an article

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/help`, `/help/[id]`
- **Goal:** Prove the member can browse the help center and read an article.

**Preconditions / setup:**
1. Logged in as the Member. Help articles must have been published by a platform admin; if none exist, the list is empty (not broken).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/help` | The help center loads with a list of articles (or a clean empty state if none are published). |
| 2 | Open an article | Its full content shows. |
| 3 | If the article offers a "was this helpful?" feedback control, use it | Your feedback is accepted with a small confirmation. |

**Screen-size check:** Article text reflows to the screen width and stays readable on a phone.

**Edge cases to try:**
- No published articles -> empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-017 - Open a support ticket and view the thread

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/support`, `/support/[id]`
- **Goal:** Prove the member can open a support ticket and view its thread. The reply comes later from a platform admin, so do not wait for one here.

**Preconditions / setup:**
1. Logged in as the Member.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/support` | The Support page loads under "Support" / "We're here to help", with a "My Tickets" list and filters (All / Open / Resolved) and a search box. |
| 2 | Tap "Report an Issue" | A form opens to create a ticket (a subject/description and a category like bug / suggestion / help). |
| 3 | Fill it in and submit | A success message; the new ticket appears in "My Tickets" with a status (e.g. "submitted"). |
| 4 | Open the ticket | The ticket thread page opens showing your message and the current status. Opening it marks the ticket read; any "new reply" indicator on that ticket in the "My Tickets" list should clear right away. |
| 5 | Stop here | A staff/admin reply is handled in the admin panel by a platform admin, not in your app. So an unanswered ticket here is expected; do NOT file "no one replied" as a bug. (The live reply arriving in the thread, and the read-indicator clearing live, is checked in CR-016.) |

**Screen-size check:** The ticket list is a single column on phone; the create form and the thread stay usable at ~768px.

**Edge cases to try:**
- Submit with an empty required field -> inline validation, no ticket created.
- Use the All / Open / Resolved filters and the search box -> the list filters correctly; "No tickets yet" shows when nothing matches.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-018 - Edit own profile and avatar

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/editProfile`, `/profile`
- **Goal:** Prove the member can edit their profile details and upload an avatar.

**Preconditions / setup:**
1. Logged in as the Member. For the photo upload, a real phone lets you use the camera; on a laptop you can pick a file.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/editProfile` | Your editable profile loads (name and other detail fields, plus an avatar control). |
| 2 | Change a field (e.g. your display name) and save | A success message; the change sticks. |
| 3 | Upload a new avatar image | The image uploads and your new avatar shows. |
| 4 | Open `/profile` | Your saved changes and new avatar are reflected. |

**Screen-size check:** The form is single-column and fully reachable on a phone; the avatar control is tappable.

**Edge cases to try:**
- Save with a required field blank -> inline validation, no save.
- Upload a very large or non-image file -> a clear rejection, not a crash.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-019 - Account / security / language settings

- **Status:** FUNCTIONAL (billing pane currently hidden)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/settings`; language from the top-bar Language selector
- **Goal:** Prove the member can change their password and switch language.

**Preconditions / setup:**
1. Logged in as the Member.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/settings` | The settings page loads with tabs such as Privacy, Security and Notifications. |
| 2 | Open the Security tab and use "Change Password": enter your current password, then a new one twice | The new passwords must match (a mismatch shows a "passwords do not match" message and keeps the button disabled). On a valid match, saving succeeds with a confirmation. |
| 3 | Open the Privacy tab | You can toggle which of your details (phone, email, address, photo) other members can see; toggles save as you flip them. |
| 4 | Open the Notifications tab, under "Push Notifications" find the "Messages" toggle ("Get notified when someone sends you a message") | Flip it and confirm it saves. It defaults to OFF for new accounts - if you are on a fresh/seeded account, check its starting state and record it. The other two push rows (Class & Club Updates, Tips & Engagement) and the email preferences save the same way. |
| 5 | Open the Language selector in the top bar (the globe), switch between English and Français | The app text switches language and your choice persists across pages. |

> NOTE on billing: there is currently NO Account / Subscription / billing tab on this page (it is turned off for now). The separate "subscription pane" note is MEM-043. Do not file the missing billing tab.

**Screen-size check:** The settings tabs collapse sensibly on a phone; switching to French should not break the tab labels or push content off-screen at ~768px (watch for longer French words).

**Edge cases to try:**
- Change password with the two new passwords differing -> "passwords do not match", button stays disabled.
- Enter the wrong current password -> a clear server error, password unchanged.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-020 - Forced complete-profile / change-password

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/complete-profile`, `/change-password`
- **Goal:** Prove that when the app forces a member to finish their profile or change their password, that forced flow works.

**Preconditions / setup:**
1. This only triggers for an account in the matching state: complete-profile is forced when a profile is still unfinished after the account is about a couple of weeks old; change-password is forced when an admin flagged the account to reset its password. Use an account the QA lead has put in that state, or note "not triggered" if you cannot reproduce it.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Log in with an account in the forced state | You are sent straight to the forced page (`/complete-profile` or `/change-password`) instead of the normal dashboard, and you cannot skip past it. |
| 2 | Complete the required fields (or set the new password) and submit | On success you are released into the app as normal. |

**Screen-size check:** The forced form fills a phone screen and the submit button is reachable.

**Edge cases to try:**
- Try to navigate away to another page before completing it -> the app keeps sending you back to the forced page.
- If you cannot get an account into this state, record "not triggered" rather than filing a bug.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-021 - File a bug / feedback in-app

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** the in-app feedback control (the bug icon in the top bar)
- **Goal:** Prove the member can send feedback / report a bug from inside the app.

**Preconditions / setup:**
1. Logged in as the Member, on any page.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Find the feedback control in the top bar (a small bug icon) and tap it | A feedback / report dialog opens. |
| 2 | Type your feedback or bug description and submit | A success confirmation; the dialog closes. |

> This is a handy way for YOU as a tester to capture something on the spot, but real QA bugs still go into ClickUp with the scenario ID (START-HERE §9). The in-app feedback is the FEATURE under test here.

**Screen-size check:** The dialog opens centered and is fully usable on a phone; it does not overflow at ~768px.

**Edge cases to try:**
- Submit empty -> validation stops it, no empty report sent.
- Cancel the dialog -> nothing is sent.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-022 - Library shows content for your tier and belt

- **Status:** FUNCTIONAL (tier + belt gated on purpose)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/library` (master move library), `/library/warmup` (master warmups)
- **Goal:** Prove the master move and warmup libraries show the content that fits your subscription tier and belt rank, and correctly HIDE the highest "Dan" content from a free or lower-belt account. Seeing less here is the expected behavior, not a bug.

**Preconditions / setup:**
1. FREE-ACCOUNT NOTE: to see the free / lower-belt limit, your account must be genuinely FREE and not a black belt. New accounts default to PREMIUM ("paying"), so a default account will see more. Ask the QA lead for an account explicitly set to free (the app cannot toggle this itself). If you can only test on a premium / black-belt account, record what you see and note the account's tier and belt; the limit will simply not apply, which is correct.
2. The master library must have moves/warmups across a range of belt ranks (beginner up to the highest "Dan" levels) so there is something to hide.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Note your account's tier (free or premium) and your belt rank before you start | Write both down; the expected result depends on them. |
| 2 | Open `/library` and scan the moves available to you | A FREE or club-unaffiliated account sees only beginner-level moves. A premium account below black belt sees beginner up to the first Dan level but NOT the higher Dan moves. A black-belt holder or club owner sees everything. |
| 3 | Look specifically for the highest "Dan" moves | If your account is free or a non-black-belt, those highest Dan moves should be ABSENT from your list. Their absence is correct, not a bug. |
| 4 | Try to open a higher-tier move you should not have (for example by guessing its detail address) | You are kept out / shown a "needs a higher plan or belt" style block rather than the full content. |
| 5 | Open `/library/warmup` | A free account sees only the free-level warmups; premium ("paying") warmups are absent for a free account. Again, absence is correct. |

> Reminder: this gating applies to the MASTER (global) move and warmup libraries. A CLUB's own custom moves/warmups are a separate show/hide and are NOT tier-gated, so do not compare the two. (START-HERE §8 #5 covers this.)

**Screen-size check:** The library grid reflows phone-to-desktop; the "needs a higher plan/belt" block, if shown, is readable on a phone.

**Edge cases to try:**
- Same account, compare the move count on a free versus a premium login of comparable belt -> the free login should show fewer moves. If a FREE non-black-belt account can see the highest Dan moves, THAT is worth flagging.
- Test in French too: the gated/empty states should still read correctly.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## BLOCKED / NOTE battery (the "you should be turned away" checks)

> For each BLOCKED test, being kept out IS the pass. You are confirming the app does not let a plain member reach owner-only screens or controls. The NOTE tests (MEM-043, MEM-044) are about known placeholders; do NOT file those.

### MEM-040 - BLOCKED: starting a chat with a plain member

- **Status:** FUNCTIONAL (expected: cannot start it)
- **Role(s) & sessions:** Free Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs (the deeper two-person version is CR-009)
- **Route(s) / feature:** `/dashboard/messages`
- **Goal:** Prove a FREE non-staff member cannot start a new conversation with another plain (non-staff) member, but can still message staff and can reply to anyone who messaged them first.

**Preconditions / setup:**
1. FREE-ACCOUNT NOTE: this limit ONLY appears on a genuinely FREE account. New accounts default to PREMIUM, and a premium account can message anyone, so the limit will NOT show, which is correct. Use a free member account (ask the QA lead). If you only have a premium account, record "account is premium, limit does not apply (expected)" and move on.
2. Logged in as the FREE Member, sharing the test club with at least one staff account AND at least one other plain member.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/messages` and tap "New Message" | The "New Message" contact list opens. |
| 2 | Look at who is in the list | For a FREE account, ONLY staff (owner / sensei / secretary) appear. Plain members are NOT offered, so there is no way to start a chat with one. |
| 3 | Confirm you CAN still pick a staff member and message them | Staff messaging works (same as MEM-013). |
| 4 | Now have a staff or premium member message YOU first (you can do this from a second session, or use the staff seeded account), then open that conversation | A reply composer is available and you can reply, because the other person started the thread. |
| 5 | If a thread exists with a plain member who did NOT message you first, open it | Instead of a message box you see a "Free Plan" notice explaining you can message staff or reply to members who messaged you first, and you cannot send. |

**Screen-size check:** The "Free Plan" notice and the staff-only contact list read correctly on a phone and at ~768px; in French the notice text should not overflow.

**Edge cases to try:**
- Premium account check: log in as a premium member -> the contact list includes plain members and you CAN start a chat with them. That difference is the expected behavior, not a bug.
- A free member replying to a staff message -> always allowed.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-041 - BLOCKED: analytics / history / settings / teachers

- **Status:** FUNCTIONAL (expected: turned away)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../analytics`, `.../history`, `.../settings`, `.../teachers`
- **Goal:** Prove a plain member cannot reach any of the owner/staff management screens, even by typing the page address directly.

**Preconditions / setup:**
1. Logged in as the Member, inside the test club. Have the club's address handy so you can type the management page addresses by hand (the member menu does not link to them).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Confirm none of these appear in your member menu or club tab bar: Analytics, History, Settings, Teachers | They are simply not offered to you. |
| 2 | Type the club's Analytics address directly | You are turned away (an "access restricted" / "no permission" screen), not shown the charts. |
| 3 | Type the club's History address directly | Same: turned away. |
| 4 | Type the club's Settings address directly | You cannot edit club settings; you are blocked or redirected. |
| 5 | Type the club's Teachers address directly | An "owner only" style block; you cannot manage teachers. |

> **Scan Attendance is NOT part of this scenario - do not file it as a leak.**
> `.../scan-attendance` is student self-check-in and is meant to open for a
> member: you scan the QR code your instructor displays to mark your OWN
> attendance. The only role blocked there is the secretary. The staff-side
> screen, where someone takes attendance for others, is the room attendance
> page reached through a site's room - that one does turn a plain member away.

**Screen-size check:** The "access restricted" screens render cleanly on a phone and at ~768px.

**Edge cases to try:**
- Refresh while on a blocked screen -> you stay blocked, you do not slip through on reload.
- If a half-valid login bounces you to "session expired", log in again and continue (START-HERE §8 #11), do not file the bounce.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-042 - BLOCKED: create an event / manage members

- **Status:** FUNCTIONAL (expected: no such controls)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../calendar`, `.../members`
- **Goal:** Prove the create-event and member-management controls simply do not render for a plain member on the pages they CAN view.

**Preconditions / setup:**
1. Logged in as the Member, viewing the test club's calendar and members pages (these you can open, view-only).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club calendar | You can view events (MEM-006) but there is NO "create class / add event" button anywhere for you. |
| 2 | Tap an empty calendar day | Nothing offers to create an event (staff get a create dialog here; you do not). |
| 3 | Open the club members page | You can view the roster (MEM-007) but there are NO approve/reject, assign-role, fee-tier, or remove-member controls, and NO staff "exit requests" tab. |
| 4 | Confirm your own member actions still work | Your "Request to Leave" (MEM-014) and curriculum Enroll/Unenroll (MEM-015) are present; those are member self-service, not management of others. |

**Screen-size check:** On both pages, the absence of staff controls is consistent across phone, ~768px and desktop (no control sneaks back in at one width).

**Edge cases to try:**
- Compare against an owner's view of the same two pages (OWP-006, OWP-010) -> confirm the staff controls you lack are absent, not just hidden behind a width breakpoint.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-043 - NOTE: the subscription / billing pane

- **Status:** STUB (do not file)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/settings` (subscription / billing area)
- **Goal:** Confirm there is no real checkout or payment anywhere. Whatever subscription / billing UI exists is a mock, and right now it is turned off entirely. Record what you see; do not file it as broken.

**Preconditions / setup:**
1. Logged in as the Member, on `/settings`.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Look across the settings tabs for a subscription / billing / payment section | Currently there is NO billing or subscription tab here at all (it is switched off). |
| 2 | If you happen to find any billing UI in this build | It is a mock with no real card entry, no real checkout, and no real payment. Nothing charges anything. |
| 3 | Record what you saw | Note "no billing tab present" or, if you found a mock, "mock billing, no real checkout". Do NOT file either as a bug (START-HERE §8 #4). |

**Screen-size check:** None specific; the settings tabs already covered in MEM-019.

**Edge cases to try:**
- None. This is a confirm-and-record check, not a functional test.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### MEM-044 - NOTE: the Portal page is a placeholder

- **Status:** STUB (do not file)
- **Role(s) & sessions:** Member (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/portal`
- **Goal:** Confirm the Portal page is still a placeholder with disabled buttons. Record it; do not file it.

**Preconditions / setup:**
1. Logged in as the Member.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/portal` | A placeholder page loads. |
| 2 | Try its buttons | They are disabled, with "Coming Soon" / "Backend integration coming soon" style labels. Nothing happens, as intended. |
| 3 | Record it | Note "Portal still a placeholder". Do NOT file the dead buttons (START-HERE §8 #1). |

**Screen-size check:** The placeholder renders without breaking on a phone or at ~768px.

**Edge cases to try:**
- None. Confirm-and-record only.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
