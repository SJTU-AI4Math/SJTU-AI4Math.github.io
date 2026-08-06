import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

describe('application shell', () => {
  it('renders the complete 2026 summer school plan and venue', async () => {
    render(<App initialEntries={['/summer-school/2026']} />)

    expect(await screen.findByRole('link', { name: 'SJTU AI4Math' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '2026 暑期学校' })).toHaveAttribute(
      'href',
      '/summer-school/2026',
    )
    expect(await screen.findByRole('heading', { level: 1, name: '2026 暑期学校' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '日程安排' })).toBeInTheDocument()

    expect(screen.getByText('8 月 24–30 日')).toBeInTheDocument()
    expect(screen.queryByText('8 天')).not.toBeInTheDocument()
    expect(screen.queryByText('11 门课程')).not.toBeInTheDocument()
    expect(screen.queryByText('12 个课题')).not.toBeInTheDocument()
    expect(document.querySelector('.summer-hero-metrics')).not.toBeInTheDocument()

    const scheduleTable = screen.getByRole('table', { name: '日程安排' })
    const august24 = within(scheduleTable).getByRole('row', { name: /8 月 24 日/ })
    const typeTheorySnl = within(august24).getByLabelText('类型论')
    expect(typeTheorySnl).toHaveAttribute('data-snl-course', 'course-1a')
    const schedulePreview = screen.getByTestId('schedule-course-preview')
    expect(within(schedulePreview).getByRole('article', { name: '类型论' })).toBeInTheDocument()
    await userEvent.hover(within(august24).getByLabelText('归纳法'))
    expect(within(schedulePreview).getByRole('article', { name: '归纳法' })).toBeInTheDocument()
    expect(within(august24).getByText('光彪楼 206')).toBeInTheDocument()

    const courseCard = screen.getByRole('link', { name: /课程 1A · 类型论/ })
    expect(document.querySelectorAll('.course-grid > .card-link')).toHaveLength(11)
    expect(courseCard).toHaveAttribute('href', '/summer-school/2026/lectures/type-theory')
    expect(courseCard).toHaveTextContent('刘云天（猫猫）')
    expect(screen.getByRole('article', { name: '智能体框架搭建' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '上海交通大学校园地图' })).toHaveAttribute(
      'src',
      '/img/SJTUmap.webp',
    )
    expect(screen.getByRole('link', { name: '打开方块交大地图' })).toHaveAttribute(
      'href',
      'https://map.sjtu.edu.cn/voxel#world',
    )
    expect(screen.getByText(/Lean 4 安装问题尽量在暑校开始前解决/)).toBeInTheDocument()
    expect(screen.getByText(/其中部分（尤其是元编程部分）课题也许是相当困难的/)).toBeInTheDocument()
    expect(screen.getByText(/也许这些工作会为你的学术生涯带来转变/)).toBeInTheDocument()
    expect(screen.getByText('课题在 API 预算范围内不限制 AI 使用，但建议 Vibe Coding 成果配合适当文档。')).toBeInTheDocument()
  })

  it('translates the summer school navigation and section headings', async () => {
    const user = userEvent.setup()
    render(<App initialEntries={['/summer-school/2026']} />)

    await screen.findByRole('heading', { name: '2026 暑期学校' })
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))

    expect(screen.getByRole('heading', { level: 1, name: '2026 Summer School' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Schedule' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Courses' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /August 24/ })).toHaveTextContent('Type Theory')
    const venueCard = screen.getByRole('article', { name: 'Venues & Campus Map' })
    expect(within(venueCard).getByText('Guangbiao Building, Room 206')).toBeInTheDocument()
    expect(within(venueCard).getByText('Science Buildings 5–6, Room 300')).toBeInTheDocument()
  })

  it('shows a lecture placeholder on the stable nested route', async () => {
    render(<App initialEntries={['/summer-school/2026/lectures/type-theory']} />)

    expect(await screen.findByRole('heading', { level: 1, name: '类型论' })).toBeInTheDocument()
    expect(screen.getAllByText('讲义将在课程前一天公布')).not.toHaveLength(0)
    const backLink = screen.getByRole('link', { name: /返回 2026 暑期学校/ })
    expect(backLink).toHaveAttribute(
      'href',
      '/summer-school/2026#courses',
    )
    expect(backLink).not.toHaveAttribute('aria-current')
  })

  it('renders the day cat screen and an empty publications card on Home', async () => {
    render(<App initialEntries={['/']} />)

    const screenImage = await screen.findByRole('img', { name: '白日校园猫' })
    expect(screenImage).toHaveAttribute('src', '/img/day_cat.webp')
    expect(screen.getByRole('heading', { name: '论文发表' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: '论文占位卡片' })).toBeEmptyDOMElement()
  })

  it('switches the Home screen to the night cat with the dark theme', async () => {
    const user = userEvent.setup()
    render(<App initialEntries={['/']} />)

    await screen.findByRole('img', { name: '白日校园猫' })
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))

    expect(screen.getByRole('img', { name: '夜间校园猫' })).toHaveAttribute(
      'src',
      '/img/night_cat.webp',
    )
  })

  it('translates the Publications heading and placeholder label', async () => {
    const user = userEvent.setup()
    render(<App initialEntries={['/']} />)

    await screen.findByRole('heading', { name: '论文发表' })
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))

    expect(screen.getByRole('heading', { name: 'Publications' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Empty publication card' })).toBeEmptyDOMElement()
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
