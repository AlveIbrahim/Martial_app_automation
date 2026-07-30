# BACKEND / ADMIN TRUTH OVERRIDES (every writer MUST apply these)

These supersede the blueprint (`01-blueprint.md`) and the frontend map (`00-app-map.md`) wherever they conflict. Full evidence is in `02-backend-logic.md` (server rules) and `03-admin-panel.md` (admin/source-of-truth). The backend is the real arbiter of "expected result"; the UI may show a control the server rejects.

Stack note for context only (keep out of tester-facing text): backend is Node.js + Express + Prisma (PostgreSQL). Ignore any "Go backend" mention.

1. **Club roles are exactly 5:** `club_owner_primary`, `club_owner`, `sensei`, `secretary`, `club_member`. There is NO club-level `admin` role and NO `member` vs `club_member` split. Drop every "admin (club-level)" scenario. The owner-secondary sheet covers `club_owner` (co-owner) only.

2. **Owner-only actions (backend rejects BOTH secretary AND sensei, even if the UI shows the control):** change a member's role, fee-tier CRUD, manual belt promote, manage owners. Add a co-owner and transfer primary ownership are `club_owner_primary` ONLY. Remove a co-owner is owner + primary.

3. **Secretary CAN:** approve/reject join requests, add/edit members, manage curricula, edit belts, create calendar events. **Secretary CANNOT:** change member roles, fee tiers, analytics, history, scan-attendance (explicit server block), club settings. (So the blueprint's "secretary manages roles" is wrong: secretary approves/rejects and edits members but does NOT change roles.)

4. **Sensei is "staff":** can grade/finalize exams, mark attendance + generate QR (as a sensei or as a class teacher), manage curricula, view eligible-students, manage library content. The frontend BLOCKS sensei from analytics + history (the tester sees an "access restricted" screen). Owner-only writes (role change, fee tiers, owners, transfer, promote) are backend-rejected for sensei. The "sensei can open Club Settings" UI quirk does NOT let them save owner-only fields: the server rejects the write.

5. **Member approval does NOT require a fee tier.** A club with zero fee tiers still approves members (fee tier auto-assigns by age or stays null). **Belt IS required** (defaults to the user's requested belt; the approver may override). Do NOT write "create a fee tier before approving." Separately and differently: completing the initial CLUB SETUP wizard does require at least one fee tier, that is a distinct step.

6. **Club creation requires an admin-issued code.** A plain user cannot self-create a club. The create-club wizard rejects without a valid, pending, unexpired `club_owner` invite code (prefix `CO-`). The code comes from a platform admin via `/invite-user`, or from an admin approving a user's request in `/club-code-requests`. On success: a 14-day trial starts, the creator becomes `club_owner_primary`, and is auto-given a Black Belt (rank 10). So the founder is already a black belt (relevant to assigning senseis).

7. **Sensei role can only be assigned to a black-belt holder** (belt rank <= 10). Otherwise the server returns "Only black belt holders can be assigned the sensei role." An empty/short candidate list on the assign-sensei screen is expected, not a bug.

8. **Attendance rules:**
   - **Staff marking attendance has NO timing limit** (any day, past or future).
   - **Member self-registration via QR scan IS bounded by the class DAY window** `[class.date - 14h, class.date + 38h]`, anchored on the class DATE (not its start/end time). Outside it the server returns "Students can only register attendance on the class day." Exception: a member who is a teacher of that class skips the window.
   - **Children cannot self-register** (a parent registers them).
   - **Duplicate blocked** (one attendance row per member per class).
   - **QR token expires at the end of the class day;** you cannot generate a QR for a past class.
   - **Belt-ineligible** members (outside the class min/max belt) are rejected.
   - **Attendance-takers = owners, sensei, OR any class teacher** (even a plain member linked as a class teacher). **Secretary is blocked.**
   - >>> The attendance-scenario writer MUST verify in the actual frontend code which direction the scan page implements: staff scanning a member's personal QR (= staff `markAttendance`, NO timing window), versus a member scanning a class QR (= `selfRegister`, the day window applies). Write the steps, permissions, and timing setup to match what the code actually does. Do not assume.

9. **Exam finalize** requires at least 2 examiners marked present; cannot finalize a future-dated exam; on finalize, every candidate graded "pass" is auto-promoted to the target belt. A draft save does not promote.

10. **Subscriptions and content gating:**
   - New users default to tier `paying` (everyone is premium out of the box). To test the FREE-tier behavior you need an account explicitly set to free (a backend/seed action; the admin UI cannot toggle tier).
   - The master MOVE library and master WARMUP library ARE gated server-side by tier + belt rank: free/club-unaffiliated users see only beginner (rank >= 19) moves; non-black-belt paying users do NOT see Dan-2+ moves; free users do not get premium master warmups. So content gating is REAL at the master-library level (the old "gating is cosmetic, free users see everything" claim is wrong). Per-CLUB custom library content is a separate hide/show system and is not tier-gated.
   - There is NO real checkout/payment anywhere (billing screens are mock). Do not test purchasing.

11. **Messaging free-tier gate:** staff (`club_owner_primary | club_owner | sensei | secretary`) and any `paying` user can DM anyone. A free non-staff user can only DM staff, or reply to someone who messaged them first. Because the default is `paying`, this gate only shows with a genuinely free account.

12. **Seeding (recommended):** the fastest real seeded club + logins comes from the ADMIN Demo Clubs tool (auto-generate + seed; all demo logins use the password `Demo@1234`; reset between runs). The QA lead does this and hands testers the logins. (Creating a club from scratch needs an admin code per #6.)

13. **Support tickets** are answered in the ADMIN panel by a platform admin (status changes, replies, ClickUp escalation), not in the user app. A true end-to-end ticket test is a user (user app) + admin (admin panel) handoff. Help-center articles a tester sees are whatever an admin published.

14. **PIN + screen-time:** PIN lockout = 5 fails -> escalating 15 / 30 / 60-minute locks; the escalation level resets after 24h. Screen-time limit resets at local midnight and is server-authoritative (clearing localStorage does NOT bypass the lock). A parent can approve an extension up to (not exceeding) the minutes the child requested.

Style: no em dashes or en dashes anywhere (commas/colons/hyphens only). Plain English for non-technical testers. Keep API/route/hook names out of tester-facing steps.
