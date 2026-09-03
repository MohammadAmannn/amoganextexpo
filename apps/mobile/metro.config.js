const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')
const fs = require('fs')

const projectRoot = __dirname

// Find monorepo root dynamically (where pnpm-workspace.yaml or pnpm-lock.yaml lives)
let monorepoRoot = projectRoot
let current = projectRoot
for (let i = 0; i < 4; i++) {
  const parent = path.resolve(current, '..')
  if (
    fs.existsSync(path.join(parent, 'pnpm-workspace.yaml')) ||
    fs.existsSync(path.join(parent, 'pnpm-lock.yaml'))
  ) {
    monorepoRoot = parent
    break
  }
  current = parent
}

const config = getDefaultConfig(projectRoot)

// 1. Watch all relevant workspace directories
const watchFolders = [projectRoot]
if (monorepoRoot !== projectRoot) {
  watchFolders.push(monorepoRoot)
  const packagesRoot = path.resolve(monorepoRoot, 'packages')
  if (fs.existsSync(packagesRoot)) {
    watchFolders.push(packagesRoot)
  }
}
config.watchFolders = watchFolders

// 2. Node modules search paths (local project first, then monorepo root)
const nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]
if (monorepoRoot !== projectRoot) {
  nodeModulesPaths.push(path.resolve(monorepoRoot, 'node_modules'))
}
config.resolver.nodeModulesPaths = nodeModulesPaths

// 3. Resolve singletons cleanly
const singletons = [
  'react',
  'react-dom',
  'react-native',
  'expo',
  'expo-router',
  '@rn-primitives/slot',
  '@rn-primitives/portal',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-gesture-handler',
  '@react-navigation/native',
  '@react-navigation/core',
  'zustand',
]

config.resolver.extraNodeModules = singletons.reduce((acc, name) => {
  try {
    const resolvedPath = path.dirname(
      require.resolve(`${name}/package.json`, { paths: [projectRoot, monorepoRoot] })
    )
    acc[name] = resolvedPath
  } catch {
    acc[name] = path.resolve(projectRoot, 'node_modules', name)
  }
  return acc
}, {})

// 4. Custom resolveRequest with fallback
const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    if (moduleName === 'react' || moduleName.startsWith('react/')) {
      const resolved = require.resolve(moduleName, { paths: [projectRoot, monorepoRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
    if (moduleName === 'react-dom' || moduleName.startsWith('react-dom/')) {
      const resolved = require.resolve(moduleName, { paths: [projectRoot, monorepoRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
    if (moduleName === 'react-native') {
      const resolved = require.resolve('react-native', { paths: [projectRoot, monorepoRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
  } catch {}

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

config.resolver.unstable_enablePackageExports = true

module.exports = withNativeWind(config, { input: './global.css' })
