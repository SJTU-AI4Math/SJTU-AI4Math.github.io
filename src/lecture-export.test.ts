import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

const typeTheoryExportRoot = resolve('public/summer-school/2026/lectures/type-theory')
const inductionExportRoot = resolve('public/summer-school/2026/lectures/induction')
const curryHowardExportRoot = resolve('public/summer-school/2026/lectures/curry-howard')
const jixiaProofExportRoot = resolve('public/summer-school/2026/lectures/jixia-proof-exploration')
const typeclassExportRoot = resolve('public/summer-school/2026/lectures/typeclasses-algebraic-structures')
const mathlibExplorerRoot = resolve('public/summer-school/2026/lectures/mathlib-explorer')

interface JixiaExportManifest {
  version: number
  source: { repository: string; commit: string }
  exporter: { repository: string; commit: string }
  library: { slug: string; entryCount: number; interactive: boolean; outputShape: string }
  rawIndexSha256: string
  postProcessing: string[]
  entries: Array<{ routeId: string; entryId: string }>
  files: Record<string, string>
}

interface JixiaExportVariant {
  locale: string
  colorScheme: string
  body: string
  entryTitles: Record<string, string>
  popovers: Record<string, string>
}

interface JixiaExportPayload {
  variants: JixiaExportVariant[]
}

const sha256 = (content: string | Buffer) => createHash('sha256').update(content).digest('hex')

const extractAttributeValues = (html: string, attribute: string) =>
  [...html.matchAll(new RegExp(`${attribute}="([^"]+)"`, 'g'))].map((match) => match[1])

const listFilesRecursively = (root: string, directory = root): string[] =>
  readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name)
    return statSync(path).isDirectory() ? listFilesRecursively(root, path) : [relative(root, path)]
  }).sort()

const extractLoadReferences = (html: string) => [
  ...[...html.matchAll(/<(?:script|img|source)\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]),
  ...[...html.matchAll(/<link\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]),
  ...[...html.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1]),
]

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

describe('2B Extension HTML export', () => {
  it('ships the exact complete interactive Extension export at the stable lecture route', () => {
    const htmlPath = resolve(jixiaProofExportRoot, 'index.html')
    const popoversPath = resolve(jixiaProofExportRoot, 'popovers.js')
    const manifestPath = resolve(jixiaProofExportRoot, 'export-manifest.json')
    const html = readFileSync(htmlPath, 'utf8')
    const popovers = readFileSync(popoversPath, 'utf8')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as JixiaExportManifest

    expect(manifest.version).toBe(1)
    expect(manifest.source).toEqual({
      repository: 'SJTU-AI4Math/Summer-School-2026',
      commit: '640e39e20ec0155b7067a3d570a469e1c1aba1b9',
    })
    expect(manifest.exporter).toEqual({
      repository: 'SJTU-AI4Math/SNL-Doc-Extension',
      commit: 'e8874c7c6958af55730863749824c521af228a43',
    })
    expect(manifest.library).toEqual({
      slug: '2B-TacticProofs',
      entryCount: 141,
      interactive: true,
      outputShape: 'folder',
    })

    const expectedRoutes = manifest.entries.map(({ routeId }) => routeId).sort()
    const expectedEntries = manifest.entries.map(({ entryId }) => entryId).sort()
    expect(new Set(expectedRoutes).size).toBe(141)
    expect(new Set(expectedEntries).size).toBe(141)

    const assertExactUniqueIds = (body: string) => {
      const routes = extractAttributeValues(body, 'data-snl-route-id')
      const entries = extractAttributeValues(body, 'data-entry-id')
      expect(routes).toHaveLength(141)
      expect(entries).toHaveLength(141)
      expect(new Set(routes).size).toBe(routes.length)
      expect(new Set(entries).size).toBe(entries.length)
      expect(routes.sort()).toEqual(expectedRoutes)
      expect(entries.sort()).toEqual(expectedEntries)
    }

    assertExactUniqueIds(html)
    expect(html).toContain('data-snl-interactive="true"')
    expect(html).toContain('globalThis.__SNL_EXPORT_VARIANTS__')
    expect(html).toContain('src="popovers.js"')
    expect(html).toContain('href="/summer-school/2026#courses"')

    const integrationStyle = `<style data-sjtu-site-integration>\n.sjtu-site-back{display:inline-flex;align-items:center;margin:0 0 1rem;color:inherit;font:600 .9rem/1.4 system-ui,sans-serif;text-decoration:none;opacity:.72}\n.sjtu-site-back:hover,.sjtu-site-back:focus-visible{opacity:1;text-decoration:underline;text-underline-offset:.2em}\n</style>\n`
    const integrationLink = '\n<a class="sjtu-site-back" href="/summer-school/2026#courses">← 2026 Summer School / 暑期学校</a>\n'
    expect(html.split(integrationStyle)).toHaveLength(2)
    expect(html.split(integrationLink)).toHaveLength(2)
    expect(sha256(html.replace(integrationStyle, '').replace(integrationLink, ''))).toBe(manifest.rawIndexSha256)

    const actualFiles = listFilesRecursively(jixiaProofExportRoot)
      .filter((file) => file !== 'export-manifest.json')
    expect(actualFiles).toEqual(Object.keys(manifest.files).sort())
    for (const [file, digest] of Object.entries(manifest.files)) {
      expect(sha256(readFileSync(resolve(jixiaProofExportRoot, file)))).toBe(digest)
    }

    for (const reference of extractLoadReferences(html)) {
      expect(reference).not.toMatch(/^(?:https?:|\/\/)/)
      if (reference.startsWith('data:')) continue
      const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0])
      const target = resolve(jixiaProofExportRoot, cleanReference)
      expect(target.startsWith(`${jixiaProofExportRoot}${sep}`)).toBe(true)
      expect(existsSync(target)).toBe(true)
    }

    const sandbox: {
      window: {
        __SNL_POPOVERS__?: Record<string, string>
        __SNL_EXPORT_VARIANTS__?: JixiaExportPayload
      }
    } = { window: {} }
    runInNewContext(popovers, sandbox, { timeout: 10_000 })
    const basePopovers = sandbox.window.__SNL_POPOVERS__
    const payload = sandbox.window.__SNL_EXPORT_VARIANTS__
    expect(basePopovers).toBeDefined()
    expect(payload).toBeDefined()
    if (!basePopovers || !payload) throw new Error('2B export payload globals were not initialized')
    expect(Object.keys(basePopovers).sort()).toEqual(expectedEntries)
    expect(payload.variants.map(({ locale, colorScheme }) => `${locale}/${colorScheme}`).sort()).toEqual([
      'en/dark',
      'en/light',
      'zh-CN/dark',
      'zh-CN/light',
    ])
    for (const variant of payload.variants) {
      assertExactUniqueIds(variant.body)
      expect(Object.keys(variant.entryTitles).sort()).toEqual(expectedEntries)
      expect(Object.keys(variant.popovers).sort()).toEqual(expectedEntries)
    }
  })
})

describe('3B typeclass hierarchy export', () => {
  it('ships the complete interactive graph at the stable lecture route', () => {
    const html = readFileSync(resolve(typeclassExportRoot, 'index.html'), 'utf8')

    expect(html).toContain('<title>3B · 类型类与代数结构 | SJTU AI4Math 2026 暑期学校</title>')
    expect(html).toContain('href="/summer-school/2026/#courses"')
    expect(html.match(/<g class="node /g)).toHaveLength(209)
    expect(html.match(/<g class="lane"/g)).toHaveLength(10)
    expect(html.match(/class="extension"/g)).toHaveLength(217)
    expect(html.match(/class="dependency"/g)).toHaveLength(128)
    expect(html.match(/class="instance"/g)).toHaveLength(37)
    expect(html).toContain('<svg role="img" aria-labelledby="typeclass-graph-title typeclass-graph-description"')
    expect(html).toContain('<title id="typeclass-graph-title">')
    expect(html).toContain('<desc id="typeclass-graph-description">')
    expect(html.match(/class="graph-node-item"/g)).toHaveLength(209)
    expect(html.match(/class="graph-edge-item"/g)).toHaveLength(382)
    expect(html).toContain('grid-template-columns:repeat(auto-fit,minmax(min(100%,130px),1fr))')
    expect(html).not.toContain('min-width:860px')

    const curves = [...html.matchAll(/<path class="(?:extension|dependency|instance)" d="M ([\d.]+) ([\d.]+) C ([\d.]+) ([\d.]+), ([\d.]+) ([\d.]+), ([\d.]+) ([\d.]+)"/g)]
    expect(curves).toHaveLength(382)
    for (const [, , startY, , firstControlY, , secondControlY, , endY] of curves) {
      expect(firstControlY).toBe(startY)
      expect(secondControlY).toBe(endY)
    }
  })
})

describe('3A Mathlib Explorer static export', () => {
  it('ships the preserved precomputed graph and all nested static assets', () => {
    const html = readFileSync(resolve(mathlibExplorerRoot, 'index.html'), 'utf8')
    const graphData = readFileSync(resolve(mathlibExplorerRoot, 'data.json'))
    const clientJavaScript = listFilesRecursively(mathlibExplorerRoot)
      .filter((file) => file.endsWith('.js'))
      .map((file) => readFileSync(resolve(mathlibExplorerRoot, file), 'utf8'))
      .join('\n')
    const provenance = JSON.parse(readFileSync(resolve(mathlibExplorerRoot, 'data-provenance.json'), 'utf8')) as {
      sha256: string
      nodeCount: number
      edgeCount: number
      coordinates: string
    }

    expect(sha256(graphData)).toBe('e9c394c8f8959161253709ab6a69fc07e9f8c8bc11d93413eecb930fd55de0de')
    expect(provenance).toMatchObject({
      sha256: 'e9c394c8f8959161253709ab6a69fc07e9f8c8bc11d93413eecb930fd55de0de',
      nodeCount: 9544,
      edgeCount: 239427,
      coordinates: 'precomputed; preserved verbatim',
    })
    expect(html).toContain('Mathlib Explorer')
    expect(clientJavaScript).toContain('Yugu233')
    expect(clientJavaScript).toContain('https://github.com/Yugu233')
    expect(clientJavaScript).toContain('https://space.bilibili.com/613069855')
    expect(clientJavaScript).toContain('https://store.steampowered.com/app/3635130')

    for (const reference of extractLoadReferences(html)) {
      if (reference.startsWith('data:') || /^(?:https?:|\/\/)/.test(reference)) continue
      const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0])
      const target = cleanReference.startsWith('/')
        ? resolve('public', cleanReference.slice(1))
        : resolve(mathlibExplorerRoot, cleanReference)
      expect(existsSync(target)).toBe(true)
    }
  })
})
