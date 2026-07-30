# Role: Owner Primary - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** the primary owner (founder) of a martial arts club - the one account with full control of the club, including the things only the founder can do (manage teachers, transfer ownership).

**Sessions:** Owner Primary is a single role. Unless a step says otherwise, you work in **Session A only** (one normal window, logged in as the Owner Primary). A few onboarding tests start from a brand-new account - they tell you so.

**Before the OWP tests:** log in as the seeded Owner Primary account (START-HERE §3) and open the club at `/dashboard/myClub/[clubID]`. The `ONB-` tests at the top build an account and a club from scratch and do not need the seeded login.

**How you move around the club:** the red bar at the top of every club page has five tabs - **Overview, Calendar, Members, Site, Settings**. Pages like History, Analytics, Belts, Curricula, Exams, Promotions, Teachers, Usage, Eligible Students and Scan Attendance are NOT in that tab bar - you reach them from cards/links on the Overview page or by typing the page address. Each test below tells you exactly how to get there.

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| ONB-001 | Sign up from scratch | FUNCTIONAL |
| ONB-002 | Verify email via OTP code | FUNCTIONAL |
| ONB-003 | Log in | FUNCTIONAL |
| ONB-004 | Forgot password and reset | FUNCTIONAL |
| ONB-005 | Create a club (wizard) | FUNCTIONAL |
| OWP-001 | Club overview loads | FUNCTIONAL |
| OWP-002 | Generate QR / share link | FUNCTIONAL |
| OWP-003 | Create a site | FUNCTIONAL |
| OWP-004 | Create a room in a site | FUNCTIONAL |
| OWP-005 | Edit / delete a site and room | FUNCTIONAL |
| OWP-006 | Create a class (calendar) | FUNCTIONAL (room-modal mock-teacher caveat) |
| OWP-007 | Create a recurring class | FUNCTIONAL |
| OWP-008 | Create an exam / workshop / social / tournament | FUNCTIONAL |
| OWP-009 | Edit / cancel / reschedule an event | FUNCTIONAL |
| OWP-010 | Approve a join request | FUNCTIONAL |
| OWP-011 | Reject a join request | FUNCTIONAL |
| OWP-012 | Assign a role to a member | FUNCTIONAL |
| OWP-013 | Create a fee tier | FUNCTIONAL |
| OWP-014 | Bulk member operations | FUNCTIONAL |
| OWP-015 | Process an exit request | FUNCTIONAL |
| OWP-016 | Define club belts | FUNCTIONAL |
| OWP-017 | Create and assign a curriculum | FUNCTIONAL |
| OWP-018 | View eligible students | FUNCTIONAL |
| OWP-019 | Schedule an exam and grade candidates | FUNCTIONAL |
| OWP-020 | Run the promotion workflow | FUNCTIONAL |
| OWP-021 | Manage teachers (add / revoke sensei) | FUNCTIONAL (room-modal mock-teacher caveat) |
| OWP-022 | Add / remove a co-owner | FUNCTIONAL |
| OWP-023 | View analytics tabs | FUNCTIONAL (Financial tab disabled on purpose) |
| OWP-024 | View attendance + promotion history | FUNCTIONAL |
| OWP-025 | View club usage metrics | FUNCTIONAL |
| OWP-026 | Manage the club library | FUNCTIONAL |
| OWP-027 | Manage club warmups | FUNCTIONAL |
| OWP-028 | Edit club settings | FUNCTIONAL |
| OWP-029 | Send a club broadcast notification | FUNCTIONAL |
| OWP-030 | Transfer primary ownership | FUNCTIONAL (primary owner only) |
| OWP-031 | Take room-level attendance | FUNCTIONAL |
| OWP-040 | Empty-state sweep (brand-new club) | FUNCTIONAL |

---

## Onboarding (from scratch)

> These five run in order and build the account and club every later OWP test reuses. Use a real email inbox you control. Trick: `you+owner1@gmail.com` still lands in `you@gmail.com` (START-HERE §3).

### ONB-001 - Sign up from scratch

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Brand-new visitor (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/register`
- **Goal:** Prove a new person can create an account with email + password and is sent to verify their email.

**Preconditions / setup:**
1. Not logged in. If you are, log out first (or use a fresh Incognito window).
2. Have a real email inbox open in another tab so you can read the code in ONB-002.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/register` | The sign-up form loads with an Email field, a Password field, an "I am an adult" checkbox, and a "Get Started" button. |
| 2 | Type a valid new email (e.g. `you+owner1@gmail.com`) | Field accepts it; no error under it. |
| 3 | Type a password | A password-strength meter appears and reacts as you type. |
| 4 | Tap the eye icon in the password field | The password becomes readable; tapping again hides it. |
| 5 | Tick the "I am an adult" checkbox | The box turns green/checked; a short explanation line appears. |
| 6 | Tap "Get Started" | A success message appears, then after about a second you land on the verify-email page, with your email shown / carried over. |

**Screen-size check:** On a phone (<640px) the form fills the screen and the "Get Started" button is reachable by thumb; the "Already have an account? Log in" line sits pinned near the bottom on mobile.

**Edge cases to try:**
- Leave the email blank or type a bad email (e.g. `abc@`) and tap Get Started → inline "invalid email" style error, no submit.
- Use a password that is too weak → strength meter stays low and the form should reject it.
- Leave the adult checkbox unticked → an error appears next to it and you are not advanced.
- Register an email that already exists → a clear "already registered" style error (server message), no new account.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### ONB-002 - Verify email via OTP code

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** New account from ONB-001 (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/verify-email`
- **Goal:** Prove the emailed 6-digit code verifies the account, the countdown works, and an expired code is rejected.

**Preconditions / setup:**
1. You just finished ONB-001 and are on the verify-email page (or open `/verify-email?email=<your email>`).
2. TIME-SENSITIVE: the code expires (about 10 minutes). Read your inbox promptly. Do step 5 immediately after typing the code.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Look at the page | Six single-digit boxes are shown, split 3 and 3, plus a line that says the code expires in a countdown like `9:58`. |
| 2 | Watch the countdown for ~10 seconds | The time ticks down second by second. |
| 3 | Open your email inbox in the other tab | An email with a 6-digit verification code has arrived. |
| 4 | Type the 6 digits into the boxes | The digits fill left to right; the "Verify" button becomes enabled once all six are entered. |
| 5 | Tap "Verify" | A success screen appears ("email verified"), then after about a second you are taken into the app (the dashboard). |

**Screen-size check:** The six code boxes stay on one row and are tappable on a phone; the top image strip does not push the boxes off-screen.

**Edge cases to try:**
- Type a wrong 6-digit code → "invalid code" style error, you stay on the page.
- Let the countdown reach `0:00` → it shows an "expired" message and the boxes/Verify are disabled. Refresh the page → it should STILL show expired (it must NOT restart at ~10:00). If a fresh ~10:00 timer reappears after expiry on refresh, that IS a bug - file it.
- Enter only 5 digits → Verify stays disabled.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### ONB-003 - Log in

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Verified account (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/login`
- **Goal:** Prove valid credentials log you in and land you on the right page; wrong credentials are rejected.

**Preconditions / setup:**
1. You have a verified account (from ONB-002) or the seeded Owner Primary account.
2. If logged in, log out first.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/login` | Login form with Email, Password, "Log in" button, "Forgot password?" link, and (on desktop) a "Sign up" link. |
| 2 | Type your email and password | Fields accept input; eye icon toggles password visibility. |
| 3 | Tap "Log in" | Success message, then after about a second you land in the app. If this account already owns a club, you land directly on that club's overview; otherwise you land on the dashboard. |

**Screen-size check:** On phone the form is centered and reachable; on desktop the "Don't have an account? Sign up" line is visible under the button.

**Edge cases to try:**
- Wrong password → a clear error toast, you stay on login.
- Unknown email → error toast, no login.
- Empty fields → inline validation, no submit.
- If you were bounced here with "session expired" earlier, simply logging in again should continue normally (START-HERE §8 #11 - do not file the bounce itself).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### ONB-004 - Forgot password and reset

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** An existing account (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/forgot-password` (the reset happens on the same flow)
- **Goal:** Prove you can request a reset code, verify it, set a new password, and log in with the new password.

**Preconditions / setup:**
1. Use an account whose password you are willing to change (a spare `you+ownerN@gmail.com` account is safest, not the shared seeded one).
2. TIME-SENSITIVE: the reset code expires like the sign-up code - read your inbox promptly.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/login` and tap "Forgot password?" | The forgot-password page loads with an Email field and a "Send" button. |
| 2 | Type your account email and tap Send | A success message ("reset code sent"); the page switches to show six code boxes plus a "Verify" button and a "Try another email" button. |
| 3 | Open your inbox, read the 6-digit code, type it in | The Verify button enables when six digits are entered. |
| 4 | Tap "Verify" | On success a confirmation appears and the page switches to a New Password + Confirm Password form. |
| 5 | Type a new password and confirm it (matching) | The confirm field shows a matched/green state; the "Reset Password" button enables only when the two match. |
| 6 | Tap "Reset Password" | A success message, then you are redirected to the login page. |
| 7 | Log in with the NEW password (reference ONB-003) | Login succeeds. |

**Screen-size check:** The six code boxes stay usable on phone; on mobile a short helper line ("Enter the 6-digit code…") shows; the back/login link shows on desktop.

**Edge cases to try:**
- Type a wrong reset code → error, you stay on the code step.
- Make the two new passwords differ → Reset Password stays disabled.
- "Try another email" → returns you to the email step and clears the code.
- Old password should no longer work at login after a successful reset.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### ONB-005 - Create a club (wizard)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Logged-in account that does not yet own a club (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/club/create`
- **Goal:** Prove the create-club wizard validates the required fields (including a valid creation code) and creates a club you become the owner of.

**Preconditions / setup:**
1. Logged in (ONB-003).
2. IMPORTANT: this wizard requires a valid **Club Creation Code** (an invitation code). The team must give you a working one before this test. Note it down here: `[fill in valid creation code]`. Without it you cannot finish - that is expected, not a bug.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/club/create` | A two-step wizard opens on Step 1 ("Basic Information"), with a Club Name field, a Club Creation Code field, a Discipline picker, and a Language picker. "Next" is disabled until the required fields are filled. |
| 2 | Type a Club Name | Field accepts it. |
| 3 | Type the valid Club Creation Code from setup | Field accepts it. |
| 4 | Open the Discipline picker | Discipline is selected from a list (e.g. "Karate - Shotokan", "Iaido"). Confirm "Iaido" is offered in the list; if it is missing, file it. |
| 5 | Pick the Language (English or French) | Language is selected; "Next" becomes enabled. |
| 6 | (Optional) expand "Advanced Options" | A collapsible section reveals logo upload, primary/secondary color pickers, federation, website, and social links. Filling these is optional. |
| 7 | Tap "Next" | The code is checked first; on a valid code a "saved" toast shows and you advance to Step 2, a celebratory "Trial Status" screen (14-day trial card) with confetti. |
| 8 | Tap "Complete" on Step 2 | A "club created" success toast, then after about a second you land on your new club's overview at `/dashboard/myClub/[clubID]`. The club starts on a 14-day trial; you (the creator) are the PRIMARY owner of it and are automatically given a Black Belt as your starting belt. |

**Screen-size check:** On phone the Step-1 form is a frosted card and scrolls; the address detail fields (house number / town / zip / country) only show on desktop within the location section - that is by design, not a cut-off bug.

**Edge cases to try:**
- Type an invalid / already-used / expired creation code and tap Next → an inline error appears under the code field and you do NOT advance. Without a valid code the wizard ends in an error, not a club - that is expected.
- Leave any required field blank → "Next" stays disabled.
- On Step 1, tap "Request one" (the "Don't have a code?" link) → a request-a-code dialog opens with an optional message box and a Send button. (You can cancel out; sending twice should warn that a request is already pending.)
- Use the back arrow at the top to leave mid-wizard → returns to the previous page; nothing is created.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Owner Primary - club management

### OWP-001 - Club overview loads

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]`
- **Goal:** Prove the owner's club overview loads with the banner, the management stats, the members preview, and overview charts.

**Preconditions / setup:**
1. Logged in as Owner Primary; note the active club ID (START-HERE §10).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard/myClub/[clubID]` | The overview loads: a club banner/header with the club name, and the five tabs (Overview, Calendar, Members, Site, Settings) in the top red bar. No "access restricted" message. |
| 2 | Look at the stat cards | Cards show real numbers for things like active members, teachers/senseis, average attendance, and app-usage minutes (zeros are fine on a quiet club - not a bug). |
| 3 | Find the members preview area and tap the small "Members" link/chip | You are taken to the members page for this club. |
| 4 | Go back and scroll to the activity/members chart, then tap the "analytics" link under it | You are taken to the analytics page (membership tab). |
| 5 | Tap your avatar pill in the top-right of the header to open the profile menu | The dropdown opens with My Profile, Household, Switch Profile, Switch Club, and Settings; confirms you are recognized as the owner (no member-only view). |

**Screen-size check:** On phone the stat cards stack and the right-hand club sidebar slides in from a toggle; at desktop (>=1024) the club list sidebar is docked on the side.

**Edge cases to try:**
- Refresh mid-load → the page re-fetches and renders, no blank shell stuck.
- Open a club you are NOT a member of by changing the ID in the address bar → you should be told you are not a member and bounced to the dashboard.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-002 - Generate QR / share link

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** Club overview + Settings QR Code tab + the Share dialog
- **Goal:** Prove the owner can produce a join QR code and a shareable join link, copy it, and regenerate it.

**Preconditions / setup:**
1. Logged in as Owner Primary on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On the overview, open the Settings tab, then the "QR Code" section (or open the overview's QR/share card) | A QR code image for the club shows, along with a join link. |
| 2 | Tap "Copy" on the join link | A "copied" confirmation toast; the link is now on your clipboard (paste it somewhere to confirm it is a `/join/...` URL). |
| 3 | Tap the "Regenerate" / refresh control on the QR | A new QR is generated and a "regenerated" success toast shows. |
| 4 | From the side menu/overview, open the "Share" option | A Share dialog opens letting you share the club join link. |

**Screen-size check:** The QR image stays square and fully visible on a phone; the copy button is reachable.

**Edge cases to try:**
- Copy the link, open it in a separate Incognito window → it should load the public join page for this club (this is the start of CR-002; you do not have to finish joining here).
- Regenerate twice quickly → still ends on a single valid QR, no crash.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-003 - Create a site

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/site`
- **Goal:** Prove the owner can add a physical site (a training location).

**Preconditions / setup:**
1. Logged in as Owner Primary on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the "Site" tab in the top bar (or go to `.../[clubID]/site`) | The Sites page loads with any existing sites and an "Add Site" button (the button is hidden for plain members - you, as owner, see it). |
| 2 | Tap "Add Site" | A create-site dialog opens with fields for name and address details. |
| 3 | Fill the site name and address fields | Fields accept input. |
| 4 | Tap "Create Site" | The dialog closes, a success indication shows, and the new site appears in the sites list. |

**Screen-size check:** The Add Site dialog fits the phone screen and scrolls if needed; the Create button stays reachable.

**Edge cases to try:**
- Submit with the name empty → validation stops you / shows an error.
- Open the dialog and cancel → no site created.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-004 - Create a room in a site

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/site/[siteId]`
- **Goal:** Prove the owner can add a room to a site. (A room is required before you can schedule classes.)

**Preconditions / setup:**
1. The club has at least one site (do OWP-003 first if not).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On the Sites page, tap a site to open its detail (or go to `.../site/[siteId]`) | The site detail page loads showing the site and any existing rooms, with an "Add Room" button. |
| 2 | Tap "Add Room" | A create-room form/dialog opens with fields like room name, size, capacity, and floor. |
| 3 | Fill the room name (others optional) | Fields accept input. |
| 4 | Tap "Create Room" | The room is created and now appears under the site. |

**Screen-size check:** The room form is reachable on phone; the Create Room button is not cut off.

**Edge cases to try:**
- Empty room name → validation blocks it.
- Create two rooms in the same site → both appear; you will use a room in OWP-006.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-005 - Edit / delete a site and room

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/site`, `.../site/[siteId]`
- **Goal:** Prove the owner can edit and remove/archive sites and rooms.

**Preconditions / setup:**
1. The club has at least one site with at least one room (OWP-003 / OWP-004). Create a throwaway "Test Site to Delete" so you do not disturb real data.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Sites page and find your throwaway site | It appears in the list with edit/manage controls. |
| 2 | Open the site, edit its name, and save | The new name shows on the site. |
| 3 | Open a room in that site, edit the room name, and save | The room shows the new name. |
| 4 | Delete/remove the room | The room disappears from the site (or is marked archived/removed). |
| 5 | Delete/remove the throwaway site | The site disappears from (or is archived in) the list. |

**Screen-size check:** Edit and delete controls are reachable by thumb on phone; confirm dialogs fit the screen.

**Edge cases to try:**
- Cancel a delete confirmation → nothing is removed.
- Try removing a site that still has rooms/classes → note whatever the app does (warn, block, or cascade); record it, do not assume which is correct.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-006 - Create a class (calendar)

- **Status:** FUNCTIONAL (PARTIAL caveat: the teacher picker INSIDE a Room's class-create modal shows placeholder names - see edge cases)
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove the owner can create a one-off class from the Calendar and that real teacher data is used there.

**Preconditions / setup:**
1. The club has at least one site and one room (OWP-003 / OWP-004).
2. Open the club from the seeded login.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the "Calendar" tab (or `.../[clubID]/calendar`) | The calendar loads. The demo events you may have seen in code (e.g. "Self Defense Basics", "Weapons Fundamentals" on Feb 2026 dates) should NOT appear here - this page uses the live schedule. If those exact demo titles DO show on the real calendar, file it. |
| 2 | Tap the create-event control (the "+" / "Create Event") | A "Create Event" dialog opens asking for the event type. |
| 3 | Choose "Class" | The flow continues to pick a site and room. |
| 4 | Pick the site and room from OWP-003/004 | The room is selected; the class detail fields appear (name, date, start/end time, teacher, etc.). |
| 5 | Fill the class name, set a date/time, and pick a teacher | When you pick the teacher here via the Calendar flow, the teacher list reflects the club's real senseis (not placeholders). |
| 6 | Save the class | A success indication; the class appears on the calendar at the chosen date/time. |

**Screen-size check:** The Create Event dialog opens from the bottom on phone and is fully scrollable; on desktop it is centered.

**Edge cases to try:**
- KNOWN - do not file: if you instead create a class by opening a **Room page** and using the room's own class-create modal, the teacher picker there lists placeholder / sample teacher names (not your real senseis). That picker is a known mock (START-HERE §8 #6). To get real teachers, create classes from the **Calendar** (this test) or the **club overview** create-class flow, not from inside the Room modal.
- Set an end time before the start time → expect a validation error.
- Cancel the dialog mid-way → no class created.
- In the Room-based one-off/recurring class form (not the Calendar flow above), fill in date, start time, and duration: room availability auto-checks itself a moment after you stop typing and shows a conflict inline, without you tapping a separate "check availability" button. Confirm it catches a real clash (try booking the same room/time as an existing class).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-007 - Create a recurring class

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove the owner can create a class that repeats on a schedule and that all its occurrences appear.

**Preconditions / setup:**
1. The club has at least one site and one room (OWP-003 / OWP-004).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Calendar and start "Create Event" → "Class" (as in OWP-006) | The class create flow opens. |
| 2 | In the class options, choose the recurring / repeating option and set the repeat (e.g. weekly) and an end | The recurring settings are accepted. |
| 3 | Fill name, time, room, teacher | Fields accept input. |
| 4 | Save | A success indication; multiple occurrences of the class show on the calendar across the repeat dates (a series). |

**Screen-size check:** The recurrence options are reachable inside the scrollable dialog on phone.

**Edge cases to try:**
- Set a recurrence with an end date before the start → validation error.
- After saving, open one occurrence - note whether you can edit just that one or the whole series (you will exercise this in OWP-009).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-008 - Create an exam / workshop / social / tournament

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove every non-class event type can be created from the Calendar.

**Preconditions / setup:**
1. The club has at least one site and one room.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Calendar and tap create-event | The "Create Event" dialog opens with type choices: Class, Exam, Workshop, Social Gathering, Tournament. |
| 2 | Choose "Workshop", fill the details, and save | The workshop appears on the calendar. |
| 3 | Create another event, choose "Social Gathering", fill and save | The social gathering appears on the calendar. (This is the only "social" feature - there is no separate newsletter; START-HERE §8 #9.) |
| 4 | Create another, choose "Tournament", fill and save | The tournament appears on the calendar. |
| 5 | Create another, choose "Exam", fill and save | The exam appears on the calendar. (Exams also have their own page - OWP-019.) |

**Screen-size check:** All five type tiles are visible/scrollable inside the dialog on phone.

**Edge cases to try:**
- Create an event with no name / no time → validation error.
- Cancel each dialog → nothing created.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-009 - Edit / cancel / reschedule an event

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove the owner can change, move, and cancel an existing event.

**Preconditions / setup:**
1. At least one event exists (create one in OWP-006/007/008 first). For the series part, use the recurring class from OWP-007.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Tap an existing event on the calendar | An event detail / edit view opens. |
| 2 | Change its name or details and save | The event shows the updated info on the calendar. |
| 3 | Change its date or time (reschedule) and save | The event moves to the new slot on the calendar. |
| 4 | Open a recurring-class occurrence and cancel/reschedule it | A scope picker asks whether the change applies to "this class", "this and future classes", or "all classes" in the series. Pick one and confirm it applies at the right scope (check a different occurrence to be sure it wasn't changed when you picked "this class" only). |
| 5 | Still in the cancel/reschedule window, look near the top | A live countdown shows how long until the class starts (e.g. "starts in 2h 15m"), or "class ongoing" / "class ended" if applicable. |
| 6 | On a ONE-OFF (non-recurring) class starting within 2 hours, try to soft-cancel it | Soft-cancel is blocked this close to start time (the late-cancel threshold); you may still be offered a hard delete instead. A recurring class occurrence is not subject to this 2-hour block (it uses delete, not soft-cancel). |
| 7 | Reschedule a recurring series and check whether you can also edit the series' name/description and its end date or occurrence count from the same dialog | All of those are editable together in the same dialog. |
| 8 | Cancel / delete a one-off event (outside the 2-hour window) | After confirming, the event is removed from the calendar. |
| 9 | On any event's detail popup on the calendar, look for a way to reassign the teacher without reopening the full edit form | A quick teacher-reassignment control (a small picker right in the popup) lets you swap the assigned teacher directly; real club members are offered, not placeholders. |

**Screen-size check:** The edit view, scope picker, and countdown label are reachable on phone; the date/time pickers are usable by thumb.

**Edge cases to try:**
- Reschedule into the past → note whether the app warns/blocks; record it.
- Cancel the delete confirmation → the event stays.
- Refresh after an edit → the change persists (not just a local UI change).
- Open the same class from both its calendar chip and its edit-popup header at once (or before/after editing) and compare the displayed time in each place - they should always match.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-010 - Approve a join request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the owner can accept a pending member, who then joins the roster.

**Preconditions / setup:**
1. There is at least one pending join request. To create one, use a separate Incognito account to apply via the club's join link (OWP-002 produced it; or see CR-002). Or use a seeded pending account.
2. The club has at least one belt defined (a freshly created club already has belts copied in; if your club has none, do OWP-016 first). A belt is the real requirement for approval; a fee tier is NOT required to approve a member.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the "Members" tab (or `.../[clubID]/members`) | The members page loads with sub-tabs including "Members", "Pending" (with a count if any), and "Exit Requests". |
| 2 | Open the "Pending" sub-tab | Pending applicants are listed with their details, including the belt level they requested when applying. |
| 3 | Tap the control that approves the pending applicant | A belt-selection dialog opens. It shows the belt the applicant requested and pre-selects it; you can keep that belt or pick a different one from the club's belts. |
| 4 | Keep or change the starting belt, then confirm the approval | A success indication; the applicant moves out of Pending. (A fee tier is assigned automatically when one exists, or left unset when the club has none - either way the approval still goes through.) |
| 5 | Open the "Members" sub-tab | The newly approved person now appears in the active roster at the belt you confirmed. |

**Screen-size check:** The Members / Pending / Exit-Requests sub-tabs stay reachable on phone (they may sit in a dropdown on small screens); the approve control and the belt-selection dialog are tappable.

**Edge cases to try:**
- Approve when the club has at least one belt but NO fee tier → the approval still succeeds (no fee tier is required to approve). NOTE: the app may pop a "set up a membership plan" prompt here first; that is a frontend nudge, not a backend block. Creating a tier or dismissing it does not change the fact that approval works without one.
- Approve a request whose applicant requested a belt → confirm the dialog pre-selects that requested belt by default.
- Refresh the Pending list mid-load → it re-fetches, no stale empty list.

> Note: completing the initial CLUB SETUP wizard does require at least one fee tier (that is a separate step at club setup, covered elsewhere). Approving an individual member here does not.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-011 - Reject a join request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the owner can decline a pending applicant.

**Preconditions / setup:**
1. There is at least one pending join request (see OWP-010 setup). Apply with a throwaway Incognito account you do not mind rejecting.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Pending" sub-tab | The pending applicant is listed. |
| 2 | Tap the control that rejects/declines the applicant | A confirm step may appear. |
| 3 | Confirm the rejection | A success indication; the applicant is removed from Pending. |
| 4 | (Optional) In the rejected Incognito account, refresh the dashboard | That account is shown as not approved / not a member of this club. |

**Screen-size check:** The reject control is reachable by thumb on phone.

**Edge cases to try:**
- Cancel the reject confirmation → the applicant stays in Pending.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-012 - Assign a role to a member

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the owner can change an existing member's role (e.g. make them a secretary, co-owner, or member).

**Preconditions / setup:**
1. The club has at least one active member besides you.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The active roster loads. |
| 2 | Tap a member to open their details | The member detail view opens with role/curriculum/fee info. |
| 3 | Change the member's role (e.g. to Secretary) and save | A success indication; the member's role label updates. |
| 4 | Refresh the page | The new role persists. |

> Note on sensei: making someone a **sensei** has a club rule - only black-belt holders can become senseis, and the dedicated path for that is the Teachers page (OWP-021). General roles like secretary / co-owner / member can be set here.

**Screen-size check:** The member detail view scrolls on phone; the role control is reachable.

**Edge cases to try:**
- Assign a role then have that member (in an Incognito session) refresh - their available screens should change to match the new role (this is CR-004).
- Cancel a role change before saving → nothing changes.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-013 - Create a fee tier

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members` (and the Settings "Fee Tiers" tab)
- **Goal:** Prove the owner can create a membership fee tier.

**Preconditions / setup:**
1. Logged in as Owner Primary on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On the Members page, open the fee-tier management control (or use the Settings tab → "Fee Tiers") | A fee-tiers area opens listing any existing tiers with a way to add one. |
| 2 | Start adding a new tier | A form appears with fields like name, description, monthly fee, and optional min/max age and display order. |
| 3 | Fill at least the name and monthly fee | Fields accept input. |
| 4 | Save the tier | A success indication; the new tier appears in the list. |

**Screen-size check:** The fee-tier form is reachable and scrollable on phone.

**Edge cases to try:**
- Save with an empty name or non-numeric fee → validation error.
- Create a second tier with the same name as an existing one → it is rejected (tier names are unique per club).
- After a tier exists, approve a member (OWP-010) and confirm the member can be assigned this tier.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-014 - Bulk member operations

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the owner can select several members and act on them at once.

**Preconditions / setup:**
1. The club has at least two active members besides you (use throwaway test members so you do not disturb real data).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The roster loads with a way to select members (checkboxes / select). |
| 2 | Select two or more members | A bulk-action affordance appears. |
| 3 | Open the bulk operation dialog | A dialog offers operations: Assign Role, Remove Member, Assign Curriculum, Remove Curriculum. |
| 4 | Choose "Assign Role", pick a role, and apply | A success indication; the selected members get the new role. |
| 5 | (Optional, on throwaway members only) choose "Remove Member" and confirm | The selected throwaway members are removed from the roster. |

**Screen-size check:** Selecting members and opening the bulk dialog works on phone; the dialog fits the screen.

**Edge cases to try:**
- Open the bulk dialog with nothing selected → it should not let you proceed (or shows zero recipients).
- Cancel a bulk remove → no one is removed.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-015 - Process an exit request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the owner can see a member's exit request and approve or deny it.

**Preconditions / setup:**
1. There is at least one pending exit request. To create one, have a member account (Incognito) submit an exit request (see CR-011 / MEM-014). Or use a seeded exit request.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Exit Requests" sub-tab | Pending exit requests are listed with the member and reason. |
| 2 | Open an exit request | Its details show. |
| 3 | Approve (or deny) the request | A success indication; the request leaves the pending list and the member's status updates accordingly. |

**Screen-size check:** The Exit Requests sub-tab and its actions are reachable on phone.

**Edge cases to try:**
- Deny instead of approve → the member stays active; the request is cleared.
- Refresh mid-load → re-fetches, no stale empty list.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-016 - Define club belts

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/belts`
- **Goal:** Prove the owner can create and edit the club's belt levels.

**Preconditions / setup:**
1. Logged in as Owner Primary. Reach the page from a belts link on the overview, or type `.../[clubID]/belts`.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/belts` | The club belts page loads showing existing belts; because you are the owner, a round "+" button (add belt) is visible (bottom-right). |
| 2 | Tap the "+" add-belt button | A belt create/edit form opens (name, rank/order, color/image, etc.). |
| 3 | Fill a new belt's details and save | A "belt created" success message; the new belt appears in the belt list in the right order. |
| 4 | Tap an existing belt and edit it, then save | The belt shows the edited details. |

**Screen-size check:** The "+" button floats above the bottom nav on phone and stays reachable; the belt form fits the screen.

**Edge cases to try:**
- Save a belt with no name → validation error.
- Cancel the form → no belt created.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-017 - Create and assign a curriculum

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/curricula` (assignment also via Members)
- **Goal:** Prove the owner can build a curriculum and assign it to members.

**Preconditions / setup:**
1. The club has at least one member to assign to.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/curricula` | The curricula page loads; because you can manage, you see a "+" / "Create" button (and an "Eligible Students" shortcut on desktop). |
| 2 | Tap "Create" | A create-curriculum dialog opens. |
| 3 | Fill the curriculum details and save | The new curriculum appears in the list. |
| 4 | Assign the curriculum to a member: open the Members page → a member's details → assign the curriculum (or use the bulk "Assign Curriculum" in OWP-014) | A success indication; the member now shows the assigned curriculum. |

**Screen-size check:** The create button is reachable on phone (it may be in a header action); the dialog fits the screen.

**Edge cases to try:**
- Save a curriculum with no name → validation error.
- After assigning, have the member (Incognito) open their progress to confirm they see it (this is CR-013).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-018 - View eligible students

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/eligible-students`
- **Goal:** Prove the owner can see the list of students eligible for promotion.

**Preconditions / setup:**
1. Logged in as Owner Primary. Reach it from the "Eligible Students" link on the Curricula page (desktop), or type `.../[clubID]/eligible-students`.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/eligible-students` | The eligible-students page loads (no "access restricted" message - owner is allowed). |
| 2 | Look at the list | Students who meet the promotion criteria are shown (an empty list is fine on a club with no eligible students yet - not a bug). This list, and the candidate picker when scheduling an exam (OWP-019), only offer eligible plain members - confirm a member you know is NOT eligible does not appear. |
| 3 | Use any role/belt filters present | The list filters accordingly. |

**Screen-size check:** The list and filters are usable on phone; rows are readable.

**Edge cases to try:**
- Refresh mid-load → re-fetches cleanly.
- On a brand-new club this list is empty - confirm it shows an empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-019 - Schedule an exam and grade candidates

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/exams`, `.../exams/[examID]/grading`
- **Goal:** Prove the owner can schedule an exam, then grade the candidates.

**Preconditions / setup:**
1. The club has at least one room, one curriculum, and at least one candidate member.
2. The club has at least two black-belt members to act as examiners (finalizing grading needs two examiners marked present). The founder is a black belt by default; make a second member a black belt if needed.
3. For the GRADING part you need an exam whose date is today or earlier - a future-dated exam cannot be graded yet (see steps). Schedule a same-day exam, or use a seeded past exam, when you want to reach finalize.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/exams` | The exams page loads with grouping/status badges and a way to schedule an exam. Status is derived live off the clock (in the club's own timezone): an exam shows "Upcoming" before its start time, switches to "In Progress" once its start time passes (even if nobody has opened grading yet), and only shows "Graded"/"Completed" after you finalize. |
| 2 | Schedule an exam: fill name, a target belt, date, start/end time, room, examiner(s), and candidate(s). The candidate picker should only offer members already eligible (OWP-018) | The form accepts the inputs. The exam date must be today or in the future; a past date is rejected with "Cannot schedule an exam in the past" (this exact message). |
| 3 | Tap "Schedule Exam" | A "scheduled" success message; the exam appears under Upcoming. |
| 4 | On the calendar (not the Exams page), find this exam's event and look for a "Grade" button on its popup | The button is disabled/greyed out until the exam's start time passes, and shows a status badge (Upcoming / In Progress / Graded) matching the Exams page. Once start time passes, tapping it takes you straight to `.../exams/[examID]/grading`. |
| 5 | Open the exam and tap "Grade" (or open `.../exams/[examID]/grading`) | If the exam date/time is still in the future, the page shows an "Exam Not Yet Conducted" screen and you cannot grade yet. Once its start time has passed (status "In Progress"), the grading page opens listing the candidates with Fail / Pending / Pass controls, plus an "Examiners Present" panel at the top. |
| 6 | In the "Examiners Present" panel, mark at least two examiners present | Each tapped examiner turns "present"; the "minimum examiners" warning clears once two or more are present. |
| 7 | Set Pass or Fail for each candidate and add a note | The choice is recorded; the passed / failed / pending tally updates; you can save the note (and a draft auto-saves). |
| 8 | Tap "Finalize Results" | A finalize confirmation dialog appears summarizing pass/fail counts. The confirm button is enabled only when at least two examiners are marked present. |
| 9 | Confirm the finalize | A "results finalized" success message; the exam moves to graded/completed. Every candidate you marked "pass" is automatically promoted to the exam's target belt (their belt updates and a congratulation note is sent per passed candidate). |

**Screen-size check:** The examiner-present panel and the grading rows (Fail/Pending/Pass + notes) are usable on phone; the finalize button is reachable.

**Edge cases to try:**
- Schedule an exam with a date in the past → expect a "Cannot schedule an exam in the past" validation error; you cannot schedule it.
- Open the grading page for a future-dated exam → expect the "Exam Not Yet Conducted" screen, not the grading controls.
- Reach the finalize dialog with fewer than two examiners marked present → the Confirm button stays disabled and a "at least two examiners" warning shows; you cannot finalize.
- Leave a candidate on "Pending" and try to finalize → note what happens (a pending warning shows); record it.
- After finalizing, open a passed candidate in Members or the promotion history (OWP-024) and confirm their belt is now the target belt.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-020 - Run the promotion workflow

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/promotions`
- **Goal:** Prove the owner can move students through the promotion workflow (eligibility → schedule → conduct).

**Preconditions / setup:**
1. The club has students who appear eligible (OWP-018) - they need curriculum + attendance progress.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/promotions` | The promotions page loads (no "access denied" message - owner is allowed). |
| 2 | Review the eligibility / candidates shown | Eligible students appear; an empty state is fine on a quiet club. |
| 3 | Move a candidate through the next step the page offers (schedule / conduct a promotion) | The candidate advances and the page reflects it. |

**Screen-size check:** The workflow controls are reachable on phone.

**Edge cases to try:**
- On a brand-new club, the page should show an empty/eligible-none state, not an error.
- After conducting a promotion, the change should be reflected in history (OWP-024).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-021 - Manage teachers (add / revoke sensei)

- **Status:** FUNCTIONAL (PARTIAL caveat: the per-class teacher picker inside the Room class-create modal is a mock - see edge cases)
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/teachers`
- **Goal:** Prove the owner (one of the few who can) can make a member a sensei and revoke it.

**Preconditions / setup:**
1. The club has at least one active member who holds a **black belt** (this is the rule for who can be made a sensei). If no member is a black belt, the assign list will be empty - that is expected behavior, not a bug.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/teachers` | The Teacher Management page loads with two tabs: "Current Senseis" and "Assign Sensei". As primary owner you are allowed in (no "owner only" block). |
| 2 | Open the "Assign Sensei" tab | A note states only black-belt holders qualify; eligible black-belt members are listed (empty if none qualify). |
| 3 | Tap "Make Sensei" on an eligible member | A confirmation dialog appears. |
| 4 | Confirm | A success toast; that member becomes a sensei. |
| 5 | Open "Current Senseis", find that sensei, and tap "Revoke" | A confirmation appears; confirming returns them to a regular member with a success toast. |
| 6 | (Optional) On "Current Senseis", expand a class under "Class Teacher Assignment" and toggle a sensei on/off | The class's assigned teachers update with a success toast. |

**Screen-size check:** The two tabs and the Make Sensei / Revoke buttons are reachable on phone; confirm dialogs fit the screen.

**Edge cases to try:**
- KNOWN - do not file: when you create or edit a class from inside a **Room page**, the teacher picker in that modal lists placeholder / sample teacher names (not your real senseis). That is a known mock (START-HERE §8 #6). The real teacher data lives on this Teachers page and in the Calendar create-class flow.
- Cancel a Make Sensei / Revoke confirmation → no change.
- The assign list shows only black belts - if a non-black-belt member is missing from it, that is expected, not a bug.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-022 - Add / remove a co-owner

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the owner can grant and revoke co-owner status on a member.

**Preconditions / setup:**
1. The club has at least one active member besides you (use a throwaway test member).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The roster loads. |
| 2 | Open a member and grant them the co-owner role (the owner/co-owner role option) | A success indication; the member becomes a co-owner. |
| 3 | (In an Incognito session as that member) open the club | They now see the full management surface (overview/members/calendar etc.) - but NOT the option to transfer primary ownership (that stays yours; see OWP-030 / CR-005). |
| 4 | Back in Session A, open that member and remove the co-owner role | A confirmation appears; confirming returns them to a regular member. |

**Screen-size check:** The grant/remove controls are reachable on phone; confirm dialogs fit.

**Edge cases to try:**
- Cancel the remove-owner confirmation → they stay a co-owner.
- Confirm the co-owner cannot transfer primary ownership (that boundary is OWS-040 from their side).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-023 - View analytics tabs

- **Status:** FUNCTIONAL (the Financial tab is disabled on purpose - do not file)
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/analytics`
- **Goal:** Prove the owner can open every working analytics tab and that no broken Financial tab is exposed.

**Preconditions / setup:**
1. A club with some history makes the charts meaningful, but empty charts on a quiet club are fine.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | From the overview, tap an analytics link, or open `.../[clubID]/analytics` | The analytics page loads (no "access restricted" - primary owner is allowed). |
| 2 | Look at the tab bar | The tabs are: Attendance, Membership, Content, Belts, Events, Usage Metrics. There is NO "Financial" tab - it is intentionally removed (START-HERE §8 #7). Do not file its absence. |
| 3 | Open each tab one by one | Each tab loads its charts/data from the live data (empty states are fine on a quiet club). |

**Screen-size check:** On phone the tabs are a scrollable pill bar; on desktop they are underline tabs spread across the width. Charts stack on phone and sit wider on desktop.

**Edge cases to try:**
- Refresh on a tab → it re-fetches; no stale empty chart stuck.
- Open analytics as a NON-owner role (a different test, SEN-040 / SEC-040 / MEM-041) → that role sees "Access Restricted". As primary owner you should never see that.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-024 - View attendance + promotion history

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/history`
- **Goal:** Prove the owner can view the attendance and promotion history charts.

**Preconditions / setup:**
1. Some attendance and/or promotions exist to populate the charts (empty is fine on a quiet club).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/history` | The history page loads (no "access restricted" - primary owner is allowed) with two tabs: "Attendance" and "Promotions". |
| 2 | Open the "Attendance" tab | Attendance-over-time charts / counts show. |
| 3 | Open the "Promotions" tab | A promotion timeline / history shows. |

**Screen-size check:** Charts stack vertically on phone (<640) and sit side by side on wider screens (>=768).

**Edge cases to try:**
- Refresh mid-load → re-fetches; no stale empty chart.
- On a brand-new club the charts are empty - confirm an empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-025 - View club usage metrics

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/usage`
- **Goal:** Prove the owner can view the app-usage metrics for the club.

**Preconditions / setup:**
1. Logged in as Owner Primary. Reach it via `.../[clubID]/usage` (also surfaced as the "Usage Metrics" analytics tab).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/usage` | The usage page loads (no "access restricted" - primary owner is allowed). |
| 2 | Review the usage stats / charts | App-usage figures show (zeros/empty are fine on a quiet club). |

**Screen-size check:** Usage charts are readable and stack on phone.

**Edge cases to try:**
- Refresh mid-load → re-fetches cleanly.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-026 - Manage the club library

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/library/manage`, `.../library/movement-types`
- **Goal:** Prove the owner can create and edit club moves, media, and movement types.

**Preconditions / setup:**
1. Logged in as Owner Primary on the club. Reach the library from the Library nav item (it opens the club library) or `.../[clubID]/library`.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club library, then its "Manage" area (`.../[clubID]/library/manage`) | The manage view loads with existing moves/media and a way to add a new one. |
| 2 | Create a new move/media item: fill the details and attach a video | While it uploads, watch for a live progress indicator (a percentage/progress bar). (Any video plays as a normal video file - adaptive quality switching is not built; START-HERE §8 #2.) |
| 3 | Save | A success indication; the new item appears in the club library. |
| 4 | If you can force a flaky connection (devtools network throttling or briefly toggling airplane mode mid-upload), try uploading a larger video | The upload retries automatically on a transient failure (up to a few attempts) before giving up; you should not have to manually restart the whole upload for a single dropped chunk. |
| 5 | Open "Movement Types" (`.../library/movement-types`) and add/edit a type | The movement type is saved and shows in the list. |
| 6 | Edit an existing move and save | The edit persists. |

**Screen-size check:** The manage forms and media upload are usable on phone (use a real device for camera capture).

**Edge cases to try:**
- Save a move with no name → validation error.
- A free-tier member seeing all of THIS CLUB's custom moves is expected (per-club custom library content is not tier-locked) - do not file that. (Separate from the app-wide master move library, which IS limited by tier and belt for free / lower-belt accounts.)

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-027 - Manage club warmups

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/library/warmup/manage`, `.../library/warmup/settings`
- **Goal:** Prove the owner can create and manage club warmups.

**Preconditions / setup:**
1. Logged in as Owner Primary on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/library/warmup` | The club warmups page loads. |
| 2 | Open its "Manage" area (`.../library/warmup/manage`) | The manage view loads with a way to add a warmup. |
| 3 | Create a new warmup, fill details, and save | A success indication; the warmup appears in the list. |
| 4 | Open warmup "Settings" (`.../library/warmup/settings`) and change a setting, then save | The setting persists. |

**Screen-size check:** The warmup manage/settings forms are usable on phone.

**Edge cases to try:**
- Save a warmup with no name → validation error.
- Free members seeing THIS CLUB's custom warmups is expected (per-club custom warmups are not tier-locked) - do not file it. (Separate from the app-wide master warmup library, where free accounts only get the free-tier exercises.)

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-028 - Edit club settings

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/settings`
- **Goal:** Prove the owner can edit the club's general info (and reach the Fee Tiers and QR Code tabs).

**Preconditions / setup:**
1. Logged in as Owner Primary on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the "Settings" tab in the top bar (or `.../[clubID]/settings`) | The settings page loads (you are the owner, so it opens - it is hidden/blocked for members and secretaries). Tabs include General, Fee Tiers, and QR Code. |
| 2 | On the General tab, change a club detail (e.g. name or a branding color) and save | A success indication; the change persists after refresh. |
| 3 | Open the "Fee Tiers" tab | The fee tiers area loads (links to OWP-013). |
| 4 | Open the "QR Code" tab | The club QR / join link area loads (links to OWP-002). |

**Screen-size check:** On phone the settings tabs are a scrollable bar; forms are usable.

**Edge cases to try:**
- Clear a required field and save → validation error.
- Reload after a save → the edit is still there (real save, not just UI).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-029 - Send a club broadcast notification

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A); a member account (Session B, incognito) to confirm receipt
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/messages` (staff broadcast composer) → members receive it on `/dashboard` announcements and `/dashboard/notifications`
- **Goal:** Prove the owner can send a club-wide announcement that members receive.

**Preconditions / setup:**
1. The club has at least one member besides you. Log that member into Session B (incognito) to confirm receipt.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Session A: open `/dashboard/messages` | Messaging loads. As staff (owner) you have a staff "bulk message" / broadcast option that members do not. |
| 2 | Open the broadcast / bulk-message composer | A composer opens with a notification type (e.g. Announcement / Alert), a Title, a Message, and a recipient choice such as "All Members" with a count. |
| 3 | Pick "All Members", type a title and message, and send | A confirm step shows the recipient count and type; confirming shows a "sent" success state. |
| 4 | Session B (member): open `/dashboard` (Announcements area) or `/dashboard/notifications` | The broadcast appears for the member. |

**Screen-size check:** The composer and confirm dialog are usable on phone.

**Edge cases to try:**
- Try to send with an empty title or message → the Send action stays disabled / blocked.
- Live behavior (member's bell updating without refresh) is exercised in CR-008 - here a refresh on the member side is acceptable.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-030 - Transfer primary ownership

- **Status:** FUNCTIONAL (PRIMARY OWNER ONLY - only you can do this)
- **Role(s) & sessions:** Owner Primary (Session A); the receiving owner (Session B, incognito) to confirm
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove the primary owner can hand primary ownership to another owner, and that this control is exclusive to the primary owner.

**Preconditions / setup:**
1. The club has at least one **co-owner** to receive primary ownership (grant one in OWP-022 first). Use a throwaway test account as the receiver, because after this you will no longer be primary.
2. CAUTION: this is a real ownership change. Do it on a throwaway/test club if possible, not the shared seeded club, unless the team says it is OK.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The roster loads. Because you are the PRIMARY owner, you see a "transfer primary ownership" control on an eligible co-owner that other roles do not. |
| 2 | Choose the co-owner and start the transfer | A confirmation dialog appears explaining you will hand over primary ownership. |
| 3 | Confirm the transfer | A success indication; that co-owner becomes the primary owner and you are demoted to co-owner. |
| 4 | Session B (the receiver): refresh the club | They now hold primary controls (including the transfer option); they have become primary. |
| 5 | Session A (you, now demoted): refresh and open the Members page | You no longer see the transfer-primary control (you are a co-owner now). |

**Screen-size check:** The transfer control and its confirm dialog are reachable on phone.

**Edge cases to try:**
- Cancel the transfer confirmation → nothing changes; you stay primary.
- A co-owner (or any non-primary role) should NOT see this control at all (the co-owner's side is OWS-040) - only the primary owner does.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-031 - Take room-level attendance

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/site/[siteId]/rooms/[roomId]/attendance`
- **Goal:** Prove the owner can take attendance for a room by marking members present/absent.

**Preconditions / setup:**
1. The club has a site with a room (OWP-003 / OWP-004) and at least one member.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open a room, then its attendance page (`.../rooms/[roomId]/attendance`) | The "Take Attendance" view loads with members listed and present/absent counts. As owner you are in full (not view-only) mode. |
| 2 | Toggle a member to "present" | The present count goes up; the member shows present. |
| 3 | Tap "Mark All" | All currently-visible members are marked present at once. |
| 4 | Save the attendance | A success indication; the attendance is recorded. |
| 5 | Reopen the page | The saved present/absent states are remembered. |

**Screen-size check:** The member rows and the present/absent toggles are usable by thumb on phone; the Save button is reachable.

**Edge cases to try:**
- Toggle a member back to absent before saving → the count updates accordingly.
- A secretary opening this page sees a VIEW-ONLY version (their test is SEC-042 / SEN-010 covers sensei) - as owner you can actually save.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWP-040 - Empty-state sweep (brand-new club)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner Primary of a brand-new club (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** multiple (overview, members, calendar, site, belts, curricula, exams, eligible-students, promotions, history, analytics, usage)
- **Goal:** Prove a freshly created club shows clean empty states (not errors or stuck spinners) before any data is added.

**Preconditions / setup:**
1. Create a brand-new club via ONB-005 and do this BEFORE adding sites, members, classes, etc. (or use a freshly created throwaway club).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the new club overview | Loads with the banner and zeroed stat cards - no error, no infinite spinner. |
| 2 | Open the Calendar | Loads an empty calendar (no events), no error. |
| 3 | Open the Members page (each sub-tab: Members, Pending, Exit Requests) | Each shows an empty/"none yet" state, no error. |
| 4 | Open the Site page | Shows "no sites yet" with the Add Site button, no error. |
| 5 | Open Belts, Curricula, Exams, Eligible Students, Promotions one by one (by typing each `.../[clubID]/<page>`) | Each loads an empty state, no "access restricted" (you are the owner), no crash. |
| 6 | Open History, Analytics, Usage | Each loads empty charts / empty states, no error. |

**Screen-size check:** Empty states are centered and readable on phone; nothing overflows.

**Edge cases to try:**
- Refresh any empty page → it re-fetches to the same clean empty state, not an error.
- If any page shows a red error or a spinner that never resolves on a brand-new club, that IS a bug - file it with the page name.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
