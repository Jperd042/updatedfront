import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd(), 'src')
const dashboard = fs.readFileSync(path.join(root, 'screens', 'Dashboard.js'), 'utf8')
const bookings = fs.readFileSync(path.join(root, 'app', 'bookings', 'BookingsList.js'), 'utf8')

if (dashboard.includes('StaffProvisioningPanel')) {
  throw new Error('Dashboard should no longer reference StaffProvisioningPanel.')
}

const scheduleIndex = bookings.indexOf("key: 'schedule'")
const calendarIndex = bookings.indexOf("key: 'calendar'")
const queueIndex = bookings.indexOf("key: 'queue'")

if (scheduleIndex === -1 || calendarIndex === -1 || queueIndex === -1) {
  throw new Error('Bookings tab definitions must include schedule, calendar, and queue.')
}

if (!(scheduleIndex < calendarIndex && calendarIndex < queueIndex)) {
  throw new Error('Calendar tab must appear between schedule and queue.')
}

console.log('Bookings layout contract satisfied.')
