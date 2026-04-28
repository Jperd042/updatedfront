import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(scriptDir, '..')
const css = fs.readFileSync(path.resolve(frontendRoot, 'src', 'app', 'globals.css'), 'utf8')
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

if (failures.length) {
  console.error('Operations suite shared UI contract missing:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Operations suite shared UI contract satisfied.')
