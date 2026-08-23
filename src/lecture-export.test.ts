import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const exportRoot = resolve('public/summer-school/2026/lectures/type-theory')

describe('1A Extension HTML export', () => {
  it('ships the complete interactive Extension export at the stable lecture route', () => {
    const html = readFileSync(resolve(exportRoot, 'index.html'), 'utf8')
    const popovers = readFileSync(resolve(exportRoot, 'popovers.js'), 'utf8')

    expect(html).toContain('data-snl-interactive="true"')
    expect(html.match(/data-snl-route-id=/g)).toHaveLength(162)
    expect(html.match(/data-entry-id=/g)).toHaveLength(162)
    expect(html).toContain('globalThis.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('src="popovers.js"')
    expect(popovers).toContain('window.__SNL_POPOVERS__')
    expect(popovers).toContain('window.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('href="/summer-school/2026#courses"')
  })
})
