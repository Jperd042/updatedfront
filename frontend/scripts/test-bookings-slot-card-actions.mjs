import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve(process.cwd(), 'src', 'app', 'bookings', 'BookingsList.js')
const content = fs.readFileSync(filePath, 'utf8')
const cssPath = path.resolve(process.cwd(), 'src', 'app', 'globals.css')
const css = fs.readFileSync(cssPath, 'utf8')
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
