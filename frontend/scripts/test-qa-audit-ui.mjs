import fs from 'node:fs'
import path from 'node:path'

const file = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'screens', 'QAAuditWorkspace.js'),
  'utf8',
)

const failures = []

for (const snippet of [
  'ops-page-shell',
  'ops-page-header',
  'ops-summary-grid',
  'Release Decision',
  'Findings Review',
  'Audit Timeline / Worker Detail',
  'Override Audit',
  'Contract Sources / Linked Context',
]) {
  if (!file.includes(snippet)) failures.push(`QAAuditWorkspace missing ${snippet}`)
}

if (!file.includes('Load QA Gate')) {
  failures.push('QAAuditWorkspace should expose a compact primary load action')
}

if (failures.length) {
  console.error('QA Audit UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('QA Audit UI contract satisfied.')
