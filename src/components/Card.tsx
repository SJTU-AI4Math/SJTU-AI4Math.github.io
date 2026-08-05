import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useId,
} from 'react'

export type CardTone =
  | 'accent'
  | 'blue'
  | 'green'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'neutral'

type ArticleProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  'aria-label' | 'aria-labelledby' | 'children' | 'className' | 'title'
>

interface CardBaseProps extends ArticleProps {
  tone?: CardTone
  className?: string
}

interface TitledCardProps extends CardBaseProps {
  title: ReactNode
  eyebrow?: ReactNode
  meta?: ReactNode
  children?: ReactNode
  ariaLabel?: never
}

interface EmptyCardProps extends CardBaseProps {
  ariaLabel: string
  title?: never
  eyebrow?: never
  meta?: never
  children?: never
}

export type CardProps = TitledCardProps | EmptyCardProps

function isPresent(value: ReactNode): boolean {
  return value !== undefined && value !== null
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  props,
  ref,
) {
  const titleId = `card-${useId()}`
  const {
    tone = 'accent',
    className,
    title,
    eyebrow,
    meta,
    children,
    ariaLabel,
    ...articleProps
  } = props
  const classes = ['content-card', className].filter(Boolean).join(' ')
  const hasTitle = title !== undefined

  return (
    <article
      {...articleProps}
      ref={ref}
      className={classes}
      data-tone={tone}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-label={!hasTitle ? ariaLabel : undefined}
    >
      {hasTitle ? (
        <>
          <header className="content-card-header">
            {isPresent(eyebrow) ? (
              <span className="content-card-eyebrow">{eyebrow}</span>
            ) : null}
            <h3 id={titleId} className="content-card-title">{title}</h3>
            {isPresent(meta) ? <div className="content-card-meta">{meta}</div> : null}
          </header>
          {isPresent(children) ? (
            <div className="content-card-body">{children}</div>
          ) : null}
        </>
      ) : null}
    </article>
  )
})
