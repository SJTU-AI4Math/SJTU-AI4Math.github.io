import katex from 'katex'
import { Fragment, useLayoutEffect, useRef } from 'react'

const KATEX_MARKER = '$\\KaTeX$'

function KatexLogo() {
  const rootRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return
    katex.render('\\KaTeX', rootRef.current, {
      output: 'htmlAndMathml',
      throwOnError: true,
      trust: false,
    })
  }, [])

  return <span ref={rootRef} className="inline-katex-logo" />
}

export function RichKatexText({ text }: { text: string }) {
  return text.split(KATEX_MARKER).map((part, index, all) => (
    <Fragment key={`${index}-${part}`}>
      {part}
      {index < all.length - 1 ? <KatexLogo /> : null}
    </Fragment>
  ))
}
