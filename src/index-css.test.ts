/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

function bracedContent(source: string, start: number) {
  const bodyStart = source.indexOf('{', start) + 1
  let depth = 1
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') depth -= 1
    if (depth === 0) return source.slice(bodyStart, index)
  }
  throw new Error('Unclosed CSS block')
}

function blockIn(source: string, selector: string, last = false) {
  const needle = `${selector} {`
  const start = last ? source.lastIndexOf(needle) : source.indexOf(needle)
  if (start < 0) throw new Error(`Missing CSS block: ${selector}`)
  return bracedContent(source, start)
}

function block(selector: string, last = false) {
  return blockIn(css, selector, last)
}

function declaration(styles: string, property: string) {
  for (const candidate of styles.split(';')) {
    const separator = candidate.indexOf(':')
    if (separator < 0) continue
    if (candidate.slice(0, separator).trim() === property) {
      return candidate.slice(separator + 1).trim()
    }
  }
  throw new Error(`Missing CSS declaration: ${property}`)
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

  it('positions the speech-bubble tail tip exactly on the measured map coordinate', () => {
    const marker = block('.campus-map-marker')
    const outerTail = block('.campus-map-marker::before', true)
    const borderWidth = Number(marker.match(/border:\s*(\d+)px\s+solid/)?.[1])
    const transformOffset = Number(marker.match(/translate\(-50%, calc\(-100% - (\d+)px\)\)/)?.[1])
    const tailBottom = Number(outerTail.match(/bottom:\s*(-?\d+)px/)?.[1])
    const tailHeight = Number(outerTail.match(/border-top:\s*(\d+)px/)?.[1])

    expect(marker).toContain('border-radius: 999px')
    expect(borderWidth).toBeGreaterThan(0)
    expect(-tailBottom).toBe(tailHeight)
    expect(transformOffset).toBe(tailHeight - borderWidth)
  })
})

describe('summer school side navigation', () => {
  it('matches declaration names exactly', () => {
    expect(() => declaration('margin-bottom: 0.75rem;', 'bottom')).toThrow(
      'Missing CSS declaration: bottom',
    )
  })

  it('uses a fixed right-side vertical rail on desktop', () => {
    const navigation = block('.summer-page-nav')
    expect(declaration(navigation, 'position')).toBe('fixed')
    expect(declaration(navigation, 'right')).toBeTruthy()
    expect(declaration(navigation, 'flex-direction')).toBe('column')
  })

  it('stays right-aligned and vertical without overlaying mobile content', () => {
    const navigation = block('.summer-page-nav', true)
    expect(declaration(navigation, 'position')).toBe('static')
    expect(declaration(navigation, 'flex-direction')).toBe('column')
    expect(declaration(navigation, 'margin')).toBe('1.25rem 0 0 auto')
  })

  it('avoids the sticky navbar in short desktop landscape viewports', () => {
    const shortLandscape = block(
      '@media (min-width: 1100px) and (max-height: 420px)',
    )
    const extremelyShortLandscape = block(
      '@media (min-width: 1100px) and (max-height: 280px)',
    )

    expect(declaration(blockIn(shortLandscape, '.summer-page-nav'), 'bottom')).toBe('0.75rem')
    expect(declaration(blockIn(extremelyShortLandscape, '.summer-page-nav'), 'position')).toBe('static')
  })
})
