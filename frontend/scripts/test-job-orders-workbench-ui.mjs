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

if (failures.length) {
  console.error('Job Orders workbench UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Job Orders workbench UI contract satisfied.')
