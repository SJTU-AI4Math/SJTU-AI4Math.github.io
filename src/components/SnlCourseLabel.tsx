import { useMemo } from 'react'
import {
  MacroDataDriver,
  parseSnlSyntaxTree,
  SnlInteractionDriver,
  SnlSyntaxTreeView,
} from '@sjtu-ai4math/snl-basics'

const macroDataDriver = new MacroDataDriver({
  queries: { query_macro: async () => null },
})

interface SnlCourseLabelProps {
  courseId: string
  label: string
  onHover: (courseId: string) => void
}

export function SnlCourseLabel({ courseId, label, onHover }: SnlCourseLabelProps) {
  const tree = useMemo(() => parseSnlSyntaxTree(`%${label}%`), [label])
  const interactionDriver = useMemo(
    () => new SnlInteractionDriver({ on_hover: () => onHover(courseId) }),
    [courseId, onHover],
  )

  return (
    <span
      className="schedule-course-snl"
      data-snl-course={courseId}
      aria-label={label}
      tabIndex={0}
      onPointerEnter={() => onHover(courseId)}
      onFocus={() => onHover(courseId)}
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
