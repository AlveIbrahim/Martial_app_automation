# Martial Apps — Manual QA Scenario Document Set: BLUEPRINT

> **Status of this doc:** Design/blueprint only. No scenario files are written here. A second wave of writer-agents fills the files defined in §A using the template in §B, the IDs in §C, the per-role lists in §D, the cross-role list in §E, the coverage proof in §F, and the work split in §G.
>
> **Ground truth:** `manual-qa/_research/00-app-map.md` (verified against late-May frontend). All status tags, traps, and route facts trace to that map, spot-confirmed against `src/app/(authenticated)/layout.tsx`, the analytics/history/scan/teachers/exams/settings guards, the household page, the members page, and the messaging container.
>
> **Locked decisions baked in:** separate files; environment-agnostic; mixed test data (seeded club + accounts AND from-scratch onboarding); click-by-click steps with per-step expected results, edge cases, and screen-size checks. Core principle: organize by JOURNEY OWNERSHIP — any 2+ role flow is ONE scenario owned by ONE tester using multiple sessions.

---

## A. FILE MANIFEST

All files live in `martial-apps-testing/manual-qa/`. Kebab-case. One START-HERE, seven per-role sheets, one cross-role journeys file, one cross-cutting non-functional file, plus a shared bug-log.

| # | Filename | Purpose (one line) |
|---|---|---|
| 1 | `00-start-here.md` | Setup, seeded-account table, the multi-session primer (1 window + 1 incognito = 2 logins; 3rd role needs 2nd browser/profile), the "do-not-file" trap list, status-tag legend, screen-size matrix, how to use scenario IDs in bug reports. Read first by every tester. |
| 2 | `role-owner-primary.md` | Single-role scenarios for `club_owner_primary` (OWP-###). Includes onboarding/create-club and "things only primary can do." |
| 3 | `role-owner-secondary.md` | Single-role scenarios for co-owner `club_owner` and club-level `admin` (OWS-###). Includes "verify you are BLOCKED from primary-only actions." |
| 4 | `role-sensei.md` | Single-role scenarios for `sensei` (SEN-###). Teaching surface + the critical BLOCKED-from-analytics/history checks and the settings-reachability probe. |
| 5 | `role-secretary.md` | Single-role scenarios for `secretary` (SEC-###). Member/curriculum/belt admin + BLOCKED-from-analytics/history/scan/settings checks. |
| 6 | `role-member.md` | Single-role scenarios for free-tier `club_member`/`member` (MEM-###). View-only surface, join flow, personal progress, the full access-control "you are blocked" battery. |
| 7 | `role-parent.md` | Single-role scenarios for the `parent` household profile (PAR-###). Household/child/PIN/screen-time/exit-request ownership. |
| 8 | `role-child.md` | Single-role scenarios for the `child` profile (CHD-###). Restricted nav, screen-time lock, PIN switch back, deep-link reachability (verify, don't file). |
| 9 | `cross-role-journeys.md` | All multi-role journeys (CR-###). One tester per journey playing every role across sessions. Realtime ones tagged "2 testers recommended" with solo fallback. |
| 10 | `cross-cutting-checks.md` | Non-functional sweeps (XC-###): French/i18n, responsive at the 768px boundary, PWA install/standalone/update, service-worker asset offline, realtime socket behavior as its own dedicated check, plus the "needs a real phone" battery. |
| 11 | `bug-log.md` | Shared running bug log all testers append to. Columns: Date, Tester, Scenario ID, Screen size, Severity, Summary, Steps-to-repro, Expected, Actual, Screenshot ref. (Optional — gives bug reports a permanent home keyed to scenario IDs.) |

**Where non-functional checks live (and why):**
- Cross-cutting non-functional checks → their own sheet (`cross-cutting-checks.md`), NOT baked per-scenario. French layout, the 768px transition, and PWA install are orthogonal to role; baking "also check in French at 768px" into ~150 scenarios would 3x every scenario and guarantee inconsistent coverage. Instead, every functional scenario carries one lightweight Screen-size check line for the layout it personally touches, and the heavy systematic sweeps live once in the XC sheet.
- Realtime gets a dual home: the mechanics live once in START-HERE's multi-session primer and are exercised inside the specific CR journeys that need them; the systematic socket battery (typing auto-clear, edit/delete propagation, reconnect, cross-page cache invalidation) lives in `cross-cutting-checks.md` as XC scenarios.
- START-HERE holds only primers and matrices, never actual test steps.

---

## B. SCENARIO TEMPLATE

Every scenario in every file uses this exact block.

```markdown
### [ID] — [Short Title]

- **Status:** FUNCTIONAL | PARTIAL | STUB | KNOWN-GAP
- **Role(s) & sessions:** [e.g. Sensei (Session A, normal window) + Member (Session B, incognito)]
- **Solo or 2 testers:** Solo-with-tabs | 2 testers recommended (solo fallback below)
- **Route(s) / feature:** [exact path(s) from the app map]
- **Goal:** [one sentence — what this proves]

**Preconditions / setup** (the same tester creates all of these as explicit steps):
1. [account(s) logged in where, which role in which club]
2. [data prereqs — e.g. club has >=1 site + >=1 room]
3. TIME-SENSITIVE SETUP (if any): [e.g. "Before starting steps, create a class with start time = now."]

**Steps** (each step = one click + its own expected result):
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | [exact thing to click/type] | [exactly what should appear] |
| 2 | ... | ... |

**Screen-size check:** [the ONE responsive thing this scenario touches]

**Edge cases to try:**
- [bad input / cancel / double-submit / empty state / permission flip / refresh mid-flow]

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (log in bug-log.md):
```

### Filled example (the attendance cross-role journey, the model writers copy)

```markdown
### CR-001 — Sensei marks attendance for a member via QR, roster + history update

- **Status:** FUNCTIONAL  (PARTIAL caveat: scan needs a real rear-camera phone over HTTPS/localhost)
- **Role(s) & sessions:** Sensei (Session A, normal window — scans on a phone) + Member (Session B, incognito or second device — owns the QR)
- **Solo or 2 testers:** Solo-with-tabs. The member's QR can be opened in Session B and pointed at the sensei's phone camera, or shown on a second device. No simultaneous human action needed.
- **Route(s) / feature:** /dashboard/myClub/[clubID]/scan-attendance ; member QR from /dashboard/myClub/[clubID] overview ; /dashboard/myClub/[clubID]/history
- **Goal:** Prove a QR scan by a teaching role records attendance for the correct member and surfaces it in attendance history.

**Preconditions / setup** (same tester builds all of this):
1. Seeded club exists. Log in as OWNER-PRIMARY (Session A) to confirm the club has >=1 site and >=1 room; if not, create a site then a room.
2. In the same club, confirm one account holds SENSEI and one holds MEMBER. If not, assign on /members (reference OWP-012).
3. Session A: log in as the SENSEI on the real phone (rear camera, HTTPS or localhost).
4. Session B: log in as the MEMBER (incognito, or a second device). Open the member's QR.
5. TIME-SENSITIVE SETUP: If the club requires an active class to accept a scan, create a class on /calendar with start time = now and the room from step 1, immediately before step 3.

**Steps:**
| # | Action | Expected result |
|---|---|---|
| 1 | Session A (sensei phone): open the club, tap "Scan Attendance" | Camera permission prompt; on allow, live rear-camera viewfinder. No "access restricted" block (only secretary is blocked here). |
| 2 | Point camera at the member's QR in Session B | QR detected; success toast names the correct member and marks present. |
| 3 | Scan the same QR again immediately | Duplicate handled gracefully (already-marked / no double count), not a crash. |
| 4 | Session A: open .../history | The scan appears for that member with today's date/session. |
| 5 | Session B (member): open personal progress | Member sees the attendance reflected (if surfaced to member view). |

**Screen-size check:** Scanner is phone-first; viewfinder fills a <640px screen, cancel/close reachable by thumb. History charts stack vertically <640px, side by side >=768px.

**Edge cases to try:**
- Deny camera permission -> clear "camera permission denied" state (in French this is one of the 3 untranslated strings -> English/key fallback; KNOWN-GAP, do not file).
- Scan an invalid / non-member QR -> friendly error, no attendance recorded.
- Secretary attempts the page -> "no permission" block (covered in SEC-042).
- Refresh history mid-load -> re-fetch, no stale empty chart.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone [ ] tablet [ ] desktop
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
```

---

## C. ID & NUMBERING SCHEME

Format: **`PREFIX-NNN`**, zero-padded 3 digits, assigned in document order, never reused. Once a scenario ships, its ID is permanent — bug reports cite it forever.

| Prefix | Owner sheet | Covers |
|---|---|---|
| `OWP-` | role-owner-primary.md | `club_owner_primary` only — full control + primary-exclusive actions |
| `OWS-` | role-owner-secondary.md | `club_owner` co-owner + club-level `admin` |
| `SEN-` | role-sensei.md | `sensei` |
| `SEC-` | role-secretary.md | `secretary` |
| `MEM-` | role-member.md | free-tier `club_member` / `member` |
| `PAR-` | role-parent.md | `parent` household profile |
| `CHD-` | role-child.md | `child` profile |
| `CR-` | cross-role-journeys.md | any flow needing 2+ roles interacting |
| `XC-` | cross-cutting-checks.md | non-functional sweeps (i18n, responsive, PWA, offline, realtime battery) |
| `ONB-` | role sheets (shared block) | onboarding/auth from scratch — placed at the top of the relevant role sheet |

**ONB note:** Onboarding scenarios are authored once as an `ONB-###` block and placed at the top of the relevant role sheet (signup + create-club atop owner-primary; signup + join-club atop member; create-household + create-child atop parent). They keep the `ONB-` prefix so they're greppable, numbered globally/sequentially so two role sheets never collide.

**Block reservations** (room to insert without renumbering): within each role prefix, `-001..-019` happy-path functional, `-020..-039` edge/empty-state, `-040..-059` the "verify you are BLOCKED" access-control battery.

---

## D. PER-ROLE SCENARIO LISTS

"BLOCKED" scenarios assert the access-control matrix from map §3 and reference the exact guard so a tester knows expected = the restricted state, not a bug.

### D1. role-owner-primary.md — `club_owner_primary` (OWP + leading ONB)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| ONB-001 | Sign up from scratch (phased) | Register email/password, phase-2 profile | /register, usePhase2Signup | FUNCTIONAL |
| ONB-002 | Verify email via OTP | Enter OTP, confirm verified; test expiry | /verify-email | FUNCTIONAL |
| ONB-003 | Log in | Credentials -> /dashboard redirect | /login | FUNCTIONAL |
| ONB-004 | Forgot + reset password | Request OTP, reset, log in with new pw | /forgot-password, /reset-password | FUNCTIONAL |
| ONB-005 | Create a club (wizard) | Basic info, discipline, colors -> club created | /dashboard/club/create | FUNCTIONAL |
| OWP-001 | Club overview loads | Banner, stats, members preview, overview analytics | /dashboard/myClub/[clubID] | FUNCTIONAL |
| OWP-002 | Generate QR / share link | Produce join QR + share URL | overview/settings | FUNCTIONAL |
| OWP-003 | Create a site | Add physical site | .../site | FUNCTIONAL |
| OWP-004 | Create a room in a site | Add room (prereq for scheduling) | .../site/[siteId] | FUNCTIONAL |
| OWP-005 | Edit/delete site & room | CRUD on sites/rooms/mats | .../site, .../site/[siteId] | FUNCTIONAL |
| OWP-006 | Create a class (calendar) | One-off class, pick room, real teacher data | .../calendar | FUNCTIONAL |
| OWP-007 | Create a recurring class | Recurring schedule | .../calendar, classApi | FUNCTIONAL |
| OWP-008 | Create exam/workshop/social/tournament | Each calendar event type | .../calendar, ?create=exam | FUNCTIONAL |
| OWP-009 | Edit / cancel / reschedule an event | Mutate existing event | .../calendar | FUNCTIONAL |
| OWP-010 | Approve a join request | Accept pending member | .../members | FUNCTIONAL |
| OWP-011 | Reject a join request | Decline pending member | .../members | FUNCTIONAL |
| OWP-012 | Assign a role to a member | Promote to sensei/secretary/admin/co-owner | .../members | FUNCTIONAL |
| OWP-013 | Create a fee tier | Add membership fee tier | .../members | FUNCTIONAL |
| OWP-014 | Bulk member operations | Bulk operate / remove | .../members | FUNCTIONAL |
| OWP-015 | Process an exit request | Approve/deny member exit | .../members | FUNCTIONAL |
| OWP-016 | Define club belts | Create/edit belt levels | .../belts | FUNCTIONAL |
| OWP-017 | Create + assign curriculum | Build curriculum, assign to members | .../curricula | FUNCTIONAL |
| OWP-018 | View eligible students | List promotion-eligible students | .../eligible-students | FUNCTIONAL |
| OWP-019 | Schedule an exam + grade candidates | Exam list -> grading | .../exams, .../exams/[examID]/grading | FUNCTIONAL |
| OWP-020 | Run promotion workflow | Eligibility -> schedule -> conduct | .../promotions | FUNCTIONAL |
| OWP-021 | Manage teachers (add/revoke sensei) | Primary-only teacher management | .../teachers | FUNCTIONAL |
| OWP-022 | Add / remove a co-owner | Grant/revoke club_owner | .../members | FUNCTIONAL |
| OWP-023 | View analytics tabs | Membership/attendance/content/belts/events/usage | .../analytics | FUNCTIONAL (FinancialTab not reachable) |
| OWP-024 | View attendance + promotion history | History charts | .../history | FUNCTIONAL |
| OWP-025 | View club usage metrics | App-usage stats | .../usage | FUNCTIONAL |
| OWP-026 | Manage club library | Create/edit moves/media/movement types | .../library/manage, .../movement-types | FUNCTIONAL |
| OWP-027 | Manage club warmups | Warmup create/manage/settings | .../library/warmup/manage | FUNCTIONAL |
| OWP-028 | Edit club settings | Club info edits | settings | FUNCTIONAL |
| OWP-029 | Send a club broadcast notification | Broadcast/targeted notification | dashboard announcements / messaging | FUNCTIONAL |
| OWP-030 | Transfer primary ownership | Hand primary to another owner (exclusive) | .../members | FUNCTIONAL |
| OWP-031 | Take room-level attendance | Attendance from a room | .../rooms/[roomId]/attendance | FUNCTIONAL |
| OWP-040 | Empty-state sweep | Brand-new club empty states render cleanly | multiple | FUNCTIONAL |

> Writer note: room class-create teacher picker uses MOCK_TEACHERS (map §8 #7) — PARTIAL, do NOT file; prefer calendar/overview. Call out in OWP-006 and OWP-021.

### D2. role-owner-secondary.md — `club_owner` co-owner + club-level `admin` (OWS)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| OWS-001 | Co-owner sees full management surface | Overview, members, calendar, curricula, belts, exams, analytics, history | multiple | FUNCTIONAL |
| OWS-002 | Co-owner approves/rejects join requests | Same member ops as primary | .../members | FUNCTIONAL |
| OWS-003 | Co-owner assigns roles & fee tiers | Role assign + fee tiers | .../members | FUNCTIONAL |
| OWS-004 | Co-owner manages calendar/classes/exams | Create/grade | .../calendar, .../exams | FUNCTIONAL |
| OWS-005 | Co-owner views analytics & history | isOwnerRole includes club_owner | .../analytics, .../history | FUNCTIONAL |
| OWS-006 | Co-owner uses scan-attendance | Not secretary, so allowed | .../scan-attendance | FUNCTIONAL |
| OWS-007 | admin role: owner-equivalent management | Same as co-owner for member/calendar/curricula | multiple | FUNCTIONAL |
| OWS-040 | BLOCKED: transfer primary ownership | Co-owner/admin cannot transfer primary | .../members | FUNCTIONAL (expected: control absent/denied) |
| OWS-041 | BLOCKED (admin): manage teachers | admin sees "owner only" block | .../teachers | FUNCTIONAL (expected: block) |
| OWS-042 | Co-owner CAN manage teachers | club_owner passes teachers guard | .../teachers | FUNCTIONAL |

### D3. role-sensei.md — `sensei` (SEN)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| SEN-001 | My Club nav visible to sensei | isAnyClubOwner includes sensei | global nav | FUNCTIONAL |
| SEN-002 | Open assigned club overview | View overview | .../[clubID] | FUNCTIONAL |
| SEN-003 | Create/edit a class or workshop | Calendar event creation | .../calendar | FUNCTIONAL |
| SEN-004 | Schedule + grade an exam | Exam allow-list includes sensei | .../exams, .../grading | FUNCTIONAL |
| SEN-005 | Run promotions workflow | sensei permitted | .../promotions | FUNCTIONAL |
| SEN-006 | Manage curricula | Curriculum CRUD/enrollment | .../curricula | FUNCTIONAL |
| SEN-007 | View eligible students | sensei permitted | .../eligible-students | FUNCTIONAL |
| SEN-008 | Manage library content | Add/edit moves/media | .../library/manage | FUNCTIONAL |
| SEN-009 | Scan attendance | sensei allowed (only secretary blocked) | .../scan-attendance | FUNCTIONAL |
| SEN-010 | Take room attendance | Room-level attendance | .../rooms/[roomId]/attendance | FUNCTIONAL |
| SEN-040 | BLOCKED: analytics | sensei excluded by isOwnerRole | .../analytics | FUNCTIONAL (expected: "no permission") |
| SEN-041 | BLOCKED: history | sensei excluded by isOwnerRole | .../history | FUNCTIONAL (expected: access-restricted) |
| SEN-042 | PROBE: can sensei reach Club Settings? | Settings guards userRole==='owner' which includes sensei -> reachable | settings | KNOWN-GAP (map §8 #11 — verify, flag; check backend rejects writes) |
| SEN-043 | BLOCKED: manage teachers | teachers page owner-only | .../teachers | FUNCTIONAL (expected: block) |
| SEN-044 | BLOCKED: transfer/add-remove owner | sensei cannot | .../members | FUNCTIONAL (expected: controls absent/denied) |

> SEN-042 is the single most important RBAC probe: record what sensei CAN change and whether a save succeeds or the backend rejects it.

### D4. role-secretary.md — `secretary` (SEC)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| SEC-001 | My Club nav visible to secretary | isAnyClubOwner includes secretary | global nav | FUNCTIONAL |
| SEC-002 | Manage members (approve/reject/roles) | canManageMembers includes secretary | .../members | FUNCTIONAL |
| SEC-003 | Process exit requests / fee tiers | Member admin ops | .../members | FUNCTIONAL |
| SEC-004 | Manage curricula | Curriculum CRUD | .../curricula | FUNCTIONAL |
| SEC-005 | Edit club belts | Belt definitions edit | .../belts | FUNCTIONAL |
| SEC-006 | View eligible students | Permitted | .../eligible-students | FUNCTIONAL |
| SEC-007 | Create/edit calendar events | Calendar permitted | .../calendar | FUNCTIONAL |
| SEC-040 | BLOCKED: analytics | isOwnerRole excludes secretary | .../analytics | FUNCTIONAL (expected: no permission) |
| SEC-041 | BLOCKED: history | owner-role-only | .../history | FUNCTIONAL (expected: access-restricted) |
| SEC-042 | BLOCKED: scan-attendance | explicit clubRole==='secretary' block | .../scan-attendance | FUNCTIONAL (expected: explicit block) |
| SEC-043 | BLOCKED: Settings tab hidden | Header hides settings for secretary | Header / settings | FUNCTIONAL (expected: tab hidden) |
| SEC-044 | BLOCKED: manage teachers | owner-only | .../teachers | FUNCTIONAL (expected: block) |
| SEC-045 | PROBE: any userRole-only owner control reachable as secretary? | secretary is "owner" in userRole | various | KNOWN-GAP (map §8 #11 — flag any leak) |

### D5. role-member.md — free-tier `club_member` / `member` (MEM + leading ONB)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| ONB-010 | Sign up as a new practitioner | Phased register + verify + login | /register, /verify-email, /login | FUNCTIONAL |
| ONB-011 | Join a club via share/QR link | Apply from a join URL | /join/[clubId]/[[...slug]] | FUNCTIONAL |
| ONB-012 | Discover & request a club in-app | Find a club, request to join | /dashboard/clubs | FUNCTIONAL |
| MEM-001 | Dashboard loads for a plain member | Clubs, activity, usage, announcements cards | /dashboard | FUNCTIONAL |
| MEM-002 | Personal belt reference | Master + club belts | /dashboard/belts | FUNCTIONAL |
| MEM-003 | Personal progression | Belt progress | /progress | FUNCTIONAL |
| MEM-004 | Club-scoped personal progress | Progress within a club | .../[clubID]/progress | FUNCTIONAL |
| MEM-005 | View club overview (member view) | No management controls visible | .../[clubID] | FUNCTIONAL |
| MEM-006 | View club calendar (read-only) | Cannot create events | .../calendar | FUNCTIONAL |
| MEM-007 | View members list (read-only) | Roster visible, no manage controls | .../members | FUNCTIONAL |
| MEM-008 | Browse sites/rooms (read-only) | View physical locations | .../site, room detail | FUNCTIONAL |
| MEM-009 | Global move library + detail | View moves/videos (plain MP4) | /library, /library/[id] | FUNCTIONAL |
| MEM-010 | Global + club warmups | View warmups (no premium gate) | /library/warmup | FUNCTIONAL |
| MEM-011 | Club library view (read-only) | View club moves | .../[clubID]/library | FUNCTIONAL |
| MEM-012 | Notification center + mark read | Receive + mark notifications | /dashboard/notifications | FUNCTIONAL |
| MEM-013 | Messaging: free tier can contact staff | Free user sees/messages staff only | /dashboard/messages | FUNCTIONAL |
| MEM-014 | Submit an exit request | Member-initiated exit | .../members | FUNCTIONAL |
| MEM-015 | Self-enroll / self-unenroll curriculum | Member curriculum self-service | .../members curricula | FUNCTIONAL |
| MEM-016 | Help center + article | Read help | /help, /help/[id] | FUNCTIONAL |
| MEM-017 | Support ticket create + thread | Open ticket, view thread (live) | /support, /support/[id] | FUNCTIONAL |
| MEM-018 | Edit own profile + avatar | Update profile, Cloudinary avatar | /editProfile, /profile | FUNCTIONAL |
| MEM-019 | Account/security/language settings | Change password, language, screen-time view | /settings | FUNCTIONAL (billing display-only) |
| MEM-020 | Forced complete-profile / change-password | Complete the forced flow if triggered | /complete-profile, /change-password | FUNCTIONAL |
| MEM-021 | File a bug / feedback in-app | Bug capture + feedback modal | BugCapture/Feedback | FUNCTIONAL |
| MEM-040 | BLOCKED: messaging a plain member | Free user cannot start DM with non-staff | /dashboard/messages | FUNCTIONAL (expected: cannot initiate) |
| MEM-041 | BLOCKED: analytics/history/settings/teachers/scan | All owner surfaces denied | multiple | FUNCTIONAL (expected: denied/absent) |
| MEM-042 | BLOCKED: create event / manage members | No create/manage controls render | .../calendar, .../members | FUNCTIONAL (expected: controls absent) |
| MEM-043 | NOTE: subscription pane is display-only | Confirm no real checkout; do not file | /settings billing | STUB (map §8 #4) |
| MEM-044 | NOTE: /portal is placeholder | Confirm disabled buttons; do not file | /portal | STUB (map §8 #1) |

> Free tier can reply to staff only if staff messaged first; cannot initiate to a plain member. Encode both.

### D6. role-parent.md — `parent` household profile (PAR + leading ONB)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| ONB-020 | Create a household | New household from scratch | /dashboard/household/create | FUNCTIONAL |
| ONB-021 | Create a child profile (PIN + screen-time) | Add child, set PIN, set daily limit | /dashboard/household | FUNCTIONAL |
| PAR-001 | View household members | List children/members | /dashboard/household | FUNCTIONAL |
| PAR-002 | Set / reset a child's PIN | Manage PIN; strength validation | /dashboard/household | FUNCTIONAL |
| PAR-003 | Set / change a child's screen-time limit | Daily limit in minutes | /dashboard/household | FUNCTIONAL |
| PAR-004 | Switch parent -> child (enter PIN) | Profile switch via Header | Header | FUNCTIONAL |
| PAR-005 | Switch child -> parent (enter PIN) | Return to parent | Header | FUNCTIONAL |
| PAR-006 | PIN lockout escalation | 5 wrong PIN -> 15/30/60-min escalation | Header | FUNCTIONAL |
| PAR-007 | Approve a screen-time extension request | Approve child's request | /dashboard/household, ScreenTimeRequestsModal | FUNCTIONAL |
| PAR-008 | Deny a screen-time extension request | Reject request | ScreenTimeRequestsModal | FUNCTIONAL |
| PAR-009 | Open child profile detail | View child detail page | /dashboard/household/child/[childId] | FUNCTIONAL |
| PAR-010 | Parent uses full standard surface | Messaging, support, clubs, profile available | (reference MEM scenarios) | FUNCTIONAL |
| PAR-040 | Edge: mismatched child PIN on creation | PIN-mismatch validation blocks create | /dashboard/household | FUNCTIONAL |
| PAR-041 | Edge: very low screen-time limit | Set tiny limit for quick lock (setup for CR-010) | /dashboard/household | FUNCTIONAL |

### D7. role-child.md — `child` profile (CHD)

| ID | Title | Scope | Route(s)/feature | Status |
|---|---|---|---|---|
| CHD-001 | Child nav is restricted | No Messages/Support/My Club/Profile/Discover | BottomNavigation/DesktopSidebar | FUNCTIONAL |
| CHD-002 | Child can use library + progress | Library/progress reachable | /library, /progress, /dashboard/belts | FUNCTIONAL |
| CHD-003 | Screen-time countdown visible | Remaining time shows | screen-time UI | FUNCTIONAL |
| CHD-004 | Hit limit -> lock screen appears | Exhaust time -> lock | screenTimeLock.ts | FUNCTIONAL |
| CHD-005 | Lock survives reload | Reload -> still locked | screenTimeLock | FUNCTIONAL |
| CHD-006 | Child requests a screen-time extension | Submit request (feeds PAR-007) | screen-time request | FUNCTIONAL |
| CHD-007 | Switch back to parent requires PIN | Exit child mode via PIN | Header | FUNCTIONAL |
| CHD-040 | VERIFY (not a bug): deep-link to Messages/Support/child-detail | Child can reach via URL client-side; confirm backend rejects writes | multiple | KNOWN-GAP (map §8 #10) |
| CHD-041 | VERIFY: clearing localStorage does not bypass lock | Lock is server-authoritative | screenTimeLock | KNOWN-GAP (expected: still locked) |

---

## E. CROSS-ROLE INTERACTION JOURNEYS (`cross-role-journeys.md`)

One tester per journey owns every role via sessions. Session A = normal window, Session B = incognito (one incognito identity at a time), Session C = second browser or separate Chrome profile. Realtime journeys carry "2 testers recommended" + a solo fallback.

| ID | Title | Actors & sessions | Dependency chain | Timing setup | Solo or 2 testers | Features |
|---|---|---|---|---|---|---|
| CR-001 | Attendance: sensei scans -> roster -> history | Sensei (A, phone) + Member QR (B) | room -> class-now -> scan -> history | class start = now before scanning | Solo-with-tabs | scan-attendance, calendar, history, room attendance |
| CR-002 | Join -> approve | Member (B) + Owner-primary (A) | apply via /join -> owner approves -> in roster | none | Solo-with-tabs | /join, members approve, dashboard card |
| CR-003 | Join -> reject path | Member (B) + Owner (A) | apply -> owner rejects -> not-approved state | none | Solo-with-tabs | /join, members reject |
| CR-004 | Role assignment takes effect | Owner (A) assigns sensei to Member (B) | assign -> member refreshes -> teaching surface appears | member must refresh to re-resolve role | Solo-with-tabs | role-assign, layout role resolution, nav |
| CR-005 | Co-owner grant + primary boundary | Owner-primary (A) + target (B) | add co-owner -> co-owner gains surface -> cannot transfer primary | none | Solo-with-tabs | add owner, co-owner surface, primary guard |
| CR-006 | Ownership transfer | Owner-primary (A) + Owner (B) | transfer primary -> B primary, A demoted -> A loses primary controls | none | Solo-with-tabs | transferPrimaryOwnership, re-resolution |
| CR-007 | Live DM (realtime) | Two accounts sharing a club (A + B) | A sends -> B list + thread update without refresh; typing auto-clears ~3s | none | 2 testers recommended. Solo fallback: A normal + B incognito side by side | messaging socket |
| CR-008 | Live notification broadcast -> bell | Owner (A) + Member (B) | broadcast -> member bell updates live -> appears in /notifications | none | 2 testers recommended. Solo fallback as above | clubApi notifications, GlobalSocketProvider |
| CR-009 | Free-tier messaging gate | Free member (A) + Staff (B) + plain member (C) | free CAN contact staff B; CANNOT initiate to plain member C; reply to B only if B first | none | Solo: A normal, B incognito; C needs 2nd browser/profile | messaging free-tier gate |
| CR-010 | Screen-time request -> parent approves | Parent (A) + own Child (PIN switch) | low limit -> child hits limit -> requests -> parent approves -> time restored | low daily limit before switching to child | Solo (one account, profile switch) | household, screen-time lock + requests |
| CR-011 | Exit request -> owner processes | Member (B) + Owner (A) | member submits exit -> owner sees -> approves/denies -> status updates | none | Solo-with-tabs | submitExitRequest, processExitRequest |
| CR-012 | Invite/add member -> appears | Owner (A) adds member + invited account (B) | owner adds/invites -> account logs in -> sees membership | none | Solo-with-tabs | addClubMember, onboarding into club |
| CR-013 | Curriculum assign -> student sees it | Owner/sensei (A) + Member (B) | assign curriculum -> B sees on progress -> B may self-unenroll | none | Solo-with-tabs | assignMemberCurriculum, member view |
| CR-014 | Exam grade -> promotion reflects | Owner/sensei (A) + candidate Member (B) | schedule exam -> grade B -> belt/promotion + history reflect | exam scheduled before grading | Solo-with-tabs | exams, grading, promotions, history |
| CR-015 | Eligibility pipeline | Owner/sensei (A) + Member (B) | B accrues attendance + curriculum -> eligible-students -> schedule promotion | prior attendance (use CR-001) | Solo-with-tabs | eligible-students, attendance->eligibility |
| CR-016 | Support ticket live thread | Member (B) + staff/owner (A) | B opens ticket -> A replies -> B thread updates live | none | 2 testers recommended. Solo fallback as above | support socket |
| CR-017 | Secretary boundary in a shared club | Secretary (A) + Owner (B) | secretary manages members/curricula/belts BUT blocked from analytics/history/scan/settings | none | Solo-with-tabs | full secretary access matrix |
| CR-018 | Sensei boundary + settings probe | Sensei (A) + Owner (B) | sensei teaches BUT blocked from analytics/history; PROBE settings reach + save | none | Solo-with-tabs | full sensei access matrix, §8 #11 |

---

## F. COVERAGE MATRIX

### Routes (§2)

| Route | Status | Covered by |
|---|---|---|
| `/`, `/privacy`, `/terms` | FUNCTIONAL | XC-008 (static/i18n) |
| `/login` | FUNCTIONAL | ONB-003 |
| `/register` | FUNCTIONAL | ONB-001, ONB-010 |
| `/forgot-password`, `/reset-password` | FUNCTIONAL | ONB-004 |
| `/verify-email` | FUNCTIONAL | ONB-002 |
| `/join/[clubId]/[[...slug]]` | FUNCTIONAL | ONB-011, CR-002, CR-003 |
| `/portal` | STUB | MEM-044 |
| `/dashboard` | FUNCTIONAL | OWP-001, MEM-001 |
| `/dashboard/belts` | FUNCTIONAL | MEM-002 |
| `/dashboard/clubs` | FUNCTIONAL | ONB-012 |
| `/dashboard/notifications` | FUNCTIONAL | MEM-012, CR-008 |
| `/dashboard/messages` | FUNCTIONAL | MEM-013, MEM-040, CR-007, CR-009 |
| `/dashboard/club/create` | FUNCTIONAL | ONB-005 |
| `/dashboard/household` | FUNCTIONAL | PAR-001..009, CR-010 |
| `/dashboard/household/create` | FUNCTIONAL | ONB-020 |
| `/dashboard/household/child/[childId]` | FUNCTIONAL | PAR-009, CHD-040 |
| `/dashboard/admin/help` | wired, no guard | EXCLUDED (no admin experience) |
| `/complete-profile` | FUNCTIONAL | MEM-020 |
| `/change-password` | FUNCTIONAL | MEM-020, ONB-004 |
| `/editProfile`, `/profile` | FUNCTIONAL | MEM-018 |
| `/settings` | FUNCTIONAL | MEM-019, MEM-043, SEN-042, SEC-043 |
| `/progress` | FUNCTIONAL | MEM-003 |
| `/library`, `/library/[id]` | FUNCTIONAL | MEM-009 |
| `/library/warmup` | FUNCTIONAL | MEM-010 |
| `/help`, `/help/[id]` | FUNCTIONAL | MEM-016 |
| `/support`, `/support/[id]` | FUNCTIONAL | MEM-017, CR-016 |
| `/messages`, `.../[clubID]/messages` | STUB redirect | XC-009 |
| `/dashboard/myClub` | FUNCTIONAL | OWP-001, MEM-005 |
| `.../[clubID]` overview | FUNCTIONAL | OWP-001, OWP-002, MEM-005 |
| `.../[clubID]/calendar` | FUNCTIONAL | OWP-006..009, SEN-003, SEC-007, MEM-006, CR-014 |
| `.../[clubID]/members` | FUNCTIONAL | OWP-010..015,022,030, SEC-002/003, MEM-007/014/015, CR-002..006/011/012/013 |
| `.../[clubID]/history` | FUNCTIONAL | OWP-024, SEN-041, SEC-041, MEM-041, CR-001 |
| `.../[clubID]/analytics` | FUNCTIONAL | OWP-023, SEN-040, SEC-040, MEM-041 |
| `.../[clubID]/promotions` | FUNCTIONAL | OWP-020, SEN-005, CR-014, CR-015 |
| `.../[clubID]/exams` (+grading) | FUNCTIONAL | OWP-019, SEN-004, CR-014 |
| `.../[clubID]/belts` | FUNCTIONAL | OWP-016, SEC-005 |
| `.../[clubID]/curricula` | FUNCTIONAL | OWP-017, SEN-006, SEC-004, CR-013 |
| `.../[clubID]/eligible-students` | FUNCTIONAL | OWP-018, SEN-007, SEC-006, CR-015 |
| `.../[clubID]/teachers` | FUNCTIONAL | OWP-021, OWS-041/042, SEN-043, SEC-044 |
| `.../[clubID]/scan-attendance` | FUNCTIONAL | SEN-009, SEC-042, OWS-006, CR-001 |
| `.../[clubID]/site` (+detail,+calendar) | FUNCTIONAL | OWP-003/004/005, MEM-008 |
| `.../rooms/[roomId]` | PARTIAL | OWP-031, MEM-008 (mock-teacher caveat) |
| `.../rooms/[roomId]/attendance` | FUNCTIONAL | OWP-031, SEN-010 |
| `.../[clubID]/progress` | FUNCTIONAL | MEM-004 |
| `.../[clubID]/usage` | FUNCTIONAL | OWP-025 |
| `.../[clubID]/library` (+manage) | FUNCTIONAL | OWP-026, SEN-008, MEM-011 |
| `.../[clubID]/library/warmup` (+manage/settings) | FUNCTIONAL | OWP-027, MEM-010 |

### Features (§4) — all covered

Clubs (ONB-005, OWP-001/028, ONB-012); Calendar/events (OWP-006..009, SEN-003, CR-014); Recurring classes (OWP-007); Members/invites/roles/fee/exit (OWP-010..015/022/030, CR-002..006/011/012); Household/PIN/screen-time (ONB-020/021, PAR-*, CHD-*, CR-010); Library/Moves/Video (MEM-009/011, OWP-026); Warmups (MEM-010, OWP-027); Belts/Curriculum/Promotions (OWP-016..020, CR-013/014/015); QR attendance (CR-001, SEN-009/010, OWP-031); Analytics (OWP-023 + blocked battery); Site builder (OWP-003/004/005); Messaging free-tier gate (MEM-013/040, CR-007/009); Notifications (OWP-029, MEM-012, CR-008); Settings/Profile (MEM-018/019); Onboarding (ONB-*); Join (ONB-011, CR-002/003); Bug capture (MEM-021); Realtime battery (XC-005 + CR-007/008/016).

### Intentionally EXCLUDED (map §8 — do NOT file)

| Excluded | Reason |
|---|---|
| /portal dead buttons | Placeholder, all disabled (§8 #1) — MEM-044 verifies only |
| HLS / .m3u8 / adaptive bitrate | useHlsPlayer dormant, plain MP4 playback (§8 #2) |
| Offline data reads / IndexedDB | idb unused; only SW asset cache (§8 #3) — XC-006 tests asset cache only |
| Subscription checkout / upgrade | Billing pane is a mock form (§8 #4) |
| "Free user sees premium content" as a bug | Tier gating cosmetic except messaging (§8 #5/#6) |
| Mock teacher names in room class-create modal | MOCK_TEACHERS (§8 #7) — use calendar/overview |
| Analytics FinancialTab | Disabled/mock, not reachable (§8 #7) |
| Admin/support dashboard incl. /dashboard/admin/help access | No admin UI / no isAdmin guard (§8 #8) |
| Newsletter / marketing site-builder | No route/API (§8 #9) |
| Child deep-link reachability | Nav-only restriction is current intended client behavior (§8 #10) — CHD-040 verifies backend instead |
| /login?session=expired bounce | Expected refresh-fail redirect (§8 #14) |
| Seeded demo calendar events array | Real calendar uses live query (§8 #13). Exception: if the Feb-2026 demo titles DO appear on the real calendar, file it — note in OWP-006 |

---

## G. WRITER-FLEET WORK BREAKDOWN

One agent per file, ~11 parallel agents.

| Agent | Owns | Notes |
|---|---|---|
| A1 | role-owner-primary.md (OWP + ONB-001..005) | Largest (~38 scenarios); produces seed data others reference |
| A2 | role-owner-secondary.md (OWS) | Smaller; reuse A1 vocabulary, don't re-describe |
| A3 | role-sensei.md (SEN) | Nail analytics/history BLOCKED + SEN-042 settings probe (KNOWN-GAP) |
| A4 | role-secretary.md (SEC) | Blocked battery; scan explicit-block differs |
| A5 | role-member.md (MEM + ONB-010..012) | Biggest BLOCKED battery; free-tier gate |
| A6 | role-parent.md (PAR + ONB-020..021) | PIN/screen-time/lockout detail; references MEM |
| A7 | role-child.md (CHD) | Short; KNOWN-GAP "verify, don't file" framing |
| A8 | cross-role-journeys.md (CR-001..018) | Strongest writer; multi-session primer + solo fallbacks |
| A9 | cross-cutting-checks.md (XC) | French sweep, 768px battery, PWA, SW offline, socket battery, real-phone list |
| A10 | 00-start-here.md + bug-log.md | Authors primers/matrices FIRST so others link to them |

**Shared conventions every writer MUST follow:**
1. Template = §B verbatim (field order, steps table with per-step expected, screen-size line, edge cases, result-capture with EN/FR + 3 size checkboxes).
2. IDs = §C prefixes + block reservations; never reuse; ONB ids globally sequential.
3. Status tags exactly as assigned; PARTIAL/KNOWN-GAP must state the expected (restricted/mock) result.
4. Environment-agnostic; never hardcode a URL.
5. Multi-session primer: link START-HERE, don't re-explain per scenario.
6. Time-sensitive setup written as an explicit step the same tester performs immediately before the dependent step.
7. Keep the §F exclusions handy; add inline "Expected — known limitation, do not file" where a scenario brushes a trap.
8. Tone = plain, simple English for a non-technical tester; one action per step, one expected result per step; no internal jargon in tester-facing steps.
9. Cross-reference other scenarios by ID instead of duplicating setup.
