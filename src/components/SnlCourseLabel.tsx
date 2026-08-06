import { useCallback, useMemo, useRef, type KeyboardEvent } from 'react'
import {
  MacroDataDriver,
  parseSnlSyntaxTree,
  SnlInteractionDriver,
  SnlSyntaxTreeView,
} from '@sjtu-ai4math/snl-basics'

const macroDataDriver = new MacroDataDriver({
  queries: { query_macro: async () => null },
})

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
  const tree = useMemo(() => parseSnlSyntaxTree(`%${label}%`), [label])
  const show = useCallback((mode: PopoverShowMode) => {
    if (rootRef.current) onShow(courseId, rootRef.current, mode)
  }, [courseId, onShow])
  const interactionDriver = useMemo(
    () => new SnlInteractionDriver({
      on_hover: () => show('transient'),
      on_leave: () => onHide(courseId),
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
      onPointerEnter={() => show('transient')}
      onPointerLeave={() => onHide(courseId)}
      onFocus={() => show('transient')}
      onBlur={() => onHide(courseId, true)}
      onClick={() => show('pinned')}
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
