import fs from 'node:fs'
import path from 'node:path'

const bookingsFile = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'app', 'bookings', 'BookingsList.js'),
  'utf8',
)

if (bookingsFile.includes('getCurrentQueue(sharedQuery')) {
  throw new Error('Current queue must not reuse the selected schedule date query.')
}

if (!bookingsFile.includes('const queueQuery = {')) {
  throw new Error('BookingsList should build a dedicated queueQuery.')
}

if (!bookingsFile.includes('scheduledDate: toDateKey()')) {
  throw new Error('Current queue should stay anchored to today.')
}

console.log('Current queue date contract satisfied.')
