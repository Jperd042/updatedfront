# Booking Operations Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the web booking operations page into a consistent operations control panel while preserving the current dark/orange theme and leaving the calendar view styling intact.

**Architecture:** Keep the redesign local to the web booking surface by updating `frontend/src/app/bookings/BookingsList.js` and adding booking-page-specific utility classes in `frontend/src/app/globals.css`. Use lightweight source-contract scripts under `frontend/scripts/` as the TDD harness so the visual structure, action hierarchy, and calendar-preservation rules can be validated before and after implementation.

**Tech Stack:** Next.js App Router, React client components, Tailwind utility classes, shared theme tokens from `globals.css`, Node-based verification scripts

---

## File Structure

- Create: `frontend/scripts/test-bookings-control-panel-ui.mjs`
- Create: `frontend/scripts/test-bookings-slot-card-actions.mjs`
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/app/bookings/BookingsList.js`
- Preserve: `frontend/src/app/bookings/BookingsCalendarView.js`
- Verify: `frontend/package.json` existing `build` script

## Notes For The Implementer

- Do not change backend calls, status logic, queue logic, or calendar component styling.
- Do not redesign `BookingsCalendarView.js`; only harmonize the surrounding page chrome.
- Keep the current dark/orange theme tokens as the source of truth.
- Long slot names such as `Late-Day Pickup / Quick Checks` must remain readable without breaking card actions.
- The plan uses source-contract scripts because this repo already uses that pattern for booking UI checks and does not have a dedicated component test runner for this page.

### Task 1: Add Booking Page UI Contract Tests

**Files:**
- Create: `frontend/scripts/test-bookings-control-panel-ui.mjs`
- Create: `frontend/scripts/test-bookings-slot-card-actions.mjs`
- Test: `frontend/scripts/test-bookings-control-panel-ui.mjs`
- Test: `frontend/scripts/test-bookings-slot-card-actions.mjs`

- [ ] **Step 1: Write the failing control-panel contract test**

```javascript
import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve(process.cwd(), 'src', 'app', 'bookings', 'BookingsList.js')
const content = fs.readFileSync(filePath, 'utf8')
const failures = []

const requiredSnippets = [
  'booking-page-shell',
  'booking-page-header',
  'booking-control-strip',
  'booking-segmented-control',
  'booking-tab-button',
  'booking-tab-button-active',
]

for (const snippet of requiredSnippets) {
  if (!content.includes(snippet)) {
    failures.push(`BookingsList.js is missing redesign hook "${snippet}"`)
  }
}

if (!content.includes("{ key: 'calendar', icon: CalendarDays, label: 'Calendar View' }")) {
  failures.push('BookingsList.js must continue to expose the calendar tab')
}

if (failures.length > 0) {
  console.error('Bookings control-panel UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Bookings control-panel UI contract satisfied.')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && node scripts/test-bookings-control-panel-ui.mjs`

Expected: FAIL with messages including:

```text
Bookings control-panel UI contract missing:
- BookingsList.js is missing redesign hook "booking-page-shell"
```

- [ ] **Step 3: Write the failing slot-action contract test**

```javascript
import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve(process.cwd(), 'src', 'app', 'bookings', 'BookingsList.js')
const content = fs.readFileSync(filePath, 'utf8')
const failures = []

const requiredSnippets = [
  'booking-slot-card',
  'booking-slot-card-header',
  'booking-slot-card-actions',
  'booking-slot-action-primary',
  'booking-slot-action-secondary',
  'booking-slot-action-danger',
]

for (const snippet of requiredSnippets) {
  if (!content.includes(snippet)) {
    failures.push(`BookingsList.js is missing slot action hook "${snippet}"`)
  }
}

if (!content.includes("className: 'btn-primary")) {
  failures.push('BookingsList.js should still preserve the primary booking status action hierarchy')
}

if (!content.includes("className: 'btn-danger")) {
  failures.push('BookingsList.js should still preserve destructive booking actions')
}

if (failures.length > 0) {
  console.error('Bookings slot-card action contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Bookings slot-card action contract satisfied.')
```

- [ ] **Step 4: Run test to verify it fails**

Run: `cd frontend && node scripts/test-bookings-slot-card-actions.mjs`

Expected: FAIL with messages including:

```text
Bookings slot-card action contract missing:
- BookingsList.js is missing slot action hook "booking-slot-card"
```

- [ ] **Step 5: Commit**

```bash
git add frontend/scripts/test-bookings-control-panel-ui.mjs frontend/scripts/test-bookings-slot-card-actions.mjs
git commit -m "test: add booking operations redesign contracts"
```

### Task 2: Add Booking-Page Utility Classes In `globals.css`

**Files:**
- Modify: `frontend/src/app/globals.css`
- Test: `frontend/scripts/test-bookings-control-panel-ui.mjs`

- [ ] **Step 1: Write the failing style-hook assertions into the existing control-panel contract**

Add these assertions to `frontend/scripts/test-bookings-control-panel-ui.mjs`:

```javascript
const cssPath = path.resolve(process.cwd(), 'src', 'app', 'globals.css')
const css = fs.readFileSync(cssPath, 'utf8')

const requiredCssSnippets = [
  '.booking-page-shell',
  '.booking-page-header',
  '.booking-control-strip',
  '.booking-segmented-control',
  '.booking-tab-button',
  '.booking-tab-button-active',
]

for (const snippet of requiredCssSnippets) {
  if (!css.includes(snippet)) {
    failures.push(`globals.css is missing booking redesign class "${snippet}"`)
  }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && node scripts/test-bookings-control-panel-ui.mjs`

Expected: FAIL with a message such as:

```text
- globals.css is missing booking redesign class ".booking-page-shell"
```

- [ ] **Step 3: Write the minimal booking-page utility classes**

Append a booking-page section in `frontend/src/app/globals.css`:

```css
  .booking-page-shell { @apply space-y-6; }
  .booking-page-header { @apply flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between; }
  .booking-page-kicker { @apply text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted; }
  .booking-page-title { @apply text-2xl md:text-[30px] font-black tracking-tight text-ink-primary; }
  .booking-page-copy { @apply max-w-3xl text-sm leading-6 text-ink-secondary; }

  .booking-control-strip {
    @apply card p-4 md:p-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end;
  }

  .booking-segmented-control {
    @apply inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-surface-border bg-surface-card p-1;
  }

  .booking-tab-button {
    @apply inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-muted transition-all duration-150 hover:bg-surface-hover hover:text-ink-primary;
  }

  .booking-tab-button-active {
    background: linear-gradient(180deg, rgb(var(--brand-orange)), rgb(var(--brand-gold)));
    @apply text-white shadow-[0_10px_30px_rgba(240,124,0,0.18)];
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && node scripts/test-bookings-control-panel-ui.mjs`

Expected: PASS with:

```text
Bookings control-panel UI contract satisfied.
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/globals.css frontend/scripts/test-bookings-control-panel-ui.mjs
git commit -m "style: add booking operations control panel utilities"
```

### Task 3: Refactor The Booking Page Header, Filters, Tabs, And Summary Layout

**Files:**
- Modify: `frontend/src/app/bookings/BookingsList.js`
- Test: `frontend/scripts/test-bookings-control-panel-ui.mjs`

- [ ] **Step 1: Extend the control-panel contract with concrete layout assertions**

Add these assertions to `frontend/scripts/test-bookings-control-panel-ui.mjs`:

```javascript
const layoutSnippets = [
  'className="booking-page-shell"',
  'className="booking-page-header"',
  'className="booking-control-strip"',
  'className="booking-segmented-control"',
  "label: 'Calendar View'",
  'className={`booking-tab-button ${tab === item.key ? \'booking-tab-button-active\' : \'\'}`}',
]

for (const snippet of layoutSnippets) {
  if (!content.includes(snippet)) {
    failures.push(`BookingsList.js is missing layout snippet ${snippet}`)
  }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && node scripts/test-bookings-control-panel-ui.mjs`

Expected: FAIL because `BookingsList.js` does not yet use the new booking layout classes.

- [ ] **Step 3: Implement the new page shell and top-level layout in `BookingsList.js`**

Update the outer page structure so the top of the component uses this shape:

```jsx
return (
  <div className="booking-page-shell">
    <section className="booking-page-header">
      <div className="space-y-2">
        <p className="booking-page-kicker">Staff Booking Operations</p>
        <h1 className="booking-page-title">Schedule, Queue &amp; Booking Handling</h1>
        <p className="booking-page-copy">
          Service advisers and super admins can review customer-created bookings, adjust slot operations, and manage
          queue flow from one consistent control surface.
        </p>
      </div>
      <button
        onClick={refreshBookingOperations}
        disabled={scheduleState.status === 'loading' || queueState.status === 'loading'}
        className="btn-ghost min-h-11 min-w-[148px] self-start xl:self-auto"
      >
        <RefreshCw size={14} className={scheduleState.status === 'loading' ? 'animate-spin' : ''} />
        Refresh
      </button>
    </section>

    <section className="booking-control-strip">
      {/* existing schedule date, status, slot filter fields */}
    </section>

    <div className="booking-segmented-control">
      {[
        { key: 'schedule', icon: CalendarDays, label: 'Daily Schedule' },
        { key: 'calendar', icon: CalendarDays, label: 'Calendar View' },
        { key: 'queue', icon: ListChecks, label: 'Current Queue' },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => setTab(item.key)}
          className={`booking-tab-button ${tab === item.key ? 'booking-tab-button-active' : ''}`}
        >
          <item.icon size={14} />
          {item.label}
        </button>
      ))}
    </div>
  </div>
)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && node scripts/test-bookings-control-panel-ui.mjs`

Expected: PASS with:

```text
Bookings control-panel UI contract satisfied.
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/bookings/BookingsList.js
git commit -m "feat: redesign booking operations page shell"
```

### Task 4: Normalize Slot Cards And Daily Schedule Actions

**Files:**
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/app/bookings/BookingsList.js`
- Test: `frontend/scripts/test-bookings-slot-card-actions.mjs`

- [ ] **Step 1: Extend the slot-action contract with the target class hooks**

Add these assertions to `frontend/scripts/test-bookings-slot-card-actions.mjs`:

```javascript
const cssPath = path.resolve(process.cwd(), 'src', 'app', 'globals.css')
const css = fs.readFileSync(cssPath, 'utf8')

const requiredCssSnippets = [
  '.booking-slot-card',
  '.booking-slot-card-header',
  '.booking-slot-card-actions',
  '.booking-slot-action-primary',
  '.booking-slot-action-secondary',
  '.booking-slot-action-danger',
]

for (const snippet of requiredCssSnippets) {
  if (!css.includes(snippet)) {
    failures.push(`globals.css is missing slot action class "${snippet}"`)
  }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && node scripts/test-bookings-slot-card-actions.mjs`

Expected: FAIL because the new slot-card classes do not exist yet.

- [ ] **Step 3: Add the slot-card utility classes in `globals.css` and apply them in `BookingsList.js`**

Add these classes to `frontend/src/app/globals.css`:

```css
  .booking-slot-card { @apply rounded-2xl border border-surface-border bg-surface-raised p-4 md:p-5; }
  .booking-slot-card-header { @apply flex items-start justify-between gap-3; }
  .booking-slot-card-actions { @apply mt-4 grid gap-2 sm:grid-cols-2; }
  .booking-slot-action-primary { @apply btn-primary min-h-11 w-full justify-center text-sm; }
  .booking-slot-action-secondary { @apply btn-ghost min-h-11 w-full justify-center text-sm; }
  .booking-slot-action-danger { @apply btn-danger min-h-11 w-full justify-center text-sm sm:col-span-2; }
```

Then refactor the slot definition card section in `BookingsList.js` to use them:

```jsx
<div key={slot.timeSlotId} className="booking-slot-card">
  <div className="booking-slot-card-header">
    <div className="min-w-0">
      <p className="truncate text-base font-bold text-ink-primary">{slot.label}</p>
      <p className="mt-1 text-sm text-ink-secondary">{formatTimeSlotWindow(slot) || 'Time window unavailable'}</p>
    </div>
    <span className={`badge ${slot.isActive === false ? 'badge-gray' : 'badge-green'}`}>
      {slot.isActive === false ? 'Inactive' : 'Active'}
    </span>
  </div>

  <p className="mt-3 text-xs text-ink-muted">
    Capacity {slot.capacity ?? 'unset'} booking{slot.capacity === 1 ? '' : 's'} per date.
  </p>

  <div className="booking-slot-card-actions">
    <button type="button" className="booking-slot-action-secondary" onClick={() => onStartEdit(slot)}>
      <Edit3 size={13} />
      Edit
    </button>
    <button type="button" className={slot.isActive === false ? 'booking-slot-action-primary' : 'booking-slot-action-secondary'} onClick={() => onToggleActive(slot)}>
      {slot.isActive === false ? 'Activate' : 'Pause'}
    </button>
    <button type="button" className="booking-slot-action-danger" onClick={() => onDelete(slot)}>
      <Trash2 size={13} />
      Delete Slot
    </button>
  </div>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && node scripts/test-bookings-slot-card-actions.mjs`

Expected: PASS with:

```text
Bookings slot-card action contract satisfied.
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/globals.css frontend/src/app/bookings/BookingsList.js frontend/scripts/test-bookings-slot-card-actions.mjs
git commit -m "feat: normalize booking slot card actions"
```

### Task 5: Refine Queue Surface, Preserve Calendar, And Run Final Verification

**Files:**
- Modify: `frontend/src/app/bookings/BookingsList.js`
- Test: `frontend/scripts/test-bookings-control-panel-ui.mjs`
- Test: `frontend/scripts/test-bookings-slot-card-actions.mjs`

- [ ] **Step 1: Write the final preservation assertions**

Extend `frontend/scripts/test-bookings-control-panel-ui.mjs` with:

```javascript
if (!content.includes('<BookingsCalendarView')) {
  failures.push('BookingsList.js must continue rendering BookingsCalendarView')
}

if (!content.includes('label="Current Queue"')) {
  failures.push('BookingsList.js must continue rendering the queue summary tile')
}
```

- [ ] **Step 2: Run test to verify it stays green or fails only if the calendar/queue surfaces were accidentally removed**

Run: `cd frontend && node scripts/test-bookings-control-panel-ui.mjs`

Expected: PASS. If it fails, stop and restore the calendar or queue surface before continuing.

- [ ] **Step 3: Implement the final UI polish for schedule and queue sections**

Update the schedule and queue wrappers in `BookingsList.js` so they use cleaner spacing and more deliberate card groupings:

```jsx
{tab === 'schedule' ? (
  <section className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* existing SummaryTile usage */}
    </div>
    <div className="space-y-4">
      {scheduleSlotsWithMeta.map((slot) => (
        <ScheduleSlotCard
          key={slot.timeSlotId}
          slot={slot}
          onStatusAction={handleBookingStatusAction}
          onOpenJobOrder={openJobOrderFromBooking}
          busyBookingId={actionState.busyBookingId}
        />
      ))}
    </div>
  </section>
) : null}

{tab === 'queue' ? (
  <section className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {/* existing queue SummaryTile usage */}
    </div>
    <QueueTable queue={queueState.data} />
  </section>
) : null}
```

This step is also where the implementer should tighten:

- button min-heights and widths for schedule booking actions
- spacing between status badges and metadata
- empty-state alignment inside queue and schedule surfaces

- [ ] **Step 4: Run full verification**

Run:

```bash
cd frontend
node scripts/test-bookings-control-panel-ui.mjs
node scripts/test-bookings-slot-card-actions.mjs
npm run build
```

Expected:

```text
Bookings control-panel UI contract satisfied.
Bookings slot-card action contract satisfied.
Compiled successfully
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/bookings/BookingsList.js frontend/src/app/globals.css frontend/scripts/test-bookings-control-panel-ui.mjs frontend/scripts/test-bookings-slot-card-actions.mjs
git commit -m "feat: complete booking operations page redesign"
```

## Self-Review

### Spec Coverage

- Full page redesign except calendar styling: covered by Tasks 2-5
- Consistent action hierarchy: covered by Tasks 2 and 4
- Header, filters, tabs, slot cards, queue surface: covered by Tasks 3-5
- Long label resilience: covered by Task 4 slot-card layout updates
- Build and route-safe verification: covered by Task 5

No spec gaps remain.

### Placeholder Scan

- No `TBD`, `TODO`, or “implement later” placeholders remain.
- Every task includes exact files, commands, and concrete code snippets.

### Type / Name Consistency

- Booking redesign hooks consistently use the `booking-` prefix:
  - `booking-page-shell`
  - `booking-control-strip`
  - `booking-segmented-control`
  - `booking-slot-card`
  - `booking-slot-action-*`
- Test script names match the responsibilities described in each task.
