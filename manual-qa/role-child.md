# Role: Child Profile - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** a child profile inside a parent's household. A child profile is not a separate login. The parent logs in, then switches into the child by entering the child's PIN (see the parent sheet, PAR-004). Once in child mode the app is locked down: a stripped-down menu, a daily screen-time limit, and a lock screen when the time runs out. You leave child mode only by entering the PIN again to go back to the parent.

**Sessions:** Child profile is a single mode you enter from one account, so you work in **Session A only** (one normal window). There is no separate "child login" to open in a second window. Everything here is done by switching the one logged-in account between parent and child.

**Before the CHD tests:** you need a parent account that already has a household with at least one child profile, a known PIN, and a daily screen-time limit set. The parent sheet builds all of this (ONB-020, ONB-021, PAR-002, PAR-003). For the lock tests you want a very LOW limit (a minute or two) so the lock triggers quickly - the parent sets that in PAR-041. Have the PIN written down: you will type it to enter child mode and again to leave it.

**How a child gets around:** the bottom menu bar (on phones/tablets) and the side menu (on laptops/desktops) show a SHORTER list for a child. The child sees Home, Library, Belts, and Progress. The child does NOT see Messages, Support, My Club, or the club-discovery options that a parent sees. The menu is the only "removed" part: some of those hidden pages can still be opened by typing their address, which is covered as a verify-only test below, not a bug.

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| CHD-001 | Child menu is restricted | FUNCTIONAL |
| CHD-002 | Child can use Library, Belts and Progress | FUNCTIONAL |
| CHD-003 | Screen-time warning appears as time runs low | FUNCTIONAL |
| CHD-004 | Hitting the limit shows the lock screen | FUNCTIONAL |
| CHD-005 | The lock survives a page reload | FUNCTIONAL |
| CHD-006 | Child sends a screen-time extension request | FUNCTIONAL |
| CHD-007 | Switching back to the parent needs the PIN | FUNCTIONAL |
| CHD-040 | VERIFY (not a bug): hidden pages reachable by typing the address | KNOWN-GAP |
| CHD-041 | VERIFY: clearing browser storage does not unlock | KNOWN-GAP |

---

## Happy path (the child experience)

### CHD-001 - Child menu is restricted

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** the bottom menu bar (phone/tablet) and the side menu (laptop/desktop)
- **Goal:** Prove that once you switch into a child profile the menu hides the parent-only areas (Messages, Support, My Club, club discovery) and shows only the child areas.

**Preconditions / setup:**
1. Logged in as the parent, with a household and at least one child profile that has a PIN (parent sheet ONB-020, ONB-021, PAR-002).
2. Switch into the child profile: open the account menu, choose Switch Profile, pick the child, and type the child's PIN (full steps are in the parent sheet, PAR-004). You are now in child mode.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | On a phone or tablet width, look at the menu bar pinned to the bottom of the screen | It shows Home, Calendar, Library, Payment. There is no Messages item and no Support item - but see the note below: neither is a child rule. |
| 2 | Look for a My Club item in that bottom bar | My Club is not shown for the child, even if the household account is a club owner/teacher elsewhere. |
| 3 | Switch to a laptop/desktop width (the menu moves to the left side of the screen) | The side menu shows Home, Progress, Library and hides Messages, Support, and My Club. |
| 4 | Open the account/avatar menu in the corner | The child sees a "Switch to Parent" button. Parent-only items (My Profile, edit profile) are not offered to the child. |

> **Two corrections, applied 2026-08-02 after reading the app source** (see
> CLAUDE.md rule 1 - where a sheet disagrees with the code, the code wins):
>
> 1. **There is no Belts item, for anyone.** This sheet used to expect "Home,
>    Library, Belts, Progress" in both menus. Neither `DesktopSidebar.tsx` nor
>    `BottomNavigation.tsx` renders a `belts` nav item for any role, so it was
>    never a child restriction that had gone missing - it was never there.
>    Belts is reached from Progress, and `CHD-002` covers it.
> 2. **The phone bar's missing Messages and Support are not child rules.** That
>    bar is a different six-item set from the sidebar for every role, dropping
>    Messages and Progress outright; it also drops Support for any club member
>    (`BottomNavigation.tsx` ~line 146). So on a phone those two are absent for
>    the parent as well, and confirming them there proves nothing about the
>    child. Step 2, My Club, is the only part of the phone check that is
>    genuinely child-specific.
>
> **Known app bugs, expected to fail steps 2 and 3 today.** The code filters
> only Support on profile type, though its own comment says otherwise:
> `// Child profiles: hide messages and support` sits directly above
> `if (currentProfileType === 'child' && item.nameKey === 'support') return false;`
> (`DesktopSidebar.tsx` ~line 232, `BottomNavigation.tsx` ~line 142). Messages
> and My Club are therefore still offered to a child. Automated as deliberately
> red tests in `e2e/specs/smoke-testing/14-child-profile/child.restricted.spec.ts`
> - report them against this scenario ID, do not re-file.

**Screen-size check:** Confirm the restricted menu is correct in BOTH layouts: the bottom bar below the 768px boundary and the side menu above it. The boundary is where the menu moves from bottom to side.

**Edge cases to try:**
- After switching to child, reload the page: the menu must still be the short child list, not the full parent menu.
- Rotate a phone/tablet between portrait and landscape: the child menu stays restricted and nothing is cut off.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Section 9):

---

### CHD-002 - Child can use Library, Belts and Progress

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/library`, `/dashboard/belts`, `/progress`
- **Goal:** Prove the areas left in the child menu actually open and work for a child.

**Preconditions / setup:**
1. You are in child mode (CHD-001 setup). The child still has screen time left (not locked).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Tap Library in the child menu | The move library opens and shows moves the child can view. Videos play as plain video (no quality-switching control - that is expected, see START-HERE Section 8). |
| 2 | Open any one move | The move detail page opens with its description and video; nothing is blocked behind a "Switch to Parent" prompt. |
| 3 | Tap Belts in the child menu | The belt reference page opens and lists belt levels. |
| 4 | Tap Progress in the child menu | The child's belt-progress page opens and shows their own progression. |
| 5 | Tap Home | The home/dashboard view opens in its child form (no owner cards, no club-management shortcuts). |

**Screen-size check:** On a phone (<640px) the library grid stacks into one or two columns and a move video fits the screen; on desktop the library shows a wider grid.

**Edge cases to try:**
- If the master library has not been seeded with content, the library may be empty - that is empty data, not a broken page (START-HERE Section 5). An empty list with no error is a PASS.
- The set of moves a child sees can be smaller depending on the account's tier and belt; if a test does not tell you a specific move must be visible, do not treat fewer items as a bug.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CHD-003 - Screen-time warning appears as time runs low

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** screen-time warning popup
- **Goal:** Prove the child is warned before the daily screen-time limit runs out.

**Preconditions / setup:**
1. As the parent, set the child's daily screen-time limit to a small number so the warning fires quickly (parent sheet PAR-003 / PAR-041). The warning is built to appear when about 15 minutes or less remain for the day, so pick a limit that lands you near that band, or run this right after the child has used most of the day's time.
2. Switch into the child profile (CHD-001 setup) and use the app normally (open Library, Belts, etc.) so time is counted.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Keep using the child profile as the remaining time drops toward the low band | A "Time Running Out" popup appears saying how many minutes of screen time remain today. |
| 2 | Read the two buttons on the popup | One button continues using the app; the other starts a request for extra time. |
| 3 | Tap the continue button | The popup closes and the child can keep using the app until the time is fully used. |

**Screen-size check:** The warning popup is centered and fully readable on a phone (<640px); its buttons are reachable by thumb and nothing is cut off.

**Edge cases to try:**
- In French, the popup text should be translated and must not overflow its box (French is often longer).
- The warning should not keep popping up repeatedly after you dismiss it within the same low-time window.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CHD-004 - Hitting the limit shows the lock screen

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** screen-time lock screen
- **Goal:** Prove that when the daily limit is fully used the app covers itself with a lock screen the child cannot click past.

**Preconditions / setup:**
1. As the parent, set a very LOW daily limit (a minute or two) so the lock triggers fast (parent sheet PAR-041).
2. Switch into the child profile (CHD-001 setup) and keep the app open and in use until the limit is reached.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Keep the child profile in use until the remaining time reaches zero | A full lock screen appears titled "Time's Up", greeting the child by name and saying the daily screen-time limit has been reached. |
| 2 | Read the usage box on the lock screen | It shows the Daily Limit, the time Used Today, and Remaining (which is zero). The numbers match the limit the parent set. |
| 3 | Try to tap the app behind the lock screen | You cannot reach the app; the lock screen sits on top and blocks everything underneath. |
| 4 | Read the three buttons on the lock screen | There is a button to request a screen-time extension, a button to re-check / refresh the remaining time, and a "Switch to Parent" button. |

**Screen-size check:** The lock screen card is centered and fully visible on a phone (<640px); all three buttons stack and stay reachable by thumb; on desktop the card is centered with the dark overlay filling the screen.

**Edge cases to try:**
- Tap the refresh button while still at zero: it should report that there is no extra time yet (not a crash), and the lock should stay.
- In French, the lock screen wording should be translated and fit without overflow.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CHD-005 - The lock survives a page reload

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** screen-time lock screen
- **Goal:** Prove a child cannot get rid of the lock just by reloading the page.

**Preconditions / setup:**
1. You are in child mode and the lock screen is already showing (finish CHD-004 first).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Reload the page (browser refresh, or pull-to-refresh on a phone) | The page reloads and the lock screen comes straight back. There is no brief moment where the app underneath is usable. |
| 2 | Open a different child page address directly (for example the library address) and load it | The lock screen still covers the page; the child cannot slip past it by changing the address. |
| 3 | Wait a few seconds after reload | The lock stays in place; it does not clear on its own while time is still zero. |

**Screen-size check:** Confirm the lock re-appears on reload at both a phone width and a desktop width.

**Edge cases to try:**
- Close the tab and reopen the app at its address while still in child mode: the lock should reappear.
- (The stronger "clear browser storage" attempt is its own test, CHD-041.)

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CHD-006 - Child sends a screen-time extension request

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs. (The parent approving it is a separate flow: see the parent sheet PAR-007, and the full child-asks / parent-approves journey is CR-010.)
- **Route(s) / feature:** the screen-time extension request popup (reached from the warning popup or the lock screen)
- **Goal:** Prove a child can ask the parent for more time, choosing how many minutes and an optional reason.

**Preconditions / setup:**
1. You are in child mode, and either the warning popup (CHD-003) or the lock screen (CHD-004) is available so you have a button to open the request.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Tap the request-extra-time button (on the warning popup it asks for extra time; on the lock screen it requests a screen-time extension) | A request popup opens with a field for how many extra minutes are needed and an optional reason box. |
| 2 | Enter a number of minutes (for example 30) | The field accepts the number. |
| 3 | Type a short optional reason, or leave it blank | The reason box accepts text; leaving it blank is allowed. |
| 4 | Tap the send button | A confirmation appears that the request was sent to the parent, and the popup closes. The child does NOT get more time yet: time is only added after the parent approves (parent sheet PAR-007). |
| 5 | Try sending another request with the minutes field set to 0 or empty | The request is refused with a "enter a valid number of minutes" style message; nothing is sent. |

**Screen-size check:** The request popup fits a phone (<640px) screen; the minutes field, reason box, and Send button are all reachable by thumb.

**Edge cases to try:**
- Type a very large number of minutes: the parent can only approve up to the amount you ask for, never more (that rule is enforced when the parent approves; see PAR-007). Just confirm the child side accepts the number and sends.
- In French, the popup labels should be translated and fit without overflow.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CHD-007 - Switching back to the parent needs the PIN

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** the "Switch to Parent" button and its PIN popup
- **Goal:** Prove a child cannot return to the parent account without the parent's PIN.

**Preconditions / setup:**
1. You are in child mode (this works whether or not the lock screen is showing - both offer a "Switch to Parent" button).
2. Have the correct PIN, and also try a wrong one.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Tap "Switch to Parent" (in the account menu, or on the lock screen if it is showing) | A small "Enter PIN" popup appears asking for the PIN to switch back to the parent account. |
| 2 | Type a WRONG PIN and confirm | The switch is refused with an "invalid PIN" style message; you stay in child mode. |
| 3 | Type the CORRECT PIN and confirm | A short "verifying" state shows, then you are switched back to the parent account; the full parent menu returns (Messages, Support, My Club, My Profile are back). |
| 4 | Look at the menu after switching | The menu is now the full parent menu, confirming you are out of child mode. |

**Screen-size check:** The PIN popup is centered and fits a phone (<640px); the PIN field and the Switch/Cancel buttons are reachable by thumb.

**Edge cases to try:**
- Enter the wrong PIN several times in a row: after repeated wrong tries the profile is locked out for a while (the lockout and its escalating wait are owned and tested on the parent side, PAR-006). On the child side just confirm wrong PINs are refused and do not let you through.
- Open the PIN popup and tap Cancel: it closes and you remain in child mode.
- In French, the popup labels should be translated.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Verify-only (do NOT file these as bugs)

> The two tests below are known limitations we are checking on purpose. Record exactly what you see. Do NOT open a ClickUp bug for the "known" part each one describes. See START-HERE Section 8, items 10 and the screen-time note.

### CHD-040 - VERIFY (not a bug): hidden pages reachable by typing the address

- **Status:** KNOWN-GAP (verify, do not file the reachability)
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/messages`, `/support`, `/dashboard/household/child/[childId]`, `/dashboard/household/create`
- **Goal:** Confirm the known behavior: the child MENU hides Messages, Support, and the child-detail page, but those pages can still be OPENED by typing their address. What we are really checking is that even when opened, the child cannot SEND or SAVE anything in them. One of the four pages tested here (household creation) goes further: the write is blocked server-side with a clear error, not just a silent no-op - that is the one page where you should expect an actual rejection message, not just "nothing happened."

**Preconditions / setup:**
1. You are in child mode (CHD-001 setup) and not currently locked out by screen time.
2. Have the addresses ready: the messages page, the support page, a child-detail page address (the parent sheet PAR-009 shows where a child-detail address comes from), and `/dashboard/household/create`.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Type the messages page address into the browser and load it | The page opens (it is NOT blocked by the menu hiding it). This open-by-address behavior is the KNOWN-GAP - do NOT file it. |
| 2 | Try to actually send a message from there | The send does not go through: the server refuses a child-context message. Record exactly what happens (error, no-op, or a blocked send). This is the part that matters. |
| 3 | Type the support page address and load it | The page opens. Try to create or reply to a support ticket. |
| 4 | Confirm whether the support action saves | The server should refuse the child-context write; record what you see. |
| 5 | Type a child-detail page address and load it | The page opens. Try any action that would change data on it. |
| 6 | Confirm whether that change saves | The server should refuse the write; record what you see. |
| 7 | Type `/dashboard/household/create` and try to create a household from a child session | The server refuses this with a clear "profile incomplete" style 403 error (a child's profile is never marked complete), not a silent failure. A clear rejection here is the pass, matching ONB-020's edge case in `role-parent.md`. |

**What to record (this is the deliverable for this test):**
- For each of the four pages: did it OPEN by address? (expected: yes for the first three - known, not a bug; the household-create action may reject you outright with an error, which is fine)
- For each page: could the child actually SEND or SAVE anything? (expected: no - the server should reject it, and for household-create specifically with a visible error rather than a silent no-op)
- If a child CAN successfully send or save in any of these, THAT is a real finding worth flagging (note it clearly), because the open-by-address part is the only known-and-allowed part.

**Screen-size check:** Not the focus here; a quick check on one phone width is enough.

**Edge cases to try:**
- Reload one of these pages while in child mode: it should still open (known) and still refuse writes.

**Result capture:**
- PASS / FAIL (PASS = pages open but writes are refused): [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (only if a write actually succeeded):

---

### CHD-041 - VERIFY: clearing browser storage does not unlock

- **Status:** KNOWN-GAP (verify, do not file)
- **Role(s) & sessions:** Child profile (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** screen-time lock screen
- **Goal:** Confirm the lock cannot be removed by clearing the browser's saved data. The limit is enforced on the server, so wiping local browser storage should NOT give the child more time.

**Preconditions / setup:**
1. The child is locked out (finish CHD-004 so the lock screen is showing).

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the browser tools and clear this site's stored data (local storage / site data for the app), then close the tools | The stored data is cleared. |
| 2 | Reload the page | The lock screen comes back. Clearing storage did NOT unlock the child; the server still says the time is used up. This is the expected result - do NOT file it. |
| 3 | Try to use the app behind the lock | Still blocked. The only real ways forward are the parent approving an extension (PAR-007) or the daily limit resetting at the next local midnight. |

**What to record:** Confirm the lock returned after clearing storage and reloading. If clearing storage DID let the child back into the app with no time left, THAT is a real finding worth flagging.

**Screen-size check:** Not the focus; one width is enough.

**Edge cases to try:**
- Clear storage, then open the app at a different child page address: the lock should still appear.

**Result capture:**
- PASS / FAIL (PASS = still locked after clearing storage): [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (only if clearing storage bypassed the lock):
