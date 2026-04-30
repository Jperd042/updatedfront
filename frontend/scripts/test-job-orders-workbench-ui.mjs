import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(scriptDir, '..')
const file = fs.readFileSync(
  path.resolve(frontendRoot, 'src', 'screens', 'JobOrderWorkbench.js'),
  'utf8',
)

const failures = []

for (const snippet of [
  'ops-page-shell',
  'ops-page-header',
  'ops-summary-grid',
  'Booking Handoff Queue',
  'Active Job Order',
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

if (!file.includes('onClick={handleLoadJobOrder}')) {
  failures.push('JobOrderWorkbench should wire the manual lookup action to handleLoadJobOrder')
}

const handleLoadJobOrderStart = file.indexOf('const handleLoadJobOrder = async () => {')
const handleLoadJobOrderEnd = file.indexOf('const handleCreateJobOrder = async () => {')
const handleLoadJobOrderBlock =
  handleLoadJobOrderStart === -1 || handleLoadJobOrderEnd === -1
    ? ''
    : file.slice(handleLoadJobOrderStart, handleLoadJobOrderEnd)

if (!handleLoadJobOrderBlock.includes('clearBookingCreateContext()')) {
  failures.push('handleLoadJobOrder should clear booking/create context before pinning a loaded job order')
} else if (
  handleLoadJobOrderBlock.indexOf('clearBookingCreateContext()') >
  handleLoadJobOrderBlock.indexOf('setActiveJobOrder(jobOrder)')
) {
  failures.push('handleLoadJobOrder should clear booking/create context before setActiveJobOrder(jobOrder)')
}

const handleCreateJobOrderStart = handleLoadJobOrderEnd
const handleCreateJobOrderEnd = file.indexOf('const handleStatusUpdate = async () => {')
const handleCreateJobOrderBlock =
  handleCreateJobOrderStart === -1 || handleCreateJobOrderEnd === -1
    ? ''
    : file.slice(handleCreateJobOrderStart, handleCreateJobOrderEnd)

if (
  !handleCreateJobOrderBlock.includes("clearBookingCreateContext({") ||
  !handleCreateJobOrderBlock.includes("status: 'create_saved'")
) {
  failures.push('handleCreateJobOrder should clear booking/create context through the shared helper on success')
}

const detailMessageRenderCount = file.split('detailState.message ? (').length - 1
if (detailMessageRenderCount !== 1) {
  failures.push('JobOrderWorkbench should render detailState.message in exactly one location')
}

const activeJobOrderIndex = file.indexOf('Active Job Order')
const createLoadIndex = file.indexOf('Create / Load Job Order')

if (
  activeJobOrderIndex === -1 ||
  createLoadIndex === -1 ||
  activeJobOrderIndex > createLoadIndex
) {
  failures.push('JobOrderWorkbench should present Active Job Order before Create / Load Job Order')
}

if (failures.length) {
  console.error('Job Orders workbench UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Job Orders workbench UI contract satisfied.')
