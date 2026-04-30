import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(scriptDir, '..')
const file = fs.readFileSync(
  path.resolve(frontendRoot, 'src', 'screens', 'InvoiceOrderManagementWorkspace.js'),
  'utf8',
)

const failures = []

for (const snippet of [
  'ops-page-shell',
  'ops-page-header',
  'ops-summary-grid',
  'Financial Snapshot',
  'Job Order Billing Detail',
  'Ecommerce Order Detail',
  'Payment Entries',
  'Action Routes / Surface Rules',
]) {
  if (!file.includes(snippet)) failures.push(`InvoiceOrderManagementWorkspace missing ${snippet}`)
}

if (!file.includes('Load Job Order') || !file.includes('Load Order')) {
  failures.push('InvoiceOrderManagementWorkspace should expose compact lookup actions')
}

if (failures.length) {
  console.error('Invoice & Orders UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Invoice & Orders UI contract satisfied.')
