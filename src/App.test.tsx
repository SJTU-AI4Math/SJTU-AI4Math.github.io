import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

describe('application shell', () => {
  it('renders the shared navigation on the 2026 summer school route', async () => {
    render(<App initialEntries={['/summer-school/2026']} />)

    expect(await screen.findByRole('link', { name: 'SJTU AI4Math' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '2026 暑期学校' })).toHaveAttribute(
      'href',
      '/summer-school/2026',
    )
    expect(screen.getByRole('main')).toBeEmptyDOMElement()
  })

  it('switches the navigation language and persists the choice', async () => {
    const user = userEvent.setup()
    render(<App initialEntries={['/']} />)

    await screen.findByRole('link', { name: 'SJTU AI4Math' })
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))

    expect(screen.getByRole('link', { name: '2026 Summer School' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(localStorage.getItem('sjtu-ai4math-language')).toBe('en')
  })

  it('restores persisted language and theme on remount', async () => {
    const user = userEvent.setup()
    const firstRender = render(<App initialEntries={['/']} />)

    await screen.findByRole('link', { name: 'SJTU AI4Math' })
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))
    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    firstRender.unmount()

    render(<App initialEntries={['/']} />)

    expect(await screen.findByRole('link', { name: '2026 Summer School' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('still renders and toggles when browser storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError')
    })
    const user = userEvent.setup()

    render(<App initialEntries={['/']} />)

    await screen.findByRole('link', { name: 'SJTU AI4Math' })
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))
    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })
})
