const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// ─── Fix: "Failed to start watch mode" on Windows ─────────────────────────
// Metro's default behavior on a pnpm monorepo is to watch the entire root
// which causes Windows to hit the file-watcher limit and time out.
// We explicitly restrict watchFolders to ONLY the mobile app itself.
// Metro still resolves node_modules via nodeModulesPaths below.
config.watchFolders = [projectRoot]

// Tell Metro where to find node_modules so imports resolve correctly
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.join(projectRoot, 'node_modules'),
    path.join(monorepoRoot, 'node_modules'),
  ],
}

module.exports = config
