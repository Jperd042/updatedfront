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
