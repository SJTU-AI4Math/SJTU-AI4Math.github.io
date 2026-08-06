/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

function block(selector: string) {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`Missing CSS block: ${selector}`)
  const bodyStart = css.indexOf('{', start) + 1
  const end = css.indexOf('}', bodyStart)
  return css.slice(bodyStart, end)
}

function hexVariable(styles: string, name: string) {
  const match = styles.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`Missing hex variable: ${name}`)
  return match[1]
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
  const linear = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(first: string, second: string) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('campus map marker contrast', () => {
  it('uses the page background against the accent in both themes', () => {
    const marker = block('.campus-map-marker')
    expect(marker).toContain('color: var(--page-bg)')

    for (const theme of [block(':root'), block(":root[data-theme='dark']")]) {
      expect(contrast(hexVariable(theme, '--accent'), hexVariable(theme, '--page-bg'))).toBeGreaterThanOrEqual(4.5)
    }
  })
})
