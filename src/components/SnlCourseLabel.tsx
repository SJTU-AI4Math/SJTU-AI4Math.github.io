import { useCallback, useMemo, useRef, type KeyboardEvent } from 'react'
import {
  MacroDataDriver,
  parseSnlSyntaxTree,
  SnlInteractionDriver,
  SnlSyntaxTreeView,
  type SnlMacro,
} from '@sjtu-ai4math/snl-basics'

export type PopoverShowMode = 'transient' | 'pinned'

interface SnlCourseLabelProps {
  courseId: string
  isOpen: boolean
  label: string
  onHide: (courseId: string, force?: boolean) => void
  onShow: (courseId: string, anchor: HTMLElement, mode: PopoverShowMode) => void
}

export function SnlCourseLabel({
  courseId,
  isOpen,
  label,
  onHide,
  onShow,
}: SnlCourseLabelProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const macroName = `SummerSchool.${courseId.replaceAll('-', '_')}`
  const macro = useMemo<SnlMacro>(() => ({
    name: macroName,
    description: label,
    source: { entries: [], urls: [] },
    kind: 'const',
    dynamic_arity: false,
    styles: [{
      style_name: 'default',
      mode: 'text',
      template: label,
      tags: [],
    }],
    tags: ['summer-school', 'course'],
  }), [label, macroName])
  const macroDataDriver = useMemo(() => new MacroDataDriver({
    queries: {
      query_macro: async ({ macro_name }) => macro_name === macroName ? macro : null,
    },
  }), [macro, macroName])
  const tree = useMemo(() => parseSnlSyntaxTree(macroName), [macroName])
  const show = useCallback((mode: PopoverShowMode, anchor = rootRef.current) => {
    if (anchor) onShow(courseId, anchor, mode)
  }, [courseId, onShow])
  const interactionDriver = useMemo(
    () => new SnlInteractionDriver({
      on_hover: ({ target }) => show('transient', target),
      on_leave: () => onHide(courseId),
      on_click: ({ target }) => show('pinned', target),
    }),
    [courseId, onHide, show],
  )
  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      show('pinned')
    } else if (event.key === 'Escape') {
      onHide(courseId, true)
    }
  }

  return (
    <span
      ref={rootRef}
      className="schedule-course-snl"
      data-snl-course={courseId}
      aria-label={label}
      aria-expanded={isOpen}
      aria-describedby={isOpen ? 'course-detail-popover' : undefined}
      role="button"
      tabIndex={0}
      onFocus={() => show('transient')}
      onBlur={() => onHide(courseId, true)}
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
