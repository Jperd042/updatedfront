import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const bookingsListPath = path.join(rootDir, 'src', 'app', 'bookings', 'BookingsList.js')
const bookingActionConfirmModalPath = path.join(rootDir, 'src', 'app', 'bookings', 'BookingActionConfirmModal.js')

function assertContract(content, failures, label, predicate) {
  if (!predicate(content)) {
    failures.push(label)
  }
}

const failures = []

function loadTargetFile(filePath, activeFailures) {
  if (!fs.existsSync(filePath)) {
    activeFailures.push(`Missing target file ${path.relative(rootDir, filePath)}`)
    return null
  }

  return fs.readFileSync(filePath, 'utf8')
}

const bookingsListContent = loadTargetFile(bookingsListPath, failures)
const bookingActionConfirmModalContent = loadTargetFile(bookingActionConfirmModalPath, failures)

if (bookingsListContent) {
  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: heading copy "Pending customer bookings"',
    (content) => content.includes('Pending customer bookings'),
  )

  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: toast hook usage `const { toast } = useToast()`',
    (content) => /const\s*\{\s*toast\s*\}\s*=\s*useToast\(\)/.test(content),
  )

  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: toast invocation `toast({`',
    (content) => /toast\s*\(\s*\{/.test(content),
  )

  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: confirmation modal render `<BookingActionConfirmModal`',
    (content) => content.includes('<BookingActionConfirmModal'),
  )

  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: decline confirmation copy `Are you sure you want to decline this booking?`',
    (content) => content.includes('Are you sure you want to decline this booking?'),
  )

  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: cancel confirmation copy `Are you sure you want to cancel this booking?`',
    (content) => content.includes('Are you sure you want to cancel this booking?'),
  )

  assertContract(
    bookingsListContent,
    failures,
    'BookingsList.js: destructive action metadata `requiresConfirmation: true`',
    (content) => /requiresConfirmation\s*:\s*true/.test(content),
  )
}

if (bookingActionConfirmModalContent) {
  assertContract(
    bookingActionConfirmModalContent,
    failures,
    'BookingActionConfirmModal.js: modal title `Confirm booking action`',
    (content) => content.includes('Confirm booking action'),
  )

  assertContract(
    bookingActionConfirmModalContent,
    failures,
    'BookingActionConfirmModal.js: modal secondary action `Keep booking`',
    (content) => content.includes('Keep booking'),
  )

  assertContract(
    bookingActionConfirmModalContent,
    failures,
    'BookingActionConfirmModal.js: overlay stacks above app chrome `z-[60]`',
    (content) => content.includes('z-[60]'),
  )

  assertContract(
    bookingActionConfirmModalContent,
    failures,
    'BookingActionConfirmModal.js: dialog stacks above overlay `z-[70]`',
    (content) => content.includes('z-[70]'),
  )

  assertContract(
    bookingActionConfirmModalContent,
    failures,
    'BookingActionConfirmModal.js: modal uses shared surface token `bg-surface-raised`',
    (content) => content.includes('bg-surface-raised'),
  )

  assertContract(
    bookingActionConfirmModalContent,
    failures,
    'BookingActionConfirmModal.js: modal uses shared border token `border-surface-border`',
    (content) => content.includes('border-surface-border'),
  )
}

if (failures.length > 0) {
  console.error('Bookings staff UI feedback contract missing:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Bookings staff UI feedback contract satisfied.')
