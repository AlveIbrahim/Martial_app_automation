# START HERE - Martial Apps Manual QA

Read this whole page once before you open any test sheet. It tells you how to set up, how to run cross-role tests on your own, what NOT to file as a bug, and how to log the bugs you do find. It takes about five minutes and will save you hours.

---

## 1. What you are testing

Martial Apps is a web app for martial arts clubs that runs in any modern browser on phone, tablet, laptop, and desktop, and can also be installed as an app (a PWA). The layout adapts to the screen it runs on. Different people use it in different roles: club owners, senseis, secretaries, ordinary members, and parents who manage child profiles. Each role sees a different version of the app.

You will test it the way a real person would: by clicking through real flows on a real screen and checking that what happens matches what the test sheet says should happen.

**The test environment:** `[APP_URL]` - *(the team fills this in: the web address you open to test).* Use this same address for every scenario unless a scenario says otherwise.

---

## 2. Pick your sheet (you do NOT test every role)

You are assigned a role (or a journey). Open only the file you need:

| You are testing... | Open this file |
|---|---|
| Club Owner (primary / founder) | `role-owner-primary.md` |
| Co-owner or club Admin | `role-owner-secondary.md` |
| Sensei (instructor) | `role-sensei.md` |
| Secretary | `role-secretary.md` |
| Ordinary club member | `role-member.md` |
| Parent (household / child profiles) | `role-parent.md` |
| Child profile | `role-child.md` |
| Flows that need two roles at once (attendance, approvals, live chat...) | `cross-role-journeys.md` |
| French, screen sizes, install, offline, live updates | `cross-cutting-checks.md` |

Inside each file, every test has a permanent ID like `OWP-006` or `CR-001`. **Always quote that ID when you report a bug.**

---

## 3. Your test accounts

The team gives you a ready-made club ("the test club") with one account per role already set up. The quickest way the team makes this is the admin Demo Clubs tool, which spins up a populated club plus a set of demo logins that all share the password `Demo@1234`. Your QA lead runs that and hands you the logins. Fill them in here before you start:

| Role | Login (email/username) | Password | Notes |
|---|---|---|---|
| Owner Primary | `[fill in]` | `[fill in]` | Founder of the test club |
| Owner Secondary / Co-owner | `[fill in]` | `[fill in]` | |
| Sensei | `[fill in]` | `[fill in]` | |
| Secretary | `[fill in]` | `[fill in]` | |
| Member (free) | `[fill in]` | `[fill in]` | Ordinary student. For the messaging-limit test it must be a genuinely FREE account (new sign-ups default to premium), or the limit won't show. |
| Member 2 (free) | `[fill in]` | `[fill in]` | Second student, needed for the messaging-limit test |
| Parent | `[fill in]` | `[fill in]` | Owns the household + child profiles |

**Test club ID / name:** `[fill in]` - note this down; some pages change depending on which club you are inside.

**Creating a brand-new club (the ONB create-club test):** creating a club needs a one-time club-creation code that only a platform admin can issue (or approve a request for). Get a valid code from your QA lead before running that test, or it will stop at an "invalid code" error. Most testers do not need this; the seeded/demo club above is enough for everything else.

**You will also create some accounts from scratch.** A few tests (the ones with IDs starting `ONB-`) ask you to register a brand-new account, verify an email, or join a club fresh. For those, use a real email inbox you control. A quick trick: if your email is `you@gmail.com`, you can register as `you+test1@gmail.com`, `you+test2@gmail.com`, and so on, and every message still arrives in your one inbox.

---

## 4. How to play two roles at once (the important part)

Many real flows need two people: a sensei creates a class and a student attends it; an owner approves a member who just applied; one person sends a chat and the other receives it. **You do NOT need a second tester for most of these.** You play both roles yourself, in two separate logins, side by side.

The trick is that each login lives in its own browser "session." Here is how to get more than one at the same time:

| You need... | Do this |
|---|---|
| **2 roles at once** | Open the app in a **normal Chrome window** (role 1) AND an **Incognito window** (role 2). Log into a different account in each. They stay separate. |
| **3 roles at once** | A normal window + an Incognito window gives you only **two** logins, because all Incognito windows in Chrome share one session. For a third role, open a **different browser** (Firefox or Edge) or a **second Chrome profile** (Chrome menu, top-right circle, "Add" a profile), and log in there. |
| **Testing on phones** | A phone browser is one login. To play two roles on mobile, use **two phones**, or one phone + a desktop. |

**To open an Incognito window in Chrome:** click the three-dot menu (top right) → "New Incognito window," or press `Ctrl+Shift+N` (Windows) / `Cmd+Shift+N` (Mac).

Throughout the cross-role sheet you will see **Session A**, **Session B**, **Session C**. That just means:
- **Session A** = your normal window (role 1)
- **Session B** = your Incognito window (role 2)
- **Session C** = a second browser or Chrome profile (role 3, only when needed)

Each cross-role test tells you exactly which session does each step. Follow the session labels and you can run the whole thing alone.

**Timing:** some flows only work if data is "live" right now (for example, you can only take attendance for a class that is happening now). The test sheet handles this by telling you to **create that class with its start time set to now** as a setup step, just before you test the attendance part. Always do the setup steps in order and you will not get stuck.

---

## 5. Test on more than one screen size

The app runs on every screen size and re-arranges itself at certain widths. It is used on desktops and laptops as much as on phones, so do NOT test only on a phone. Test each scenario on more than one size, including a phone size AND a desktop size. The most important boundary is **768px** - that is where the bottom menu bar switches to a side menu and some screens switch from one panel to two.

| Size | Width to use | What to watch for |
|---|---|---|
| Phone | ~375-390px (e.g. iPhone SE, Pixel) | Bottom menu bar shows; buttons reachable by thumb; nothing cut off |
| Tablet | ~768px (the tricky boundary) | The layout switches here - check nothing breaks right around this width |
| Desktop | 1280px and up | Side menu shows; wider panels; two-panel screens |

**Easiest way to change size:** in Chrome, press `F12` to open DevTools, then click the little phone/tablet icon (top-left of the DevTools panel) to switch into device mode, and pick a device or drag the width. For QR scanning, camera upload, install-to-home-screen, and pull-to-refresh, use a **real phone** - those features need real hardware.

---

## 6. Test in both languages

The app supports **English** and **French**. Switch language from the in-app Language selector (in the header/settings). When you test a scenario in French, watch for text that overflows or breaks the layout (French is often longer than English).

Known: three error messages on the QR scanner (camera not supported / permission denied / camera not found) are **not translated** and will show in English even in French mode. That is a known gap, not a bug you need to file.

---

## 7. Status tags on each test

Every scenario carries a status so you know what "correct" looks like:

- **FUNCTIONAL** - fully built. It should work end to end. If it doesn't, that's a bug.
- **PARTIAL** - mostly built, with a known rough edge the scenario will point out. Only file a bug for the parts marked as expected-to-work.
- **STUB** - placeholder only, not built yet. The scenario just asks you to confirm it's still a placeholder. **Do not file "this doesn't work."**
- **KNOWN-GAP** - a known limitation we are checking on purpose (often a permission question). The scenario tells you exactly what to record. Do not file the known part as a surprise bug.

---

## 8. DO NOT file bugs on these (known and expected)

These are already known. Filing them wastes everyone's time. The relevant scenarios will remind you, but here is the master list:

1. **The "Portal" page** - every button is disabled / "Coming Soon." It's a placeholder.
2. **Video quality switching / adaptive streaming** - not built. Videos play as plain video files only.
3. **Offline use of your data** - not built. The app may load its shell offline, but your clubs/messages/etc. will not work without a connection.
4. **Buying a subscription / upgrading to premium / entering a card** - the billing screen is a mock. There is no real checkout or payment anywhere. What free vs premium actually affects is covered in #5.
5. **Seeing fewer items in the move or warmup library** - content visibility depends on your subscription tier and your belt rank, by design. Free or lower-belt accounts see fewer master-library moves/warmups (beginners see beginner moves only; non-black-belts do not see the highest "Dan" moves). If a library test expects you to see or not see something, the scenario will say so. New accounts default to premium, so to test the FREE limits, an account has to be set to free first. (Per-club custom content the club itself adds is a separate show/hide and is not tier-gated.)
6. **Fake teacher names** when creating a class **inside a Room** - that picker uses placeholder names. To create a class with real teachers, use the **Calendar** or the **club overview** instead.
7. **The "Financial" analytics tab** - disabled on purpose. Other analytics tabs are real.
8. **No admin or support dashboard** - those roles exist in the system but have no screens yet.
9. **No newsletter feature and no website-builder** - "social gatherings" is just a type of calendar event.
10. **A child profile being able to reach Messages/Support by typing the URL** - the menu hides those for children, but the page can still be opened directly. That's current behavior; just confirm the child can't actually send/save anything. Don't file the reachability itself.
11. **Being bounced to the login screen with "session expired"** if your login got into a half-valid state - log back in and continue.

If something is NOT on this list and it doesn't match the scenario's expected result, that IS a bug. File it.

---

## 9. How to file a bug (ClickUp)

When a step's result does not match the "Expected result" (and it's not on the do-not-file list above), file it in **ClickUp**:

1. Create a task in the QA bug list: `[ClickUp QA bug list - fill in the link]`.
2. **Title:** `[BUG] <scenario-ID> - <short summary>` (example: `[BUG] OWP-010 - Approving a join request shows a spinner forever`).
3. Set the status to your team's bug-intake status (e.g. **Reported**).
4. In the description, include:
   - **Scenario ID** (e.g. `OWP-010`) and which step number failed
   - **Role** you were using and **which club**
   - **Screen size** (phone / tablet / desktop) and **language** (EN / FR)
   - **Steps to reproduce** (copy the steps you did)
   - **Expected** result (from the sheet) vs **Actual** result (what really happened)
   - A **screenshot or screen recording** if you can
   - **Severity:** Blocker (can't continue) / Major (feature broken) / Minor (cosmetic)

Always quote the scenario ID. It lets anyone trace the bug straight back to the exact test.

---

## 10. Golden rules

- Do the setup steps in order. Most "it won't let me" problems are a skipped setup step.
- Note which club you are inside - the app behaves differently per club.
- When you switch roles, switch the whole window/session, not just the account, so logins don't collide.
- Re-read the "Expected result" before deciding something is broken.
- One bug per ClickUp task, with the scenario ID in the title.
- When in doubt about whether something is a real bug, check the do-not-file list (Section 8) first, then ask.
