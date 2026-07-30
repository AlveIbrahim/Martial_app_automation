# Role: Sensei - Manual QA

**Read [`00-start-here.md`](00-start-here.md) first** (setup, sessions, screen sizes, the do-not-file list, status tags, how to file a bug). This sheet links to it instead of repeating it.

**Who you are:** a sensei (instructor) at a martial arts club. You are teaching staff, not the owner. You CAN run the teaching side of the club: create and edit calendar events, schedule and grade exams, run promotions, manage curricula, view the eligible-students list, manage the club's move and warmup library, and mark attendance (including generating a check-in QR for a class you teach). You CANNOT do owner-only things: you do not manage teachers, change anyone's role, change fee tiers, or add/remove/transfer owners, and the app blocks you from the Analytics and History pages.

**Sessions:** Sensei is a single role. Unless a step says otherwise, you work in **Session A only** (one normal window, logged in as the Sensei). The few flows that need a second person are owned by the cross-role sheet, not here.

**Before the SEN tests:** log in as the seeded Sensei account (START-HERE Section 3) and open the assigned club at `/dashboard/myClub/[clubID]`. Note the club ID you are inside; the app behaves differently per club.

**How you move around the club:** the bar at the top of every club page has tabs - **Overview, Calendar, Members, Sites, Settings** (you, as a sensei, also see the Settings tab; that is part of what SEN-042 checks). Pages like Curricula, Exams, Promotions, Eligible Students, Library, Scan Attendance, Analytics and History are NOT in that tab bar. You reach them from cards or links on the Overview page, or by typing the page address. Each test below tells you exactly how to get there.

**One thing to keep straight (it matters for your scores):** when the app shows you a button or a page, that does not always mean the action will go through. Some owner-only actions are visible to a sensei in the screen but get rejected by the server when you actually try to save. SEN-042 is built around exactly this. When a test says "expected: the save is rejected," a rejection IS the pass.

---

## Index of scenarios in this file

| ID | Title | Status |
|---|---|---|
| SEN-001 | My Club is visible to a sensei | FUNCTIONAL |
| SEN-002 | Open the assigned club overview | FUNCTIONAL |
| SEN-003 | Create / edit a class or workshop (calendar) | FUNCTIONAL |
| SEN-004 | Schedule an exam and grade candidates | FUNCTIONAL |
| SEN-005 | Run the promotion workflow | FUNCTIONAL |
| SEN-006 | Manage curricula | FUNCTIONAL |
| SEN-007 | View eligible students | FUNCTIONAL |
| SEN-008 | Manage library content | FUNCTIONAL |
| SEN-009 | Scan attendance / generate a class QR | FUNCTIONAL |
| SEN-010 | Take room-level attendance | FUNCTIONAL |
| SEN-011 | Teaching schedule filter on the Calendar | FUNCTIONAL |
| SEN-040 | BLOCKED: Analytics | FUNCTIONAL (expected: access restricted) |
| SEN-041 | BLOCKED: History | FUNCTIONAL (expected: access restricted) |
| SEN-042 | PROBE: can a sensei reach and save Club Settings? | KNOWN-GAP (record observations) |
| SEN-043 | BLOCKED: Manage Teachers | FUNCTIONAL (expected: owner-only block) |
| SEN-044 | BLOCKED: change roles / add / remove / transfer owner | FUNCTIONAL (expected: controls absent or rejected) |

---

## Teaching surface (the things a sensei CAN do)

### SEN-001 - My Club is visible to a sensei

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A, normal window)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** global navigation, `/dashboard/myClub`
- **Goal:** Prove a sensei sees the My Club area and can open the club they teach at.

**Preconditions / setup:**
1. Logged in as the seeded Sensei (START-HERE Section 3) in the club where you hold the sensei role.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Look at the main menu (bottom bar on phone, side menu on desktop) | A "My Club" entry is present. It appears for anyone who belongs to a club, staff or not, so this confirms your club membership resolved - not that you hold a staff role. |
| 2 | Open "My Club" | You land on the club overview at `/dashboard/myClub/[clubID]`. `/dashboard/myClub` is not a picker - it forwards you straight to your first club. |
| 3 | Check you landed in the club you teach at | The overview is for that club. If you hold roles in several clubs you are sent to the first one, so switch clubs from the club switcher if it is not the one you meant. |

**Screen-size check:** On a phone (<640px) the menu is the bottom bar; at desktop (>=1024px) it is the side menu. "My Club" is reachable in both.

**Edge cases to try:**
- If you also hold a role in another club, "My Club" still sends you to the first one; confirm you can switch to the other.
- Refresh on the club overview: the page reloads without bouncing you out.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID (file in ClickUp, cite the scenario ID; see START-HERE Section 9):

---

### SEN-002 - Open the assigned club overview

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `/dashboard/myClub/[clubID]`
- **Goal:** Prove the club overview loads for a sensei with the teaching links available.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club at `/dashboard/myClub/[clubID]` | The overview loads: club banner, basic stats, a members preview, and links/cards to the club's pages. No error or blank screen. |
| 2 | Look at the tab bar at the top | You see Overview, Calendar, Members, Sites, and Settings. |
| 3 | Scroll the overview for links to Curricula, Exams, Promotions, Eligible Students, Library, Scan Attendance | Those links are present (this is how you reach the pages used in the later tests). |

**Screen-size check:** On a phone the stats and cards stack in one column; on desktop they spread across the width. Nothing is cut off at the ~768px boundary.

**Edge cases to try:**
- Refresh mid-load: the overview re-fetches and renders, no stuck spinner.
- Switch language to French and reload: labels translate, layout does not break.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-003 - Create / edit a class or workshop (calendar)

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove a sensei can create a calendar event (a class), then edit it, and the change sticks.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. The club has at least one site and at least one room (a room is required to schedule). If it does not, this is owner/secretary setup; ask your QA lead to seed a room, or use a club that already has one.

> Note: create classes from the **Calendar** (this test), not from inside a Room. The room's own class-create picker shows placeholder teacher names and is a known gap (START-HERE Section 8, item 6). Do not file that.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Calendar tab | The calendar loads with any existing events. No "access restricted" block; a sensei may create events here. |
| 2 | Start creating a new event (the add/create control on the calendar) | A create panel opens with event-type choices (class, exam, workshop, social gathering, tournament) and fields for date, time, and room. |
| 3 | Pick "class," set a date and time, choose the room from step 2, and pick a real teacher if asked | Fields accept your input; the teacher list shows real club members (not placeholder names). |
| 4 | Save the event | The event is created and appears on the calendar at the date/time you set. |
| 5 | Open the event you just made and change its time, then save | The event moves to the new time and the change persists after a refresh. If it is a one-off class starting within the next 2 hours, soft-cancel/reschedule is blocked by a late-cancel threshold; use a class further out to test a normal edit. If it is a recurring occurrence, you are asked whether the change applies to this class, this-and-future, or all classes in the series. |
| 6 | On the event's calendar popup, look for a quick way to swap the assigned teacher without reopening the full edit form | A small teacher-reassignment picker is available right in the popup, offering real club members (staff only see this control). |

**Screen-size check:** The calendar switches from a compact day/list view on phone to a wider month grid on desktop. The create panel is fully usable, with the Save button reachable by thumb, on a <640px screen.

**Edge cases to try:**
- Try to save with a required field empty (no room, or no date): a clear validation message appears and nothing is created.
- Schedule onto a room/time that is already taken: the app should warn you about the clash rather than silently double-book.
- Cancel out of the create panel halfway: no half-made event is left behind.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-004 - Schedule an exam and grade candidates

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/exams`, `.../[clubID]/exams/[examID]/grading`
- **Goal:** Prove a sensei can schedule an exam, grade candidates, and that the finalize rules behave as designed (two examiners present, no future-dating, a pass promotes the candidate).

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. The club has belt levels defined and at least a couple of members who can be candidates and examiners (owner/secretary setup; use a seeded club).
3. TIME-SENSITIVE: to actually finalize, you need an exam whose date is today or in the past (a future-dated exam cannot be finalized). For the scheduling part you may use any date; for the finalize part, schedule it for today.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Exams page | The exam list loads. No "access restricted" block; a sensei may manage exams. A "create exam" control is available. Exam status badges are derived live from the clock (club timezone): "Upcoming" before start time, "In Progress" once start time passes, "Graded"/"Completed" only after finalize. |
| 2 | Create an exam: set its name (or use auto-name), date, time, room, the target belt, and add examiners and candidates. The candidate picker should default to eligible members only | Fields accept input; you can add at least two examiners and one or more candidates. Save. A past date is rejected with "Cannot schedule an exam in the past". |
| 3 | The new exam appears in the list with status "Upcoming" | The exam is saved and listed. |
| 4 | Open the exam's grading screen before its start time | Blocked with an "Exam Not Yet Conducted" screen - correct, not a bug. |
| 5 | Open the exam's grading screen once its start time has passed (status "In Progress") | The grading view opens with your candidates listed and a way to mark each examiner present and record a pass/fail per candidate. |
| 6 | Mark only ONE examiner present and try to finalize | Finalize is refused with a message that at least two examiners must be present. (This refusal is the expected result.) |
| 7 | If the exam date is in the future, try to finalize | Finalize is refused because the exam has not been conducted yet. (Expected. Re-schedule it for today to proceed.) |
| 8 | Mark TWO examiners present, set one candidate to "pass," and finalize | Finalize succeeds. The candidate graded "pass" is automatically promoted to the target belt (their belt changes; their progress resets toward the next belt). A "draft save" earlier would NOT have promoted anyone. |

**Screen-size check:** The grading screen is wide; on phone the candidate rows stack and the present/result controls stay reachable, on desktop they sit in a table.

**Edge cases to try:**
- Save grading as a draft (not finalize): the exam is NOT marked complete and no one is promoted.
- Try to finalize an exam that is already completed: it is refused.
- Leave a candidate at "pending" and finalize: confirm only "pass" candidates get promoted.
- On the Calendar (not the Exams page), find this exam's popup and use its "Grade" shortcut button: disabled until start time, then jumps straight into grading, matching the status badge shown there.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-005 - Run the promotion workflow

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/promotions`
- **Goal:** Prove a sensei can open and use the promotion workflow (the eligibility -> schedule -> conduct flow), and is not blocked from it.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. Belt levels defined; some members with attendance/curriculum progress so the workflow has data to show.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Promotions page | The promotion workflow loads. No "access restricted" block; a sensei is permitted here. |
| 2 | Step through the workflow stages it shows (eligibility, schedule, conduct) | Each stage opens and shows its data without error. |
| 3 | Do whatever the workflow's first actionable step is (for example, pick eligible members to put forward) | The action is accepted and the workflow advances. |

**Screen-size check:** The workflow steps stack vertically on phone and lay out in a row/stepper on desktop; the active step's controls are reachable on a <640px screen.

**Edge cases to try:**
- Open promotions on a club with no eligible members: a clean empty state, not an error.
- Refresh mid-workflow: you return to a sensible state, not a crash.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-006 - Manage curricula

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/curricula`
- **Goal:** Prove a sensei has the management view of curricula (not the member self-enroll view) and can create or edit a curriculum.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Curricula page | The page loads in management mode: you see the club's curricula with a "create" control, not the read-only "my curricula" view a plain member gets. |
| 2 | Create a new curriculum (name it, fill its fields) and save | The curriculum is created and shows in the list. |
| 3 | Open an existing curriculum and edit a field, then save | The change persists after a refresh. |
| 4 | Assign the curriculum to a member (if the screen offers it) | The assignment is accepted. |

**Screen-size check:** The curricula list is cards on phone and a wider grid/table on desktop; the create panel's Save button is reachable on a <640px screen.

**Edge cases to try:**
- Create with a blank required field: a validation message appears, nothing saved.
- Cancel a half-filled create: no stray empty curriculum left.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-007 - View eligible students

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/eligible-students`
- **Goal:** Prove a sensei can open the eligible-students list and read who is ready for promotion.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. Some members with attendance/curriculum progress so the list has eligible and not-eligible entries.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Eligible Students page | The page loads with counts at the top (total students, eligible, not eligible). No "access restricted" block; a sensei is permitted. |
| 2 | Read the table/cards | Each student shows their current belt, next belt, class progress (attended out of required), teaching hours where required, and an Eligible / Not Eligible status. |
| 3 | Hover or focus a "Not Eligible" status | A tooltip lists what is still missing (for example, classes remaining). |
| 4 | Use the search box and the Belt / Curriculum / Role / Status filters | The list narrows to match; the result count updates. |
| 5 | Open a student's attendance history | A history view opens for that student. |

**Screen-size check:** Desktop shows a full table; below the large breakpoint it switches to stacked cards with a mobile sort bar. Check both, especially around 768px.

**Edge cases to try:**
- Filter to a combination that matches no one: a clean "no students found" state, not an error.
- Note: only recurring and curriculum classes count toward "classes attended"; one-off classes do not. If a member's count looks lower than the raw number of classes you remember, that is by design, not a bug.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-008 - Manage library content

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/library/manage` (moves/media), `.../[clubID]/library/warmup/manage` (warmups)
- **Goal:** Prove a sensei can add or edit club library content (moves, media, warmups).

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the club Library, then its manage view | The management view loads with the club's moves/media and a "create" or "add" control. No block for a sensei. |
| 2 | Create a new move/media entry (fill its fields; attach an image or video if the form allows) | The entry is created and shows in the club library. |
| 3 | Open an existing entry and edit it, then save | The change persists after a refresh. |
| 4 | Open the club Warmup library's manage view and add or edit a warmup | The warmup is saved and listed. |
| 5 | Play a library video | It plays as a normal video file. (Quality switching / adaptive streaming is not built; do not file that, START-HERE Section 8 item 2.) |

**Screen-size check:** The manage list is cards on phone, a wider grid on desktop; upload and Save controls are reachable on a <640px screen. For attaching media captured from a camera, use a real phone.

**Edge cases to try:**
- Save with a required field empty: validation message, nothing created.
- Cancel a half-filled upload: no broken/empty entry left.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-009 - Scan attendance / generate a class QR

- **Status:** FUNCTIONAL  (needs a real rear-camera phone over a secure connection for the scan)
- **Role(s) & sessions:** Sensei (Session A, on a real phone for the camera step)
- **Solo or 2 testers:** Solo-with-tabs (the member's QR can be opened in a second window/device and pointed at your camera)
- **Route(s) / feature:** `.../[clubID]/scan-attendance`; the class check-in QR is generated for a class you teach
- **Goal:** Prove a sensei can open the scan-attendance screen (the secretary block does NOT apply to you) and that the camera flow and duplicate handling behave.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club, on a real phone (rear camera, secure connection or localhost).
2. A class exists with a valid check-in QR, and a member QR or class QR is available to point the camera at.
3. TIME-SENSITIVE: attendance check-in via a member scanning a class QR only works on the class day window (anchored on the class date, with a wide grace either side). If you are testing a member's self check-in path, the class must be dated for today. A sensei marking attendance directly has no such timing limit. If a scan is refused with "students can only register attendance on the class day," check the class date before treating it as a bug.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Scan Attendance page | The page loads with a camera/QR area and a "Start Scanning" button. You do NOT see the "Access Restricted" screen (only a secretary is blocked here). |
| 2 | Tap "Start Scanning" and allow camera access when asked | A live rear-camera viewfinder appears with a framing box and a "point camera at the QR code" hint. |
| 3 | Point the camera at a valid attendance QR | The code is read; a success screen says attendance was marked for the right person/class. |
| 4 | Scan the same QR for the same person/class again | It is handled cleanly (already-marked / no double count), not a crash and not a second record. |
| 5 | Generate or use the class check-in QR for a class you teach | A QR/token is produced for that class (you can do this as a teacher of the class). |

**Screen-size check:** The scanner is phone-first: the viewfinder fills a <640px screen and Stop/Cancel are reachable by thumb. On a wider screen the layout may show the scanner beside an optional panel.

**Edge cases to try:**
- Deny camera permission: a clear "camera permission denied" message. In French this is one of three camera messages that stay in English (known gap, do not file, START-HERE Section 6).
- Scan a non-attendance / invalid QR: a friendly "invalid or expired QR" message, no attendance recorded.
- Scan a QR for a class on a different club: it is rejected as not belonging to this club.
- A member whose belt is outside the class's allowed belt range: their check-in is rejected with a belt-eligibility message.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-010 - Take room-level attendance

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/site/[siteId]/rooms/[roomId]/attendance`
- **Goal:** Prove a sensei can take attendance from a room (marking members present/absent without scanning).

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. The club has a site with a room, and a class in that room.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open Sites, then the site, then a room, then its attendance view | The room attendance view loads with the class roster. No block for a sensei. |
| 2 | Mark a member present | The member is recorded present; the change shows immediately. |
| 3 | Mark another member absent, then change them back to present | The toggles update without error. |
| 4 | Mark the same member present twice | Handled cleanly (no duplicate record). |

> Note: as a sensei (staff) marking attendance directly, there is no class-day timing limit; you can record it for a class on any day. The day-window limit applies only when a member self-registers by scanning a QR (see SEN-009).

**Screen-size check:** The roster is a stacked list on phone and a wider table on desktop; the present/absent controls are reachable on a <640px screen.

**Edge cases to try:**
- Refresh mid-marking: the marks you saved are still there.
- Open a room with no class scheduled: a clean empty state.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-011 - Teaching schedule filter on the Calendar

- **Status:** FUNCTIONAL
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/calendar`
- **Goal:** Prove the Calendar's Teaching/Attending filter defaults sensibly for a sensei and lets them check another teacher's schedule.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. Ideally the club has at least one class taught by you and one taught by a different teacher, plus one class you are enrolled in as a student (curriculum), so you can tell the views apart.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Calendar | It defaults to a "Teaching · Mine" view: only events where you are the assigned teacher are shown. |
| 2 | Switch the filter to "Attending" | The calendar now shows classes you are enrolled in / attending as a student instead of the ones you teach. |
| 3 | Open the `[Name ▾]` teacher dropdown | You can pick another teacher to view their schedule; as a sensei (not owner), this list is scoped, not the full club roster. |
| 4 | Enroll or unenroll a member in a curriculum tied to a class, then return to the Calendar | The calendar refreshes to reflect the curriculum change without a manual reload. |

**Screen-size check:** The Teaching/Attending toggle and the teacher dropdown stay reachable and don't overlap the calendar grid on a <640px screen.

**Edge cases to try:**
- Confirm a plain member never sees this toggle at all (their calendar is attendance-only, no filter).
- As the owner (a second login), confirm the equivalent dropdown offers the FULL teacher roster, not just a scoped subset like the sensei's.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

## Access-control battery (the things a sensei is BLOCKED from)

> For these, the BLOCK is the expected result. A clean "access restricted" screen, a missing control, or a server-rejected save is a PASS, not a bug. Only file if you can actually do the blocked thing (for example, an owner-only change saves successfully as a sensei).

### SEN-040 - BLOCKED: Analytics

- **Status:** FUNCTIONAL (expected: access restricted)
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/analytics`
- **Goal:** Prove the app blocks a sensei from the Analytics page even though a sensei runs most of the teaching surface.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Go to the club Analytics page (open it from a link if one is shown, or type `.../[clubID]/analytics` in the address bar) | An "Access Restricted" screen appears: a message that you do not have permission to access analytics, plus a "Go Back" button. You do NOT see any analytics charts or tabs. |
| 2 | Tap "Go Back" | You return to the previous page. |

**Screen-size check:** The Access Restricted card is centered and readable on both a phone and a desktop width; the Go Back button is reachable on a <640px screen.

**Edge cases to try:**
- Reload directly on the analytics address: still the Access Restricted screen (no flash of real charts that then stays visible).
- Switch to French: the restriction screen still appears (text translated where available).
- If you can actually see analytics charts as a sensei, THAT is a bug: file it.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-041 - BLOCKED: History

- **Status:** FUNCTIONAL (expected: access restricted)
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/history`
- **Goal:** Prove the app blocks a sensei from the attendance + promotion History page.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Go to the club History page (from a link if shown, or type `.../[clubID]/history`) | An "Access Restricted" screen appears with a message and a "Go Back" button. You do NOT see the attendance or belt-promotion history charts or tables. |
| 2 | Tap "Go Back" | You return to the previous page. |

**Screen-size check:** The restriction card is centered and readable on phone and desktop; Go Back reachable on a <640px screen.

**Edge cases to try:**
- Reload directly on the history address: still blocked.
- A brief loading skeleton may flash before the block resolves; the end state must be the restriction screen, not the history data.
- If you can actually read history data as a sensei, THAT is a bug: file it.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-042 - PROBE: can a sensei reach and save Club Settings?

- **Status:** KNOWN-GAP (this is the most important check on this sheet - record observations, do not just tick pass/fail)
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** Club `Settings` tab / `.../[clubID]/settings`
- **Goal:** Find out exactly how far a sensei gets in Club Settings: can they OPEN it, can they CHANGE a field, and when they SAVE does it actually go through or does the server reject it? Owner-only writes must be rejected for a sensei even if the screen lets them try.

> Why this test is special: a sensei is treated as an "owner-level" user in parts of the app, so the Settings tab is shown to a sensei and the Settings page opens for a sensei. That does NOT mean a sensei is allowed to change owner-only settings. The real gate is on the server: when a sensei tries to save an owner-only change, the save should be rejected. Your job is to record what actually happens at each step, not to assume.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. Have a notepad ready: you will record three things (can open, can change a field, does the save succeed or fail).

**Steps:**
| # | Action (click-by-click) | Expected result / what to record |
|---|---|---|
| 1 | Look at the club tab bar | RECORD: is a "Settings" tab visible to you as a sensei? (Expected: yes, it is shown.) |
| 2 | Open the Settings page (tap the tab, or type `.../[clubID]/settings`) | RECORD: does the Settings page OPEN, or do you get an "Access Denied" card? (Expected per current build: it opens.) |
| 3 | On the General tab, change a basic club field (for example the club name or website) | RECORD: does the field let you type a change? |
| 4 | Tap "Save Changes" | RECORD the exact outcome: a green "Saved" confirmation, OR an error toast / failure message. Note which. This is the key data point: an owner-only write by a sensei should be REJECTED by the server. |
| 5 | Reload the page and look at that field | RECORD: did your change actually persist, or did it revert? (If it reverted or the save errored, the server rejected it: that is the expected, healthy behavior.) |
| 6 | Look at the other Settings tabs (Subscriptions / billing, Club Fee Tiers, QR code) | RECORD: which tabs you can open. Note the billing/payment form is a mock with no real checkout (do not file that, START-HERE Section 8 item 4). |
| 7 | Try a clearly owner-only change if one is reachable here (for example creating or editing a fee tier) | RECORD: does the save succeed or get rejected? (Expected: rejected for a sensei.) |

**What a PASS looks like:** the sensei can open Settings (UI quirk), but any owner-only SAVE is rejected by the server (error message, or the change does not persist on reload). **What is a real BUG to file:** a sensei successfully SAVES an owner-only change (it persists after reload, no error). In that case file it and quote SEN-042, and write down exactly which field saved.

**Screen-size check:** Settings uses a left-label / right-field two-column layout on desktop that stacks to one column on phone; the tab strip scrolls horizontally on a narrow screen. Confirm the Save button is reachable on a <640px screen.

**Edge cases to try:**
- Try saving with the club name blank: a "club name required" style message (this is plain validation, separate from the permission question).
- Switch to French and repeat step 4: note whether the success/error message still appears correctly.

**Result capture:**
- PASS / FAIL: [ ]  (PASS = could open but owner-only saves were rejected)
- Can OPEN Settings: [ ] yes [ ] no
- Can CHANGE a field: [ ] yes [ ] no
- SAVE outcome: [ ] succeeded and persisted (BUG - file it) [ ] errored / did not persist (expected)
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-043 - BLOCKED: Manage Teachers

- **Status:** FUNCTIONAL (expected: owner-only block)
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/teachers`
- **Goal:** Prove a sensei cannot use the Manage Teachers page (adding or revoking senseis is owner-only).

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Go to the Manage Teachers page (type `.../[clubID]/teachers` in the address bar) | An "Access Restricted" / owner-only screen appears: a message that this is for owners only. You do NOT see the add-sensei or revoke-sensei controls. |
| 2 | Confirm there is no way to add or revoke a sensei from here | No working teacher-management control is available to you. |

**Screen-size check:** The owner-only card is centered and readable on phone and desktop.

**Edge cases to try:**
- Reload directly on the teachers address: still the owner-only block.
- If you can actually add or revoke a sensei as a sensei, THAT is a bug: file it and quote SEN-043.

**Result capture:**
- PASS / FAIL: [ ]
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:

---

### SEN-044 - BLOCKED: change roles / add / remove / transfer owner

- **Status:** FUNCTIONAL (expected: controls absent, or any attempt is rejected)
- **Role(s) & sessions:** Sensei (Session A)
- **Solo or 2 testers:** Solo-with-tabs
- **Route(s) / feature:** `.../[clubID]/members`
- **Goal:** Prove a sensei cannot change a member's role, cannot add or remove a co-owner, and cannot transfer primary ownership. These are owner-only; the server rejects a sensei even if a control happens to be visible.

**Preconditions / setup:**
1. Logged in as the Sensei, inside the club.
2. The club has at least one other member and at least one owner, so the controls would have something to act on.

**Steps:**
| # | Action (click-by-click) | Expected result |
|---|---|---|
| 1 | Open the Members page | The roster loads (a sensei can view members). |
| 2 | Open a member from the roster | Expected: no "Assign Role" button for you. Currently the button IS offered - mark this step FAIL against the existing bug (see the note below). |
| 3 | Click "Assign Role" and open the role dropdown | You are offered only Club Member, Secretary, and Sensei (Sensei only for a black-belt member). "Club Owner" and "Primary Owner" are NOT in the list. There is no separate add/remove co-owner control and no transfer-ownership control anywhere in the app - those grants are made only by picking the matching role here, and only the primary owner is offered them. |
| 4 | Pick one of the roles you ARE offered and save | The save is rejected by the server (changing a member's role requires owner or primary owner). Reload and confirm the member's role is unchanged. |
| 5 | Look for fee-tier controls (create/edit a membership fee tier) | Expected: not offered to you, or any attempt is rejected (fee tiers are owner-only). |

> **Step 2 is expected to FAIL right now - that is the point.** Assigning roles
> is owner-only, so a sensei should not be shown the "Assign Role" button at
> all. It is shown because the app treats sensei, secretary and admin as
> `userRole: 'owner'` for the club being viewed, and that button is gated on
> `userRole` rather than the club role. Mark step 2 FAIL and reference the
> existing bug rather than raising a new one. The server still refuses the save
> (step 4), so no data is at risk - the defect is that a control which can
> never succeed is offered. Same root cause as SEC-043 and SEN-042.

**What is a real BUG to file:** any of these owner-only changes actually goes through as a sensei (the role changes, an owner is added/removed, primary is transferred, or a fee tier is created/edited, and it persists after reload). File it and quote SEN-044, noting exactly which action succeeded. In particular, if the save in step 4 succeeds, that is a genuine privilege escalation - file it immediately.

**Screen-size check:** The members roster is a stacked list on phone and a table on desktop; confirm no owner-only control is hiding behind a row menu that only appears at one size.

**Edge cases to try:**
- Check both the per-member row menu AND any bulk-action bar for an owner-only control that should not work for you.
- Switch to French and re-check: the same controls should be absent or rejected.

**Result capture:**
- PASS / FAIL: [ ]  (PASS = controls absent, or attempts rejected and nothing persisted)
- Screen size tested: [ ] phone (<640) [ ] tablet (~768) [ ] desktop (>=1024)
- Language tested: [ ] EN [ ] FR
- Notes / bug ID:
