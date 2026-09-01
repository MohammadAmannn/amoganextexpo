import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../src')

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      processDir(fullPath)
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      if (entry.name.endsWith('.d.ts')) continue
      let content = fs.readFileSync(fullPath, 'utf8')
      const hasHook = /\b(useState|useEffect|useRef|useCallback|useMemo|useRouter|usePathname|useTheme|useLayout|useContext|useForm|useFormContext|useFormState|createContext)\b/.test(content)
      const hasClientDirective = content.startsWith("'use client'") || content.startsWith('"use client"')
      if (hasHook && !hasClientDirective) {
        content = "'use client'\n\n" + content
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log('Added use client to:', path.relative(rootDir, fullPath))
      }
    }
  }
}

processDir(rootDir)
console.log('Done checking client directives.')
