# Martial Apps BACKEND Business Logic Map (Source of Truth for QA)

> Provenance: Read directly from `ai-buddy/martial-apps/martial-apps-backend` (Node.js + Express + Prisma) on 2026-06-01. This is the server side truth: when the frontend UI shows a control the backend rejects, the rule below wins. Cross-checked against the frontend map `_research/00-app-map.md`; see the final section for every correction.
>
> Stack: Express 4, Prisma 5 (PostgreSQL), JWT in httpOnly cookies, socket.io, Zod validators per route, bcrypt for passwords and PINs.

---

## 0. How auth and roles actually work server-side

- **`authenticate` middleware** decodes the JWT and sets `req.user` (`personId`, `userId`, global `role`, optional `childProfileId`). All protected routes start with it. File: `src/middlewares/authMiddleware.js`.
- **Global app role** is `AppRole.role` enum: `app_user | app_support | app_admin`. The generic `authorize(...roles)` middleware (`src/middlewares/authorizationMiddleware.js`) checks `req.user.role` against an allowlist. Used only by admin/global routes.
- **Per-club role** is `ClubMember.role` enum (Prisma `ClubRoleType`): `club_owner_primary | club_owner | sensei | secretary | club_member`. NOTE: there is NO separate `admin` or `member` club role in the schema; the enum has exactly these five values (`prisma/schema.prisma` lines 949-955).
- **Per-club enforcement is real and query-based.** Every club mutation route runs a guard that does `prisma.clubMember.findFirst({ where: { clubId, personId, role: { in: [...] }, status: 'active' } })`. If no row, it throws 403. The clubId comes from the URL param, so a user's permissions are scoped to the exact club in the URL. Guards live in:
  - `checkClubAuthorization(...roles)` defined inline in `src/routes/clubRoutes.js` (lines 95-135)
  - `requireClubStaff` / `checkClubStaff` in `src/middlewares/clubStaffAuthMiddleware.js` (allows `club_owner_primary, club_owner, sensei`)
  - `requireClubOwner` in `src/middlewares/clubAuthorizationMiddleware.js` (allows `club_owner, club_owner_primary` only)
  - `checkClubMembership` in `src/middlewares/clubMembershipMiddleware.js` (any active member; includes child profile memberships)
  - `checkAttendanceTaker` and `checkClubTeacherOrOwner` defined inline in `src/routes/attendanceRoutes.js`
- **Definition of "staff"** is consistent across services: `['club_owner_primary', 'club_owner', 'sensei', 'secretary']`. Confirmed in `directMessageService._isStaff`, `clubNotificationService._isStaff`, `attendanceService` (history auth), `clubMemberService` (multiple).
- **Definition of "owner"** for owner-only operations: `['club_owner', 'club_owner_primary']`.
- Active status matters everywhere: guards require `status: 'active'`. A member with status `ending | inactive | removed` (enum `MemberStatus`) fails membership checks.

---

## 1. Data model (entities, key fields, enums, constraints)

### Identity and accounts
- **Person** (`schema.prisma` ~14): root identity. `email` unique-nullable, `firstName`, `lastName`, `dateOfBirth`, `age`, `emailVerified` (default false), `profileCompleted` (default false), `language` (default "english"), `analyticsConsent` (`full|essential|declined`, null until decided). One Person has at most one `User`, one `SSO`, one `ChildProfile`, one `SenseiProfile`, one `Household` (as account holder).
- **User** (~72): account/auth state. `status` enum `UserStatus = active | deactivated`. `subscriptionTier String? @default("paying")` (values used: `free`, `paying`). `failedAttempts`, `lockedUntil` for login lockout. One-to-one with Person.
- **SSO** (~229): holds `passwordHash`, `provider` (default "email"), `mustChangePassword` (default false), `lastPasswordChangeAt`. Login goes Person -> SSO for the password.
- **AppRole** (~152): `GlobalAppRole` enum `app_user | app_support | app_admin`. Unique `[userId, role]`. The schema comment marks `app_admin` as "nick only".
- **OTP** (~207): email verification / reset code. `attempts` (default 0), `isUsed`, `expiresAt`. Unique `[email, isUsed]`.

### Household / child / screen-time
- **Household** (~249): `householdName`, `accountHolderId` unique (the parent Person). One household per account holder.
- **HouseholdMember** (~269): `role` enum `HouseholdMemberRole = parent | child`. Unique `[householdId, personId]`.
- **HouseholdJoinRequest** (~290): `requestedRole`, `status` enum `JoinRequestStatus = pending | approved | rejected | cancelled`. Unique `[householdId, personId]`.
- **ChildProfile** (~318): `pin` (bcrypt hash), `isLocked`, `lockedUntil`, `failedPinAttempts` (default 0), `lockoutCount` (default 0), `lastLockoutAt`, `dailyScreenTimeLimit` (minutes, REQUIRED, no default). One per Person.
- **ScreenTimeLog** (~365): per-session usage; `durationMinutes` "resets every day"; `last_pull` for AFK detection.
- **ScreenTimeRequest** (~384): extension request. `requestedMinutes`, `approvedMinutes`, `status` enum `RequestStatus = pending | approved | denied`.
- **ScreenTimeBonus** (~417): granted extra minutes for a specific date. Unique `[childProfileId, date]`.

### Clubs and membership
- **Club** (~455): `name` (required, not unique), `subscriptionStatus` enum `SubscriptionStatus = trial | active | expired | cancelled` (default `trial`), `monthlyFee` (default 20), `trialEndsAt`, `martialArtDiscipline`, `timezone` (IANA, nullable), bank fields (encrypted), `qrCode`, `demoHidden`.
- **ClubFeeTier** (~544): `name`, `monthlyFee`, optional `minAge`/`maxAge`, `isActive` (default true), `displayOrder`. Unique `[clubId, name]`.
- **Site** (~568): physical location. `address` REQUIRED. `status` enum `SiteStatus = active | archived`. Unique `[clubId, name]`. A "Main Site" is auto-created on club creation.
- **Room** (~963): belongs to Site. `status` enum `RoomStatus = active | archived`. Unique `[siteId, name]`. Has `Mat[]`.
- **Mat** (~987): each Room gets a Mat; all event scheduling and double-booking checks are mat-based via junction tables (`ClassMat`, `ExamMat`, etc.).
- **ClubMember** (~725): `role` (`ClubRoleType`), `beltId` (REQUIRED), `status` enum `MemberStatus = active | ending | inactive | removed` (default active), `feeTierId` (nullable), `childProfileId` (nullable, set for child memberships). Unique `[clubId, personId, childProfileId]`.
- **ClubJoinRequest** (~608): `requestedBeltId`, `requestedRole` (default `club_member`), `status` (`JoinRequestStatus`), `joinMethod` enum `JoinMethod = invitation | qr_code | self_registration | bulk_import | parent_initiated`. Unique `[clubId, personId]`.
- **ClubLeaveRequest** (~807): exit request. `memberId` unique (one pending exit per member), `respondedAt` null until processed.
- **Invitation** (~641): `code` UNIQUE, `type` enum `InvitationType = club_owner | club_member | household_partner`, `status` enum `InvitationStatus = pending | consumed | expired | revoked`, `expiresAt`, `recipientEmail`.
- **ClubCreationRequest** (~2090): in-app request to be granted a club-owner invitation. `status` enum `ClubCreationRequestStatus = pending | approved | rejected`; approval auto-generates a `club_owner` Invitation.
- **Lead** (~684): website/in-app lead funnel with `LeadStatus = new | contacted | invited | converted | rejected`.

### Belts, curricula, classes, attendance
- **BeltDefinition** (~1369): per-club belt. `name`, `rank` (STRING, nullable), `color` (required), `numberOfClassesRequired` (default 0), `numberOfTeachingHoursRequired` (default 0), `status` enum `BeltStatus = active | inactive`. Unique `[clubId, name]`. Rank convention (from code comments): higher rank number = more junior (rank 20 = 10th Kyu beginner, rank 1 = 10th Dan); black belt is rank <= 10.
- **ClassDefinition** (~1470): the recurring class template. `monthlyFee` (default 0), optional `minAge`/`maxAge`, `defaultSenseiIds`. Unique `[clubId, name]`.
- **ClubMemberCurriculum** (~1494): a member's enrollment in a ClassDefinition. `classesAttended` (counter), `status` enum `CurriculumAssignmentStatus = active | archived`, `archivedReason` enum `CurriculumArchiveReason = curriculum_change | belt_upgrade | member_removed | manual`.
- **Class** (~1515): a scheduled instance. `roomId` REQUIRED, `minBeltId` REQUIRED, `maxBeltId` nullable, `isRecurring`, `classFee` (default 0), `status` enum `ClassStatus = scheduled | completed | cancelled`.
- **ClassTeacher** (~1579): links a class to a sensei/assistant/guest. `clubMemberId` or `personId` or `guestName`.
- **Attendance** (~1603): `isPresent` (default false), `markedAt`, `markedBy`. UNIQUE `[classId, memberId]` (one record per member per class - this is the duplicate guard).
- **AttendanceQRToken** (~1623): `token` UNIQUE, `classId`, `expiresAt`, `createdBy`. The scannable QR payload.
- **MemberBeltProgress** (~915): `classesAttended`, `classesRequiredForNext`, `classesRemainingForNext`, `progressPercentage`, `teachingHoursDone`, `eligibleForExam`. Unique `[memberId, clubId]`.

### Exams and events
- **Exam** (~1726): `targetBeltId`, `classDefinitionId`, `roomId` REQUIRED, `status` enum `ExamStatus = scheduled | in_progress | completed | cancelled`.
- **ExamExaminer** (~1761): `isPresent` (default false). Unique `[examId, memberId]`.
- **ExamCandidate** (~1775): candidates sitting the exam. Unique `[examId, memberId]`.
- **ExamResult** (~1791): `result` enum `ExamResultStatus = pass | fail | pending`, `targetBeltId`, `gradedBy`, `gradedAt`. Unique `[examId, memberId]`.
- **Workshop / SocialGathering / Tournament** (~1820+): event types, `status` enum `EventStatus = scheduled | cancelled`. Tournament can be an external venue (`isExternalVenue`, `roomId` nullable); the others require a `roomId`.

### Messaging, notifications, support
- **DirectMessage** (~2002): 1:1 DM scoped by `clubId`, sender/receiver are `ClubMember` ids. `readAt`, `isEdited`.
- **InAppGroup / InAppMessage** (~1926): group chat created by a member (sensei). Separate from DMs.
- **ClubNotification** (~2048): broadcast. `type` enum `NotificationType = alert | announcement | info`. Has `ClubNotificationRecipient` per active member.
- **UserNotification** (~2391): personal notifications (`ticket_reply`, `club_join_request_accepted/rejected`, etc.).
- **SupportTicket** (~2341): `ticketNumber` UNIQUE (TKT-#####), `category` (`bug|suggestion|help`), `status` string (`submitted | in_triage | in_progress | qa_testing | resolved | closed`).

---

## 2. RBAC: who can do what (server-enforced)

| Action | Roles allowed (route guard) | Evidence |
|---|---|---|
| Create club | Any authenticated user WITH a valid `club_owner` invitation code | `clubRoutes.js` ~178 (`authenticate` + `validate(createClubSchema)`); code validated in `clubService.createClub` |
| Submit join request | Any authenticated user (no club role) | `clubRoutes.js` ~654 |
| View / approve / reject join requests | `club_owner_primary, club_owner, secretary` | `clubRoutes.js` 666-696 |
| List / view members | staff (`...primary, owner, sensei, secretary`) for full detail; members see limited | `clubRoutes.js` ~768; `clubMemberService.listClubMembers` |
| Add member, edit member info, import/export members | `club_owner_primary, club_owner, secretary` | `clubRoutes.js` 782-874 |
| Change a member's role (`PUT /members/:memberId/role`) | `club_owner_primary, club_owner` ONLY (NOT secretary, NOT sensei) | `clubRoutes.js` ~859-861 |
| Promote a member's belt manually | `club_owner_primary, club_owner` | `clubRoutes.js` ~885-887 |
| Get owners list | `...primary, owner, sensei, secretary` | `clubRoutes.js` ~304-306 |
| Add a co-owner (`POST /owners`) | `club_owner_primary` ONLY | `clubRoutes.js` ~316-318 |
| Transfer primary ownership (`PUT /owners/primary`) | `club_owner_primary` ONLY | `clubRoutes.js` ~329-331 |
| Remove a co-owner (`DELETE /owners/:memberId`) | `club_owner_primary, club_owner` | `clubRoutes.js` ~342-344 |
| Fee tiers CRUD | `club_owner_primary, club_owner` | `clubRoutes.js` 357-417 |
| Mark / bulk-mark / update / delete attendance | attendance takers: owners, sensei, OR a `ClassTeacher` of the class | `attendanceRoutes.js` `checkAttendanceTaker` 66-117. SECRETARY IS BLOCKED. |
| Generate attendance QR | owners, sensei, OR a class teacher | `attendanceRoutes.js` `checkClubTeacherOrOwner` 259+ |
| Scan attendance QR | Any active club member (children handled separately) | `attendanceRoutes.js` ~342 (`checkClubMembership`) |
| Send DM | Any active member (subject to free-tier gate, see 7) | `messageRoutes.js` 49-55 |
| Send bulk DM | staff only (`requireClubStaff`) | `messageRoutes.js` 62-69 |
| Broadcast notification | staff only | `clubNotificationService.broadcastNotification` 49-51 |
| Grade / finalize exam | owners + sensei (club staff routes) | `examRoutes.js` (requireClubStaff pattern) |

---

## 3. The pass/fail rules (the ones a tester scores against)

### 3.1 Attendance timing rule (CRITICAL)
File: `src/services/attendanceService.js` (`isWithinAttendanceWindow`, lines 97-108).

- The window is anchored on `Class.date` floored to UTC midnight, NOT on `startTime`/`endTime`. The allowed window is `[date - 14h, date + 38h]`. This is deliberately permissive to cover all timezones (UTC-12..UTC+14) plus grace. It is NOT a "from class start to class end" window and has NO short grace period; it is roughly "the class calendar day, fuzzed by half a day on each side."
- **Staff marking attendance (`markAttendance`, `bulkMarkAttendance`): NO timing restriction at all.** Staff can mark attendance any day, past or future. The window check is only applied to self/child registration.
- **Self-registration (`selfRegisterAttendance`) and parent-registering-children (`registerChildAttendance`): the window IS enforced** -> error `"Students can only register attendance on the class day"` / `"Children can only be registered for attendance on the class day"`. Exception: if the self-registering member is a teacher of that class (`classRecord.teachers.length > 0`), the window is skipped.
- **QR scan path** (`attendanceQRService.scanAttendanceQR`) calls `selfRegisterAttendance`, so the same window applies to the scanning member. Children scanned by a parent go through `registerChildAttendance` (window applies).

### 3.2 What makes a QR scan valid / duplicate handling
File: `src/services/attendanceQRService.js`.
- The QR encodes a short token (`ATT-...`). On scan, `lookupToken` requires the token to exist AND `now <= expiresAt`, else `"Invalid QR code"` / `"QR code has expired"`.
- The token's `clubId` must match the URL `clubId` or `"QR code does not belong to this club"`.
- **QR token expiry: end of the class day** (`expirationDate.setHours(23,59,59,999)` on the class date, lines 110-115). You cannot generate a QR for a past class (`"Cannot generate QR code for a past class"`).
- **Duplicate scan**: the `Attendance` table has UNIQUE `[classId, memberId]`. The service also explicitly checks for an existing record and throws `ConflictError "Attendance already registered for this class"` (self) / `"Attendance already exists..."` (staff). A second scan of the same member for the same class fails.
- **Children cannot self-register**: `"Children cannot self-register for attendance. Parents must register on their behalf."`
- **Belt eligibility on attendance**: `checkBeltEligibility` compares the member's belt rank to the class `minBeltId`/`maxBeltId`. If the member's rank falls outside, attendance is rejected (`"...belt level is not eligible for this class"`). Classes with neither min nor max belt accept anyone.
- **Curriculum counter**: attendance only increments belt-progress class counters for RECURRING classes (`isRecurring || recurringClassId`). One-off classes do NOT count toward promotion progress (`RW-127`, lines 136-144).

### 3.3 Club creation requires an invite code (CRITICAL)
File: `src/services/clubService.createClub` + `src/services/invitationService.validateAndGetInvitation`.
- The create endpoint REQUIRES a `code` in the body (Zod `createClubSchema`). The code is validated as: invitation must exist (`"Invalid invitation code"`), `type === 'club_owner'` (`"This invitation code is not valid for club creation"`), `status === 'pending'` (else `"already been consumed/expired/revoked"`), and `expiresAt >= now` (`"Invitation code has expired"`).
- Codes are minted server-side with prefix `CO-` and 7-day expiry by `invitationService.generateClubOwnerInvitation` (admin action). They are also auto-generated when an admin approves a `ClubCreationRequest`.
- On success the transaction: creates the Club (`subscriptionStatus: 'trial'`, `trialEndsAt = now + 14 days`), auto-creates a "Main Site", clones the app-level master belts into the new club, makes the creator a **`club_owner_primary`** ClubMember, assigns the creator a **Black Belt (rank 10) by default** (falls back to most-junior belt, then a White belt), and marks the invitation `consumed`. So: creation always burns one invite, always produces a 14-day trial, and the founder is auto-black-belt.

### 3.4 Member approval: fee tier and belt rules (CRITICAL)
File: `src/services/clubJoinRequestService.approveJoinRequest`.
- **A fee tier does NOT need to exist.** Belt is what matters. The effective belt = `assignBeltId` (admin override, optional) OR the user's `requestedBeltId`. If neither exists -> `"No belt ID available..."`. The belt must be active for the club or `"Belt ID not found or inactive"`.
- **Fee tier assignment is automatic and optional.** If `feeTierOverride` is given, it must be an active tier for the club. Otherwise the service auto-assigns by age using `findCheapestMatchingFeeTier`; if no age match, it picks the lowest-cost active tier; **if the club has zero fee tiers, `feeTierId` is simply left null and the member is still created.** So approval works even with no fee tiers configured.
- On approval the join request row is DELETED (not kept as "approved") and a `ClubMember` is created with `role: 'club_member'`, `status: 'active'`. Submitting requires a belt (`submitJoinRequestSchema.beltId` is required).
- **Membership state machine**: `ClubJoinRequest` (pending -> approved[deleted]/rejected) then `ClubMember.status` (active -> ending/inactive/removed). Rejected requests can be re-submitted (the old rejected row is deleted on resubmit). Exit: member submits `ClubLeaveRequest`; on approve, the `ClubMember` is hard-deleted; on reject, the request is marked responded and membership stays.

### 3.5 Sensei role requires a black belt (CRITICAL)
File: `src/services/clubMemberService.assignMemberRole` (lines 803-808).
- Assigning `sensei` is gated: the member's belt `rank` parsed as int must be `<= 10` (black belt). Otherwise `"Only black belt holders can be assigned the sensei role."`
- You cannot change your own role (`"Cannot change your own role."`). This route itself is owner-only (see RBAC table).

### 3.6 Co-owner add/remove and primary transfer
File: `src/services/clubService.js` (`addClubOwner` 616, `transferPrimaryOwner` 703, `removeClubOwner` 864).
- **Add co-owner**: target must be active and not already an owner; role set to `club_owner`. Caller must be `club_owner_primary`.
- **Transfer primary**: caller must currently be `club_owner_primary`; target must already be a `club_owner` (`"Target member must be a club_owner to become primary owner"`). On transfer, the OLD primary is downgraded to `club_owner` and the target becomes `club_owner_primary`, in one transaction. The old primary's sessions are then revoked (token revocation) to prevent stale privilege; if revocation fails the role change still stands and it is logged as a security incident.
- **Remove co-owner**: cannot remove a `club_owner_primary` (`"Cannot remove the primary owner. Transfer primary ownership... first"`); cannot remove the last owner (`"Cannot remove the last club owner"`). Removed owner is downgraded to `club_member`, not deleted. Secretaries cannot remove owners (also blocked in `clubMemberService.removeMember`).

### 3.7 Belt / curricula / exam / promotion / eligibility
- **Eligibility** (`src/services/eligibleStudentService.js` lines 101-110): a student is eligible when, for the next belt up, `classesAttended >= numberOfClassesRequired` AND `teachingHoursDone >= numberOfTeachingHoursRequired`. `classesAttended` is summed from active curriculum enrollments; teaching hours come from classes the member taught. Both thresholds default to 0, so a belt with zero requirements makes everyone eligible.
- **Exam grading finalize** (`src/services/examService.finalizeGrading` lines 1032-1190): cannot finalize an already-completed exam, cannot finalize a future-dated exam (`"...has not been conducted yet"`), and **requires at least 2 examiners marked present** (`"At least two examiners must be marked as present to finalize grading!"`). On finalize: results are upserted; **every candidate graded `pass` is auto-promoted** - their `ClubMember.beltId` is set to `targetBeltId` and their `MemberBeltProgress` is reset and re-pointed at the new next belt. A draft save (`saveGradingDraft`) does NOT change exam status or promote.
- **Belt-upgrade side effect** (`clubMemberService._handleCurriculumResetOnBeltUpgrade`): promoting to a black belt (rank <= 10) carries over attendance; a non-black-belt upgrade archives old curricula and resets the attendance counter to 0.

### 3.8 Household / child / PIN / screen-time
File: `src/services/profileSwitchingService.verifyPinAndHandleLockout` (lines 34-200) and `src/services/screenTimeService.js`.
- **PIN lockout**: after **5 failed PIN attempts** the profile auto-locks. Lockout duration escalates by `lockoutCount`: **1st lockout = 15 min, 2nd = 30 min, 3rd+ = 60 min** (lines 120-126). On lock, `failedPinAttempts` resets to 0 and `lockoutCount` increments. `lockoutCount` (the escalation level) resets to 0 after 24 hours since the last lockout. While locked, any attempt returns `PROFILE_LOCKED` with `remainingMinutes`. A successful PIN clears `failedPinAttempts`. PINs are bcrypt-compared.
- **Screen-time enforcement** (`screenTimeService.getScreenTimeUsage` lines 105-147): `effectiveLimitToday = dailyScreenTimeLimit + today's bonus`. `remainingMinutes = max(0, effectiveLimit - usedToday)`. Used time is summed from today's `ScreenTimeLog` rows (sessions starting today). A warning fires at 75% of the effective limit. The limit resets at the next local midnight (`resetTime = tomorrow 00:00`). Lock is reached when remaining hits 0; the client polls and the lock is server-authoritative (no client bypass by clearing localStorage).
- **Update limit** is parent-only and must be `> 0` (`"Daily screen time limit must be greater than 0"`).
- **Extension flow** (`requestScreenTimeExtension` -> `approveScreenTimeRequest` / `denyScreenTimeRequest`): child requests N minutes; a parent approves up to N (`approvedMinutes > requestedMinutes` is rejected; `approvedMinutes <= 0` rejected). Approval writes/increments a `ScreenTimeBonus` for today, which immediately raises the effective limit. Deny records a reason. Status enum is `pending | approved | denied`.

### 3.9 Messaging free-tier gate (CRITICAL)
File: `src/services/directMessageService.sendDirectMessage` (lines 96-129).
- Sender's tier comes from `User.subscriptionTier` (default `"paying"`). Staff = `club_owner_primary | club_owner | sensei | secretary`.
- Rule, in order:
  1. If the sender is staff -> can DM anyone.
  2. Else if sender tier is `paying` -> can DM anyone.
  3. Else (free tier, non-staff): can DM only if the receiver is staff, OR a prior message exists from that receiver to the sender (i.e. you may reply to whoever messaged you first). Otherwise `AuthorizationError "Free tier members can only message club staff, or reply to members who messaged them first"`.
- Cannot message yourself; both parties must be members of the same club.
- **Bulk DM** is staff-only at the route layer (`requireClubStaff`), separate from the per-message gate.

### 3.10 Subscriptions: what free vs premium actually gates server-side
- Default for every new user is `subscriptionTier = "paying"` (set in `authService` at signup and the schema default), so out of the box everyone is effectively premium.
- **Real server-side gates** (not cosmetic):
  - **Messaging** (3.9): free non-staff users are restricted to staff/replies.
  - **Master move library** (`src/services/masterMoveService.js` `_getAccessibleBeltIds`, lines 44-87): free or club-unaffiliated users see ONLY moves on belts with `rank >= 19` (beginner). Non-black-belt paying users see `rank >= 10` (up to Dan-1) but NOT Dan-2..Dan-10. Black-belt holders and club owners see everything. Single-move access enforced again at line 548 (`tier === 'paying' || moveRank >= 19`, else `requiredTier: 'paying'`).
  - **Master warmup library** (`src/services/masterWarmupService.js` lines 37-40): free users only get `tier === 'free'` exercises; `premium` warmups require `paying`. (Note: master-level warmups, not club warmups.)
- So the frontend map's "subscription gating is broadly cosmetic, only messaging matters" is WRONG for the master move and master warmup libraries: those ARE gated server-side.

### 3.11 Notifications: broadcast vs targeted, who can send
File: `src/services/clubNotificationService.js`.
- **Broadcast** (`broadcastNotification`): staff only (`_isStaff`). Creates one `ClubNotification` plus a `ClubNotificationRecipient` row for every active member, then fires push + (for `type: 'alert'`) email. `type` is `alert | announcement | info`.
- Personal/system notifications (`UserNotification`) are created by lifecycle events (join approved/rejected, support replies), not user-sent.

---

## 4. Validation rules that produce user-visible errors (for the flows above)

- **Login lockout**: 5 failed logins -> 30-min lock (`User.lockedUntil`); email must be verified before login (`emailVerified`). (`authService`, CLAUDE.md confirms.)
- **Password**: min 8 chars, 1 uppercase, 1 number, 1 special (Zod `authValidator`).
- **Join request**: `beltId` required on submit; duplicate pending request -> `"You already have a pending join request"`; already a member -> conflict.
- **Approve**: belt must resolve and be active; fee tier override (if given) must be active; already-processed request -> `"This join request has already been processed"`.
- **Sensei assignment**: non-black-belt -> `"Only black belt holders can be assigned the sensei role."`
- **Attendance**: window error strings (3.1); duplicate -> conflict; belt-ineligible -> error; child self-register blocked.
- **QR**: invalid/expired/wrong-club token strings; cannot generate for past class.
- **Exam finalize**: future exam blocked; <2 present examiners blocked; already finalized blocked.
- **Fee tier**: unique name per club (`@@unique([clubId, name])`); club setup requires at least one fee tier in `completeSetup` (`"At least one fee tier is required"`) and unique tier names.
- **Owner ops**: cannot remove primary, cannot remove last owner, transfer target must already be `club_owner`.
- **Screen-time**: limit must be > 0; approved extension cannot exceed requested; cannot approve <= 0.
- **Event scheduling**: mat double-booking returns 409 with `code: 5003` and a `conflicts` array (mat-based availability, all event types).

---

## CORRECTIONS TO THE FRONTEND MAP (`00-app-map.md`)

1. **Subscription gating is NOT "only messaging."** The backend gates the **master move library** and **master warmup library** by tier and belt rank (`masterMoveService`, `masterWarmupService`). Free/unaffiliated users are limited to beginner (rank >= 19) moves; non-black-belt paying users are blocked from Dan-2..Dan-10 moves; free users cannot see `premium` master warmups. The frontend map's traps #5, #6 ("warmup not premium-gated", "subscription gating broadly cosmetic, free users see all library moves/belts/videos") are wrong at the master-library level. CLUB-level (custom) move/warmup visibility is a separate hide/show system and is not tier-gated, which may be where the frontend confusion comes from, but the master catalog IS gated.

2. **Club roles: there is no `admin` and no `club_member` vs `member` split.** The `ClubRoleType` enum is exactly `club_owner_primary | club_owner | sensei | secretary | club_member` (5 values). The frontend's `admin` club role and the `club_member | member` distinction do not exist server-side. Anything the UI labels "admin (club-level)" maps to no backend role and gets no special backend treatment.

3. **Changing a member's role is owner-only, and secretaries/senseis are blocked.** `PUT /members/:memberId/role` is guarded by `checkClubAuthorization('club_owner_primary', 'club_owner')`. The frontend's worry that "secretary is owner in userRole so can reach owner-gated controls" does not translate to role assignment: the backend rejects secretary and sensei here. Sensei reaching Club Settings (frontend trap #11) also will not let them mutate owner-only fields; the per-route guards reject them.

4. **Attendance has a real server-side timing rule that the frontend map does not mention.** Self/child/QR-scan registration is bounded by `[class.date - 14h, class.date + 38h]` ("class day" fuzzed for timezones), and children cannot self-register. STAFF marking attendance has NO timing limit. QR tokens expire at end of the class day. Testers should not treat "scan works on a random day" as correct; outside the window it must fail with `"Students can only register attendance on the class day"`.

5. **Club creation absolutely requires a valid `club_owner` invitation code.** The frontend map says "any user can open the create-club wizard (intended), no role restriction." That is true for the UI, but the backend `createClub` REJECTS the request without a valid, pending, unexpired `club_owner`-type code. A tester who completes the wizard without a real `CO-` code will get an error, not a club. Codes come from an admin (or admin approving a `ClubCreationRequest`).

6. **Member approval does NOT require a fee tier and does NOT require the approver to choose a belt.** A club with zero fee tiers can still approve members (`feeTierId` stays null). Belt defaults to the user's requested belt if the approver gives no override. The only hard requirement is that SOME active belt resolves.

7. **Scan-attendance access is broader than "owner/admin/sensei."** Any class TEACHER (a `ClassTeacher` row, including assistant/guest-linked members) can mark attendance and generate QR for that class, even if they are only `club_member` by club role. Secretary is the one explicitly blocked from marking/QR (confirmed: `checkAttendanceTaker` and `checkClubTeacherOrOwner` exclude secretary), which matches the frontend's "secretary blocked from scan."

8. **"Owner" for backend purposes = `club_owner` + `club_owner_primary` only.** Senseis and secretaries are "staff" but NOT "owners." The frontend's layout-level conflation of secretary/sensei into `userRole==='owner'` has no backend equivalent: owner-only routes (`/owners`, role change, fee tiers, promote, transfer) reject sensei and secretary.

9. **The promotion that matters is exam finalize, not a manual toggle.** Passing an exam at finalize auto-promotes the candidate's belt and resets progress. There is also a separate manual `promoteClubMember` (owner-only). Eligibility (`eligible-students`) is purely informational: it is computed from `classesAttended >= required AND teachingHours >= required` and does not itself promote anyone.

10. **Newsletter exists as a backend model** (`Newsletter` table, `clubMemberService`/club relations) even though the frontend map says "no newsletter feature." It may be unused by the current UI, but the data model and `newsletters` relation are present; do not assert the concept is absent server-side. Social gatherings are indeed just a calendar event type (`SocialGathering`), matching the frontend.

11. **Group chat (`InAppGroup`/`InAppMessage`) is a real, separate backend feature** from 1:1 DMs. The frontend map only documents 1:1 DMs. Group messaging endpoints exist (`messageRoutes.js` `/messages/groups/...`). Whether the UI surfaces it is a frontend question, but the backend supports group chats created by a member.
