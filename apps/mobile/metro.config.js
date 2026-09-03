const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')
const packagesRoot = path.resolve(monorepoRoot, 'packages')

const config = getDefaultConfig(projectRoot)

// 1. Watch mobile project AND shared monorepo packages
config.watchFolders = [projectRoot, packagesRoot]

// 2. Configure node_modules resolution paths (mobile first, monorepo root second)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

// 3. Pin critical packages as singletons to guarantee only ONE copy is ever loaded
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
  acc[name] = path.resolve(projectRoot, 'node_modules', name)
  return acc
}, {})

// 4. Custom resolveRequest to guarantee single-instance resolution for React & React Native
const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Guarantee react and its submodules (e.g. react/jsx-runtime, react/jsx-dev-runtime)
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    const resolved = require.resolve(moduleName, { paths: [projectRoot] })
    return {
      filePath: resolved,
      type: 'sourceFile',
    }
  }

  // Guarantee react-dom and its submodules (e.g. react-dom/client)
  if (moduleName === 'react-dom' || moduleName.startsWith('react-dom/')) {
    const resolved = require.resolve(moduleName, { paths: [projectRoot] })
    return {
      filePath: resolved,
      type: 'sourceFile',
    }
  }

  // Guarantee react-native root module
  if (moduleName === 'react-native') {
    const resolved = require.resolve('react-native', { paths: [projectRoot] })
    return {
      filePath: resolved,
      type: 'sourceFile',
    }
  }

  // Guarantee primitives and state management singletons
  if (
    moduleName === '@rn-primitives/slot' ||
    moduleName === '@rn-primitives/portal' ||
    moduleName === 'zustand'
  ) {
    const resolved = require.resolve(moduleName, { paths: [projectRoot] })
    return {
      filePath: resolved,
      type: 'sourceFile',
    }
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

// 5. Prevent Metro from looking up directory tree and finding duplicate copies of React
config.resolver.disableHierarchicalLookup = true
config.resolver.unstable_enablePackageExports = true

module.exports = withNativeWind(config, { input: './global.css' })
