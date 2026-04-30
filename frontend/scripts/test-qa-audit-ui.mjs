import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(scriptDir, '..')
const file = fs.readFileSync(path.resolve(frontendRoot, 'src', 'screens', 'QAAuditWorkspace.js'), 'utf8')

const failures = []
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

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

const releaseSummaryExpectations = [
  ['release_allowed', 'Allowed'],
  ['release_allowed_by_override', 'Allowed by Override'],
  ['release_blocked', 'Blocked'],
  ['release_pending_audit', 'Pending Audit'],
  ['release_unavailable', 'Awaiting Load'],
]

for (const [state, value] of releaseSummaryExpectations) {
  const pattern = new RegExp(`${state}:\\s*\\{[\\s\\S]*?value:\\s*'${escapeRegex(value)}'`)
  if (!pattern.test(file)) {
    failures.push(`QAAuditWorkspace should map ${state} to release summary value "${value}"`)
  }
}

const blockingGroupIndex = file.indexOf("title: 'Blocking Findings'")
const reviewGroupIndex = file.indexOf("title: 'Review Needed'")
const infoGroupIndex = file.indexOf("title: 'Informational Findings'")

if (blockingGroupIndex === -1 || reviewGroupIndex === -1 || infoGroupIndex === -1) {
  failures.push('QAAuditWorkspace should define findings groups for blocking, review-needed, and informational findings')
} else if (!(blockingGroupIndex < reviewGroupIndex && reviewGroupIndex < infoGroupIndex)) {
  failures.push('QAAuditWorkspace should enforce findings groups in priority order: blocking, review-needed, informational')
}

if (!file.includes('sortQualityFindings')) {
  failures.push('QAAuditWorkspace should sort findings before rendering them')
}

if (!file.includes("disabled={qaState.status === 'qa_loading'}")) {
  failures.push('QAAuditWorkspace should disable the header refresh while QA is loading')
}

if (failures.length) {
  console.error('QA Audit UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('QA Audit UI contract satisfied.')
