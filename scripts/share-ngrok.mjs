import { spawn } from 'child_process'
import fs from 'fs'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Find ngrok executable
function getNgrokPath() {
  const npmNgrok = path.join(
    process.env.APPDATA || '',
    'npm',
    'node_modules',
    'ngrok',
    'bin',
    'ngrok.exe'
  )
  if (fs.existsSync(npmNgrok)) {
    return npmNgrok
  }
  return 'ngrok'
}

// Helper: fetch JSON from local HTTP
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

// Helper: wait for ngrok API to become available
async function waitForNgrokUrl(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const data = await fetchJson('http://127.0.0.1:4040/api/tunnels')
      const httpsTunnel = data.tunnels?.find((t) => t.public_url.startsWith('https://'))
      if (httpsTunnel) {
        return httpsTunnel.public_url
      }
    } catch {
      // waiting for ngrok to initialize
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('Timed out waiting for ngrok tunnel to start. Make sure ngrok is installed.')
}

async function main() {
  console.log('\n==================================================================')
  console.log('🚀 Starting ngrok Tunnel (For You, Your Manager & Anyone Else)...')
  console.log('==================================================================\n')

  let ngrokProcess = null
  let publicUrl = null

  // Check if ngrok is already running on port 4040
  try {
    const data = await fetchJson('http://127.0.0.1:4040/api/tunnels')
    publicUrl = data.tunnels?.find((t) => t.public_url.startsWith('https://'))?.public_url
  } catch {
    // Start ngrok process
    const ngrokBin = getNgrokPath()
    console.log(`[ngrok] Launching ngrok binary...`)

    ngrokProcess = spawn(
      ngrokBin,
      ['http', '8081', '--request-header-add', 'ngrok-skip-browser-warning:1'],
      {
        stdio: 'ignore',
        detached: false,
      }
    )

    ngrokProcess.on('error', (err) => {
      console.error('[ngrok] Failed to spawn ngrok:', err.message)
    })

    publicUrl = await waitForNgrokUrl()
  }

  const expUrl = publicUrl.replace(/^https?:\/\//, 'exp://')
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(expUrl)}`

  console.log('\n✅ ngrok Tunnel Connected!')
  console.log(`🌐 Public URL : ${publicUrl}`)
  console.log(`📱 Expo Go URL : ${expUrl}\n`)
  console.log('==================================================================')
  console.log('📋 TO OPEN ON YOUR DEVICE OR SEND TO YOUR MANAGER:')
  console.log(`👉 Link to paste in Expo Go: ${expUrl}`)
  console.log(`👉 Or scan QR Code image   : ${qrUrl}`)
  console.log('==================================================================\n')
  console.log('Starting Expo Metro bundler...\n')

  // Set EXPO_PACKAGER_PROXY_URL so Metro formats manifest correctly for ngrok
  // EXPO_NO_DEPENDENCY_VALIDATION + EXPO_OFFLINE suppress Node 24 fetch failures
  const env = {
    ...process.env,
    EXPO_PACKAGER_PROXY_URL: publicUrl,
    EXPO_NO_DEPENDENCY_VALIDATION: '1',
    EXPO_OFFLINE: 'true',
  }

  // Start Expo Metro bundler
  const expoProcess = spawn('pnpm --dir apps/mobile start -c', {
    shell: true,
    stdio: 'inherit',
    env,
    cwd: rootDir,
  })

  const cleanup = () => {
    console.log('\nStopping servers...')
    if (expoProcess) expoProcess.kill()
    if (ngrokProcess) ngrokProcess.kill()
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
