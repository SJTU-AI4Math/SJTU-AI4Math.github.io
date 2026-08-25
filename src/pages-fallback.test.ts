import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it } from 'vitest'

const tempRoots: string[] = []

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('GitHub Pages fallbacks', () => {
  it('adds directory indexes where static lecture paths collide with SPA routes', () => {
    const dist = mkdtempSync(join(tmpdir(), 'pages-fallback-'))
    tempRoots.push(dist)
    const appShell = '<!doctype html><title>SPA shell</title>'
    writeFileSync(join(dist, 'index.html'), appShell)
    mkdirSync(join(dist, 'summer-school/2026/lectures/type-theory'), { recursive: true })
    writeFileSync(join(dist, 'summer-school/2026/lectures/type-theory/index.html'), '<title>1A lecture</title>')

    const result = spawnSync(process.execPath, [resolve('scripts/create-pages-fallback.mjs')], {
      cwd: resolve('.'),
      env: { ...process.env, DIST_DIR: dist },
      encoding: 'utf8',
    })

    expect(result.status, result.stderr).toBe(0)
    expect(readFileSync(join(dist, '404.html'), 'utf8')).toBe(appShell)
    expect(readFileSync(join(dist, 'summer-school/index.html'), 'utf8')).toBe(appShell)
    expect(readFileSync(join(dist, 'summer-school/2026/index.html'), 'utf8')).toBe(appShell)
    expect(readFileSync(join(dist, 'summer-school/2026/lectures/type-theory/index.html'), 'utf8')).toBe('<title>1A lecture</title>')
  })
})
