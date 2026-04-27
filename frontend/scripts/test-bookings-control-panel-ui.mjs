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
