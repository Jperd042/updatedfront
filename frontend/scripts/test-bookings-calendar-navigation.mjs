import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const bookingsListPath = path.join(rootDir, 'src', 'app', 'bookings', 'BookingsList.js')

const failures = []

if (!fs.existsSync(bookingsListPath)) {
  failures.push(`Missing target file ${path.relative(rootDir, bookingsListPath)}`)
} else {
  const content = fs.readFileSync(bookingsListPath, 'utf8')

  if (!content.includes('onNextMonth={() =>')) {
    failures.push('BookingsList.js: calendar view still exposes a next-month handler')
  }

  if (!content.includes('onPreviousMonth={() =>')) {
    failures.push('BookingsList.js: calendar view still exposes a previous-month handler')
  }

  const forcedCalendarMonthSyncPattern =
    /useEffect\(\(\)\s*=>\s*\{\s*if\s*\(tab !== 'calendar'\)\s*\{\s*return\s*\}\s*const selectedMonth = startOfMonth\(toDateFromKey\(selectedDate\)\)\s*if\s*\(\s*calendarMonth\.getFullYear\(\) !== selectedMonth\.getFullYear\(\)\s*\|\|\s*calendarMonth\.getMonth\(\) !== selectedMonth\.getMonth\(\)\s*\)\s*\{\s*setCalendarMonth\(selectedMonth\)\s*\}\s*\},\s*\[calendarMonth,\s*selectedDate,\s*tab\]\s*\)/s

  if (forcedCalendarMonthSyncPattern.test(content)) {
    failures.push(
      'BookingsList.js: calendar month navigation is still forced back to the selected date month while viewing the calendar tab',
    )
  }
}

if (failures.length > 0) {
  console.error('Bookings calendar navigation contract missing:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Bookings calendar navigation contract satisfied.')
