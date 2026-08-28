import { useCallback, useLayoutEffect, useMemo, useRef, type KeyboardEvent } from 'react'
import {
  clearSnlHoverHighlight,
  MacroDataDriver,
  parseSnlSyntaxTree,
  SnlInteractionDriver,
  SnlSyntaxTreeView,
  type SnlMacro,
} from '@sjtu-ai4math/snl-basics'
import type { PopoverShowMode } from './SnlCourseLabel'
import type { SnlDocTerm } from '../pages/homeSnlDocData'

interface SnlDocTermLabelProps {
  description: string
  isOpen: boolean
  item: SnlDocTerm
  label: string
  onHide: (itemId: string, force?: boolean) => void
  onShow: (itemId: string, anchor: HTMLElement, mode: PopoverShowMode) => void
}

export function SnlDocTermLabel({
  description,
  isOpen,
  item,
  label,
  onHide,
  onShow,
}: SnlDocTermLabelProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const macro = useMemo<SnlMacro>(() => ({
    name: item.macroName,
    description,
    source: { entries: [], urls: [] },
    kind: 'const',
    dynamic_arity: false,
    styles: [{
      style_name: 'default',
      mode: 'text',
      template: label,
      tags: [],
    }],
    tags: ['snl-doc', item.id],
  }), [description, item.id, item.macroName, label])
  const macroDataDriver = useMemo(() => new MacroDataDriver({
    queries: {
      query_macro: async ({ macro_name }) => macro_name === item.macroName ? macro : null,
    },
  }), [item.macroName, macro])
  const tree = useMemo(() => parseSnlSyntaxTree(item.macroName), [item.macroName])
  const show = useCallback((mode: PopoverShowMode, anchor = rootRef.current) => {
    if (anchor) onShow(item.id, anchor, mode)
  }, [item.id, onShow])
  const interactionDriver = useMemo(() => new SnlInteractionDriver({
    on_hover: ({ target }) => show('transient', target),
    on_leave: () => onHide(item.id),
    on_click: ({ target }) => show('pinned', target),
  }), [item.id, onHide, show])

  useLayoutEffect(() => {
    if (!isOpen && rootRef.current) clearSnlHoverHighlight(rootRef.current)
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      show('pinned')
    } else if (event.key === 'Escape') {
      onHide(item.id, true)
    }
  }

  return (
    <span
      ref={rootRef}
      className="snl-doc-term"
      data-snl-doc-term={item.id}
      aria-label={label}
      aria-expanded={isOpen}
      aria-describedby={isOpen ? 'snl-doc-detail-popover' : undefined}
      role="button"
      tabIndex={0}
      onFocus={() => show('transient')}
      onBlur={() => onHide(item.id, true)}
      onKeyDown={handleKeyDown}
    >
      <SnlSyntaxTreeView
        tree={tree}
        macro_data_driver={macroDataDriver}
        interaction_driver={interactionDriver}
        hooks={{ renderTooltip: () => null }}
      />
    </span>
  )
}
