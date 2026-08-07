import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

const COURSE_MACRO_NAMES = [
  'SummerSchool.course_1a',
  'SummerSchool.course_1b',
  'SummerSchool.course_2a',
  'SummerSchool.course_2b',
  'SummerSchool.course_3a',
  'SummerSchool.course_3b',
  'SummerSchool.course_4a',
  'SummerSchool.course_4b',
  'SummerSchool.course_5a',
  'SummerSchool.course_5b',
  'SummerSchool.course_6a',
]

function stubDecodedCatImages() {
  const decode = vi.fn(async () => undefined)
  class DecodedImage {
    decoding = ''
    fetchPriority = ''
    src = ''
    decode = decode
  }
  vi.stubGlobal('Image', DecodedImage)
  return decode
}

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
    const pageNavigation = screen.getByRole('navigation', { name: '本页导航' })
    expect(pageNavigation).toHaveClass('summer-side-nav')
    expect(within(pageNavigation).getAllByRole('link').map((link) => link.textContent)).toEqual([
      '日程安排',
      '课程',
      '课题实践',
      '地点',
    ])

    expect(screen.getByText('8 月 24–30 日')).toBeInTheDocument()
    expect(screen.queryByText('8 天')).not.toBeInTheDocument()
    expect(screen.queryByText('11 门课程')).not.toBeInTheDocument()
    expect(screen.queryByText('12 个课题')).not.toBeInTheDocument()
    expect(document.querySelector('.summer-hero-metrics')).not.toBeInTheDocument()

    const scheduleTable = screen.getByRole('table', { name: '日程安排' })
    const august23 = within(scheduleTable).getByRole('row', { name: /8 月 23 日/ })
    expect(within(august23).getByText('理科群楼六号楼 440 讨论室')).toBeInTheDocument()
    const august24 = within(scheduleTable).getByRole('row', { name: /8 月 24 日/ })
    const typeTheorySnl = within(august24).getByLabelText('类型论')
    expect(typeTheorySnl).toHaveAttribute('data-snl-course', 'course-1a')
    expect(screen.queryByTestId('schedule-course-preview')).not.toBeInTheDocument()
    const inductionSnl = within(august24).getByLabelText('归纳法')
    await waitFor(() => {
      expect(document.querySelectorAll('.schedule-course-snl [data-kind="const"]')).toHaveLength(11)
    })
    expect(document.querySelector('.schedule-course-snl [data-kind="fvar"]')).not.toBeInTheDocument()
    expect([...document.querySelectorAll('.schedule-course-snl [data-kind="const"]')]
      .map((node) => node.getAttribute('data-name'))).toEqual(COURSE_MACRO_NAMES)
    const inductionSnlNode = inductionSnl.querySelector<HTMLElement>('[data-tree-path=""]')!
    const elementsFromPoint = vi.spyOn(document, 'elementsFromPoint').mockReturnValue([])
    fireEvent.pointerEnter(inductionSnl)
    expect(screen.queryByTestId('course-popover')).not.toBeInTheDocument()
    await userEvent.hover(inductionSnlNode)
    expect(screen.queryByTestId('course-popover')).not.toBeInTheDocument()
    await userEvent.unhover(inductionSnlNode)
    elementsFromPoint.mockReturnValue([inductionSnlNode])
    await userEvent.hover(inductionSnlNode)
    const coursePopover = await screen.findByTestId('course-popover')
    expect(coursePopover).toHaveAttribute('role', 'tooltip')
    expect(within(coursePopover).getByRole('article', { name: '归纳法' })).toBeInTheDocument()
    await userEvent.unhover(inductionSnlNode)
    expect(screen.queryByTestId('course-popover')).not.toBeInTheDocument()
    await userEvent.click(inductionSnlNode)
    expect(screen.getByTestId('course-popover')).toBeInTheDocument()
    expect(inductionSnl).toHaveAttribute('aria-expanded', 'true')
    fireEvent.pointerDown(inductionSnl)
    expect(screen.queryByTestId('course-popover')).not.toBeInTheDocument()
    await userEvent.click(inductionSnlNode)
    expect(screen.getByTestId('course-popover')).toBeInTheDocument()
    await userEvent.click(inductionSnlNode)
    expect(screen.queryByTestId('course-popover')).not.toBeInTheDocument()
    await userEvent.click(inductionSnlNode)
    fireEvent.keyDown(inductionSnl, { key: 'Escape' })
    expect(screen.queryByTestId('course-popover')).not.toBeInTheDocument()
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
    const venueCard = screen.getByRole('article', { name: '地点与校园地图' })
    const venueMarkers = within(venueCard).getAllByRole('button', { name: /查看.+介绍/ })
    expect(venueMarkers).toHaveLength(4)
    expect(venueMarkers.every((marker) => marker.classList.contains('campus-map-marker-bubble'))).toBe(true)
    expect(screen.queryByTestId('campus-location-preview')).not.toBeInTheDocument()
    await userEvent.hover(within(venueCard).getByRole('button', { name: '查看理科群楼 5-6 号楼介绍' }))
    let venuePopover = screen.getByTestId('venue-popover')
    expect(venuePopover).toHaveAttribute('role', 'tooltip')
    expect(within(venuePopover).getByRole('article', { name: '理科群楼 5-6 号楼' })).toHaveTextContent(
      '23 日晚在六号楼 440 讨论室',
    )
    await userEvent.hover(within(venueCard).getByRole('button', { name: '查看第二餐饮大楼介绍' }))
    venuePopover = screen.getByTestId('venue-popover')
    expect(within(venuePopover).getByRole('article', { name: '第二餐饮大楼' })).toHaveTextContent(
      '二楼有餐厅，支持微信 / 支付宝直接支付',
    )
    const yulanMarker = within(venueCard).getByRole('button', { name: '查看玉兰苑介绍' })
    fireEvent.focus(yulanMarker)
    venuePopover = screen.getByTestId('venue-popover')
    expect(within(venuePopover).getByRole('article', { name: '玉兰苑' })).toHaveTextContent('食堂')
    const guangbiaoMarker = within(venueCard).getByRole('button', { name: '查看光彪楼介绍' })
    await userEvent.click(guangbiaoMarker)
    expect(guangbiaoMarker).toHaveAttribute('aria-pressed', 'true')
    venuePopover = screen.getByTestId('venue-popover')
    expect(within(venuePopover).getByRole('article', { name: '光彪楼' })).toHaveTextContent('主要上课地点')
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
    await waitFor(() => {
      expect([...document.querySelectorAll('.schedule-course-snl [data-kind="const"]')]
        .map((node) => node.getAttribute('data-name'))).toEqual(COURSE_MACRO_NAMES)
    })
    expect(document.querySelector('.schedule-course-snl [data-kind="fvar"]')).not.toBeInTheDocument()
    expect(screen.getByRole('row', { name: /August 23/ })).toHaveTextContent(
      'Science Building 6, Room 440 Discussion Room',
    )
    const venueCard = screen.getByRole('article', { name: 'Venues & Campus Map' })
    await user.hover(within(venueCard).getByRole('button', { name: 'View details for Guangbiao Building' }))
    expect(within(screen.getByTestId('venue-popover')).getByRole('article', { name: 'Guangbiao Building' })).toHaveTextContent(
      'The main teaching venue',
    )
    await user.hover(within(venueCard).getByRole('button', { name: 'View details for Science Buildings 5–6' }))
    expect(within(screen.getByTestId('venue-popover')).getByRole('article', { name: 'Science Buildings 5–6' })).toHaveTextContent(
      'Room 440 discussion room in Building 6',
    )
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

  it('renders the day cat screen without a publications section on Home', async () => {
    render(<App initialEntries={['/']} />)

    const screenImage = await screen.findByRole('img', { name: '白日校园猫' })
    expect(screenImage).toHaveAttribute('src', '/img/day_cat.webp')
    expect(screen.queryByRole('heading', { name: '论文发表' })).not.toBeInTheDocument()
    expect(screen.queryByRole('article', { name: '论文占位卡片' })).not.toBeInTheDocument()
    expect(document.querySelector('.publications')).not.toBeInTheDocument()
  })

  it('preloads and decodes every Home cat image', async () => {
    const preloadedSources: string[] = []
    const decode = vi.fn(async () => undefined)
    class PreloadImage {
      decoding = ''
      fetchPriority = ''
      set src(source: string) {
        preloadedSources.push(source)
      }
      decode = decode
    }
    vi.stubGlobal('Image', PreloadImage)

    render(<App initialEntries={['/']} />)

    await waitFor(() => {
      expect(preloadedSources).toEqual([
        '/img/day_cat.webp',
        '/img/night_cat.webp',
        '/img/找个彩蛋还作弊真无聊.webp',
      ])
    })
    expect(decode).toHaveBeenCalledTimes(3)
  })

  it('ignores the stare sequence until the cat images are decoded in memory', async () => {
    const user = userEvent.setup()
    const finishDecode: Array<() => void> = []
    class PendingImage {
      decoding = ''
      fetchPriority = ''
      src = ''
      decode = () => new Promise<void>((resolve) => finishDecode.push(resolve))
    }
    vi.stubGlobal('Image', PendingImage)
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    render(<App initialEntries={['/']} />)

    await waitFor(() => expect(finishDecode).toHaveLength(3))
    now = 100
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))
    now = 500
    await user.click(screen.getByRole('button', { name: '切换到浅色模式' }))
    now = 1_100
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))
    expect(screen.queryByRole('img', { name: '凝视校园猫' })).not.toBeInTheDocument()

    await act(async () => finishDecode.forEach((resolve) => resolve()))
    now = 2_000
    await user.click(screen.getByRole('button', { name: '切换到浅色模式' }))
    now = 2_500
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))
    now = 3_000
    await user.click(screen.getByRole('button', { name: '切换到浅色模式' }))
    expect(screen.getByRole('img', { name: '凝视校园猫' })).toHaveAttribute(
      'src',
      '/img/找个彩蛋还作弊真无聊.webp',
    )
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

  it('locks the screen to the stare cat after three theme switches within one second', async () => {
    const user = userEvent.setup()
    const decode = stubDecodedCatImages()
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    render(<App initialEntries={['/']} />)

    await screen.findByRole('img', { name: '白日校园猫' })
    await waitFor(() => expect(decode).toHaveBeenCalledTimes(3))
    await act(async () => undefined)
    now = 100
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))
    expect(screen.queryByRole('img', { name: '凝视校园猫' })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: '夜间校园猫' })).toBeInTheDocument()

    now = 500
    await user.click(screen.getByRole('button', { name: '切换到浅色模式' }))
    expect(screen.queryByRole('img', { name: '凝视校园猫' })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: '白日校园猫' })).toBeInTheDocument()

    now = 1_100
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))

    expect(screen.getByRole('img', { name: '凝视校园猫' })).toHaveAttribute(
      'src',
      '/img/找个彩蛋还作弊真无聊.webp',
    )

    now = 1_600
    await user.click(screen.getByRole('button', { name: '切换到浅色模式' }))
    expect(screen.getByRole('img', { name: '凝视校园猫' })).toHaveAttribute(
      'src',
      '/img/找个彩蛋还作弊真无聊.webp',
    )
  })

  it('does not trigger the stare cat when three theme switches span more than one second', async () => {
    const user = userEvent.setup()
    const decode = stubDecodedCatImages()
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    render(<App initialEntries={['/']} />)

    await screen.findByRole('img', { name: '白日校园猫' })
    await waitFor(() => expect(decode).toHaveBeenCalledTimes(3))
    await act(async () => undefined)
    now = 100
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))
    now = 500
    await user.click(screen.getByRole('button', { name: '切换到浅色模式' }))
    now = 1_101
    await user.click(screen.getByRole('button', { name: '切换到深色模式' }))

    expect(screen.queryByRole('img', { name: '凝视校园猫' })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: '夜间校园猫' })).toHaveAttribute(
      'src',
      '/img/night_cat.webp',
    )
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
