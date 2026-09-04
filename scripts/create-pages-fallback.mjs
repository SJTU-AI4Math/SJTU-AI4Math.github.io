import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const dist = resolve(process.env.DIST_DIR ?? new URL('../dist', import.meta.url).pathname)
const appShell = resolve(dist, 'index.html')
const fallbacks = [
  resolve(dist, '404.html'),
  resolve(dist, 'summer-school/index.html'),
  resolve(dist, 'summer-school/2026/index.html'),
  resolve(dist, 'snl/index.html'),
  resolve(dist, 'snl/documents/fulcrum-notes-snl/index.html'),
  resolve(dist, 'snl/documents/snl4gaokao/index.html'),
]

for (const destination of fallbacks) {
  await mkdir(dirname(destination), { recursive: true })
  await copyFile(appShell, destination)
}

console.log('Created GitHub Pages SPA fallbacks for 404 and static-directory route collisions.')
