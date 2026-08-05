import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('provides a reusable labelled surface with Entry-like metadata and body regions', () => {
    render(
      <Card
        tone="violet"
        eyebrow="课程 1A"
        title="类型论"
        meta="刘云天（猫猫）"
      >
        <p>课程内容</p>
      </Card>,
    )

    const card = screen.getByRole('article', { name: '类型论' })
    expect(card).toHaveAttribute('data-tone', 'violet')
    expect(screen.getByText('课程 1A')).toBeInTheDocument()
    expect(screen.getByText('刘云天（猫猫）')).toBeInTheDocument()
    expect(screen.getByText('课程内容')).toBeInTheDocument()
  })

  it('supports a deliberately empty labelled placeholder card', () => {
    render(<Card ariaLabel="论文占位卡片" tone="neutral" />)

    expect(screen.getByRole('article', { name: '论文占位卡片' })).toBeEmptyDOMElement()
  })

  it('preserves falsy React nodes and forwards article attributes and refs', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Card
        ref={ref}
        id="global-card"
        data-testid="global-card"
        title="可复用卡片"
        eyebrow={0}
        meta={0}
      >
        {0}
      </Card>,
    )

    expect(screen.getAllByText('0')).toHaveLength(3)
    expect(screen.getByTestId('global-card')).toHaveAttribute('id', 'global-card')
    expect(ref.current).toBe(screen.getByTestId('global-card'))
  })
})
