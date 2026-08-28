import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repo = path.resolve(import.meta.dirname, '..')

describe('route bundle boundaries', () => {
  it('emits the SNL-backed home page as a real dynamic chunk', async () => {
    const previousRayonThreads = process.env.RAYON_NUM_THREADS
    process.env.RAYON_NUM_THREADS = '4'

    try {
      const { build } = await import('vite')
      const result = await build({
        root: repo,
        logLevel: 'silent',
        build: { write: false },
      })
      const outputs = Array.isArray(result) ? result : [result]
      const artifacts = outputs.flatMap((output) => 'output' in output ? output.output : [])
      const chunks = artifacts.filter((artifact) => artifact.type === 'chunk')
      const entry = chunks.find((chunk) => chunk.isEntry)
      const home = chunks.find((chunk) => chunk.facadeModuleId?.endsWith('/src/pages/HomePage.tsx'))

      expect(entry).toBeDefined()
      expect(home).toBeDefined()
      expect(home?.isDynamicEntry).toBe(true)
      expect(entry?.dynamicImports).toContain(home?.fileName)
    } finally {
      if (previousRayonThreads === undefined) delete process.env.RAYON_NUM_THREADS
      else process.env.RAYON_NUM_THREADS = previousRayonThreads
    }
    expect(process.env.RAYON_NUM_THREADS).toBe(previousRayonThreads)
  }, 15_000)
})
