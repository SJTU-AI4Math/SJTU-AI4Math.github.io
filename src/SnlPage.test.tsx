import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

const documentCards = [
  ['使用文档', 'https://github.com/SJTU-AI4Math/SNL-Doc-Extension/tree/main/docs'],
  ['Fulcrum Notes SNL', '/snl/documents/fulcrum-notes-snl'],
  ['SNL4GaoKao', '/snl/documents/snl4gaokao'],
] as const

const repositoryCards = [
  ['SNL Basics', 'https://github.com/SJTU-AI4Math/SNL-Basics'],
  ['SNL Doc Extension', 'https://github.com/SJTU-AI4Math/SNL-Doc-Extension'],
  ['SNL Agent Toolkit', 'https://github.com/SJTU-AI4Math/SNL-Agent-Toolkit'],
  ['SNL4Lean', 'https://github.com/SJTU-AI4Math/SNL4Lean'],
] as const

describe('SNL navigation and landing page', () => {
  it('renders Summer School and SNL as parallel navigation buttons', async () => {
    render(<App initialEntries={['/snl']} />)

    const navigation = await screen.findByRole('navigation', { name: 'Primary navigation' })
    expect(navigation).toHaveClass('nav-button-row')
    const links = within(navigation).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['2026 暑期学校', 'SNL'])
    expect(links.every((link) => link.classList.contains('nav-button'))).toBe(true)
    expect(within(navigation).getByRole('link', { name: 'SNL' })).toHaveAttribute('aria-current', 'page')
  })

  it('splits natural-language documents and GitHub repositories into two card columns', async () => {
    render(<App initialEntries={['/snl']} />)

    expect(await screen.findByRole('heading', { level: 1, name: 'SNL' })).toBeInTheDocument()
    const documents = screen.getByRole('region', { name: '自然语言文档' })
    const repositories = screen.getByRole('region', { name: 'GitHub 仓库' })

    for (const [name, href] of documentCards) {
      expect(within(documents).getByRole('link', { name })).toHaveAttribute('href', href)
    }
    for (const [name, href] of repositoryCards) {
      expect(within(repositories).getByRole('link', { name })).toHaveAttribute('href', href)
    }
    expect(within(documents).getAllByRole('link')).toHaveLength(3)
    expect(within(repositories).getAllByRole('link')).toHaveLength(4)
  })

  it.each([
    '/snl/documents/fulcrum-notes-snl',
    '/snl/documents/snl4gaokao',
  ])('keeps the new document page empty at %s', async (route) => {
    const { container } = render(<App initialEntries={[route]} />)
    expect(await screen.findByRole('link', { name: 'SNL' })).toBeInTheDocument()
    expect(container.querySelector('main')).toBeEmptyDOMElement()
  })

  it('localizes the SNL section headings while preserving repository names', async () => {
    const user = userEvent.setup()
    render(<App initialEntries={['/snl']} />)

    await screen.findByRole('heading', { name: '自然语言文档' })
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))

    expect(screen.getByRole('heading', { name: 'Natural-language documents' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'GitHub repositories' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'SNL Basics' })).toBeInTheDocument()
  })
})
