import fs from 'node:fs'
import path from 'node:path'
const source = path.resolve('apps/web/src/context/color-theme-provider.tsx')
if (!fs.existsSync(source)) throw new Error('Web theme provider not found')
console.log('Theme source:', source)
console.log('packages/theme/src/color-themes.ts is a preserved extracted catalog. Re-run the repository generator or update it when the web catalog changes.')
