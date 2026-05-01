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

for (const snippet of [
  'label="Service Invoice State"',
  'label="Service Payment State"',
  'label="Ecommerce Order State"',
]) {
  if (!file.includes(snippet)) {
    failures.push(`InvoiceOrderManagementWorkspace missing summary label ${snippet}`)
  }
}

if (!file.includes("normalizedKey.includes('unpaid')") || !file.includes("normalizedKey.includes('paid')")) {
  failures.push('InvoiceOrderManagementWorkspace should normalize finance badge states before classifying paid/unpaid values')
}

if (!file.includes('Ecommerce invoice only') || !file.includes('ecommerce invoice payment-entry history')) {
  failures.push('InvoiceOrderManagementWorkspace should frame Payment Entries as ecommerce-invoice history')
}

if (failures.length) {
  console.error('Invoice & Orders UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Invoice & Orders UI contract satisfied.')
