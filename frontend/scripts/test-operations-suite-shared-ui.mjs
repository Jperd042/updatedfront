import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const css = fs.readFileSync(path.resolve(root, 'src', 'app', 'globals.css'), 'utf8')
const jobOrders = fs.readFileSync(path.resolve(root, 'src', 'screens', 'JobOrderWorkbench.js'), 'utf8')
const qaAudit = fs.readFileSync(path.resolve(root, 'src', 'screens', 'QAAuditWorkspace.js'), 'utf8')
const invoices = fs.readFileSync(
  path.resolve(root, 'src', 'screens', 'InvoiceOrderManagementWorkspace.js'),
  'utf8',
)
const failures = []

for (const snippet of [
  '.ops-page-shell',
  '.ops-page-header',
  '.ops-page-kicker',
  '.ops-page-title',
  '.ops-page-copy',
  '.ops-control-strip',
  '.ops-summary-grid',
  '.ops-workspace-grid',
  '.ops-panel',
  '.ops-action-primary',
  '.ops-action-secondary',
]) {
  if (!css.includes(snippet)) failures.push(`globals.css missing ${snippet}`)
}

for (const [name, source] of [
  ['JobOrderWorkbench', jobOrders],
  ['QAAuditWorkspace', qaAudit],
  ['InvoiceOrderManagementWorkspace', invoices],
]) {
  for (const hook of ['ops-page-shell', 'ops-page-header', 'ops-control-strip']) {
    if (!source.includes(hook)) failures.push(`${name} missing ${hook}`)
  }
}

if (failures.length) {
  console.error('Operations suite shared UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Operations suite shared UI contract satisfied.')
