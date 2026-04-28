# Operations Suite Redesign Design

Date: 2026-04-29
Owner: Codex
Scope: Frontend-only redesign for `Job Orders`, `QA Audit`, and `Invoices & Orders` in the web staff/admin app

## Goal

Redesign the three remaining front-desk operations pages so they feel consistent with the updated `Bookings` module while preserving the existing backend behavior, workflows, role rules, and data contracts.

The target outcome is a coordinated staff-facing operations suite:

- `Job Orders` becomes an operations workbench
- `QA Audit` becomes a decision console
- `Invoices & Orders` becomes a financial control surface

## Non-Goals

- No backend changes
- No route or API contract changes
- No new workflow steps or business rules
- No redesign of unrelated global shell elements such as sidebar/topbar
- No forced visual cloning of all three pages into identical layouts

## Shared Design System

All three pages should inherit the same structural language introduced in the booking redesign:

- compact command header with kicker, title, support copy, and right-aligned utility action
- one clear control strip for search, filters, date inputs, or lookup controls
- a top summary row for the most important live metrics or state indicators
- sectioned workspace below with stronger separation between read-only information and staff actions
- shared action hierarchy:
  - primary: main task in the section
  - secondary: safe support actions
  - destructive: irreversible actions
- consistent empty, error, loading, and blocked-role states

Visual rules:

- keep the current dark/orange theme
- reduce oversized full-width action bars unless they are clearly the primary action for that section
- normalize spacing, card padding, border treatment, heading levels, and badge rhythm
- make long labels, IDs, and timestamps wrap or truncate cleanly without breaking layout

Implementation is expected to happen mostly inside the screen components under `frontend/src/screens/`, with shared utility classes added only where helpful and kept page-scoped by naming.

## Module 1: Job Orders

### Intent

`Job Orders` should feel like the core staff workbench for moving a booking into execution, tracking work in progress, and closing the financial loop.

### Current Surface

The page combines several different activities in one long operational stack:

- booking handoff intake
- job-order creation/loading
- execution status updates
- progress entry logging
- evidence photo submission
- finalization
- payment recording

### Target Structure

1. Command header
   - kicker, title, support copy
   - refresh action

2. Control strip
   - schedule date
   - handoff refresh/load action
   - manual job-order lookup

3. Summary row
   - handoff candidate count
   - active execution phase
   - technician assignment state
   - finalization/payment readiness

4. Main workspace
   - `Booking Handoff Queue`
   - `Create / Load Job Order`
   - `Execution Control`
   - `Progress & Evidence`
   - `Finalize & Payment`

### UX Rules

- handoff candidates should read like a selectable queue, not loose generic cards
- the active job order should feel pinned and visually dominant
- status transition controls should share consistent button sizing and placement
- progress and photo tools should feel operational, not like a random form pile
- finalization and payment should read as the closing stage of the workflow

## Module 2: QA Audit

### Intent

`QA Audit` should feel like a decision console centered on release readiness, blocking findings, and accountable override visibility.

### Current Surface

The page already contains strong information, but release state, findings, override history, and support details need clearer hierarchy and better separation.

### Target Structure

1. Command header
   - kicker, title, support copy
   - refresh action

2. Control strip
   - job-order search/load
   - current QA state visibility
   - override access cue when relevant

3. Summary row
   - QA status
   - risk score
   - blocking findings count
   - release state

4. Main workspace
   - `Release Decision`
   - `Findings Review`
   - `Audit Timeline / Worker Detail`
   - `Override Audit`
   - `Contract Sources / Linked Context`

### UX Rules

- release state should be the page focal point
- blocking findings must be easier to scan by gate and severity
- override history must feel controlled and auditable rather than buried in findings
- provenance and contract-source detail should remain available but visually secondary
- empty states should clarify that live QA data has not been loaded, not imply a broken feature

## Module 3: Invoices & Orders

### Intent

`Invoices & Orders` should feel like a financial control surface with clear lookup tools, state visibility, and dependable result presentation.

### Current Surface

The page mixes:

- job-order billing detail
- ecommerce order lookup
- invoice state
- payment entries
- aging analytics
- route and surface documentation

These need stronger hierarchy and cleaner separation between lookup, results, and supporting references.

### Target Structure

1. Command header
   - kicker, title, support copy
   - refresh action

2. Control strip
   - job-order lookup
   - ecommerce order lookup
   - load actions

3. Summary row
   - live load state
   - invoice aging snapshot
   - payment collection state
   - fulfillment/order state

4. Main workspace
   - `Financial Snapshot`
   - `Job Order Billing Detail`
   - `Ecommerce Order Detail`
   - `Payment Entries`
   - `Action Routes / Surface Rules`

### UX Rules

- lookup controls should feel compact and deliberate
- result cards should use consistent field blocks for IDs, amounts, status, and timestamps
- payment entries should remain table-friendly but visually cleaner and easier to scan
- runtime warnings and partial-load states should be prominent without overwhelming the page
- reference material such as surface rules should remain secondary to live financial state

## Shared Implementation Boundaries

In scope:

- page headers
- control strips
- summary cards
- section layout and grouping
- button hierarchy and sizing
- card/table/detail presentation
- empty/error/loading state consistency
- shared page-scoped utility classes in `globals.css` when useful

Out of scope:

- API calls and payloads
- role logic and guard behavior
- route paths
- backend-generated state labels
- workflow semantics

## Verification Expectations

For implementation, verification should include:

- `npm run build` in `frontend`
- route smoke checks for:
  - `/admin/job-orders`
  - `/admin/qa-audit`
  - `/admin/invoices`
- manual visual checks that long IDs, long action labels, and dense data blocks stay aligned on desktop and narrow widths
- confirmation that existing load, blocked-role, and empty states still render and remain understandable

## Risks To Watch

- over-generalizing the three pages into one generic dashboard pattern
- introducing visual consistency that accidentally hides workflow-critical actions
- letting shared utility classes become too global or leak into unrelated modules
- making dense operational pages look cleaner at the expense of scan speed

## Recommended Delivery Shape

Implement as one coordinated redesign effort with a shared visual system and module-by-module execution order:

1. `Job Orders`
2. `QA Audit`
3. `Invoices & Orders`

This keeps the heaviest operational page as the anchor pattern and lets the other two inherit proven layout decisions while remaining purpose-specific.
