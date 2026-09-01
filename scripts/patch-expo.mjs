import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

function patchFile(filePath, searchTarget, replacement, checkIndicator, patchName) {
  if (!fs.existsSync(filePath)) {
    return false
  }
  let content = fs.readFileSync(filePath, 'utf8')
  if (content.includes(checkIndicator)) {
    console.log(`[patch-expo] ${patchName} is already applied.`)
    return true
  }
  if (content.includes(searchTarget)) {
    content = content.replace(searchTarget, replacement)
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`[patch-expo] Successfully applied ${patchName}.`)
    return true
  }
  return false
}

// Find @expo/cli build directory
const pnpmDir = path.join(rootDir, 'node_modules', '.pnpm')
if (fs.existsSync(pnpmDir)) {
  const entries = fs.readdirSync(pnpmDir)
  const expoCliEntry = entries.find((e) => e.startsWith('@expo+cli@'))
  if (expoCliEntry) {
    const cliDir = path.join(pnpmDir, expoCliEntry, 'node_modules', '@expo', 'cli', 'build', 'src')

    // Patch 1: Node 24 undici body read bug in getNativeModuleVersions.js
    const versionsJs = path.join(cliDir, 'api', 'getNativeModuleVersions.js')
    patchFile(
      versionsJs,
      `async function getNativeModuleVersionsAsync(sdkVersion) {
    const fetchAsync = (0, _client.createCachedFetch)({`,
      `async function getNativeModuleVersionsAsync(sdkVersion) {
    try {
        const fetchAsync = (0, _client.createCachedFetch)({`,
      'try {',
      'Node 24 fetch fix'
    )

    // Patch 2: Sanitize bundleUrl for HTTPS tunnels in ExpoGoManifestHandlerMiddleware.js
    const manifestJs = path.join(cliDir, 'start', 'server', 'middleware', 'ExpoGoManifestHandlerMiddleware.js')
    patchFile(
      manifestJs,
      `        const expoUpdatesManifest = {
            id: _crypto().default.randomUUID(),
            createdAt: new Date().toISOString(),
            runtimeVersion,
            launchAsset: {
                key: 'bundle',
                contentType: 'application/javascript',
                url: bundleUrl
            },`,
      `        const isHttpsTunnel = bundleUrl.startsWith('https://');
        const cleanBundleUrl = isHttpsTunnel ? bundleUrl.replace(/:\d+(?=[/?#]|$)/, '') : bundleUrl;
        const cleanHostUri = isHttpsTunnel && hostUri ? hostUri.replace(/:\d+(?=[/?#]|$)/, '') : hostUri;
        const expoUpdatesManifest = {
            id: _crypto().default.randomUUID(),
            createdAt: new Date().toISOString(),
            runtimeVersion,
            launchAsset: {
                key: 'bundle',
                contentType: 'application/javascript',
                url: cleanBundleUrl
            },`,
      'isHttpsTunnel',
      'HTTPS tunnel port 8081 stripping'
    )

    // Patch 3: UrlCreator.js port handling
    const urlCreatorJs = path.join(cliDir, 'start', 'server', 'UrlCreator.js')
    patchFile(
      urlCreatorJs,
      `    if (port) {
        return url + \`:\${port}\`;
    }`,
      `    if (port && port !== '80' && port !== '443') {
        return url + \`:\${port}\`;
    }`,
      "port !== '80'",
      'UrlCreator port 443 fix'
    )
  }
}
