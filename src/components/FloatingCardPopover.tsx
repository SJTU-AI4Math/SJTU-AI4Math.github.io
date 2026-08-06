import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

interface FloatingCardPopoverProps {
  anchor: HTMLElement | null
  children: ReactNode
  contentKey: string
  id: string
  onDismiss: () => void
  testId: string
}

interface Position {
  left: number
  maxHeight: number
  top: number
  ready: boolean
}

const VIEWPORT_MARGIN = 12
const POPOVER_GAP = 12

function stickyStackBottom() {
  let bottom = VIEWPORT_MARGIN
  for (const element of document.querySelectorAll<HTMLElement>('.navbar, .summer-page-nav')) {
    const styles = window.getComputedStyle(element)
    if (styles.position !== 'sticky' && styles.position !== 'fixed') continue
    const rect = element.getBoundingClientRect()
    const insetTop = Number.parseFloat(styles.top) || 0
    const isStuck = styles.position === 'fixed' || rect.top <= insetTop + 1
    if (isStuck && rect.bottom > 0) bottom = Math.max(bottom, rect.bottom + POPOVER_GAP)
  }
  return bottom
}

export function FloatingCardPopover({
  anchor,
  children,
  contentKey,
  id,
  onDismiss,
  testId,
}: FloatingCardPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position>({
    left: 0,
    maxHeight: 0,
    top: 0,
    ready: false,
  })

  const updatePosition = useCallback(() => {
    const popover = popoverRef.current
    if (!anchor || !popover) return

    const anchorRect = anchor.getBoundingClientRect()
    const safeTop = stickyStackBottom()
    const hasLayout = anchorRect.width > 0 || anchorRect.height > 0
    if (
      (hasLayout && anchorRect.bottom <= safeTop)
      || anchorRect.top > window.innerHeight
      || anchorRect.right < 0
      || anchorRect.left > window.innerWidth
    ) {
      onDismiss()
      return
    }
    const popoverRect = popover.getBoundingClientRect()
    const contentHeight = Math.max(popover.scrollHeight, popoverRect.height)
    const maxLeft = Math.max(VIEWPORT_MARGIN, window.innerWidth - popoverRect.width - VIEWPORT_MARGIN)
    const centeredLeft = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2
    const left = Math.min(Math.max(centeredLeft, VIEWPORT_MARGIN), maxLeft)
    const viewportBottom = window.innerHeight - VIEWPORT_MARGIN
    const belowTop = Math.max(safeTop, anchorRect.bottom + POPOVER_GAP)
    const spaceBelow = Math.max(0, viewportBottom - belowTop)
    const spaceAbove = Math.max(0, anchorRect.top - POPOVER_GAP - safeTop)
    const placeBelow = spaceBelow >= contentHeight || spaceBelow >= spaceAbove
    const maxHeight = placeBelow ? spaceBelow : spaceAbove
    if (maxHeight <= 0) {
      onDismiss()
      return
    }
    const renderedHeight = Math.min(contentHeight, maxHeight)
    const top = placeBelow
      ? belowTop
      : Math.max(safeTop, anchorRect.top - POPOVER_GAP - renderedHeight)

    setPosition({ left, maxHeight, top, ready: true })
  }, [anchor, onDismiss])

  useLayoutEffect(() => {
    setPosition((current) => ({ ...current, ready: false }))
    updatePosition()
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (!anchor?.contains(event.target) && !popoverRef.current?.contains(event.target)) onDismiss()
    }
    document.addEventListener('pointerdown', handleOutsidePointer)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('pointerdown', handleOutsidePointer)
    }
  }, [anchor, contentKey, onDismiss, updatePosition])

  if (!anchor) return null

  return createPortal(
    <div
      ref={popoverRef}
      id={id}
      className="floating-card-popover"
      data-testid={testId}
      role="tooltip"
      aria-live="polite"
      style={{
        left: position.left,
        maxHeight: position.maxHeight,
        top: position.top,
        visibility: position.ready ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
