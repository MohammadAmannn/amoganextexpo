const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')
const packagesRoot = path.resolve(monorepoRoot, 'packages')

const config = getDefaultConfig(projectRoot)

// Watch mobile project AND shared packages.
// Watching `packagesRoot` avoids Windows file-watcher timeouts caused by apps/web/.next
config.watchFolders = [projectRoot, packagesRoot]

// Tell Metro where to find node_modules and enable package exports
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.join(projectRoot, 'node_modules'),
    path.join(monorepoRoot, 'node_modules'),
  ],
  unstable_enablePackageExports: true,
}

module.exports = withNativeWind(config, { input: './global.css' })

