# Booking Operations Page Redesign Design

## Goal

Redesign the web booking operations page into a consistent, modern, professional operations control panel while preserving the current dark/orange theme and keeping the existing calendar view styling intact.

## Scope

In scope:

- `frontend/src/app/bookings/BookingsList.js`
- booking page-only layout, spacing, visual hierarchy, and action styling
- header, filters, slot-definition form, slot cards, daily schedule surface, queue surface, and tab switcher
- responsive cleanup for long labels and inconsistent button widths

Out of scope:

- backend routes, DTOs, or business logic
- booking workflow/status rules
- global app shell, sidebar, or topbar redesign
- `frontend/src/app/bookings/BookingsCalendarView.js` visual redesign

## Problem Summary

The booking page currently works functionally, but the booking operations surface is visually inconsistent:

- button treatments vary by section and do not follow one action hierarchy
- some controls appear oversized or visually detached from their section
- some labels and actions stretch awkwardly, especially in dense slot-management areas
- the tab switcher looks like unstyled text rather than a clear mode selector
- spacing and section rhythm feel stacked rather than intentionally composed

The result is a page that feels harder to scan and less production-polished than the rest of the admin system.

## Product Direction

The page should use an `operations control panel` design direction rather than an `executive dashboard` style.

This means:

- dense enough for daily operational work
- strong visual hierarchy for scanning
- compact but readable actions
- polished summaries without sacrificing action speed
- calm, restrained presentation instead of loud visual emphasis

The only part explicitly preserved from the current visual language is the calendar view, which the user already likes.

## Design Principles

### 1. One action system per page

All buttons on the page should map to a clear hierarchy:

- Primary: orange filled, used only for the main action in a section
- Secondary: neutral bordered action for standard support tasks
- Destructive: restrained red action for delete/cancel only
- Utility: icon + label or compact text action only when necessary

This prevents slot-management buttons, schedule actions, and page controls from looking like separate UI systems.

### 2. Strong section rhythm

Each page section should use predictable spacing:

- page header
- control strip
- slot-definition management
- mode switcher
- active workspace

Each section should feel visually separated, but still part of one composed surface.

### 3. Compact operational clarity

Operational pages should privilege:

- fast scanning
- legible metadata
- clearly grouped actions
- stable card geometry

This is more important than decorative treatment or oversized hero spacing.

### 4. Long-label resilience

Long slot names and long action labels must not break alignment or produce awkward width differences.

The layout should explicitly accommodate:

- long slot labels like `Late-Day Pickup / Quick Checks`
- multi-word action labels like `Accept New Slot`
- narrow viewport wrapping without button chaos

## Information Architecture

### Header

The page header should become a compact command header:

- eyebrow label: `Staff Booking Operations`
- main title: `Schedule, Queue & Booking Handling`
- one-line support copy
- refresh action aligned with the control area rather than floating independently

The title area should look intentional and premium, but not oversized.

### Filter / Control Strip

The filter row should become a single consistent control strip:

- schedule date
- schedule status
- slot filter
- refresh button

Design requirements:

- all controls share one height
- labels and fields align cleanly
- refresh reads as a secondary page action
- no detached or lonely button placement

### Slot Definition Section

This section should visually separate `create` from `manage`.

Structure:

- section title + supporting copy
- create-slot form in one clean raised sub-panel
- existing slot cards below in a uniform grid

The create form should have one strong primary action: `Add Slot Definition`.

### Mode Switcher

The mode switcher should become a proper segmented control for:

- `Daily Schedule`
- `Calendar View`
- `Current Queue`

Design requirements:

- equal-height tab buttons
- clear active state
- enough spacing so labels don’t visually collapse together
- mobile-safe overflow handling

The switcher should read as navigation within the page, not as loose inline text.

### Active Workspace

The visible content area below the tabs should keep its current logic, but gain more consistent presentation.

Daily Schedule:

- summary tiles remain at top
- schedule slot cards become more structured
- status/action zones become cleaner

Current Queue:

- summary tiles visually match the schedule view
- empty state uses the same page language and spacing system

Calendar View:

- keep existing calendar styling and interactions
- only allow outer page chrome around it to harmonize with the rest of the redesign

## Component-Level Design

### Summary Tiles

Summary tiles should feel cleaner and more aligned with the control-panel style:

- consistent height
- compact icon treatment
- stronger number/value hierarchy
- quieter supporting copy

They should feel informative, not oversized.

### Slot Cards

Each slot card should use one predictable layout:

1. top row: slot name + status badge
2. second row: time window
3. third row: capacity / supporting metadata
4. bottom row: action group

Rules:

- title line should handle long labels without collapsing the badge
- metadata should stay subdued
- action group should align to a shared visual system across every card

### Slot Card Actions

Slot card actions should be reorganized as:

- `Edit`: secondary
- `Pause` or `Activate`: secondary with state-aware wording
- `Delete Slot`: destructive, clearly separated, but not visually oversized

Consistency requirements:

- equal heights
- stable spacing
- cleaner destructive treatment
- no action should look unstyled or accidentally stretched

### Booking Actions Within Schedule Cards

Booking status actions should adopt the same hierarchy:

- orange filled only for the main positive action
- neutral bordered for non-destructive support actions if present
- red only for destructive actions like cancel

These actions should wrap gracefully on smaller widths and maintain consistent button height.

## Visual Language

The redesign should preserve the current theme tokens:

- current dark surfaces
- current orange brand accent
- current badge palette where appropriate

But the page should tighten the visual system with:

- more disciplined spacing
- more consistent card padding
- better action sizing
- calmer typography hierarchy
- more restrained destructive emphasis

This is a refinement, not a recolor.

## Responsive Behavior

### Desktop

- filters appear in one aligned strip
- slot cards display in a clean multi-column grid
- action rows align without oversized gaps
- tabs remain easy to scan

### Tablet / Small Laptop

- filter controls may wrap to a second line while keeping equal widths
- slot actions may wrap cleanly but keep button height and spacing
- no text collision between slot names and badges

### Mobile / Narrow Width

- sections stack vertically with clear separation
- buttons remain tap-safe
- segmented control can scroll horizontally if needed
- long labels wrap without breaking card padding

## Non-Functional Constraints

- frontend-only change
- preserve existing booking business logic
- do not change backend requests or route wiring
- do not redesign the calendar component itself
- follow existing repo patterns and shared CSS tokens where possible

## Implementation Notes

The current `BookingsList.js` file already owns most of this page’s presentation. The redesign should prefer:

- extracting small presentational helpers where needed
- reusing existing utility classes and theme tokens
- introducing booking-page-specific class groupings only where they increase consistency

The work should avoid unrelated refactors outside the booking page.

## Verification Plan

Required verification:

- `cd frontend && npm run build`
- route check for `/bookings`
- route check for `/admin/appointments`
- manual visual check for:
  - consistent button sizing
  - cleaner tab switcher
  - resilient long slot labels
  - improved slot card action layout
  - preserved calendar styling

## Acceptance Criteria

The redesign is successful when:

- the booking page feels visually unified end-to-end
- buttons use one consistent hierarchy
- long labels no longer create awkward layout breaks
- the page feels modern and professional without changing the color theme
- the calendar view still looks like the current version the user approved

## Assumptions

- The existing dark/orange theme remains the source of truth for color direction.
- The user wants a full booking-page redesign except for the calendar visual treatment.
- Functional behavior should remain unchanged unless a small UI-only correction is required for consistency.
