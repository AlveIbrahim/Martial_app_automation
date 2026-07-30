# Role: Parent (Household) - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** a parent who runs a **household**. You create the household, add **child profiles**, lock each child behind a **PIN**, and set a **daily screen-time limit** for each child. When a child runs out of time and asks for more, you approve or deny the request. You also have the full normal member surface (messaging, support, clubs, your own profile); those are covered by the MEM scenarios and referenced here, not repeated.

**Sessions:** Parent is a single role. Unless a step says otherwise, you work in **Session A only** (one normal window, logged in as the seeded Parent account from START-HERE §3). The two `ONB-` tests at the top build a household and a child from scratch; every later PAR test reuses what they create.

**How you get to the household:** open the user/profile menu in the top header and pick **My Household** (this opens the Household page). To move between the parent profile and a child profile, open the same header menu and pick **Switch Profile**, which opens the profile-switch panel where you choose a child and type that child's PIN. Each test below tells you exactly which one to use.

**Two facts that change what "correct" looks like (from the backend, not the screen):**
- A child's daily screen-time limit must be **greater than 0**. The create/edit form shows the limit field as "optional" and quietly uses a large default if you leave it blank, but **0 is rejected**, and a warning appears if you type 0.
- The screen-time lock is enforced on the server. **Clearing the browser's stored data does not give a locked child more time.** (That bypass attempt is a child-side check, CHD-041; you do not test it here.)

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| ONB-020 | Create a household | FUNCTIONAL |
| ONB-021 | Create a child profile (PIN + screen-time) | FUNCTIONAL |
| PAR-001 | View household members | FUNCTIONAL |
| PAR-002 | Set / reset a child's PIN | FUNCTIONAL |
| PAR-003 | Set / change a child's screen-time limit | FUNCTIONAL |
| PAR-004 | Switch parent to child (enter PIN) | FUNCTIONAL |
| PAR-005 | Switch child back to parent (enter PIN) | FUNCTIONAL |
| PAR-006 | PIN lockout escalation | FUNCTIONAL |
| PAR-007 | Approve a screen-time extension request | FUNCTIONAL |
| PAR-008 | Deny a screen-time extension request | FUNCTIONAL |
| PAR-009 | Open child profile detail | FUNCTIONAL |
| PAR-010 | Parent uses the full standard surface | FUNCTIONAL |
| PAR-040 | Edge: mismatched child PIN on creation | FUNCTIONAL |
| PAR-041 | Edge: very low screen-time limit | FUNCTIONAL |

---

## Onboarding (from scratch)

> These two run in order and build the household and the first child profile that every later PAR test reuses. Run them on the seeded Parent login, or on a fresh account you control.

### ONB-020 - Create a household

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent, no household yet (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household`, `/dashboard/household/create`
- **Goal:** Prove a parent with no household can create one and lands on their new Household page.

**Preconditions / setup:**
1. Logged in as a parent account that does NOT already have a household. (If your seeded Parent already has one, skip to ONB-021, or use a fresh account.)
2. Household creation is server-gated on having a COMPLETE profile. Your seeded parent account should already be profile-complete; if you are testing with a brand-new/incomplete-profile account instead, expect step 5 to be refused with a "profile incomplete" style error until you finish `/complete-profile` first - see the edge case below.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the top header menu and pick **My Household** | Because you have no household yet, a setup screen appears with two cards: one to **Create Household** and one to join an existing household. |
| 2 | On the Create Household card, tap **Create** | A small dialog opens titled "Create Household" with a single **Household Name** field and a note that the household manages subscriptions. |
| 3 | Leave the name blank and try to submit | The Create button stays disabled (you cannot submit an empty name). |
| 4 | Type a household name (e.g. "Test Family") | The field accepts it and the Create button becomes enabled. |
| 5 | Tap **Create** | A short "creating" state, then the dialog closes and you land on your new Household page showing the household name, member count, and child count (all starting small/zero). |

**Screen-size check:** On a phone (<640px) the two setup cards stack vertically and the Create dialog fits the screen; the name field and Create button are reachable by thumb.

**Edge cases to try:**
- Open the Create dialog and tap the X / Cancel → it closes with no household created; reopening My Household shows the setup screen again.
- Type a name, submit, then open My Household again → it now takes you straight to the household (no setup screen), proving one household per account.
- With an account whose profile is NOT complete yet, try to create a household: the server should refuse it (403, "profile incomplete" style error), not silently succeed. A switched-in child session hits the same block, which is what CHD-040 in `role-child.md` checks from that side.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE §9):

---

### ONB-021 - Create a child profile (PIN + screen-time)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent with a household (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household` (Add Child Profile)
- **Goal:** Prove a parent can add a child with a first/last name, birthdate, a PIN (typed twice and matching), and a daily screen-time limit.

**Preconditions / setup:**
1. You have a household (ONB-020). Open **My Household** from the header menu.
2. Decide a PIN you will reuse in later tests (4 to 8 digits). Write it down; you need it for every profile switch.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On the Household page, tap **Add Child Profile** | A dialog opens titled "Create Child Profile" with First Name, Last Name, Birthdate, PIN, Confirm PIN, and a Daily Screen Time Limit (minutes) field. |
| 2 | Type a First Name and Last Name | Both fields accept text. |
| 3 | Pick a Birthdate (a past date) | The date is set; future dates are not selectable. |
| 4 | Type your chosen PIN in the **PIN** field | A PIN strength meter appears and reacts; the digits are hidden as dots. |
| 5 | Type the same PIN again in **Confirm PIN** | A green "PINs match" confirmation appears. |
| 6 | Type a daily screen-time limit in minutes (e.g. `120`) | The number is accepted; no error. |
| 7 | Tap **Create** | A short "creating" state, then a success message ("child profile created"), the dialog closes, and the new child appears in the Family Members list with their age and a "No clubs" label. |

**Screen-size check:** The Create Child dialog scrolls inside itself on a phone so all fields and the Create button stay reachable; the First/Last name pair sits side by side and does not overflow at ~768px.

**Edge cases to try:**
- Tap Create with required fields empty → inline "required" errors under First Name, Last Name, Birthdate, and PIN; no child is created.
- Type a weak/obvious PIN → the strength meter stays low and lists the failing rule(s); a clearly invalid PIN is rejected on submit.
- Leave the screen-time limit blank → the form still submits (a large default is used). This is expected; do not file it. (The "must be greater than 0" rule is tested as 0 in PAR-041.)
- Mismatched PIN in Confirm PIN is its own test, PAR-040.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Household management (PAR)

### PAR-001 - View household members

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household`
- **Goal:** Prove the Household page lists the parent (account holder), any other adult members, and every child profile with correct counts.

**Preconditions / setup:**
1. A household with at least one child (ONB-021).
2. Open **My Household** from the header menu.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Look at the household info card near the top | It shows the household name plus two stats: Total Members and Total Children, matching what you have created. |
| 2 | Find the Family Members section (on a phone it is inside the main card; on desktop it sits in a panel on the right) | The account holder is listed as the household owner; each child is listed with their first initial, name, and age. |
| 3 | Read each child row | A child in no clubs shows a "No clubs" label; a child in one or more clubs shows a club count instead. |
| 4 | On a child row, note the small edit (pencil) and delete (trash) icons | Both icons are visible to the parent (you will not delete here). |

**Screen-size check:** Below 768px the Family Members list lives inside the main card and can be collapsed/expanded with its header; at/above 768px it moves to a sticky right-hand panel. Check the list is complete in both layouts.

**Edge cases to try:**
- A brand-new household with no children → a clean "no child profiles yet" empty state with a prompt to create one, not an error.
- Refresh the page → counts and the member list reload to the same values, no stuck spinner.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-002 - Set / reset a child's PIN

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household` (PIN set on create); PIN reset via the header household tools
- **Goal:** Prove a child's PIN can be set when the child is created, and that the strength check forces a non-trivial PIN.

**Preconditions / setup:**
1. A household with at least one child (ONB-021). Open **My Household**.
2. Have the child's current PIN if you intend to test a reset path.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Start adding a child (Add Child Profile) and reach the PIN field | The PIN field accepts only digits, 4 to 8 of them; non-digits are ignored. |
| 2 | Type an obvious PIN such as `1234` or `0000` | The strength meter shows a weak rating and lists why (too simple / repeated / sequential), so a weak PIN is flagged before you submit. |
| 3 | Type a stronger PIN and repeat it in Confirm PIN | The strength rating improves and a green "PINs match" line appears. |
| 4 | Finish creating the child | The child is created with that PIN (you will use it to switch profiles in PAR-004). |
| 5 | If a reset-PIN tool is offered for an existing child (in the header household tools), open it and set a new valid PIN | The new PIN is accepted; the old PIN no longer switches into that child, the new one does. |

**Screen-size check:** The strength meter and its rule list stay readable on a phone and do not push the Create button off-screen.

**Edge cases to try:**
- PIN based on the child's birthdate (e.g. their birth year) → the strength check should warn against it.
- A PIN shorter than 4 digits → cannot submit (the switch panel also refuses to act on fewer than 4 digits).
- Reset to a PIN that fails the strength rules → rejected with the failing rule shown.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-003 - Set / change a child's screen-time limit

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household` (Edit child profile)
- **Goal:** Prove a parent can change a child's daily screen-time limit (in minutes) and that 0 is rejected as a valid limit.

**Preconditions / setup:**
1. A household with at least one child (ONB-021). Open **My Household**.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On the child row, tap the **edit (pencil)** icon | The "Edit Child Profile" dialog opens pre-filled with the child's name, birthdate, and current daily screen-time limit. |
| 2 | Change the Daily Screen Time Limit to a new positive number (e.g. `90`) | The number field accepts it. |
| 3 | Tap **Update** | A short "updating" state, then a success message and the dialog closes; reopening edit shows the new value. |
| 4 | Open edit again and set the limit to `0` | A red warning appears that setting 0 will block the child. |
| 5 | Try to save with `0` | The save is refused (the limit must be greater than 0); the value is not applied. |

**Screen-size check:** The Edit dialog fits a phone screen; the number field and Update button are reachable by thumb.

**Edge cases to try:**
- Type a negative number or letters → the number field rejects them or the save is refused; no negative limit is stored.
- Set a very small limit (e.g. `1`) → accepted (this is the setup PAR-041 uses to force a quick lock).
- Change only the limit and leave name/birthdate as-is → still saves correctly.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-004 - Switch parent to child (enter PIN)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo (one account, profile switch)
- **Route(s) / feature:** profile switch from the header menu
- **Goal:** Prove a parent can switch into a child profile by selecting the child and entering the correct PIN.

**Preconditions / setup:**
1. A household with at least one child whose PIN you know (ONB-021 / PAR-002).
2. You are currently in the parent profile.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the top header menu and pick **Switch Profile** | A panel opens listing the child profiles in the household. |
| 2 | Tap a child that is NOT locked | A PIN entry view opens showing that child's name and a PIN field (with a show/hide eye toggle). |
| 3 | Type the wrong PIN and confirm | An "incorrect PIN" message appears; you stay on the PIN view and are still the parent. |
| 4 | Type the correct PIN and confirm | A short "switching" state, then you enter the child profile: the app reloads into the child view (restricted navigation, a screen-time countdown is visible). |

**Screen-size check:** On a phone the switch panel slides up from the bottom and fills the width; the child list and PIN field are reachable by thumb. On desktop it appears as a centered dialog.

**Edge cases to try:**
- A child already shown as locked → tapping it does not open PIN entry; you see a "profile locked" / "temporarily locked" note instead (see PAR-006).
- Type fewer than 4 digits → the confirm button stays disabled.
- Cancel the panel mid-entry → you remain the parent, nothing changes.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-005 - Switch child back to parent (enter PIN)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent currently in a child profile (Session A)
- **Solo or 2 testers:** Solo (one account, profile switch)
- **Route(s) / feature:** profile switch from the header menu
- **Goal:** Prove that leaving a child profile back to the parent also requires the PIN, so a child cannot exit on their own without it.

**Preconditions / setup:**
1. You are currently inside a child profile (finish PAR-004 first).
2. You know the PIN used to switch into that child.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the header menu and choose to switch profile / return to parent | A "Switch to Parent" panel opens showing you are currently viewing as the child, with a PIN field. |
| 2 | Type the wrong PIN and confirm | An "incorrect PIN" message appears; you stay in the child profile. |
| 3 | Type the correct PIN and confirm | A short "switching" state, then you are back in the parent profile with the full parent navigation restored. |

**Screen-size check:** The switch-back panel slides up on a phone and is centered on desktop; the PIN field and confirm button are reachable in both.

**Edge cases to try:**
- Repeated wrong PINs here count toward the same 5-attempt lockout in PAR-006.
- Cancel the panel → you remain in the child profile.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-006 - PIN lockout escalation

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo (one account, profile switch)
- **Route(s) / feature:** profile switch from the header menu
- **Goal:** Prove that 5 wrong PIN attempts lock the child profile, that the locked wait gets longer each time it happens, and that a correct PIN clears the failed-attempt count.

**Preconditions / setup:**
1. A child with a known PIN (ONB-021 / PAR-002). Pick a child you can afford to lock for a while.
2. Be ready to wait: the first lock is 15 minutes. Test the lock-and-message behavior, not the full wait, unless you have time.

**What "correct" looks like (from the backend):**
- After **5 wrong PIN attempts** the child profile **locks**.
- The wait escalates: **1st lockout = 15 minutes, 2nd = 30 minutes, 3rd and beyond = 60 minutes**.
- The escalation level (which wait you get) **resets after 24 hours** since the last lockout.
- A **correct PIN clears the failed-attempt count**, so the counter starts over.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open Switch Profile, pick the child, and enter a wrong PIN 4 times in a row | Each try shows "incorrect PIN"; the profile is still selectable (not yet locked). |
| 2 | Enter a wrong PIN a 5th time | The profile locks: you can no longer enter a PIN for it and you see a locked / "temporarily locked" state with a wait time of about 15 minutes. |
| 3 | Confirm the lock holds | Tapping the locked child does not open PIN entry; the wait is shown, not a blank PIN box. |
| 4 | (Optional, needs time) Wait out the first lock, then trigger 5 wrong PINs again | The second lock shows a longer wait of about 30 minutes; a third round shows about 60 minutes. |
| 5 | Before hitting 5 wrong tries, enter the CORRECT PIN once | The switch succeeds and the failed-attempt count is cleared, so the next wrong try starts counting from 1 again, not from where you left off. |

**Screen-size check:** The locked state and its wait time stay readable on a phone and do not overflow the switch panel.

**Edge cases to try:**
- Reload the page while a child is locked → it is still locked with the wait still counting; the lock is not cleared by a refresh.
- Mix wrong attempts across "switch to child" (PAR-004) and "switch back to parent" (PAR-005) on the same PIN → they count toward the same lockout.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-007 - Approve a screen-time extension request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo (one account, profile switch). Full end-to-end (child requests, parent approves) is the cross-role journey CR-010.
- **Route(s) / feature:** `/dashboard/household` -> Screen Time Requests
- **Goal:** Prove a parent can approve a child's request for extra minutes, that the approved minutes cannot exceed what the child asked for, and that approval immediately raises the child's available time for today.

**Preconditions / setup:**
1. A pending screen-time request must exist. The clean way to create one is CR-010: switch into a child (PAR-004), let their time run out, request extra minutes, then switch back to the parent (PAR-005). A pending request then waits on the Household page.
2. Open **My Household**. If there are pending requests, a highlighted banner shows the count near the top.

**What "correct" looks like (from the backend):**
- The parent may approve **up to** the minutes the child requested. **Approving more than requested is rejected.**
- **Approving 0 or fewer minutes is rejected.**
- An approval adds bonus minutes **for today only** and **raises the child's limit right away**.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On the Household page, open **Screen Time Requests** (the banner or the settings card link) | A panel opens with **Pending / Approved / Denied** tabs; the Pending tab lists each request with the child's name, age, the minutes requested, and the child's reason. |
| 2 | On a pending request, tap **Approve** | An input appears pre-filled with the requested minutes, labeled approved minutes. |
| 3 | Type a number HIGHER than the child asked for and confirm | The approval is rejected (you cannot grant more than requested); an error is shown and nothing is approved. |
| 4 | Type `0` and confirm | The approval is rejected (must be greater than 0). |
| 5 | Set the value to the requested amount (or less) and tap **Confirm** | A short "confirming" state, then a success message; the request moves to the **Approved** tab showing the minutes granted. |
| 6 | Switch into that child (PAR-004) and check the screen-time countdown | The child now has the extra minutes available today; if they were locked, they can use the app again. |

**Screen-size check:** The requests panel scrolls inside itself; tabs, the approve input, and Confirm/Cancel stay reachable on a phone and the tab row scrolls sideways if cramped.

**Edge cases to try:**
- Approve, then reopen the panel → the same request is not still pending (it is on the Approved tab), so you cannot approve it twice.
- The approved minutes apply to **today**; they should not silently carry into tomorrow (tomorrow resets to the normal daily limit).
- Use the date-range filter to find older requests; an invalid range (start after end) shows a warning instead of results.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-008 - Deny a screen-time extension request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo (one account, profile switch)
- **Route(s) / feature:** `/dashboard/household` -> Screen Time Requests
- **Goal:** Prove a parent can deny a request, that a denial reason is required, and that the child gets no extra time.

**Preconditions / setup:**
1. A pending screen-time request exists (create one as in PAR-007 / CR-010).
2. Open **Screen Time Requests** on the Household page, Pending tab.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On a pending request, tap the **Deny** option | A reason box opens (a multi-line text field) with a character count. |
| 2 | Leave the reason blank and confirm | The deny is refused with a "reason required" message. |
| 3 | Type a very short reason (under ~10 characters) and confirm | The deny is refused with a minimum-length message. |
| 4 | Type a proper reason and tap **Confirm** | A short state, then a success message; the request moves to the **Denied** tab and the reason is recorded with it. |
| 5 | Switch into that child (PAR-004) and check their countdown | The child has NO extra time; if they were locked, they stay locked. |

**Screen-size check:** The reason box and its character count are readable on a phone; Confirm/Cancel stay reachable.

**Edge cases to try:**
- An extremely long reason (over the maximum) → refused with a too-long message.
- Open Approve, then back out to Deny on the same request → only one outcome is recorded; the request does not end up in both tabs.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-009 - Open child profile detail

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Route(s) / feature:** `/dashboard/household/child/[childId]`
- **Solo or 2 testers:** Solo-with-tabs
- **Goal:** Prove the child detail page shows the child's age, birthdate, daily screen-time limit, clubs joined, and lock status.

**Preconditions / setup:**
1. A household with at least one child (ONB-021).
2. You know the child's id, or you reach the page from the household (see step 1 below).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the child's detail page (open `/dashboard/household/child/<childId>` for one of your children) | A profile page loads with the child's name and avatar initials at the top. |
| 2 | Read the Age and Birthdate cards | They match what you set when creating the child. |
| 3 | Read the Screen Time card | It shows the child's Daily Limit in minutes and the number of Clubs Joined. |
| 4 | Read the Security card | It shows "Profile is accessible" normally, or a "temporarily locked due to failed PIN attempts" note with a red dot if the child is currently locked (e.g. right after PAR-006). |
| 5 | Read the Member Since card | It shows the date the child profile was created. |

**Screen-size check:** The cards stack to one column on a phone and sit in a two-column grid on wider screens; nothing overflows at ~768px.

**Edge cases to try:**
- Open the page for a child id that does not exist (or was deleted) → a clean "profile not found" state, not a crash.
- Right after locking the child in PAR-006, reload this page → the Security card reflects the locked state.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-010 - Parent uses the full standard surface

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** messaging, support, clubs, profile (see referenced MEM scenarios)
- **Goal:** Prove the parent is a normal full member outside the household: messaging, support, club discovery, and their own profile all work the same as for any member.

**Preconditions / setup:**
1. Logged in as the parent (Session A), in the **parent** profile (not a child profile).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open Messages | The messaging surface works for the parent exactly as for a member. Run it per **MEM-013** (and the free-tier gate in **MEM-040** if this account is free); do not re-test it here. |
| 2 | Open Support and the Help center | Tickets and help articles work per **MEM-016** and **MEM-017**. |
| 3 | Open Discover Clubs | Searching and requesting to join a club works per **ONB-012**. |
| 4 | Open your own Profile and Settings | Editing profile, avatar, password, and language work per **MEM-018** and **MEM-019**. |
| 5 | Confirm the household tools are still reachable | My Household and Switch Profile remain in the header menu for the parent. |

**Screen-size check:** This is just a reachability confirmation; the detailed responsive checks live in the referenced MEM scenarios and the cross-cutting sheet.

**Edge cases to try:**
- Switch into a child profile (PAR-004) and confirm Messages, Support, and Discover Clubs are hidden from the child navigation; switch back (PAR-005) and confirm they return for the parent. (The child-side reachability rules are CHD-001 and CHD-040; do not file the child hiding here.)

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Edge / empty-state (PAR)

### PAR-040 - Edge: mismatched child PIN on creation

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household` (Create Child Profile)
- **Goal:** Prove the create-child form blocks creation when the PIN and Confirm PIN do not match.

**Preconditions / setup:**
1. A household (ONB-020). Open **Add Child Profile**.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Fill in First Name, Last Name, and Birthdate | All accepted. |
| 2 | Type a valid PIN in the **PIN** field | The strength meter rates it; no error yet. |
| 3 | Type a DIFFERENT value in **Confirm PIN** | A "PINs do not match" message appears under the confirm field. |
| 4 | Tap **Create** | Creation is blocked; an error indicates the PINs must match and no child is created. |
| 5 | Correct the Confirm PIN to match | The mismatch message clears and a green "PINs match" line appears; Create now works. |

**Screen-size check:** The mismatch and match messages stay readable on a phone and do not push the Create button off-screen.

**Edge cases to try:**
- Match the PINs, then change only the first PIN field so they differ again → the mismatch message returns and Create is blocked again.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### PAR-041 - Edge: very low screen-time limit

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/household` (Edit child profile)
- **Goal:** Prove a parent can set a very low daily limit (used to force a quick lock in CR-010), and confirm where the warning fires and where 0 is refused.

**Preconditions / setup:**
1. A household with a child (ONB-021). Open **My Household**.
2. This sets up the quick-lock used by CR-010; use a child you can afford to lock out for a bit.

**What "correct" looks like (from the backend):**
- The daily limit must be **greater than 0** (0 is refused).
- A **warning fires at 75%** of the limit (e.g. with a 4-minute limit, around the 3-minute mark).
- The limit **resets at the next local midnight**.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Edit the child and set the Daily Screen Time Limit to a very small positive number (e.g. `2` or `4`) | The small number is accepted and saved. |
| 2 | Edit again and set the limit to `0` | A red "setting 0 will block" warning shows and the save is refused. |
| 3 | Set it back to the small positive number and save | Saved; this is the low limit CR-010 relies on. |
| 4 | Switch into the child (PAR-004) and use the app until you near the limit | At about 75% of the limit a warning appears that time is almost up; at the limit the child is locked out (the lock screen appears). |
| 5 | Note the reset behavior | The child's time does not reset until the next local midnight; it does not refill just by reloading. |

**Screen-size check:** The 75% warning and the lock state are readable on a phone; the limit field and Update button stay reachable.

**Edge cases to try:**
- After the child is locked, the only ways to give time back today are a parent-approved extension (PAR-007) or waiting for local midnight; reloading or clearing browser data does not unlock it (the bypass attempt is CHD-041, a child-side check, not yours to file).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
