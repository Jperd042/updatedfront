import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve(process.cwd(), 'src', 'app', 'bookings', 'BookingsList.js')
const content = fs.readFileSync(filePath, 'utf8')
const cssPath = path.resolve(process.cwd(), 'src', 'app', 'globals.css')
const css = fs.readFileSync(cssPath, 'utf8')
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

if (!content.includes("{ key: 'calendar', icon: CalendarDays, label: 'Calendar View' }")) {
  failures.push('BookingsList.js must continue to expose the calendar tab')
}

if (!content.includes('<BookingsCalendarView')) {
  failures.push('BookingsList.js must continue rendering BookingsCalendarView')
}

if (!content.includes("if (tab !== 'calendar')")) {
  failures.push('BookingsList.js must only load calendar data when the calendar tab is active')
}

if (!content.includes("if (tab === 'calendar')") || !content.includes('refreshTasks.push(loadCalendarMonth(calendarMonth))')) {
  failures.push('BookingsList.js refresh flow must only reload month data when the calendar view is active')
}

if (!content.includes('label="Current Queue"')) {
  failures.push('BookingsList.js must continue rendering the queue summary tile')
}

if (!content.includes('className="space-y-5"')) {
  failures.push('BookingsList.js must use the refined section spacing for schedule and queue surfaces')
}

if (!content.includes('className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"')) {
  failures.push('BookingsList.js must keep the refined schedule summary grid grouping')
}

if (!content.includes('className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"')) {
  failures.push('BookingsList.js must keep the refined queue summary grid grouping')
}

if (failures.length > 0) {
  console.error('Bookings control-panel UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Bookings control-panel UI contract satisfied.')
