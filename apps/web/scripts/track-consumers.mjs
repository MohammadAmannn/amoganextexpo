#!/usr/bin/env node

/**
 * Track Consuming Applications Status Dashboard
 * Run via: npm run consumers:status
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const registryPath = path.resolve(__dirname, '../consumers-registry.json')

if (!fs.existsSync(registryPath)) {
  console.error(`❌ Error: Registry not found at ${registryPath}`)
  process.exit(1)
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
const amogaPackage = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')
)

const latestVersion = amogaPackage.version

console.log('\n===============================================================')
console.log(`  🌟 AmogaDS (@amogads/ui) Central Consumer Tracker`)
console.log(`  📦 Current Design System Version: v${latestVersion}`)
console.log('===============================================================\n')

const rows = registry.consumers.map((consumer) => {
  const isUpToDate = consumer.currentVersion === latestVersion
  const statusIcon = isUpToDate ? '✅' : '⚠️'

  return {
    'Repository': consumer.repository,
    'App Name': consumer.name,
    'Installed': `v${consumer.currentVersion}`,
    'Target': `v${latestVersion}`,
    'Status': `${statusIcon} ${consumer.updateStatus}`,
    'Automation': consumer.automationStatus,
    'Team': consumer.team,
    'Active PR': consumer.activePrUrl || 'None',
  }
})

console.table(rows)

const pendingCount = registry.consumers.filter(
  (c) => c.currentVersion !== latestVersion
).length

console.log(
  `\n📊 Summary: ${registry.consumers.length} registered apps | ${registry.consumers.length - pendingCount} up-to-date | ${pendingCount} pending upgrade.\n`
)
