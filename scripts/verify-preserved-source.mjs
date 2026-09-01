import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const rows = readFileSync('PRESERVED_SOURCE_SHA256.txt', 'utf8').trim().split('\n')
let failed = 0

for (const row of rows) {
  const match = row.match(/^([a-f0-9]{64})  (.+)$/)
  if (!match) continue
  const [, expected, rel] = match
  const file = resolve('apps/web', rel)
  if (!existsSync(file)) {
    console.error('MISSING', rel)
    failed++
    continue
  }
  const actual = createHash('sha256').update(readFileSync(file)).digest('hex')
  if (actual !== expected) {
    console.error('CHANGED', rel)
    failed++
  }
}

if (failed) {
  console.error(`Preservation check failed: ${failed}`)
  process.exit(1)
}
console.log(`Preservation check passed: ${rows.length} original files unchanged`)
