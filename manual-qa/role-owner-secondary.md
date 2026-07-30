# Role: Owner Secondary (Co-owner) - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** a co-owner of a martial arts club. You have the same full management surface as the founder (primary owner), with two exceptions you cannot do: hand over primary ownership, and add another co-owner. Both of those belong to the primary owner only.

**Sessions:** Co-owner is a single role. Unless a step says otherwise, you work in **Session A only** (one normal window, logged in as the co-owner). A couple of tests use a second window (Session B, incognito) only to confirm a result.

**Before the OWS tests:** log in as the seeded co-owner account (START-HERE §3) and open the club at `.../[clubID]`. If no seeded co-owner exists, the primary owner grants one first (OWP-022). Note the active club ID (START-HERE §10): your role is per club, so you must be a co-owner in THIS club.

**How this sheet works:** the point of these tests is to confirm a co-owner gets the owner surface, then to confirm the two boundaries above. To avoid repeating identical steps, most "you can do X" tests point you at the matching Owner Primary test (OWP-###) and ask you to run it as the co-owner and confirm the same result. Run the referenced OWP steps exactly, just signed in as the co-owner. Only the boundary tests (OWS-040, OWS-041) are written out in full here.

**The red tab bar:** every club page has five tabs - Overview, Calendar, Members, Site, Settings. Pages like History, Analytics, Belts, Curricula, Exams, Promotions, Teachers, Usage, Eligible Students, Scan Attendance are reached from cards/links on the Overview page or by typing the page address.

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| OWS-001 | Co-owner sees the full management surface | FUNCTIONAL |
| OWS-002 | Co-owner approves / rejects join requests | FUNCTIONAL |
| OWS-003 | Co-owner changes member roles + manages fee tiers | FUNCTIONAL |
| OWS-004 | Co-owner manages calendar, exams, and grading | FUNCTIONAL |
| OWS-005 | Co-owner views analytics and history | FUNCTIONAL |
| OWS-006 | Co-owner uses scan-attendance | FUNCTIONAL |
| OWS-007 | Co-owner manages teachers (assign / revoke sensei) | FUNCTIONAL |
| OWS-008 | Co-owner manages belts, curricula, library, warmups | FUNCTIONAL |
| OWS-009 | Co-owner adds / removes members and processes exits | FUNCTIONAL |
| OWS-040 | BLOCKED: transfer primary ownership (primary only) | FUNCTIONAL (expected: control absent) |
| OWS-041 | BLOCKED: add a co-owner (primary only) | FUNCTIONAL (expected: control absent) |
| OWS-042 | Co-owner removes a co-owner | KNOWN-GAP (UI control absent; verify) |

---

## Co-owner: the full owner surface

> These tests confirm a co-owner gets the same surface as the primary owner. Each one references the matching Owner Primary test - run those exact steps signed in as the co-owner, and confirm you get the SAME result (no "access restricted" block), unless a boundary is called out.

### OWS-001 - Co-owner sees the full management surface

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]` overview + the tab bar + the management pages
- **Goal:** Prove a co-owner lands on the owner view of the club, not the member view, and can reach every management area.

**Preconditions / setup:**
1. Logged in as the co-owner on the club; note the active club ID.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]` | The owner overview loads: club banner, the five tabs (Overview, Calendar, Members, Site, Settings), and management stat cards. No member-only view, no "access restricted". This is the same as OWP-001. |
| 2 | Open each of the five tabs in turn | Each opens the full management version (you can create/edit, not just view). |
| 3 | From the overview, open the links/cards to Analytics, History, Belts, Curricula, Exams, Promotions, Eligible Students, Usage, Teachers, Scan Attendance (or type each `.../[clubID]/<page>`) | Each page opens for you (the detailed tests below confirm each one). None shows "access restricted" except where a boundary test says so. |

**Screen-size check:** On phone the stat cards stack and the club sidebar slides in from a toggle; at desktop (>=1024) the sidebar is docked. Same layout as OWP-001.

**Edge cases to try:**
- Refresh the overview mid-load → re-fetches and renders, no stuck blank shell.
- Open a club where you are NOT a co-owner (change the ID in the address) → you should see the member view or be bounced, depending on your role there. Your owner surface is per club.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE §9):

---

### OWS-002 - Co-owner approves / rejects join requests

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove a co-owner can accept and decline pending applicants, exactly as the primary owner does.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.
2. At least one pending join request exists (create one with a throwaway incognito account via the club join link; see OWP-002 / CR-002).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Run **OWP-010** (approve a join request) signed in as the co-owner | Same result as OWP-010: the applicant moves out of Pending and appears in the active roster. No "access restricted". |
| 2 | Run **OWP-011** (reject a join request) signed in as the co-owner, using a throwaway applicant | Same result as OWP-011: the applicant is removed from Pending. |

> A fee tier is NOT required to approve a member. If the club has no fee tier, approval still works (the starting belt is what matters). Do not treat a missing fee tier as a blocker here.

**Screen-size check:** The Members / Pending / Exit-Requests sub-tabs stay reachable on phone (they may collapse into a dropdown); the approve/reject controls are tappable. Same as OWP-010.

**Edge cases to try:**
- Refresh the Pending list mid-load → re-fetches, no stale empty list.
- Cancel a reject confirmation → the applicant stays in Pending.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-003 - Co-owner changes member roles + manages fee tiers

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members` (and the Settings "Fee Tiers" tab)
- **Goal:** Prove a co-owner can change a member's role and create/edit fee tiers, just like the primary owner.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.
2. At least one active member besides you (use a throwaway test member for role changes).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Run **OWP-012** (assign a role to a member) as the co-owner: open a throwaway member, change their role to Secretary, save | Same result as OWP-012: the role label updates and persists after refresh. |
| 2 | Run **OWP-013** (create a fee tier) as the co-owner | Same result as OWP-013: the new tier appears in the list. |
| 3 | In the role dropdown for a member, check which roles you are offered | You can set Club Member, Secretary, and Sensei (Sensei only for a black-belt member). The owner roles (co-owner / primary owner) do NOT appear in your dropdown - granting co-owner is primary-only (OWS-041). That absence is expected, not a bug. |

**Screen-size check:** The member detail view and the fee-tier form scroll on phone; controls are reachable. Same as OWP-012 / OWP-013.

**Edge cases to try:**
- Assign a role, then have that member (incognito) refresh - their screens should change to match (CR-004).
- Try to make a non-black-belt member a sensei → the Sensei option is not offered for them; that is expected (only black belts qualify).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-004 - Co-owner manages calendar, exams, and grading

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`, `.../[clubID]/exams`, `.../exams/[examID]/grading`
- **Goal:** Prove a co-owner can create calendar events and schedule/grade exams, exactly as the primary owner.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.
2. The club has at least one site and one room (needed to schedule). If not, create them (OWP-003 / OWP-004) as the co-owner first.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Run **OWP-006** (create a class from the Calendar) as the co-owner | Same result as OWP-006: the class appears on the calendar; the Calendar teacher picker uses real senseis. |
| 2 | Run **OWP-008** (create an exam / workshop / social / tournament) as the co-owner | Same result as OWP-008: each event type appears on the calendar. |
| 3 | Run **OWP-019** (schedule an exam and grade candidates) as the co-owner | Same result as OWP-019: you can schedule, open grading, set Pass/Fail, and finalize. |

> KNOWN - do not file: creating a class from inside a **Room page** shows placeholder teacher names in that one modal (START-HERE §8 #6). Use the Calendar to get real teachers. Same caveat as OWP-006.

> Finalizing an exam needs at least 2 examiners marked present, and you cannot finalize a future-dated exam. If finalize is blocked for one of those reasons, that is the rule, not a bug.

**Screen-size check:** The Create Event dialog opens from the bottom and scrolls on phone; grading rows are usable by thumb. Same as OWP-006 / OWP-019.

**Edge cases to try:**
- Set an end time before the start time → validation error.
- Try to finalize a grading with fewer than 2 examiners present → it should block with a clear message (expected).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-005 - Co-owner views analytics and history

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/analytics`, `.../[clubID]/history`
- **Goal:** Prove a co-owner can open the analytics tabs and the history page - the surfaces that senseis and secretaries are blocked from.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Run **OWP-023** (view analytics tabs) as the co-owner | Same result as OWP-023: the analytics page opens (no "access restricted"); tabs are Attendance, Membership, Content, Belts, Events, Usage Metrics. There is NO Financial tab - its absence is intentional (START-HERE §8 #7). |
| 2 | Run **OWP-024** (view attendance + promotion history) as the co-owner | Same result as OWP-024: the history page opens with Attendance and Promotions tabs. |
| 3 | Run **OWP-025** (view club usage metrics) as the co-owner | Same result as OWP-025: the usage page opens. |

> This is the key difference from senseis and secretaries: a co-owner IS allowed here, they are not. If you ever see "access restricted" on analytics or history as a co-owner, that IS a bug - file it.

**Screen-size check:** On phone the analytics tabs are a scrollable pill bar and charts stack; on desktop tabs spread and charts widen. Same as OWP-023.

**Edge cases to try:**
- Refresh on a tab → re-fetches; no stale empty chart stuck.
- Empty charts on a quiet club are fine, not a bug.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-006 - Co-owner uses scan-attendance

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A, on a real phone for the camera)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/scan-attendance`
- **Goal:** Prove a co-owner can open the scan-attendance camera page - secretaries are explicitly blocked here, co-owners are not.

**Preconditions / setup:**
1. Logged in as the co-owner on the club, on a real phone with a rear camera (the camera needs HTTPS or localhost).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/scan-attendance` | The page opens for you; on allowing the camera you get a live viewfinder. No "access restricted" block (that block is only for secretaries). |
| 2 | Point the camera at a valid member QR (see CR-001 for the full scan-to-history journey) | The QR is detected and attendance is recorded for that member. |

> Full attendance behavior (scan, duplicate handling, history) is the cross-role journey CR-001 - run that for the end-to-end flow. Here you only confirm a co-owner is NOT blocked from the page.

> The three camera-error messages (camera not supported / permission denied / camera not found) show in English even in French mode. That is a known gap (START-HERE §6), not a bug.

**Screen-size check:** The viewfinder fills a phone screen and the cancel/close control is reachable by thumb. This page is phone-first.

**Edge cases to try:**
- Deny camera permission → a clear "permission denied" state (English even in French; do not file).
- A secretary opening this page sees an explicit block - that is their test (SEC-042), not yours.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-007 - Co-owner manages teachers (assign / revoke sensei)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/teachers`
- **Goal:** Prove a co-owner can open the Teacher Management page and assign/revoke senseis - the page is open to both owner roles (primary and co-owner).

**Preconditions / setup:**
1. Logged in as the co-owner on the club.
2. For the assign step, the club has at least one active member who holds a **black belt** (only black belts can be made senseis). If none do, the assign list is empty - that is expected, not a bug.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open `.../[clubID]/teachers` | The Teacher Management page loads for you (no "owner only" block - a co-owner is allowed). It has "Current Senseis" and "Assign Sensei" tabs. This is the same as OWP-021. |
| 2 | Run **OWP-021** (make a member a sensei, then revoke it) as the co-owner | Same result as OWP-021: an eligible black-belt member can be made a sensei and revoked. |

> KNOWN - do not file: the per-class teacher picker inside the Room class-create modal shows placeholder names (START-HERE §8 #6). The Teachers page and the Calendar flow use real data.

**Screen-size check:** The two tabs and the Make Sensei / Revoke buttons are reachable on phone; confirm dialogs fit the screen. Same as OWP-021.

**Edge cases to try:**
- The assign list shows only black belts - a non-black-belt member missing from it is expected, not a bug.
- Cancel a Make Sensei / Revoke confirmation → no change.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-008 - Co-owner manages belts, curricula, library, and warmups

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/belts`, `.../[clubID]/curricula`, `.../[clubID]/eligible-students`, `.../[clubID]/promotions`, `.../[clubID]/library` (+ manage), `.../[clubID]/library/warmup` (+ manage)
- **Goal:** Prove a co-owner can run the curriculum/belt/promotion and content-library surfaces, exactly as the primary owner.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Run **OWP-016** (define club belts) as the co-owner | Same result as OWP-016: you can create and edit belts. |
| 2 | Run **OWP-017** (create and assign a curriculum) as the co-owner | Same result as OWP-017: you can build a curriculum and assign it to a member. |
| 3 | Run **OWP-018** (view eligible students) as the co-owner | Same result as OWP-018: the list opens (no "access restricted"); an empty list on a quiet club is fine. |
| 4 | Run **OWP-020** (run the promotion workflow) as the co-owner | Same result as OWP-020: the promotions page opens and you can move a candidate through. |
| 5 | Run **OWP-026** (manage the club library) and **OWP-027** (manage club warmups) as the co-owner | Same results: you can create/edit club moves, media, and warmups. |

**Screen-size check:** Floating "+" buttons stay reachable above the bottom nav on phone; forms and dialogs fit the screen. Same as the referenced OWP tests.

**Edge cases to try:**
- Save a belt or curriculum with no name → validation error.
- On a brand-new club, eligible-students and promotions show empty states, not errors.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-009 - Co-owner adds / removes members and processes exits

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Co-owner (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove a co-owner can add and remove ordinary members (including bulk) and process exit requests, exactly as the primary owner.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.
2. For removal/bulk, use throwaway test members. For the exit step, a member must have a pending exit request (have a member account submit one; see MEM-014 / CR-011).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Run **OWP-014** (bulk member operations) as the co-owner, on throwaway members | Same result as OWP-014: you can select several members and assign a role, remove them, or assign/remove a curriculum. |
| 2 | Run **OWP-015** (process an exit request) as the co-owner | Same result as OWP-015: you can approve or deny a pending exit request and the member's status updates. |

> Adding a member from scratch (invite / add) is the owner-side of CR-012 - the co-owner has the same add-member control as the primary owner.

**Screen-size check:** Member selection, the bulk dialog, and the Exit Requests sub-tab are usable on phone. Same as OWP-014 / OWP-015.

**Edge cases to try:**
- Open the bulk dialog with nothing selected → it should not let you proceed.
- Cancel a bulk remove → no one is removed.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Co-owner: the boundaries (BLOCKED / verify)

> A co-owner has the whole owner surface above, with two things reserved for the primary owner: handing over primary ownership, and adding another co-owner. These two tests confirm those controls are absent for you. A third test checks whether a co-owner can remove a co-owner.

### OWS-040 - BLOCKED: transfer primary ownership (primary owner only)

- **Status:** FUNCTIONAL (expected result: the control is absent for a co-owner)
- **Role(s) & sessions:** Co-owner (Session A); the primary owner (Session B, incognito) only if you want to confirm the control exists for them
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove a co-owner cannot hand primary ownership to anyone - that control belongs to the primary owner only.

**Preconditions / setup:**
1. Logged in as the co-owner on the club. The club has a primary owner and at least one other co-owner (so there would be a candidate to transfer to, if the control existed).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The roster loads. |
| 2 | Open a member, choose "Assign Role", and open the role dropdown | The dropdown offers Club Member, Secretary, and Sensei (Sensei only for a black-belt member). "Primary Owner" is NOT among the choices, and there is no separate "transfer ownership" or "make primary" control anywhere on the page. |
| 3 | (Optional confirmation) In Session B as the PRIMARY owner, open the same member and open the same role dropdown | The primary owner IS offered "Primary Owner" in that dropdown (that is OWP-030). Handing over primary ownership is done by choosing that role - there is no separate "transfer ownership" button anywhere in the app. This confirms the option exists for the primary owner only. |

> Expected and not a bug: the absence of the transfer control for a co-owner is the correct restricted state. Even if a control were somehow shown, the server only lets the current primary owner transfer, so a co-owner's attempt would be rejected. Record either way.

**Screen-size check:** The member detail / role area is reachable on phone; confirm the transfer control is simply not present (not just hidden off-screen).

**Edge cases to try:**
- Open your OWN member detail as the co-owner → no self-transfer / self-promote to primary.
- If you DO find any working "transfer primary" or "make primary" control as a co-owner, that IS a bug - file it (it would break the primary-only rule).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-041 - BLOCKED: add a co-owner (primary owner only)

- **Status:** FUNCTIONAL (expected result: the control is absent for a co-owner)
- **Role(s) & sessions:** Co-owner (Session A); the primary owner (Session B, incognito) only to confirm the control exists for them
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove a co-owner cannot promote another member to co-owner - granting co-owner status belongs to the primary owner only.

**Preconditions / setup:**
1. Logged in as the co-owner on the club. At least one ordinary member exists (a candidate you would promote, if the control existed).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The roster loads. |
| 2 | Open an ordinary member and open the role options | The role choices you see do NOT include the co-owner ("Club Owner") option. You can set Club Member, Secretary, and Sensei (black belt only) - but not co-owner. There is no separate "make co-owner" / "add owner" button either. |
| 3 | (Optional confirmation) In Session B as the PRIMARY owner, open the same member | The primary owner DOES see the co-owner / "Club Owner" role option (that is OWP-022). This confirms granting co-owner is primary-only. |

> Expected and not a bug: a co-owner not being offered the co-owner role is the correct restricted state. On the server, adding a co-owner is allowed only for the primary owner, so a co-owner's attempt would be rejected regardless. Record either way.

**Screen-size check:** The role options area is reachable on phone; confirm the co-owner option is genuinely absent from the list.

**Edge cases to try:**
- Check the bulk "Assign Role" dialog too → it should also not offer the co-owner role to you as a co-owner.
- If you DO find any working way to grant co-owner as a co-owner, that IS a bug - file it.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### OWS-042 - Co-owner removes a co-owner

- **Status:** KNOWN-GAP (the rule allows it, but the current screen does not show a co-owner the control - verify, see below)
- **Role(s) & sessions:** Co-owner (Session A); a second co-owner (a throwaway test account) as the one being removed
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Check whether a co-owner can remove ANOTHER co-owner (return them to an ordinary member). The rule permits a co-owner to do this; this test records whether the current screen actually lets you.

**Preconditions / setup:**
1. Logged in as the co-owner on the club.
2. There is a SECOND co-owner on the club to remove - a throwaway test account promoted to co-owner by the primary owner first (OWP-022). Never remove the only remaining owner; keep the primary owner in place.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page → "Members" sub-tab | The roster loads; the second co-owner is shown with the co-owner label. |
| 2 | Open that second co-owner's detail and look for a remove-co-owner control (a "remove" / "remove owner privileges" action, or a way to set their role back to Club Member) | RECORD what you see. The remove-co-owner action is permitted for a co-owner by the rules. If the screen offers you a working control, use it and confirm the member returns to an ordinary member. |
| 3 | If you found and used a remove control, refresh the page | The removed account now shows as an ordinary Club Member (their owner privileges are gone), and they are NOT deleted from the club. |

> KNOWN-GAP to verify, do not file as a surprise: in the current build the remove-co-owner control and the owner role options are shown only to the PRIMARY owner, so as a co-owner you will most likely NOT see a control to remove another co-owner, even though the rule allows it. Record exactly what you see:
> - If you see NO remove control as a co-owner, note "co-owner cannot remove a co-owner from the UI" - this is the gap we are checking, not a bug to file on its own.
> - If you DO see a control, test that it works and that it cannot remove the primary owner or the last remaining owner (those are blocked by rule).

**Screen-size check:** The member detail and any remove control are reachable on phone; confirm dialogs fit the screen.

**Edge cases to try:**
- If a control exists, try it on the PRIMARY owner → it must be refused (you cannot remove the primary owner; they must transfer first).
- If a control exists, try removing the last remaining owner → it must be refused (a club cannot be left with no owner).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
