import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const typeTheoryExportRoot = resolve('public/summer-school/2026/lectures/type-theory')
const inductionExportRoot = resolve('public/summer-school/2026/lectures/induction')
const curryHowardExportRoot = resolve('public/summer-school/2026/lectures/curry-howard')

describe('1A Extension HTML export', () => {
  it('ships the complete interactive Extension export at the stable lecture route', () => {
    const html = readFileSync(resolve(typeTheoryExportRoot, 'index.html'), 'utf8')
    const popovers = readFileSync(resolve(typeTheoryExportRoot, 'popovers.js'), 'utf8')

    expect(html).toContain('data-snl-interactive="true"')
    expect(html.match(/data-snl-route-id=/g)).toHaveLength(162)
    expect(html.match(/data-entry-id=/g)).toHaveLength(162)
    expect(html).toContain('globalThis.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('src="popovers.js"')
    expect(popovers).toContain('window.__SNL_POPOVERS__')
    expect(popovers).toContain('window.__SNL_EXPORT_VARIANTS__')
    expect(popovers).toContain('rgb(55, 65, 81)')
    expect(popovers).toContain('rgb(224, 123, 0)')
    expect(popovers).toContain('rgb(255, 235, 210)')
    expect(html).toContain('href="/summer-school/2026#courses"')
  })
})

describe('1B Extension HTML export', () => {
  it('ships the complete interactive Extension export at the stable lecture route', () => {
    const html = readFileSync(resolve(inductionExportRoot, 'index.html'), 'utf8')
    const popovers = readFileSync(resolve(inductionExportRoot, 'popovers.js'), 'utf8')

    expect(html).toContain('data-snl-interactive="true"')
    expect(html.match(/data-snl-route-id=/g)).toHaveLength(64)
    expect(html.match(/data-entry-id=/g)).toHaveLength(64)
    expect(html).toContain('globalThis.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('src="popovers.js"')
    expect(popovers).toContain('window.__SNL_POPOVERS__')
    expect(popovers).toContain('window.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('href="/summer-school/2026#courses"')
    expect(html).toContain('href="/brand/logo-dark.svg"')
    expect(html).toContain('html,body{overflow-x:clip}')
  })
})

describe('2A Extension HTML export', () => {
  it('ships the complete interactive Extension export at the stable lecture route', () => {
    const html = readFileSync(resolve(curryHowardExportRoot, 'index.html'), 'utf8')
    const popovers = readFileSync(resolve(curryHowardExportRoot, 'popovers.js'), 'utf8')

    expect(html).toContain('data-snl-interactive="true"')
    expect(html.match(/data-snl-route-id=/g)).toHaveLength(48)
    expect(html.match(/data-entry-id=/g)).toHaveLength(48)
    expect(html).toContain('globalThis.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('src="popovers.js"')
    expect(popovers).toContain('window.__SNL_POPOVERS__')
    expect(popovers).toContain('window.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('href="/summer-school/2026#courses"')
  })
})
