# Operations Suite Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the web `Job Orders`, `QA Audit`, and `Invoices & Orders` pages so they share the polished booking-style frontend system while preserving existing backend behavior, workflows, role rules, and route contracts.

**Architecture:** Add a small set of page-scoped operations-suite utility classes in `frontend/src/app/globals.css`, then refactor each screen component in `frontend/src/screens/` to adopt the shared header/control-strip/summary/workspace structure. Guard the redesign with lightweight source-contract scripts under `frontend/scripts/` plus a full Next.js production build and route smoke checks.

**Tech Stack:** Next.js App Router, React client components, Tailwind utility classes via `globals.css`, lucide-react icons, existing staff web client libs, Node-based contract scripts

---

## File Structure

- Modify: `frontend/src/app/globals.css`
  - Add page-scoped operations-suite utility classes shared by the three staff modules.
- Modify: `frontend/src/screens/JobOrderWorkbench.js`
  - Restructure the job-order page into a command header, control strip, summary row, and guided workbench sections.
- Modify: `frontend/src/screens/QAAuditWorkspace.js`
  - Restructure the QA page into a decision-console layout with clearer release and findings hierarchy.
- Modify: `frontend/src/screens/InvoiceOrderManagementWorkspace.js`
  - Restructure the invoices page into a financial control surface with compact lookup tools and stronger result grouping.
- Create: `frontend/scripts/test-operations-suite-shared-ui.mjs`
  - Source-contract check for shared operations-suite classes and page-shell hooks.
- Create: `frontend/scripts/test-job-orders-workbench-ui.mjs`
  - Source-contract check for the Job Orders redesign hooks and section names.
- Create: `frontend/scripts/test-qa-audit-ui.mjs`
  - Source-contract check for the QA redesign hooks and release/finding structure.
- Create: `frontend/scripts/test-invoice-orders-ui.mjs`
  - Source-contract check for the invoice/order redesign hooks and section grouping.

## Task 1: Add Shared Operations-Suite UI Utilities

**Files:**
- Create: `frontend/scripts/test-operations-suite-shared-ui.mjs`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Write the failing shared-UI contract script**

```js
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const css = fs.readFileSync(path.resolve(root, 'src', 'app', 'globals.css'), 'utf8')
const jobOrders = fs.readFileSync(path.resolve(root, 'src', 'screens', 'JobOrderWorkbench.js'), 'utf8')
const qaAudit = fs.readFileSync(path.resolve(root, 'src', 'screens', 'QAAuditWorkspace.js'), 'utf8')
const invoices = fs.readFileSync(path.resolve(root, 'src', 'screens', 'InvoiceOrderManagementWorkspace.js'), 'utf8')
const failures = []

for (const snippet of [
  '.ops-page-shell',
  '.ops-page-header',
  '.ops-page-kicker',
  '.ops-page-title',
  '.ops-page-copy',
  '.ops-control-strip',
  '.ops-summary-grid',
  '.ops-workspace-grid',
  '.ops-panel',
  '.ops-action-primary',
  '.ops-action-secondary',
]) {
  if (!css.includes(snippet)) failures.push(`globals.css missing ${snippet}`)
}

for (const [name, source] of [
  ['JobOrderWorkbench', jobOrders],
  ['QAAuditWorkspace', qaAudit],
  ['InvoiceOrderManagementWorkspace', invoices],
]) {
  for (const hook of ['ops-page-shell', 'ops-page-header', 'ops-control-strip']) {
    if (!source.includes(hook)) failures.push(`${name} missing ${hook}`)
  }
}

if (failures.length) {
  console.error('Operations suite shared UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Operations suite shared UI contract satisfied.')
```

- [ ] **Step 2: Run the shared-UI contract to verify it fails**

Run: `node scripts/test-operations-suite-shared-ui.mjs`

Expected: FAIL with messages about missing `.ops-*` classes and missing page-shell hooks in the three screen files.

- [ ] **Step 3: Add the shared operations-suite utility classes**

Add these classes near the existing booking-page helpers in `frontend/src/app/globals.css`:

```css
.ops-page-shell { @apply space-y-6; }
.ops-page-header { @apply flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between; }
.ops-page-kicker { @apply text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted; }
.ops-page-title { @apply text-2xl md:text-[30px] font-black tracking-tight text-ink-primary; }
.ops-page-copy { @apply max-w-3xl text-sm leading-6 text-ink-secondary; }

.ops-control-strip {
  @apply card p-4 md:p-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end;
}

.ops-summary-grid { @apply grid gap-3 sm:grid-cols-2 xl:grid-cols-4; }
.ops-workspace-grid { @apply grid gap-5 2xl:grid-cols-[420px_minmax(0,1fr)]; }
.ops-panel { @apply card p-4 md:p-5; }
.ops-panel-muted { @apply rounded-xl border border-surface-border bg-surface-raised px-4 py-3; }
.ops-action-primary { @apply btn-primary min-h-11 justify-center; }
.ops-action-secondary { @apply btn-ghost min-h-11 justify-center; }
.ops-action-danger { @apply btn-danger min-h-11 justify-center; }
```

- [ ] **Step 4: Run the shared-UI contract to verify it passes**

Run: `node scripts/test-operations-suite-shared-ui.mjs`

Expected: `Operations suite shared UI contract satisfied.`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/globals.css frontend/scripts/test-operations-suite-shared-ui.mjs
git commit -m "feat: add operations suite shared ui system"
```

## Task 2: Redesign Job Orders as an Operations Workbench

**Files:**
- Create: `frontend/scripts/test-job-orders-workbench-ui.mjs`
- Modify: `frontend/src/screens/JobOrderWorkbench.js`
- Test: `frontend/scripts/test-operations-suite-shared-ui.mjs`

- [ ] **Step 1: Write the failing Job Orders UI contract**

```js
import fs from 'node:fs'
import path from 'node:path'

const file = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'screens', 'JobOrderWorkbench.js'),
  'utf8',
)

const failures = []

for (const snippet of [
  'ops-page-shell',
  'ops-page-header',
  'ops-summary-grid',
  'Booking Handoff Queue',
  'Create / Load Job Order',
  'Execution Control',
  'Progress & Evidence',
  'Finalize & Payment',
]) {
  if (!file.includes(snippet)) failures.push(`JobOrderWorkbench missing ${snippet}`)
}

if (!file.includes('className="ops-action-secondary min-w-[148px]')) {
  failures.push('JobOrderWorkbench should expose a shared refresh action in the header')
}

if (failures.length) {
  console.error('Job Orders workbench UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Job Orders workbench UI contract satisfied.')
```

- [ ] **Step 2: Run the Job Orders contract to verify it fails**

Run: `node scripts/test-job-orders-workbench-ui.mjs`

Expected: FAIL with missing `ops-*` hooks and missing section titles.

- [ ] **Step 3: Refactor `JobOrderWorkbench.js` into the new workbench layout**

Apply the redesign without changing existing data calls or workflow logic:

```jsx
return (
  <div className="ops-page-shell">
    <section className="ops-page-header">
      <div className="space-y-2">
        <p className="ops-page-kicker">Workshop Operations</p>
        <h1 className="ops-page-title">Job Order Workbench</h1>
        <p className="ops-page-copy">
          Move confirmed bookings into workshop execution, track progress and evidence, then finalize
          invoice-ready work from one guided control surface.
        </p>
      </div>
      <button onClick={loadBookingHandoffs} className="ops-action-secondary min-w-[148px] self-start xl:self-auto">
        <RefreshCw size={14} />
        Refresh
      </button>
    </section>

    <section className="ops-control-strip">
      <div className="grid gap-3 lg:grid-cols-3">
        {/* selectedDate input */}
        {/* handoff refresh action */}
        {/* manualJobOrderId lookup input */}
      </div>
    </section>

    <section className="ops-summary-grid">
      {/* keep SummaryTile components, but feed handoff count, active phase, assignment state, finalization/payment readiness */}
    </section>

    <section className="ops-workspace-grid">
      <div className="space-y-5">
        <div className="ops-panel">
          <p className="card-title">Booking Handoff Queue</p>
          {/* existing handoff candidate rendering */}
        </div>
      </div>

      <div className="space-y-5">
        <div className="ops-panel">
          <p className="card-title">Create / Load Job Order</p>
          {/* existing create/load surface */}
        </div>
        <div className="ops-panel">
          <p className="card-title">Execution Control</p>
          {/* existing status update surface */}
        </div>
        <div className="ops-panel">
          <p className="card-title">Progress & Evidence</p>
          {/* existing progress + photo surfaces */}
        </div>
        <div className="ops-panel">
          <p className="card-title">Finalize & Payment</p>
          {/* existing finalize + payment surfaces */}
        </div>
      </div>
    </section>
  </div>
)
```

- [ ] **Step 4: Run focused verification for Job Orders**

Run:

```bash
node scripts/test-operations-suite-shared-ui.mjs
node scripts/test-job-orders-workbench-ui.mjs
```

Expected:

- `Operations suite shared UI contract satisfied.`
- `Job Orders workbench UI contract satisfied.`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/screens/JobOrderWorkbench.js frontend/scripts/test-job-orders-workbench-ui.mjs
git commit -m "feat: redesign job orders workbench surface"
```

## Task 3: Redesign QA Audit as a Decision Console

**Files:**
- Create: `frontend/scripts/test-qa-audit-ui.mjs`
- Modify: `frontend/src/screens/QAAuditWorkspace.js`
- Test: `frontend/scripts/test-operations-suite-shared-ui.mjs`

- [ ] **Step 1: Write the failing QA UI contract**

```js
import fs from 'node:fs'
import path from 'node:path'

const file = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'screens', 'QAAuditWorkspace.js'),
  'utf8',
)

const failures = []

for (const snippet of [
  'ops-page-shell',
  'ops-page-header',
  'ops-summary-grid',
  'Release Decision',
  'Findings Review',
  'Audit Timeline / Worker Detail',
  'Override Audit',
  'Contract Sources / Linked Context',
]) {
  if (!file.includes(snippet)) failures.push(`QAAuditWorkspace missing ${snippet}`)
}

if (!file.includes('Load QA Gate')) {
  failures.push('QAAuditWorkspace should expose a compact primary load action')
}

if (failures.length) {
  console.error('QA Audit UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('QA Audit UI contract satisfied.')
```

- [ ] **Step 2: Run the QA contract to verify it fails**

Run: `node scripts/test-qa-audit-ui.mjs`

Expected: FAIL with missing `ops-*` hooks and missing section labels.

- [ ] **Step 3: Refactor `QAAuditWorkspace.js` into the decision-console layout**

Keep `loadQualityGate()` and `handleOverrideQualityGate()` behavior intact, but reorganize the rendering:

```jsx
return (
  <div className="ops-page-shell">
    <section className="ops-page-header">
      <div className="space-y-2">
        <p className="ops-page-kicker">Quality Governance</p>
        <h1 className="ops-page-title">QA Audit Workspace</h1>
        <p className="ops-page-copy">
          Review live quality gates, scan blocking findings, and record auditable overrides when release
          exceptions are justified.
        </p>
      </div>
      <button type="button" onClick={loadQualityGate} className="ops-action-secondary min-w-[148px] self-start xl:self-auto">
        <RefreshCw size={14} />
        Refresh
      </button>
    </section>

    <section className="ops-control-strip">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        {/* jobOrderId input */}
        {/* read/override badges */}
        <button type="button" onClick={loadQualityGate} className="ops-action-primary">
          <Search size={14} />
          Load QA Gate
        </button>
      </div>
    </section>

    <section className="ops-summary-grid">
      {/* existing StatCard values for QA status, risk, blocking findings, release */}
    </section>

    <section className="space-y-5">
      <div className="ops-panel">{/* Release Decision */}</div>
      <div className="ops-panel">{/* Findings Review */}</div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="ops-panel">{/* Audit Timeline / Worker Detail */}</div>
        <div className="ops-panel">{/* Override Audit */}</div>
      </div>
      <div className="ops-panel">{/* Contract Sources / Linked Context */}</div>
    </section>
  </div>
)
```

- [ ] **Step 4: Run focused verification for QA Audit**

Run:

```bash
node scripts/test-operations-suite-shared-ui.mjs
node scripts/test-qa-audit-ui.mjs
```

Expected:

- `Operations suite shared UI contract satisfied.`
- `QA Audit UI contract satisfied.`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/screens/QAAuditWorkspace.js frontend/scripts/test-qa-audit-ui.mjs
git commit -m "feat: redesign qa audit decision console"
```

## Task 4: Redesign Invoices & Orders as a Financial Control Surface

**Files:**
- Create: `frontend/scripts/test-invoice-orders-ui.mjs`
- Modify: `frontend/src/screens/InvoiceOrderManagementWorkspace.js`
- Test: `frontend/scripts/test-operations-suite-shared-ui.mjs`

- [ ] **Step 1: Write the failing invoice/order UI contract**

```js
import fs from 'node:fs'
import path from 'node:path'

const file = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'screens', 'InvoiceOrderManagementWorkspace.js'),
  'utf8',
)

const failures = []

for (const snippet of [
  'ops-page-shell',
  'ops-page-header',
  'ops-summary-grid',
  'Financial Snapshot',
  'Job Order Billing Detail',
  'Ecommerce Order Detail',
  'Payment Entries',
  'Action Routes / Surface Rules',
]) {
  if (!file.includes(snippet)) failures.push(`InvoiceOrderManagementWorkspace missing ${snippet}`)
}

if (!file.includes('Load Job Order') || !file.includes('Load Order')) {
  failures.push('InvoiceOrderManagementWorkspace should expose compact lookup actions')
}

if (failures.length) {
  console.error('Invoice & Orders UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Invoice & Orders UI contract satisfied.')
```

- [ ] **Step 2: Run the invoice/order contract to verify it fails**

Run: `node scripts/test-invoice-orders-ui.mjs`

Expected: FAIL with missing `ops-*` hooks and missing section names.

- [ ] **Step 3: Refactor `InvoiceOrderManagementWorkspace.js` into the financial-control layout**

Preserve `loadInvoiceAging()`, `handleLoadServiceInvoice()`, and `handleLoadEcommerceOrder()` behavior while reorganizing the page:

```jsx
return (
  <div className="ops-page-shell">
    <section className="ops-page-header">
      <div className="space-y-2">
        <p className="ops-page-kicker">Financial Operations</p>
        <h1 className="ops-page-title">Invoice & Order Management</h1>
        <p className="ops-page-copy">
          Inspect service invoice readiness, known ecommerce order snapshots, and aging analytics from one
          structured staff finance surface.
        </p>
      </div>
      <button type="button" onClick={loadInvoiceAging} className="ops-action-secondary min-w-[148px] self-start xl:self-auto">
        <RefreshCcw size={14} />
        Refresh
      </button>
    </section>

    <section className="ops-control-strip">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto]">
        {/* jobOrderId input */}
        <button type="button" onClick={handleLoadServiceInvoice} className="ops-action-primary">Load Job Order</button>
        {/* ecommerceOrderId input */}
        <button type="button" onClick={handleLoadEcommerceOrder} className="ops-action-primary">Load Order</button>
      </div>
    </section>

    <section className="ops-summary-grid">
      {/* existing metric cards for load state, aging snapshot, payment state, fulfillment state */}
    </section>

    <section className="space-y-5">
      <div className="ops-panel">{/* Financial Snapshot */}</div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="ops-panel">{/* Job Order Billing Detail */}</div>
        <div className="ops-panel">{/* Ecommerce Order Detail */}</div>
      </div>
      <div className="ops-panel">{/* Payment Entries */}</div>
      <div className="ops-panel">{/* Action Routes / Surface Rules */}</div>
    </section>
  </div>
)
```

- [ ] **Step 4: Run focused verification for Invoices & Orders**

Run:

```bash
node scripts/test-operations-suite-shared-ui.mjs
node scripts/test-invoice-orders-ui.mjs
```

Expected:

- `Operations suite shared UI contract satisfied.`
- `Invoice & Orders UI contract satisfied.`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/screens/InvoiceOrderManagementWorkspace.js frontend/scripts/test-invoice-orders-ui.mjs
git commit -m "feat: redesign invoice and order management surface"
```

## Task 5: Final Verification and Route Smoke Checks

**Files:**
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/screens/JobOrderWorkbench.js`
- Modify: `frontend/src/screens/QAAuditWorkspace.js`
- Modify: `frontend/src/screens/InvoiceOrderManagementWorkspace.js`
- Test: `frontend/scripts/test-operations-suite-shared-ui.mjs`
- Test: `frontend/scripts/test-job-orders-workbench-ui.mjs`
- Test: `frontend/scripts/test-qa-audit-ui.mjs`
- Test: `frontend/scripts/test-invoice-orders-ui.mjs`

- [ ] **Step 1: Run all redesign contract scripts**

Run:

```bash
node scripts/test-operations-suite-shared-ui.mjs
node scripts/test-job-orders-workbench-ui.mjs
node scripts/test-qa-audit-ui.mjs
node scripts/test-invoice-orders-ui.mjs
```

Expected:

- `Operations suite shared UI contract satisfied.`
- `Job Orders workbench UI contract satisfied.`
- `QA Audit UI contract satisfied.`
- `Invoice & Orders UI contract satisfied.`

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: `Compiled successfully` and static route output including `/admin/job-orders`, `/admin/qa-audit`, and `/admin/invoices`.

- [ ] **Step 3: Smoke-test the three admin routes**

Run:

```powershell
(Invoke-WebRequest -Uri 'http://127.0.0.1:3002/admin/job-orders' -UseBasicParsing).StatusCode
(Invoke-WebRequest -Uri 'http://127.0.0.1:3002/admin/qa-audit' -UseBasicParsing).StatusCode
(Invoke-WebRequest -Uri 'http://127.0.0.1:3002/admin/invoices' -UseBasicParsing).StatusCode
```

Expected:

- `200`
- `200`
- `200`

- [ ] **Step 4: Manually verify layout resilience**

Check these on desktop and narrow widths:

```text
- Long booking/job-order/order ids do not overflow cards
- Lookup actions stay compact and aligned
- Summary cards wrap cleanly without collapsing hierarchy
- Role-blocked and empty states remain understandable
- Dense lists/tables remain readable without overlapping controls
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/globals.css frontend/src/screens/JobOrderWorkbench.js frontend/src/screens/QAAuditWorkspace.js frontend/src/screens/InvoiceOrderManagementWorkspace.js frontend/scripts/test-operations-suite-shared-ui.mjs frontend/scripts/test-job-orders-workbench-ui.mjs frontend/scripts/test-qa-audit-ui.mjs frontend/scripts/test-invoice-orders-ui.mjs
git commit -m "feat: complete operations suite redesign"
```
