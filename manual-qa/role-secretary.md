# Role: Secretary - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** a club secretary - club staff who handles the day-to-day admin: approving people who want to join, keeping member info up to date, editing the club's belts, and putting events on the calendar. You are NOT an owner. There are several things an owner can do that you cannot, and a few pages the app keeps you out of on purpose. Many of the tests below are about confirming those limits are working, not finding bugs.

**Sessions:** Secretary is a single role. Unless a step says otherwise, you work in **Session A only** (one normal window, logged in as the Secretary). Where it helps to confirm a blocked page actually works for someone who is allowed, a test asks you to open a second window (incognito) as an Owner side by side.

**Before the SEC tests:** log in as the seeded Secretary account (START-HERE §3) and open the club at `/dashboard/myClub/[clubID]`. Note which club you are in - the app behaves per club, so your secretary powers only apply inside the club where you hold that role.

**How you move around the club:** the red bar at the top of every club page has tabs - **Overview, Calendar, Members, Site** (the **Settings** tab is hidden for you, that is expected). Pages like Belts, Curricula, Eligible Students, Analytics, History, Scan Attendance and Teachers are NOT in that tab bar - you reach them from cards/links on the Overview page or by typing the page address. Each test below tells you exactly how to get there.

**Two important things to keep in mind while testing:**
- A secretary is treated as an "owner" by one internal shortcut in the app. That means a few owner-style controls may still appear on screen for you. When you press them, the server is the real gatekeeper and should refuse. Several tests below ask you to push on exactly those spots and write down what happens (see SEC-045).
- "Edit belts" means editing the club's belt LADDER (the list of belt levels, their colors, and requirements). It does NOT mean promoting a member to a new belt. Promoting a member is an owner-only action.

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| SEC-001 | My Club nav is visible to the secretary | FUNCTIONAL |
| SEC-002 | Approve / reject join requests; edit member info | FUNCTIONAL |
| SEC-003 | Process exit requests | FUNCTIONAL |
| SEC-004 | Manage curricula | FUNCTIONAL (frontend gap noted) |
| SEC-005 | Edit club belts | FUNCTIONAL |
| SEC-006 | View eligible students | FUNCTIONAL |
| SEC-007 | Create / edit calendar events | FUNCTIONAL |
| SEC-040 | BLOCKED: Analytics | FUNCTIONAL (expected: no permission) |
| SEC-041 | BLOCKED: History | FUNCTIONAL (expected: access restricted) |
| SEC-042 | BLOCKED: Scan Attendance | FUNCTIONAL (expected: explicit block) |
| SEC-043 | BLOCKED: Club Settings tab hidden | FUNCTIONAL (expected: tab hidden) |
| SEC-044 | BLOCKED: Manage Teachers | FUNCTIONAL (expected: owner-only block) |
| SEC-045 | PROBE: any owner-only control reachable as secretary? | KNOWN-GAP |

---

## What a secretary CAN and CANNOT do (read once)

This is the access matrix the tests below check. The server is the real arbiter: even if a button appears, the server may refuse the save.

**CAN do:**
- Approve and reject people who request to join the club.
- Add a member and edit a member's information (name, contact details, address).
- Edit the club's belt ladder (belt levels, colors, requirements).
- Manage curricula (class definitions and who is enrolled).
- Create and edit calendar events (classes, workshops, socials, tournaments, exams).
- View the eligible-students list.
- Process exit requests members submit.

**CANNOT do (the server refuses, even if a control shows):**
- Change a member's role (make someone a sensei, secretary, co-owner, or member). Owner-only.
- Create or change fee tiers / a member's fee tier. Owner-only.
- Promote a member's belt by hand. Owner-only.
- Add or remove owners, or transfer primary ownership. Owner-only / primary-only.

**Is kept out of entirely (the page blocks you):**
- Analytics, History, Scan Attendance, Club Settings, Teachers.

---

### SEC-001 - My Club nav is visible to the secretary

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** global navigation; `/dashboard/myClub`
- **Goal:** Prove a secretary sees the "My Club" area and can open the club they belong to.

**Preconditions / setup:**
1. Logged in as the seeded Secretary (START-HERE §3).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `/dashboard` | The dashboard loads. A "My Club" entry is present in the menu (bottom menu on phone, side menu on desktop). |
| 2 | Tap "My Club" | You land on the club overview at `/dashboard/myClub/[clubID]`, no "access restricted" message. `/dashboard/myClub` is not a picker - it forwards you straight to your first club. |
| 3 | Look at the top tab bar | It shows Overview, Calendar, Members, Site. There is NO Settings tab for a secretary. |

**Screen-size check:** On a phone (<640px) "My Club" sits in the bottom menu; at 768px+ it moves to the side menu. Confirm it is reachable both ways.

**Edge cases to try:**
- If you are a plain member in some OTHER club, confirm switching to that club hides the management controls there (your secretary powers are per club).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-002 - Approve / reject join requests; edit member info

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove a secretary can approve and reject people requesting to join, and edit an existing member's information; and confirm the secretary does NOT get a role-change control.

**Preconditions / setup:**
1. Logged in as the Secretary, club open.
2. At least one pending join request exists. If none, create one: in a separate incognito window, log in as a spare account and request to join this club (reference the member sheet join flow), then come back to Session A.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/members` | The members page loads with the roster, no "access restricted". You see tabs for Members, Pending, and Exit Requests. |
| 2 | Open the "Pending" tab | The list of people waiting to join shows, each with an Approve and a Reject option. |
| 3 | Approve one pending request (confirm the belt if it asks) | A success message; that person moves out of Pending and appears in the Members roster. No "you must create a fee tier first" wall blocks the approval. |
| 4 | Go back to "Pending" and Reject another request | A success message; that request leaves the Pending list. |
| 5 | Back on the Members roster, open a member and choose to edit their information | An edit panel opens with name / contact / address fields you can change. |
| 6 | Change a field (e.g. address) and save | A success message; the new value sticks after the panel closes and reopens. |
| 7 | While viewing a member, look for any "Assign role" / "Change role" control | For a secretary this control is NOT shown. (It is owner-only and is hidden for you on purpose.) |

**Screen-size check:** On a phone the Pending list stacks one card per row with Approve/Reject reachable by thumb; at 768px+ the roster and detail can sit side by side.

**Edge cases to try:**
- Approve a request, then open Pending again - the same request should not still be there (no double-approve).
- Try editing a member, clear a required field, and save - expect an inline validation error, no save.
- Refresh mid-approval - the member should be either pending or approved, never duplicated.
- Expected - known limitation, do not file: approving works even if the club has zero fee tiers configured.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-003 - Process exit requests

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members` (Exit Requests tab)
- **Goal:** Prove a secretary can approve or deny a member's request to leave the club.

**Preconditions / setup:**
1. Logged in as the Secretary, club open.
2. At least one pending exit request exists. If none, create one: in an incognito window, log in as a plain member of this club and submit an exit request (reference the member sheet), then return to Session A.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/members` and select the "Exit Requests" tab | The list of members who asked to leave shows, with an approve and a deny option per request. |
| 2 | Deny one request | A success message; the request is marked handled and the member stays in the club. |
| 3 | Approve another request | A success message; that member is removed from the club roster. |

**Screen-size check:** On a phone the Exit Requests cards stack and the approve/deny buttons are thumb-reachable; at 768px+ they sit in a wider list.

**Edge cases to try:**
- Approve a request, then revisit Exit Requests - it should not still be listed as pending.
- Refresh mid-process - the request should be either pending or resolved, not both.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-004 - Manage curricula

- **Status:** FUNCTIONAL (frontend gap noted below)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/curricula`
- **Goal:** Check whether the secretary can create and manage curricula, and record what the page actually offers a secretary.

> Note: by the access rules, a secretary is allowed to manage curricula, and the server permits it. However the current curricula page builds its "manage" controls from a list of roles that does NOT include secretary. So in today's build a secretary may open the page but see it in a VIEW / self-service mode without the create-and-manage controls an owner sees. This is a real mismatch between what the secretary is allowed to do and what the page lets them do. Your job here is to record exactly what shows, not to assume.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner of the same club, so you can compare what the page shows each of you.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): open `.../[clubID]/curricula` | The page loads, no "access restricted". |
| 2 | **Session A**: look for controls to create a new curriculum / class definition and to add or remove members from one | RECORD what you see: are create / manage controls present, or only a view / "my curricula" self-service view? |
| 3 | **Session B** (owner): open the same page | The owner sees the full create-and-manage controls. |
| 4 | Compare A vs B | Note any control the owner has that the secretary does not. If the secretary has NO management controls at all, write that down - it is the known mismatch above, flag it as an observation, do not treat the empty controls as a normal pass. |

**Screen-size check:** On a phone the curricula list stacks; at 768px+ it widens. Confirm the layout holds at both sizes for whichever view the secretary gets.

**Edge cases to try:**
- If a create / manage control IS present for the secretary, use it and confirm the save succeeds (server allows curricula for secretary). If a save is refused, capture the exact message.
- Switch language to French and confirm the curricula labels translate and do not overflow.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-005 - Edit club belts

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/belts`
- **Goal:** Prove a secretary can create and edit the club's belt levels.

**Preconditions / setup:**
1. Logged in as the Secretary, club open.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/belts` | The club belt ladder loads, no "access restricted". Because you can edit, you also see any inactive belts. |
| 2 | Use the control to add a new belt | A belt editor opens with fields for name, color, and requirements (classes / teaching hours). |
| 3 | Fill in the new belt and save | A success message; the new belt appears in the ladder. |
| 4 | Open an existing belt and use the edit control | The same editor opens pre-filled with that belt's values. |
| 5 | Change a value (e.g. color or a requirement number) and save | A success message; the change shows in the ladder. |

**Screen-size check:** On a phone the belt ladder stacks vertically and the edit control is thumb-reachable; at 768px+ belts may show in a wider grid.

**Edge cases to try:**
- Save a belt with a name that already exists in this club - expect a "name must be unique" style error, no save.
- Leave the color blank and save - expect a validation error.
- Remember: editing the belt LADDER is allowed, but there is no "promote this member to this belt" action here for you - that is owner-only and lives elsewhere.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-006 - View eligible students

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/eligible-students`
- **Goal:** Prove a secretary can open the eligible-students list (the members who have met the requirements for their next belt).

**Preconditions / setup:**
1. Logged in as the Secretary, club open.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/eligible-students` | The page loads, no "access restricted" (secretary is allowed to view this). |
| 2 | Read the list | Members who qualify for promotion are shown. If none qualify yet, an empty state shows cleanly (not a crash). |

**Screen-size check:** On a phone the list stacks; at 768px+ it widens. Confirm filters/controls stay usable at both.

**Edge cases to try:**
- If the list is empty, that is a valid state when no one has met the requirements - do not file it as broken.
- Refresh mid-load - the list should re-fetch, not show a stale empty state.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-007 - Create / edit calendar events

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove a secretary can add events to the calendar and edit them.

**Preconditions / setup:**
1. Logged in as the Secretary, club open.
2. The club has at least one site and one room (a room is required to schedule). If not, ask your QA lead or have the owner create them; a secretary creates events but the club must already have a place to hold them.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/calendar` | The calendar loads. Because you can edit, a control to create a new event is visible. |
| 2 | Start creating an event and pick a type (class, workshop, social, tournament, or exam) | The create flow opens and asks for the event type, then a site and room. |
| 3 | Pick the site and room, fill the required fields, and save | A success message; the new event appears on the calendar on the right day. |
| 4 | Open the event you just created and edit it (e.g. change the time) | An edit panel opens; saving updates the event on the calendar. |

**Screen-size check:** On a phone the calendar shows a compact (often list/day) view and the create control is thumb-reachable; at 768px+ a wider month/week grid shows. Check nothing is cut off around 768px.

**Edge cases to try:**
- Try to book a room that is already in use at that time - expect a "conflict" message, not a silent double-booking.
- Cancel out of the create flow halfway - no half-made event should appear.
- Expected - known limitation, do not file: if you create a class from inside a specific Room page, the teacher picker there shows placeholder names. Create from the Calendar (as in this test) to use real teacher data.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-040 - BLOCKED: Analytics

- **Status:** FUNCTIONAL (expected result is a block, not a working page)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/analytics`
- **Goal:** Confirm a secretary is kept out of analytics, and that the same page works for an owner.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): open `.../[clubID]/analytics` | An "Access Restricted - you don't have permission to access analytics" screen shows. No charts. |
| 2 | **Session A**: try reaching it by typing the URL directly | Still blocked - the page guards itself, not just the menu. |
| 3 | **Session B** (owner): open the same analytics page | The page loads with charts, confirming the block in step 1 is about your role, not a broken page. |

**Screen-size check:** The "Access Restricted" card is centered at all sizes; confirm it reads cleanly on phone and desktop.

**Edge cases to try:**
- Switch to French and confirm the access-restricted wording translates (this string is translated; only three camera-error strings are not).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-041 - BLOCKED: History

- **Status:** FUNCTIONAL (expected result is a block)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/history`
- **Goal:** Confirm a secretary cannot open attendance/promotion history, and an owner can.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): open `.../[clubID]/history` | An access-restricted screen shows (history is owner-only). No charts. |
| 2 | **Session A**: try the URL directly | Still blocked. |
| 3 | **Session B** (owner): open the same history page | It loads with Attendance and Promotions history, confirming the block is role-based. |

**Screen-size check:** The access-restricted card is centered at all sizes.

**Edge cases to try:**
- Confirm the block holds whether you arrive from an Overview link or by typing the address.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-042 - BLOCKED: Scan Attendance

- **Status:** FUNCTIONAL (expected result is an explicit block)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner or Sensei (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/scan-attendance`
- **Goal:** Confirm the secretary is the role specifically blocked from scanning attendance, and that an owner or sensei is allowed.

> The secretary is the one role the app explicitly shuts out of marking attendance and generating attendance QR codes. The server refuses it too, so this is a real, intended block on both sides.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner or Sensei of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): open `.../[clubID]/scan-attendance` | An "Access Restricted - you don't have permission to access scan attendance" screen shows. No camera prompt, no viewfinder. |
| 2 | **Session A**: try the URL directly | Still blocked. |
| 3 | **Session B** (owner/sensei): open the same scan page | A camera permission prompt appears (on a real phone), confirming the block in step 1 is specific to the secretary role. |

**Screen-size check:** The access-restricted card is centered at all sizes. (The working scanner in Session B is phone-first and needs a real rear-camera device, per START-HERE §5.)

**Edge cases to try:**
- Confirm the secretary block holds from both a menu/Overview link and a typed URL.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-043 - BLOCKED: Club Settings tab hidden

- **Status:** FUNCTIONAL (expected result is a hidden tab)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** club tab bar / `.../[clubID]/settings`
- **Goal:** Confirm the Settings tab is hidden for a secretary, that typing the settings URL nevertheless opens the page, and that the server refuses an owner-only save from it.

> **This test is expected to FAIL on step 3 right now - that is the point.**
> Club Settings is owner-only. The menu correctly hides the Settings tab from a
> secretary, but typing the address opens the real settings form: the app
> treats secretary (and sensei, and admin) as `userRole: 'owner'` for the club
> being viewed, and the page guards on `userRole` rather than the club role.
> Mark step 3 FAIL and reference the existing bug rather than raising a new
> one. The server still refuses the save, so no data is at risk - the defect is
> that an owner-only screen is reachable at all.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): look at the club tab bar (bottom menu on phone, side menu on desktop) | There is NO "Settings" tab for the secretary. |
| 2 | **Session B** (owner): look at the same tab bar | A "Settings" tab IS present for the owner, confirming step 1 is role-based. |
| 3 | **Session A** (secretary): type the settings URL directly, `.../[clubID]/settings` | Expected: an "Access Denied" screen. Currently the settings page OPENS instead - you see "Club Settings" with the club information form. Mark this step FAIL against the existing bug. |
| 4 | **Session A**: change a club setting and save | The save is refused by the server. Reload and confirm the club setting is unchanged. A save that STICKS is a real bug - file it immediately, quoting SEC-043. |
| 5 | **Session A**: for comparison, type the same settings URL as a plain member (or see MEM-041) | A plain member gets the "Access Denied" screen, confirming the page does gate on role - the secretary is let through specifically because of the `userRole` shortcut. |

**Screen-size check:** Confirm the Settings tab is absent from the bottom menu on a phone AND from the side menu at 768px+ for the secretary.

**Edge cases to try:**
- Compare the typed-URL result for the secretary (this test) against a plain member, who should clearly get "Access Denied". Note any difference.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-044 - BLOCKED: Manage Teachers

- **Status:** FUNCTIONAL (expected result is an owner-only block)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/teachers`
- **Goal:** Confirm a secretary cannot manage teachers (add/revoke senseis), and an owner can.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): open `.../[clubID]/teachers` | An "Access Restricted - owner only" screen shows. No add/revoke controls. |
| 2 | **Session A**: try the URL directly | Still blocked. |
| 3 | **Session B** (owner): open the same teachers page | The teacher-management controls load for the owner, confirming the block is role-based. |

**Screen-size check:** The access-restricted card is centered at all sizes.

**Edge cases to try:**
- Confirm the block holds from both a link and a typed URL.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### SEC-045 - PROBE: any owner-only control reachable as secretary?

- **Status:** KNOWN-GAP (this is a deliberate investigation, not a pass/fail of one screen)
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) for comparison
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** members (role change, fee tier, manual belt promote, owners), settings - any owner-only control across the club
- **Goal:** Because a secretary is treated as an "owner" by one internal shortcut, hunt for any owner-only control that still appears on screen for the secretary, press it, and record whether the server lets the change through or refuses it. The server should refuse every owner-only write for a secretary; record any place it does not.

> What "owner-only" means here (the server refuses these for a secretary, even if a button shows): changing a member's role, creating or changing fee tiers, promoting a member's belt by hand, and adding / removing owners or transferring primary ownership. Settings is also owner territory (see SEC-043). Go through each one below and write down (a) whether the control is visible to you, (b) what happens when you use it, and (c) the exact message if it is refused.

**Preconditions / setup:**
1. Session A: logged in as the Secretary, club open.
2. Session B (incognito): logged in as an Owner of the same club, to confirm each control is real for an owner.
3. The club has at least a couple of members and (ideally) at least one existing fee tier so the controls have something to act on.

**Steps:**
| # | Action (which session) | What to record |
|---|---|---|
| 1 | **Session A** (secretary): open Members, pick a member, and look for a "Change role" / "Assign role" control | Expected: the role-change control is NOT shown to a secretary. If it IS shown, note that and continue to step 2. |
| 2 | **Session A**: if a role-change control appears, try to change a member's role and save | Expected: the server refuses (owner-only). Record the exact message. Do NOT treat a refusal as a bug - record it as the expected backend block. A SUCCESSFUL role change WOULD be a real leak - file it. |
| 3 | **Session A**: on a member, look for a fee-tier control (set or change the member's fee tier) | RECORD: a fee-tier control may appear for plain members. If it does, try to save a change. |
| 4 | **Session A**: if you changed a fee tier, confirm whether it actually saved | Expected: the server refuses fee-tier changes for a secretary. Record the message. A change that sticks WOULD be a leak - file it. |
| 5 | **Session A**: look for any "promote belt" control on a member (manually moving them up a belt) | Expected: not available to a secretary, or refused by the server if attempted. Record what you find. |
| 6 | **Session A**: look for any "add owner" / "remove owner" / "transfer ownership" control | Expected: not available to a secretary, or refused by the server. Record what you find. |
| 7 | **Session A**: re-confirm the settings URL behavior from SEC-043 (does the page open, and does a save stick?) | Record the outcome here too so the whole probe lives in one place. |
| 8 | **Session B** (owner): for any owner-only control that the secretary could SEE but not save, confirm it actually works for the owner | This proves the control is genuine and the secretary's refusal is a role block, not a broken feature. |

**Screen-size check:** Run the probe at least once on a phone and once on desktop - a control hidden at one width is sometimes shown at another.

**Edge cases to try:**
- For every owner-only control you can reach as a secretary, the key question is whether the SAVE goes through. A blocked save is the expected behavior - record it, do not file it. A save that sticks is a genuine privilege leak - file it with this scenario ID and exactly which control leaked.
- Note any difference between what the secretary SEES (a control may render) and what the secretary can DO (the server refuses). That gap is the whole point of this probe.

**Result capture:**
- PASS / FAIL: [ ]  (PASS = no owner-only write succeeded as secretary)
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9): list each owner-only control, whether it was visible, and whether the save was refused or leaked
