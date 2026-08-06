import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FloatingCardPopover } from './FloatingCardPopover'

function rect({
  bottom,
  height,
  left,
  right,
  top,
  width,
}: {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}) {
  return {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('FloatingCardPopover', () => {
  it('fits between a two-level sticky stack and a short viewport', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 300 })
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 })

    const navbar = document.createElement('div')
    navbar.className = 'navbar'
    navbar.style.position = 'sticky'
    navbar.style.top = '0px'
    const pageNav = document.createElement('div')
    pageNav.className = 'test-page-nav'
    pageNav.dataset.stickyTop = ''
    pageNav.style.position = 'sticky'
    pageNav.style.top = '60px'
    const anchor = document.createElement('button')
    document.body.append(navbar, pageNav, anchor)
    let anchorTop = 220
    let anchorBottom = 240

    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if (this === navbar) return rect({ top: 0, bottom: 60, height: 60, left: 0, right: 390, width: 390 })
      if (this === pageNav) return rect({ top: 60, bottom: 100, height: 40, left: 0, right: 390, width: 390 })
      if (this === anchor) return rect({
        top: anchorTop,
        bottom: anchorBottom,
        height: anchorBottom - anchorTop,
        left: 180,
        right: 210,
        width: 30,
      })
      if (this instanceof HTMLElement && this.dataset.testid === 'test-popover') {
        const constrainedHeight = Number.parseFloat(this.style.maxHeight)
        const height = constrainedHeight > 0 ? constrainedHeight : 400
        return rect({ top: 0, bottom: height, height, left: 0, right: 360, width: 360 })
      }
      return rect({ top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 })
    })

    const onDismiss = vi.fn()
    render(
      <FloatingCardPopover
        anchor={anchor}
        contentKey="test"
        id="test-popover"
        onDismiss={onDismiss}
        testId="test-popover"
      >
        <div>Details</div>
      </FloatingCardPopover>,
    )

    const popover = screen.getByTestId('test-popover')
    Object.defineProperty(popover, 'scrollHeight', { configurable: true, value: 400 })
    expect(popover).toHaveStyle({ top: '112px', maxHeight: '96px', visibility: 'visible' })
    expect(onDismiss).not.toHaveBeenCalled()

    fireEvent.pointerDown(popover)
    expect(onDismiss).not.toHaveBeenCalled()
    fireEvent.pointerDown(document.body)
    expect(onDismiss).toHaveBeenCalledOnce()

    onDismiss.mockClear()
    anchorTop = 300
    anchorBottom = 320
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 500 })
    fireEvent(window, new Event('resize'))
    expect(popover).toHaveStyle({ top: '112px', maxHeight: '176px' })
    expect(onDismiss).not.toHaveBeenCalled()

    navbar.remove()
    pageNav.remove()
    anchor.remove()
  })
})
