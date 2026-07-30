# Cross-Role Interaction Journeys - Manual QA

**Read `00-start-here.md` first (especially §4 on running two roles at once).**

Each journey below needs two or more roles interacting (a member scans a class QR to check in, an owner approves a member, one person chats and another receives). Every journey is owned by **ONE** tester who plays **every** role across separate browser sessions. You do not need a second person for most of these. The journey tells you exactly which session does each step, and each step has its own expected result.

**Session shorthand** (from START-HERE §4): **Session A** = your normal Chrome window (role 1). **Session B** = an Incognito window (role 2). **Session C** = a second browser (Firefox/Edge) or a second Chrome profile (role 3, only when a journey needs a third identity, because all Incognito windows share one login).

Three journeys are realtime (live chat, live notification, live support thread). Those are tagged **2 testers recommended** and also carry a spelled-out **SOLO fallback** using one normal window plus one Incognito window placed side by side so you can watch one update while you act in the other.

---

## Index - CR-001 to CR-019

| ID | Title | Sessions | Solo / 2 testers |
|---|---|---|---|
| [CR-001](#cr-001--attendance-member-scans-the-class-qr-self-register--history-update) | Attendance: member scans the class QR → history | A (staff, shows class QR) + B (member, phone) | Solo-with-tabs |
| [CR-002](#cr-002--join-request--owner-approves--member-in-roster) | Join request → owner approves → member in roster | B (member) + A (owner) | Solo-with-tabs |
| [CR-003](#cr-003--join-request--owner-rejects--not-approved-state) | Join request → owner rejects → not-approved state | B (member) + A (owner) | Solo-with-tabs |
| [CR-004](#cr-004--role-assignment-takes-effect-after-the-member-refreshes) | Role assignment takes effect | A (owner) + B (member→sensei) | Solo-with-tabs |
| [CR-005](#cr-005--co-owner-grant--co-owner-surface--primary-only-boundary) | Co-owner grant + primary boundary | A (primary) + B (co-owner) | Solo-with-tabs |
| [CR-006](#cr-006--ownership-transfer-primary-hands-off-and-is-demoted) | Ownership transfer | A (primary) + B (owner) | Solo-with-tabs |
| [CR-007](#cr-007--live-dm-realtime) | Live DM (realtime) | A + B (shared club) | **2 testers recommended** (solo fallback) |
| [CR-008](#cr-008--live-notification-broadcast--members-bell-realtime) | Live notification broadcast → bell | A (owner) + B (member) | **2 testers recommended** (solo fallback) |
| [CR-009](#cr-009--free-tier-messaging-gate-three-identities) | Free-tier messaging gate (3 identities) | A (free) + B (staff) + C (plain member) | Solo: A normal, B incognito, C 2nd browser/profile |
| [CR-010](#cr-010--screen-time-request--parent-approves-one-account-profile-switch) | Screen-time request → parent approves | A (parent ↔ own child via PIN) | Solo (one account, profile switch) |
| [CR-011](#cr-011--exit-request--owner-processes) | Exit request → owner processes | B (member) + A (owner) | Solo-with-tabs |
| [CR-012](#cr-012--inviteadd-member--account-sees-membership) | Invite/add member → appears | A (owner) + B (added account) | Solo-with-tabs |
| [CR-013](#cr-013--curriculum-assign--student-sees-it--self-unenroll) | Curriculum assign → student sees it | A (owner/sensei) + B (member) | Solo-with-tabs |
| [CR-014](#cr-014--exam-grade--belt-promotion--history-reflect) | Exam grade → promotion reflects | A (owner/sensei) + B (candidate) | Solo-with-tabs |
| [CR-015](#cr-015--eligibility-pipeline-attendance--curriculum--eligible--schedule-promotion) | Eligibility pipeline | A (owner/sensei) + B (member) | Solo-with-tabs |
| [CR-016](#cr-016--support-ticket-live-thread) | Support ticket live thread | B (member, user app) + A (admin, admin panel) | **2 testers recommended** (solo fallback) |
| [CR-017](#cr-017--secretary-boundary-in-a-shared-club) | Secretary boundary in a shared club | A (secretary) + B (owner) | Solo-with-tabs |
| [CR-018](#cr-018--sensei-boundary--settings-probe-known-gap) | Sensei boundary + settings probe | A (sensei) + B (owner) | Solo-with-tabs |
| [CR-019](#cr-019--group-chat-staff-creates-a-member-participates) | Group chat: staff creates, a member participates | A (staff) + B (member) | Solo-with-tabs |

---

### CR-001 - Attendance: member scans the class QR (self-register), history update

- **Status:** FUNCTIONAL  (PARTIAL caveat: the scan step needs a real rear-camera phone over HTTPS/localhost.)
- **Role(s) & sessions:** Staff who shows the class QR - owner, sensei, or a class teacher (Session A, normal window, displays the QR on screen) + Member who scans it (Session B, a real phone with a rear camera - this is the person whose attendance gets recorded).
- **Solo or 2 testers:** Solo-with-tabs. Session A displays the class QR on the desktop screen; you point the member's phone (Session B) at that screen and scan. No two humans acting at once.
- **Route(s) / feature:** Staff: club → Calendar → today's class → Mark Attendance (the room attendance page) → **Show QR**. Member: club → Scan Attendance (the phone scanner). Owner: club → History.
- **Goal:** Prove a member who scans the class QR records their own attendance for that class, and it shows up in attendance history.
- **Direction note:** This app uses self-registration. The MEMBER scans a per-CLASS QR to check themselves in (a parent can also check in their children from the same scanner). Staff do NOT scan a member's personal QR here. Because it is self-registration, the class-day timing window applies (see setup step 5).

**Preconditions / setup** (the same tester builds all of this):
1. Seeded club exists. Log in as OWNER-PRIMARY (Session A) and confirm the club has at least one site and at least one room. If not, create a site then a room.
2. In the same club, confirm one account holds Member. The QR-shower (Session A) can be the owner, a sensei, or any account set as a teacher on that specific class. A secretary CANNOT generate the class QR, so do not use a secretary for Session A.
3. Session A: log in as the QR-shower (owner / sensei / class teacher) on a normal desktop window.
4. Session B: log in as the MEMBER on a **real phone** (rear camera, opened over HTTPS or localhost).
5. TIME-SENSITIVE SETUP (required, not optional): self-registration is allowed only on the class's own calendar day. As Session A, open the Calendar and **create the class dated TODAY**, in the room from step 1, before the steps below. The window is anchored on the class DATE, not its clock start/end time, so any class dated today works all day; a class dated yesterday or tomorrow will be rejected on scan. You also cannot generate a QR for a class whose date is already in the past.

**Steps** (each step = one action + its own expected result):
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (staff): open the Calendar, open today's class, click **Mark Attendance**, then on the room attendance page click **Show QR** (or the QR-code button). | A QR code for that class appears on screen. No error. (If Session A is a secretary, the Scan Attendance page is blocked and the QR button is not available - that is why Session A must be owner / sensei / class teacher.) |
| 2 | **Session B** (member, phone): open the club → **Scan Attendance** and tap **Start Scanning**. | A camera-permission prompt appears; after you allow it, a live rear-camera viewfinder fills the frame with a square target outline. No "Access Restricted" block (only the secretary is blocked here). |
| 3 | **Session B**: point the phone camera at the class QR shown in **Session A**. | The QR is detected; a green success screen reads "Attendance Marked" and names the class. No crash, no frozen camera. |
| 4 | **Session B**: tap **Done**, start scanning again, and scan the **same** class QR a second time right away. | The repeat scan is handled gracefully (already-marked / no double count or a friendly message), not a crash or a stuck spinner. Duplicate attendance for the same class is blocked. |
| 5 | **Session A** (or switch to owner): open the club → **History**. | Today's scan appears for that member with today's date / session. The attendance chart is not stuck empty. |
| 6 | **Session B** (member): open the member's own progress within the club. | If member-facing progress surfaces attendance, the new visit is reflected there. |

**Screen-size check:** The scanner is phone-first; on a <640px screen the viewfinder fills the width and the Stop / Cancel buttons are reachable by thumb. History charts stack vertically under 640px and sit side by side at 768px and up.

**Edge cases to try:**
- Deny camera permission → a clear "camera permission denied" message. (In French this is one of 3 untranslated strings → it shows in English; KNOWN-GAP, do not file.)
- Scan a QR that is not a valid attendance code (any random QR) → a friendly "invalid or expired QR code" message, no attendance recorded.
- Scan a class QR for a class dated **tomorrow** (build a class dated tomorrow, generate its QR today, then scan it today) → the scan is rejected with a "you can only register attendance on the class day" message, no attendance recorded. (Exception: if the scanning member is themselves a teacher of that class, the day limit does not apply - record that if you test it.)
- Try to generate a QR for a class dated **yesterday** (a past class) → the QR cannot be generated at all ("cannot generate QR code for a past class"); there is nothing to scan.
- Scan with a member whose belt is outside the class's allowed belt range → the scan is rejected as belt-ineligible, no attendance recorded.
- Have the SECRETARY open the Scan Attendance page → a red "Access Restricted - you don't have permission to access scan attendance" block (covered in SEC-042 / CR-017).
- Refresh the History page mid-load → it re-fetches; no stale empty chart.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Â§9):

---

### CR-002 - Join request → owner approves → member in roster

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** New/plain member (Session B, incognito) + Owner-primary or staff who can manage members (Session A, normal window).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Member: the club's join link (`/join/...`). Owner: club → Members → Pending tab. Also the Dashboard "Club Announcements" card shows a pending preview.
- **Goal:** Prove a person who requests to join via the share link shows up as Pending and, once approved, becomes a roster member with a belt.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club. On the club overview (or Settings), generate / copy the club's **share link or QR**. (If the club has no belts yet, define at least one belt first - approval asks you to pick a belt; see OWP-016.)
2. Session B (incognito): log in as a member account that is **not** already in this club. Paste the club's join link into Session B's address bar.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session B**: open the pasted join link. | A "Join [Club Name]" card appears with a terms checkbox and a **Join Club** button. (If Session B were logged out, it would show a "Please log in or sign up to join" card instead.) |
| 2 | **Session B**: tick the terms checkbox, then click **Join Club**. | A green "Request Submitted!" screen confirms the request to join went in and says club staff will review it. |
| 3 | **Session A**: open the club → **Members** → **Pending** tab (or click the pending-request card on the Dashboard). | The new applicant appears in the Pending list with their name and the belt they requested. |
| 4 | **Session A**: on that pending request, click **Approve**. | A belt-assignment dialog opens, pre-selecting the belt the applicant chose; you can confirm or change it. |
| 5 | **Session A**: confirm the belt in the dialog. | A success toast names the member as approved; they move out of Pending into the main **Members** roster. Look at their status label in the roster: a member who has not yet logged into the app shows "Invited" (a distinct status, not "Active"). |
| 6 | **Session B**: reload the dashboard / open the club, then log in properly if you have not already | The member sees they belong to the club (club appears in their list, not pending). |
| 7 | **Session A**: reload the Members roster after Session B has logged in at least once | The same member's status label should now switch from "Invited" to "Active". |

**Screen-size check:** The join card is a single centered panel that fits a phone width. On Members, the Pending tab and its Approve / Reject buttons stay reachable on a phone; the roster switches to a wider layout at 768px+.

**Edge cases to try:**
- **Session B** clicks Join Club without ticking the box → a "please agree to the terms" toast; nothing submitted.
- **Session B** submits a second time while already pending → an "Unable to Join" message (e.g. already has a pending request), not a duplicate.
- **Session A** approves when the club has no belts defined → a "no belts available" message; define a belt first (do not file as a crash).
- **Session A** refreshes the Pending tab after approving → the approved person is gone from Pending.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-003 - Join request → owner rejects → not-approved state

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Plain member (Session B, incognito) + Owner / member-manager (Session A, normal window).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Member: the club's join link. Owner: club → Members → Pending tab.
- **Goal:** Prove a staff member can reject a pending request and the applicant does NOT end up in the roster.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club and have the club's share link ready.
2. Session B (incognito): log in as a member account that is **not** in this club (you can reuse the email-plus-trick to create a fresh applicant, see START-HERE §3).

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session B**: open the join link, tick terms, click **Join Club**. | "Request Submitted!" screen confirms the request. |
| 2 | **Session A**: open club → **Members** → **Pending** tab. | The applicant appears in Pending. |
| 3 | **Session A**: on that request, click **Reject**. | A success toast confirms the request was rejected; the applicant disappears from the Pending list. |
| 4 | **Session A**: open the main **Members** roster. | The rejected applicant is NOT in the roster. |
| 5 | **Session B**: reload the dashboard / open the club list. | The applicant is not a member of the club (no membership granted). |

**Screen-size check:** The Reject button sits next to Approve on each pending card and stays tappable on a phone width.

**Edge cases to try:**
- **Session A** rejects, then the **Session B** applicant opens the join link again → they can submit a fresh request (rejection is not a permanent block), unless your club blocks re-requests - record what happens.
- Reject while the Pending list is still loading more entries → the rejected one still leaves the list cleanly.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-004 - Role assignment takes effect after the member refreshes

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner / member-manager (Session A, normal window) + the member being promoted (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Owner: club → Members → member detail → Assign Role. Member: global navigation + the club's teaching surface (Calendar / Exams).
- **Goal:** Prove that promoting a plain member to Sensei changes what that member can see and do, once they refresh so their role re-resolves.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club.
2. Session B (incognito): log in as a **plain member** of the same club. Note that "My Club" management tabs are NOT available to them yet and they cannot create calendar events.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Members**, open that member, click **Assign Role**. | A role panel opens with a **Select Role** dropdown. |
| 2 | **Session A**: choose **Sensei**, then click the confirm / save button. | A success toast confirms the role change. (Note: assigning Sensei may require the member to hold a Dan-rank belt; if blocked for that reason, set the belt first - not a bug.) |
| 3 | **Session B**: WITHOUT refreshing yet, look at the member's view. | Their view may still look like a plain member - role is resolved at load time, so the change is not guaranteed to appear live. |
| 4 | **Session B**: now **reload** the app (or navigate into the club fresh). | The member now sees the teaching surface for that club: they can open the club's management area, and the **Calendar** lets them create a class / event. |
| 5 | **Session B**: open the **Calendar** and start creating a class. | The create-event controls are present and usable (sensei is allowed to create calendar events). |

**Screen-size check:** On a phone, the newly available club tabs appear in the bottom menu; at 768px+ they appear in the side menu. Confirm nothing overflows when the extra tabs appear.

**Edge cases to try:**
- Assign Sensei to a member without a Dan-rank belt → the app explains a Dan belt is required (do not file as a crash); assign a qualifying belt, then retry.
- After promotion, **Session B** still should NOT see Analytics or History (sensei is blocked from those - see CR-018). Confirm those stay blocked.
- Promote, then in **Session A** change the role back to Club Member; **Session B** refreshes → teaching surface disappears again.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-005 - Co-owner grant → co-owner surface → primary-only boundary

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner-primary (Session A, normal window) + the member being promoted to co-owner (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Owner: club → Members → member detail → Assign Role (Club Owner). Co-owner: full management surface + the Members page (transfer-primary control).
- **Goal:** Prove a primary owner can add a co-owner, the co-owner gains the management surface, but the co-owner CANNOT transfer primary ownership.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club.
2. Session B (incognito): log in as a member of the same club who will become the co-owner.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Members**, open the target member, click **Assign Role**, choose **Club Owner**, save. | A success toast confirms the role change to co-owner. |
| 2 | **Session B**: reload and open the club. | The co-owner now sees the full management surface (Members, Calendar, Curricula, Belts, Exams, plus Analytics and History - co-owners get those). |
| 3 | **Session B**: open the club → **Analytics**. | Analytics loads for the co-owner (co-owner counts as a full owner for analytics). |
| 4 | **Session B**: open **Members** and open another member's detail; look for a way to make someone the **Primary Owner** / transfer primary ownership. | There is NO "Primary Owner" option / transfer-primary control for the co-owner. Only the primary owner can transfer primary ownership. Record exactly what the co-owner sees in that dropdown. |
| 5 | **Session A** (primary): open the same member detail → Assign Role dropdown. | The primary owner DOES see the **Primary Owner** option (the transfer path), confirming it is primary-only. |

**Screen-size check:** Analytics tabs and charts stack on a phone and spread out at 768px+. The role dropdown is a full-width control on a phone.

**Edge cases to try:**
- **Session A** then removes the co-owner (primary owner viewing a co-owner sees a **Remove Admin** button - the label still reads "Admin," but the role being removed is co-owner / `club_owner`) → confirmation dialog → the co-owner is demoted back to a plain member; **Session B** refreshes and loses the owner surface. Note: only the primary owner can add or remove a co-owner; a co-owner cannot.
- Confirm the co-owner CAN open the Teachers (sensei management) page - a co-owner (`club_owner`) is treated as a full owner for club management. (There is no separate club-level "admin" role; the only owner roles are primary owner and co-owner.)

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-006 - Ownership transfer: primary hands off and is demoted

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner-primary (Session A, normal window) + the co-owner who will receive primary (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Members → member detail → Assign Role → Primary Owner (transfer). Note: after transferring, the OLD primary is logged out and sent to the login screen.
- **Goal:** Prove the primary owner (and only the primary owner) can transfer primary ownership; the receiver becomes primary and the old primary loses primary-only powers and is logged out.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club.
2. Session B (incognito): log in as an existing **co-owner** (`club_owner`) of the same club (use CR-005 to create one first if needed).
3. Heads-up: this changes the club permanently. Use a throwaway test club, or be ready to transfer it back afterward.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Members**, open the co-owner's detail, click **Assign Role**. | The role panel opens with the dropdown, including the **Primary Owner** option (visible because you are the primary). |
| 2 | **Session A**: choose **Primary Owner** and confirm. (A confirm dialog about transferring primary ownership may appear - confirm it.) | A success toast says primary ownership was transferred to that member. Within about a second, **Session A is logged out and lands on the login screen** - on transfer, the old primary's login is deliberately revoked so the demoted account cannot keep acting with stale primary privileges. |
| 3 | **Session A**: log back in with the same account and reopen the club. | The account is now a regular co-owner, NOT the primary: the **Primary Owner / transfer** option is gone, and adding or removing co-owners and transferring primary are no longer offered - confirm primary-only powers are gone. (A co-owner cannot transfer primary or add a co-owner; only the primary can.) |
| 4 | **Session B**: reload and open the club → **Members**. | This account is now the **primary owner**: opening another member's Assign Role dropdown now shows the **Primary Owner** transfer option. |
| 5 | **Session B**: optionally transfer primary back to the original account to restore the club. | Transfer succeeds; Session B is then logged out and sent to login (same demotion behavior). |

**Screen-size check:** The role dropdown and confirm dialog are full-width on a phone; the forced login screen after transfer is the standard responsive login.

**Edge cases to try:**
- Try to transfer primary to a plain **member** (not a co-owner) → record whether the dropdown even offers Primary Owner for a non-owner, and whether the transfer is allowed.
- After the forced logout in step 2, confirm the old primary truly cannot reach a primary-only control even by typing the Members URL directly.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-007 - Live DM (realtime)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Two accounts that share a club (Session A + Session B). At least one of them should be staff so they are allowed to message freely (or make both premium) - otherwise the free-tier gate in CR-009 applies.
- **Solo or 2 testers:** **2 testers recommended** (two people, two devices, messaging each other). **SOLO fallback:** open the app in a **normal window (Session A)** and an **Incognito window (Session B)** and place them **side by side on one screen**, logged into the two accounts. You type in one and watch the other update without touching it.
- **Route(s) / feature:** Messages (`/dashboard/messages`) in both sessions.
- **Goal:** Prove a direct message sent from one person appears in the other person's conversation list and open thread **without refreshing**, and that the typing indicator shows and then clears on its own.

**Preconditions / setup:**
1. Both accounts belong to the **same club**, and the pair is allowed to message (one is staff, or both are premium). If unsure, use the seeded Owner and a Member.
2. Session A (normal): log in as account 1, open **Messages**.
3. Session B (incognito): log in as account 2, open **Messages**.
4. Place the two windows side by side so you can watch both at once.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: start a new conversation with account 2 (New Message → pick the contact) and send a short message. | The message sends and appears in Session A's thread immediately. |
| 2 | **Session B**: do NOT refresh - just watch the Messages screen. | Within a moment, the conversation list in Session B updates on its own: the new conversation / latest message appears with an unread marker, no manual refresh. "Updates live" = the list row changes by itself. |
| 3 | **Session B**: click into that conversation and start **typing** in the reply box (do not send yet). | Session B's typing is emitted live. |
| 4 | **Session A**: watch the open thread. | A "typing…" indicator appears for account 2, then **clears on its own after about 3 seconds** of no typing. |
| 5 | **Session B**: send a reply. | Session A's open thread shows the reply appear **without refreshing**; the unread badge in Session A's header / list updates too. |
| 6 | **Session A**: edit, then delete one of your own sent messages. | Session B's thread reflects the edit and the deletion live (the edited text changes; the deleted message is removed) without a manual refresh. |
| 7 | **Session A**: turn on the "urgent" (red bell) toggle in the composer and send a message. | It sends normally. If Session B's app is foregrounded, Session B plays an in-app beep and shows a toast on top of the normal live arrival. On a real device/PWA with Session B backgrounded, Session B gets a stronger push (harder to dismiss, extra vibration, plays sound) than a normal message would - see `role-member.md` MEM-024 for the full device-level check. |

**Screen-size check:** Below 768px, Messages is a single full-screen pane (list, then tap into a thread, with a back arrow). At 768px+ it is a split view: conversation list on the left, open thread on the right. Verify the live updates work in both layouts.

**Edge cases to try:**
- Send several messages rapidly from Session A → all land in order in Session B without losing any.
- In Session B, leave the conversation open and let Session A send a message → it should auto-mark as read only if Session B has actually clicked into that conversation.
- Briefly disconnect Session B's network and reconnect → the socket reconnects and the list catches up (this is also exercised in the XC realtime battery).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-008 - Live notification broadcast → member's bell (realtime)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner / staff who can broadcast (Session A, normal window) + a plain member of the same club (Session B, incognito).
- **Solo or 2 testers:** **2 testers recommended** (one sends, one watches their bell). **SOLO fallback:** normal window (Session A, staff) and Incognito window (Session B, member) **side by side**; send in A, watch the bell / notifications update by itself in B.
- **Route(s) / feature:** Staff: Dashboard → "Club Announcements" card → megaphone button (the Club Message composer). Member: the header notification bell and `/dashboard/notifications`.
- **Goal:** Prove a club broadcast reaches a member: their bell updates live and the message lands in their notification center.

**Preconditions / setup:**
1. Session A (normal): log in as the OWNER (or any staff) of the seeded club, on the **Dashboard**.
2. Session B (incognito): log in as a plain **member** of the same club, on the **Dashboard** (so the header bell is visible).
3. Place the two windows side by side.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: on the Dashboard "Club Announcements" card, click the **megaphone** button. | The **Club Message** composer opens. (If you are staff in more than one club, it first asks you to pick the club.) |
| 2 | **Session A**: choose recipients **All Members**, click **Next**. | The compose step opens with a message type (Announcement / Alert / Info), a **Title** field, and a **Message** field. |
| 3 | **Session A**: pick **Announcement**, type a Title and a Message, click **Next**, then on the confirm screen click **Send**. | A "Message Sent" confirmation appears. |
| 4 | **Session B**: do NOT refresh - watch the header notification **bell**. | The bell's unread count updates on its own within a moment (no manual refresh). "Updates live" = the bell badge increments by itself. |
| 5 | **Session B**: open `/dashboard/notifications` (or the bell dropdown). | The new announcement appears in the list with its title and body. |
| 6 | **Session B**: click the notification to mark it read. | It marks as read; the unread count drops accordingly. |

**Screen-size check:** The composer is a bottom sheet on a phone and a centered dialog at 768px+. The notification bell sits in the header at all sizes; the notifications list is single-column on a phone.

**Edge cases to try:**
- **Session A** sends to a **Group** (e.g. by role or belt) or to one **Individual** instead of All → only the intended recipient(s) receive it; confirm a member outside the group does NOT get it.
- **Session A** tries to send with an empty Title or Message → the Send button stays disabled.
- **Session B** with the notifications page already open when the broadcast arrives → the new item appears without a manual refresh (cache is invalidated live).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-009 - Free-tier messaging gate (three identities)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Free-tier member (Session A, normal window) + a Staff member of the same club (Session B, incognito) + a second **plain** member of the same club (Session C).
- **Solo or 2 testers:** Solo, but you need **three logins at once**. A normal window + one incognito window only gives you TWO logins (all incognito windows share one session). For the **third** identity (Session C) you must use a **different browser** (Firefox/Edge) or a **second Chrome profile** - see START-HERE §4.
- **Route(s) / feature:** Messages (`/dashboard/messages`) → New Message contact picker, for all three.
- **Goal:** Prove a free-tier member can contact STAFF but cannot start a conversation with a plain member, and can only reply to a non-staff person if that person messaged first.

**Preconditions / setup:**
1. All three accounts are in the **same club**. One holds a staff role - staff means primary owner, co-owner, sensei, or secretary. The other two are plain members. The "actor" account (Session A) must be on the **free** subscription tier.
2. IMPORTANT - the free tier is not the default. Every new account is created as **premium** ("paying") out of the box, and a premium account can message anyone, so this gate will NOT appear unless Session A is a genuinely free account. If your "free" account is actually still premium, step 1 will show plain members in the picker and the restriction will simply not show - that is expected, not a bug; it means the account is not really free. Account tier cannot be flipped from the admin panel, so you need a backend or pre-seeded free account for Session A.
3. Session A (normal): log in as the **free-tier member**, open **Messages**.
4. Session B (incognito): log in as the **staff** member, open **Messages**.
5. Session C (second browser or Chrome profile): log in as the **plain member**, open **Messages**.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (free): click **New Message** and look at the contact list. | The contact picker shows **only staff** contacts for the free user - plain members are filtered out of the list. |
| 2 | **Session A**: pick the **staff** contact (Session B's account) and send a message. | The message sends successfully (free users are always allowed to message staff). |
| 3 | **Session B** (staff): confirm the message arrived (live, per CR-007). | Staff receives the free member's message. |
| 4 | **Session A** (free): try to start a brand-new conversation with the **plain member** (Session C's account). | You cannot initiate it: the plain member is not offered in the contact list, so a free user has no way to start that DM. Record exactly how it is blocked (absent from list). |
| 5 | **Session C** (plain member): start a conversation TO the free member (Session A) and send a message. (Session C must itself be allowed to do this - if C is also free, have C message staff instead and note it; ideally C is premium or staff for this step.) | The message reaches Session A. |
| 6 | **Session A** (free): open the conversation the plain member just started and send a reply. | Now the reply is allowed, because the other person messaged first. The free member can reply into an existing thread even with a non-staff person. |

**Screen-size check:** The New Message contact picker is a full-screen sheet on a phone and a dialog at 768px+. Verify the staff-only filtering looks the same at both sizes.

**Edge cases to try:**
- Make Session A **premium** instead of free → the contact picker now shows plain members too, and the free-tier restriction disappears. (Billing is display-only, so flipping the tier may require backend/test-data help - record if you cannot change it.)
- If the staff account (Session B) is staff in a DIFFERENT shared club than the one the free member expects → confirm messaging is still allowed if either party is staff in ANY shared club.
- Free member opens an OLD thread where staff messaged them earlier → they can still reply.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-010 - Screen-time request → parent approves (one account, profile switch)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Parent and that parent's own Child profile, both on **one** account via the in-app profile switch (PIN). No second window needed.
- **Solo or 2 testers:** Solo (single account, switch profiles with the PIN).
- **Route(s) / feature:** Parent: Household page + the Screen Time Requests modal. Child: the child experience under a screen-time limit + the lock screen + the extension-request action. Switching: the profile switcher in the header (PIN).
- **Goal:** Prove a child who hits the screen-time limit can request more time, and the parent can approve it so time is restored.

**Preconditions / setup:**
1. Log in as the **parent** account (Session A, normal window). Open the **Household** page; confirm there is a child profile with a PIN set (create one if needed - see ONB-021 / PAR-002).
2. TIME-SENSITIVE SETUP: edit that child's **daily screen-time limit to a very low number** (a minute or two) so the child will hit the lock quickly. Do this immediately before switching to the child.
3. Keep the child's PIN handy - you will switch into and out of child mode with it.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (parent): use the header profile switcher to **switch to the child**, entering the child's PIN. | You enter child mode: the navigation is restricted (no Messages / Support / My Club) and a screen-time countdown is visible. |
| 2 | **Session A** (now child): use the app (browse library / progress) until the low limit is exhausted. | When time runs out, a **lock screen** appears and blocks further use. |
| 3 | **Session A** (child, locked): reload the page. | The lock **survives the reload** - it is enforced by the server, not just the page. Still locked. |
| 4 | **Session A** (child): from the lock / screen-time area, submit a **request for more time** (with a reason). | The extension request is submitted; the child sees it went to the parent. |
| 5 | **Session A**: switch back to the **parent** (header switcher → parent PIN). | You return to the parent experience. |
| 6 | **Session A** (parent): open **Household** → **Screen Time Requests**; on the **Pending** tab find the child's request and click **Approve**. | An approve panel asks for the **approved minutes**; the child's requested amount is pre-filled. |
| 7 | **Session A** (parent): adjust minutes if you like, click **Confirm**. | A success toast confirms the request was approved for that many minutes; the request moves to the **Approved** tab. |
| 8 | **Session A**: switch back to the **child** (PIN). | The child is no longer locked - the approved time is restored and the countdown reflects the new allowance. |

**Screen-size check:** The lock screen fills the viewport on a phone. The Screen Time Requests modal is a tall sheet on a phone with its Pending / Approved / Denied tabs scrollable; on desktop it is a centered dialog.

**Edge cases to try:**
- In step 6, click **Deny** instead → it requires a denial reason of at least 10 characters; confirm a too-short reason is rejected and a valid one denies the request (it lands on the **Denied** tab). The child stays locked. (This is the PAR-008 / deny path.)
- Approve with minutes set to 0 or a huge value (over 24 hours) → validation blocks it ("minutes must be greater than zero" / "exceeds 24 hours").
- Enter the wrong child PIN 5 times when switching → the profile-switch locks out with an escalating wait (this is the PIN lockout in PAR-006).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-011 - Exit request → owner processes

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Member who wants to leave (Session B, incognito) + Owner / member-manager (Session A, normal window).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Member: club → Members → "request to leave". Owner: club → Members → Exit Requests tab.
- **Goal:** Prove a member can submit an exit request and an owner can approve or deny it, with the member's status updating accordingly.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club.
2. Session B (incognito): log in as a **plain member** of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session B** (member): open the club → **Members** (member view) and find the **request to leave** action for yourself. | A leave / exit request form opens asking for a reason. |
| 2 | **Session B**: type a reason and submit (the submit button reads "Request to Leave"). | A confirmation that the exit request was submitted; the button shows a submitting state and then completes. |
| 3 | **Session A** (owner): open club → **Members** → **Exit Requests** tab. | The member's exit request appears with their name and reason. |
| 4 | **Session A**: approve (or deny) the exit request. | A confirmation that the request was processed; the request leaves the pending Exit Requests list. |
| 5 | **Session B**: reload the club. | The member's status reflects the outcome (e.g. membership ended if approved, or unchanged if denied). Record what the member sees for each outcome. |

**Screen-size check:** The Members page tab strip (Members / Pending / Exit Requests) stays usable on a phone; the request cards stack single-column under 640px.

**Edge cases to try:**
- **Session B** submits with an empty reason → the submit button stays disabled until a reason is typed.
- **Session A** denies instead of approves → the member keeps their membership; confirm the request is cleared from Exit Requests.
- Open the Exit Requests tab when there are none → a clean "no exit requests" empty state, not an error.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-012 - Invite/add member → account sees membership

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner / member-manager (Session A, normal window) + the account being added/invited (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Owner: club → Members → add / invite member. Member: dashboard / club list after logging in.
- **Goal:** Prove an owner can add or invite a member and that account then sees the club membership.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY of the seeded club. A fee tier is NOT required to add a member - if the club has no fee tier the member is still created (the fee tier is auto-assigned by age, or simply left blank). If the add form offers a membership plan, it is optional.
2. Have a target account ready for Session B: either an existing member account that is NOT yet in this club, or an email you control (use the email-plus trick).

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Members** and start the **add / invite member** flow. | The add/invite form opens (entering the person's details / email). |
| 2 | **Session A**: complete the add/invite for the target account, and submit. | A success confirmation; the add/invite goes through even if the club has no fee tier defined. |
| 3 | **Session A**: open the main **Members** roster. | The added member appears in the roster (or, for an invite, appears in the appropriate pending/invited state). |
| 4 | **Session B** (incognito): log in as the target account and open the dashboard / club list. | The account now sees the club it was added to (membership granted), or sees the invitation to accept - record which path your club uses. |

**Screen-size check:** The add/invite form is a full-width sheet on a phone and a dialog at 768px+. The roster reflows at 768px.

**Edge cases to try:**
- Add a member when the club has **no fee tier** → the member is still added (no fee tier is forced); confirm the member lands in the roster with no fee tier or an auto-assigned one. (Do not file - this is expected.)
- Add an email that is already a member of this club → a friendly "already a member" type message, no duplicate.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-013 - Curriculum assign → student sees it → self-unenroll

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner or Sensei (Session A, normal window) + the member being assigned (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Staff: club → Curricula → open a curriculum → manage its members (assign). Member: club → Curricula (the Enroll / Unenroll buttons) and the member's progress.
- **Goal:** Prove that assigning a curriculum to a student makes it appear for that student, and the student can self-unenroll.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY (or a Sensei) of the seeded club. Confirm at least one **curriculum** exists (create one if needed; see OWP-017).
2. Session B (incognito): log in as a **plain member** of the same club.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Curricula**, open a curriculum, and use its member management to **assign** the Session B member to it. | A success confirmation; the member's enrolled count for that curriculum goes up. |
| 2 | **Session B**: reload and open club → **Curricula** (and/or the member's progress in the club). | The assigned curriculum now shows for the member; an enrolled indicator / progress is visible. |
| 3 | **Session B**: on the assigned curriculum, click **Unenroll**. | The button confirms the unenroll; the curriculum no longer shows as enrolled for that member. |
| 4 | **Session B**: optionally click **Enroll** on a curriculum that allows self-enrollment. | The member self-enrolls and an "enrolled" success appears; the button flips to **Unenroll**. |
| 5 | **Session A**: reload the curriculum's member list. | The list reflects the member's enroll / unenroll changes from Session B. |

**Screen-size check:** Curriculum cards are single-column on a phone; the Enroll / Unenroll button is full-width inside each card. The staff member-management view reflows at 768px.

**Edge cases to try:**
- **Session A** assigns, then removes the member from the curriculum on the staff side → **Session B** refreshes and the curriculum drops off their list.
- A member tries to self-enroll in a curriculum they are not eligible for → record whether the Enroll button is hidden or the action is refused.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-014 - Exam grade → belt promotion → history reflect

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner or Sensei (Session A, normal window) + the candidate member (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Staff: club → Exams (schedule) → Grading. Member / verification: club → History (promotion history) and the member's belt / progress.
- **Goal:** Prove that scheduling an exam, marking enough examiners present, then finalizing a candidate as Pass, promotes their belt and shows in promotion history.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY (or a Sensei) of the seeded club. Confirm the club has **belt levels** defined (see OWP-016).
2. Session B (incognito): log in as the **candidate** member of the same club.
3. TIME-SENSITIVE SETUP: **schedule the exam before you try to grade it, and date it today or earlier (not in the future).** As Session A, open **Exams** and schedule a belt-promotion exam (the page calls it "Schedule Belt Promotion Exam"; scheduling is done via the calendar step), including the candidate, immediately before the grading steps. Finalizing a future-dated exam is blocked, so do not date it ahead.
4. The exam needs **at least 2 examiners marked present** before it can be finalized. When you set up the exam, add at least two examiners; you will mark them present in step 3 below.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Exams** and confirm the exam you just scheduled appears with status Upcoming. | The scheduled exam is listed. Status is derived live off the clock (club timezone): it flips to "In Progress" on its own once the scheduled start time passes, even before you open grading. |
| 2 | **Session A**: open that exam's **Grading** screen (only reachable once status is "In Progress" or later). | The candidate(s) appear with a pass / fail / pending toggle. (Grading is open to owner / co-owner / sensei; a secretary would be blocked here.) |
| 3 | **Session A**: mark **at least two examiners present**, set the candidate's result to **Pass**, then **finalize** the grading. | The result saves; a success confirmation appears, and the passed count increases. If fewer than two examiners are present, finalizing is refused with a "at least two examiners must be marked present" message - mark a second examiner present and retry. |
| 4 | **Session B** (candidate): reload and open the member's **belt / progress** in the club. | The candidate's belt reflects the promotion: on finalize, every candidate graded Pass is automatically promoted to the exam's target belt. The new belt level shows for the member. |
| 5 | **Session A** (owner): open club → **History** → promotion history. | The promotion appears in promotion history with today's date and the candidate. |

**Screen-size check:** The grading list is single-column on a phone with the pass/fail toggle full-width; the pass/fail summary badges wrap on narrow screens. History promotion charts stack under 640px and spread at 768px+.

**Edge cases to try:**
- Try to finalize with only **one examiner** marked present → finalizing is blocked ("at least two examiners must be marked present"); no promotion happens.
- Try to finalize an exam **dated in the future** → blocked ("the exam has not been conducted yet"); no promotion. (Saving a grading draft is allowed and does NOT promote anyone; only finalize promotes.) Note: scheduling itself rejects a past date with "Cannot schedule an exam in the past" (this exact wording).
- Grade the candidate as **Fail** instead, then finalize → no belt promotion for them; confirm history does not show a promotion for that candidate.
- Open the Grading screen as a **secretary** → an access-restricted block (secretary is not in the grading allow-list).
- A candidate who has not met eligibility shows an "eligibility not met" note on the grading row → record whether you can still pass them.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-015 - Eligibility pipeline: attendance + curriculum → eligible → schedule promotion

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Owner or Sensei (Session A, normal window) + the member building toward eligibility (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Staff: club → Eligible Students; club → Promotions. Member: their attendance accrues (use CR-001) and curriculum enrollment (use CR-013).
- **Goal:** Prove that as a member accrues attendance and curriculum, they appear as eligible for promotion, and an owner/sensei can schedule a promotion from there.

**Preconditions / setup:**
1. Session A: log in as OWNER-PRIMARY (or a Sensei). Confirm belts and at least one curriculum exist.
2. Session B (incognito): log in as the candidate member.
3. Build up the member's record first: enroll them in the relevant curriculum (CR-013) and record several attendances for them (CR-001), so they can meet the eligibility criteria.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: open club → **Eligible Students**. | The page loads (open to owner / co-owner / sensei / secretary; a plain member is blocked with "Access Restricted"). Each student shows their progress toward eligibility. |
| 2 | **Session A**: find the Session B member and check their eligibility status. | The member shows as **Eligible** if they meet the attendance + curriculum criteria, or **Not Eligible** with the unmet criteria listed (e.g. classes still needed). |
| 3 | **Session A**: open a student's attendance history from this page (the "view history" action). | Their attendance records open in a modal, matching the visits you recorded in CR-001. |
| 4 | **Session A**: open club → **Promotions** and start scheduling a promotion for the eligible member. | The promotions workflow opens and lets you proceed for the eligible student. |
| 5 | **Session B** (member): reload their progress. | The member's progress reflects their standing (eligibility / pending promotion), consistent with what Session A sees. |

**Screen-size check:** Eligible Students cards are single-column on a phone with progress bars full-width; the attendance-history modal is a tall sheet on a phone. Promotions reflows at 768px.

**Edge cases to try:**
- Open Eligible Students as a **plain member** → "Access Restricted" block.
- A member who is clearly short on classes shows "Not Eligible" with the specific unmet criterion → confirm the wording matches their real shortfall.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-016 - Support ticket live thread

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** A member who raises a ticket in the USER app (Session B) + a platform admin who answers it in the separate ADMIN panel (Session A). The staff reply and status changes do NOT happen in the user app: they are done by a platform admin in the admin panel, which is a different application that only an `app_admin` account can log into. So this is a user-app to admin-panel handoff, and the realtime part you verify is: the member's ticket thread in the user app updates live when the admin replies or changes the status.
- **Solo or 2 testers:** **2 testers recommended** - one person (or session) opens a ticket in the user app while a second actor with admin-panel access replies / changes the status in the admin panel, and you watch the member's thread update live. The "second actor" must be a platform admin (an `app_admin` login for the admin panel), not a club owner: a club owner in the user app cannot answer tickets. **SOLO fallback:** if you do NOT have admin-panel access, you can still verify the user side only - that the member can create a ticket, send replies, and that the thread, the status stepper, and the live-update mechanism render correctly. The ticket detail **auto-polls about every 30 seconds** and the live socket refreshes the thread on a reply, so a reply / status change made admin-side appears **without manually refreshing** (within the poll window at worst). Without an admin login you cannot trigger the admin reply yourself, so record that the admin-side steps are unverified.
- **Route(s) / feature:** Member: Support hub (`/support`) → a ticket → ticket detail (`/support/[id]`) in the user app. Admin: the admin panel's Support Tickets page, where the admin replies and changes status.
- **Goal:** Prove a member's support ticket thread updates live (or within the auto-poll) when an admin replies or changes the status in the admin panel, without the member refreshing the user app.

**Preconditions / setup:**
1. Session B: log in to the USER app as a member, open **Support**.
2. Session A: have a platform admin login (`app_admin`) for the ADMIN panel ready, so a teammate (or you, in a separate admin-panel session) can reply and change the ticket status from the admin side. If you have no admin login, run the SOLO fallback above and verify the user side only.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session B** (member, user app): on the Support hub, use **Report an Issue** to open a new ticket (the feedback modal), then open the ticket from "My Tickets". | A new ticket appears in My Tickets and its detail page opens with a status stepper, the description, and a conversation area. |
| 2 | **Session B**: type a reply in the ticket and send it. | A "Reply sent" confirmation; your reply appears in the thread. |
| 3 | **Session A** (admin panel): open Support Tickets, find that same ticket, and add an admin reply. | The reply posts on the admin side. (Skip if you have no admin login - run the SOLO fallback instead.) |
| 4 | **Session B**: do NOT refresh - keep the ticket detail open and watch. | The admin reply appears in the member's thread **without a manual refresh** (live via socket, or within ~30s via the auto-poll). "Updates live" = a new message bubble appears on its own. |
| 5 | **Session B**: navigate back to the "My Tickets" list (without refreshing the app), then check this ticket's row | Any "new reply" indicator on that ticket has cleared, since opening the thread in step 4 marked it read server-side. |
| 6 | **Session A** (admin panel): change the ticket **status** (e.g. to Resolved). | The status changes on the admin side. (Skip if you have no admin login.) |
| 7 | **Session B**: keep watching. | The status badge / stepper at the top updates to the new status on its own (no manual refresh). |

**Screen-size check:** Support hub quick-action cards scroll horizontally on a phone; the ticket detail is a single scrollable column with the reply box pinned at the bottom on a phone, widening at 768px+.

**Edge cases to try:**
- **Session B** sends a reply while offline briefly, then reconnects → confirm the reply ultimately sends or shows a clear failure, no silent loss.
- If you have no admin-panel access, at least confirm the **filter tabs** (All / Open / Resolved) and the empty state on the Support hub behave, and that the reply box disables while a reply is sending - this is the SOLO user-side-only verification.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-017 - Secretary boundary in a shared club

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Secretary (Session A, normal window) + Owner (Session B, incognito) - the owner is present so you can confirm the same actions ARE allowed for an owner, side by side.
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** The full secretary access matrix across one shared club: Members, Curricula, Belts, Calendar (allowed) vs Analytics, History, Scan Attendance (blocked), and the Settings tab hidden (with a reachability probe in step 8).
- **Goal:** Prove a secretary can manage members / curricula / belts / calendar but is blocked from analytics, history, and scan-attendance, has the Settings tab hidden, and that any owner-only change a secretary attempts is rejected by the server.

**Preconditions / setup:**
1. Session A: log in as the **Secretary** of the seeded club.
2. Session B (incognito): log in as the **Owner** of the same club, ready to confirm the blocked pages DO work for an owner.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (secretary): open club → **Members** and approve/reject a join request, add or edit a member, and process an exit request. | Allowed - the secretary can approve/reject join requests, add and edit member info, and handle exit requests. |
| 2 | **Session A**: on a member, try to **change that member's role** (and try to manage **fee tiers**). | **Blocked at the server** - changing a member's role and managing fee tiers are owner-only; even if the control shows, the save is rejected for a secretary. Record what happens. |
| 3 | **Session A**: open club → **Curricula** and **Belts** and make a small edit. | Allowed - the secretary can manage curricula and edit belt definitions. |
| 4 | **Session A**: open club → **Calendar** and create / edit an event. | Allowed - the secretary can create calendar events. |
| 5 | **Session A**: open club → **Analytics**. | **Blocked** - a red "Access Restricted - you don't have permission to access analytics" screen. |
| 6 | **Session A**: open club → **History**. | **Blocked** - an access-restricted screen (history is owner-only). |
| 7 | **Session A**: open club → **Scan Attendance**. | **Blocked** - an explicit "Access Restricted - you don't have permission to access scan attendance" screen (secretary is specifically blocked here). |
| 8 | **Session A**: look at the club tab strip for a **Settings** tab, then try opening the settings page by typing its URL. | The **Settings tab is hidden** for the secretary. PROBE (same gap as SEC-045): because the secretary is treated as an owner by one front-end check, the settings PAGE may actually OPEN instead of showing "Access Denied" (the page only hard-blocks plain members). Record whether it opens. If it does, change a field and Save, then check as the owner in Session B whether it persisted; owner-only changes should be rejected by the server. Capture the behavior, do not assume a clean block. |
| 9 | **Session B** (owner): open Analytics, History, Scan Attendance, and Settings for the same club, and change a member's role. | All four pages load for the owner and the role change is allowed - confirming the blocks in steps 2 and 5-7 are role-based, not broken pages. |

**Screen-size check:** The "Access Restricted" screens are centered cards at all sizes. On a phone, confirm the Settings tab is absent from the bottom menu for the secretary; at 768px+ confirm it is absent from the side menu / tab strip.

**Edge cases to try:**
- Secretary tries each blocked page by **typing the URL** directly (not via a tab) → still blocked (the page guards itself, not just the menu).
- Secretary opens **Eligible Students** and **Promotions** → record whether allowed (secretary can view eligible students; confirm what they see on promotions).
- Because a secretary is treated as "owner" in some generic checks, probe any owner-only control that gates only on the simplified owner flag → note any leak (this is the SEC-045 probe).

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-018 - Sensei boundary + settings probe (KNOWN-GAP)

- **Status:** PARTIAL / KNOWN-GAP - most of this is a clean access-matrix check (FUNCTIONAL), but step 7 onward is a deliberate permission probe with NO clean pass/fail expected. Record what you observe; do not file the known part as a surprise bug.
- **Role(s) & sessions:** Sensei (Session A, normal window) + Owner (Session B, incognito) - owner present to confirm the contrast.
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** The full sensei access matrix in one shared club: Calendar, Exams, Grading, Curricula, Eligible Students, Scan Attendance, Library manage (allowed) vs Analytics, History (blocked) - plus the **Settings reachability + save probe** (the most important RBAC check here).
- **Goal:** Prove a sensei can teach (calendar / exams / grading / curricula / scan) but is blocked from analytics and history, AND record exactly what the sensei can do on the Club Settings page, including whether a save actually sticks.

**Preconditions / setup:**
1. Session A: log in as the **Sensei** of the seeded club.
2. Session B (incognito): log in as the **Owner** of the same club, for side-by-side contrast.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A** (sensei): open club → **Calendar** and create / edit a class or workshop. | Allowed - the sensei can create calendar events. |
| 2 | **Session A**: open club → **Exams**, then open an exam's **Grading** screen and set a result. | Allowed - the sensei can schedule exams and grade (sensei is in the grading allow-list). |
| 3 | **Session A**: open club → **Curricula** and **Eligible Students**. | Allowed - both load for the sensei. |
| 4 | **Session A**: open club → **Scan Attendance** (real phone) and confirm the scanner opens. | Allowed - the sensei can scan attendance (only the secretary is blocked there). |
| 5 | **Session A**: open club → **Analytics**. | **Blocked** - "Access Restricted - you don't have permission to access analytics" (sensei is excluded despite being treated as an owner elsewhere). |
| 6 | **Session A**: open club → **History**. | **Blocked** - an access-restricted screen (history is owner-only). |
| 7 | **Session A**: look at the club tab strip - is there a **Settings** tab for the sensei? | **PROBE / KNOWN-GAP:** the Settings tab is expected to be **VISIBLE** to the sensei (it is only hidden for members and secretaries). Record whether you see it. |
| 8 | **Session A**: open club → **Settings** (via the tab, or by typing the settings URL). | **PROBE / KNOWN-GAP:** the settings page is expected to be **reachable** by the sensei (its guard only blocks plain members). Record what the sensei can see and which fields are editable. |
| 9 | **Session A**: change a club setting (e.g. the club motto / a non-destructive field) and click **Save Changes**. | **PROBE / KNOWN-GAP - the key check:** record exactly what happens. Does it show a "Saved" state? Does the change actually persist? Then verify in **Session B (owner)** by reloading Settings: did the sensei's change actually take effect on the backend, or did it silently fail / get rejected? Note both the front-end result AND whether it stuck. Do NOT file this as a clean pass/fail - capture the full behavior for the team to judge. |
| 10 | **Session B** (owner): open Analytics, History, and Settings for the same club. | All load for the owner - confirming steps 5-6 are role blocks and giving you the owner-side reference to compare the sensei's save against in step 9. |

**Screen-size check:** "Access Restricted" screens are centered cards at all sizes. On a phone, check whether the Settings tab appears for the sensei in the bottom menu; at 768px+ check the side menu / tab strip. The Settings form fields are full-width on a phone.

**Edge cases to try:**
- In step 9, try changing **different** settings fields (logo, address, fee details) and a save each time → record which (if any) persist for the sensei and which are rejected. This pinpoints exactly how far the gap goes.
- Sensei tries to open the **Teachers** (sensei management) page → expected block (that page is owner-only); confirm it is blocked even though Settings is reachable.
- Sensei opens **Members** and looks for transfer-ownership / add-remove owner controls → those should be absent for the sensei.

**Result capture:**
- PASS / FAIL: [ ]  (for steps 1-6 and the Teachers block; steps 7-9 are a recorded observation, not pass/fail)
- Settings probe recorded: [ ] tab visible? [ ] page reachable? [ ] save showed success? [ ] change actually persisted (verified as owner)?
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### CR-019 - Group chat: staff creates, a member participates

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Staff (owner, co-owner, sensei, or secretary) (Session A, normal window) + a plain member of the same club (Session B, incognito).
- **Solo or 2 testers:** Solo-with-tabs.
- **Route(s) / feature:** Messages (`/dashboard/messages`) in both sessions.
- **Goal:** Prove staff can create a group chat, add a member to it, and that messages flow live to everyone in the group.

**Preconditions / setup:**
1. Both accounts belong to the same club.
2. Session A: log in as staff, open Messages.
3. Session B (incognito): log in as the member, open Messages.

**Steps:**
| # | Action (which session) | Expected result |
|---|---|---|
| 1 | **Session A**: create a group, name it, and add Session B's account as a member. | The group is created; Session A lands in its thread with Session B listed as a member. |
| 2 | **Session A**: send a message in the group. | It appears in Session A's thread. |
| 3 | **Session B**: without refreshing, watch Messages. | The new group conversation appears live in Session B's list with the message from step 2, the same way a live DM would (CR-007). |
| 4 | **Session B**: open the group and send a reply. | It sends successfully and Session A sees it live. |
| 5 | **Session B**: look for the "urgent" (red bell) toggle in this group's composer. | It is not shown to a plain member - urgent messages in group chats are staff-only, unlike a 1:1 DM where every member sees the toggle (MEM-024). |
| 6 | **Session A**: look for the same toggle in the group composer. | It is shown to staff. |

**Screen-size check:** Same split-pane behavior as CR-007 at the 768px boundary.

**Edge cases to try:**
- Session A removes Session B from the group → Session B loses access to the thread (or it becomes read-only, depending on what the app does - record which).
- Session A adds a second member to the group → succeeds.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
