import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { RichKatexText } from './components/RichKatexText'
import source from '../assets/source/SNL-Doc-home-card.zh.md?raw'
import { snlDocFeatures, snlDocNotice, snlDocScenarios } from './pages/homeSnlDocData'

const featureLabels = [
  '交互式术语语义查询',
  '完整数学公式支持',
  '交换图支持',
  '图表与一般前端组件兼容',
  '兼容自然语言表达',
  '跨语言性',
  '多样数据结构管理',
  '内置高级搜索系统',
  'IDE 集成',
  '智能体工具集',
]

const scenarioLabels = [
  '形式化项目蓝图',
  '笔记或知识管理',
  '代码项目管理',
  '语言学句法分析或传统 NLP',
  '智能体报告',
]

const macroNames = [
  'SNLDoc.feature.semantic_query',
  'SNLDoc.feature.math_formula',
  'SNLDoc.feature.commutative_diagram',
  'SNLDoc.feature.frontend_component',
  'SNLDoc.feature.natural_language',
  'SNLDoc.feature.cross_language',
  'SNLDoc.feature.data_structure',
  'SNLDoc.feature.advanced_search',
  'SNLDoc.feature.ide_integration',
  'SNLDoc.feature.agent_toolkit',
  'SNLDoc.scenario.formal_blueprint',
  'SNLDoc.scenario.knowledge_management',
  'SNLDoc.scenario.code_project',
  'SNLDoc.scenario.syntax_analysis',
  'SNLDoc.scenario.agent_report',
]

const expectedEnglishTerms = [
  ['Interactive terminology queries', 'Hover over a term to inspect its definition and implicit context.'],
  ['Complete mathematical formula support', 'Supports $\\KaTeX$, with a specialized macro system for multiple expressions of one mathematical concept and custom notation conventions.'],
  ['Commutative diagram support', 'Supports dynamic drawing of lightweight rectangular commutative diagrams native to $\\KaTeX$. Complex diagrams are not yet handled internally and must still be supplied as static assets. Complex nonlinear visual languages produced with tools such as TikZ, including higher-order or curved arrows that $\\KaTeX$ cannot handle, can be incorporated into the term-macro system.'],
  ['Diagram and general frontend component compatibility', 'Supports SVG as interactive term-macro nodes. Block-mode term macros support interactive React components including collapsible blocks, lists, tables, and images, with broader customization planned.'],
  ['Natural-language compatibility', 'Entries support Markdown content, while SNL syntax trees permit temporary natural-language macro nodes containing $\\KaTeX$; language does not have to be completely structured.'],
  ['Cross-language authoring', 'Provides extensive I18N for unified documents spanning multiple content languages. Custom content languages can also represent non-human natural-language content such as pseudocode or alternative expressions of the same syntax tree.'],
  ['Diverse data-structure management', 'Uses one-concept Entries as the smallest unit of knowledge organization, offering finer granularity than document- or chapter-level systems. It supports both custom chapter-tree organization within a Library and graph-oriented global organization.'],
  ['Built-in advanced search', 'Finds term macros and Entries using namespace hierarchy, tags, and other metadata. More search dimensions and custom combinations are planned.'],
  ['IDE integration', 'VS Code and Cursor extension integration that embeds into code projects and synchronizes indexes at Entry granularity.'],
  ['Agent toolkit', 'Planned authoring and validation plugins for Codex, Hermes, Claude Code, and DeepSeek Harness, combining complete Skill documentation with a CLI toolchain and targeting stable operation on models comparable to DeepSeek V4 Flash 0731.'],
  ['Formalization project blueprints', 'Supports planning and document generation for large-scale formalization in mathematics and other fields. Future Lean 4 support will use Pretty Printer-like metaprogramming for Info View widgets and automatic documentation, while the core project requires only VS Code or Cursor and remains language-independent.'],
  ['Notes and knowledge management', 'Especially suited to mathematics, while also supporting rigorous fields rich in abstract terminology, including science, engineering, linguistics, and philosophy. It manages abstract concepts, formulas, terminology, and diagrams, though its design may be too heavyweight for an individual human author writing everything manually.'],
  ['Code project management', 'Refines project requirements and manages documentation for code architecture and implementation details.'],
  ['Linguistic syntax analysis and traditional NLP', 'Expresses natural-language syntactic structure explicitly and can serve as a preliminary reasoning tool for standardizing and formalizing domain terminology.'],
  ['Agent reports', 'Refines verbose model responses and uses reverse learning to improve information acquisition and learning efficiency, spending a small number of extra tokens to optimize human reading efficiency and attention allocation.'],
] as const

describe('SNL Doc home card', () => {
  it('matches the complete ordered Chinese source without omissions or reassignment', async () => {
    const parseRows = (section: string) => section
      .split('\n')
      .map((line) => line
        .trim()
        .replace(/^>\s?/, '')
        .replace('【左式本身应用 KaTeX 渲染为其 Logo、下同】', ''))
      .filter((line) => line.startsWith('* ')
        || /^\d+\. /.test(line)
        || line.startsWith('交互式术语语义查询 --'))
      .map((line) => line.match(/^(?:\* |\d+\. )?(.+?) -- (.+)$/))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match) => ({ label: match[1], detail: match[2] }))
    const featureSource = source.split('## 特色功能')[1].split('## 设计应用场景')[0]
    const scenarioSource = source.split('## 设计应用场景')[1].split('贡献者：')[0]
    const authoredLines = source.split('\n').map((line) => line.trim().replace(/^>\s?/, ''))
    const separatorIndex = authoredLines.indexOf('---')
    const title = authoredLines[separatorIndex - 1].replace(/^# /, '')
    const tagline = authoredLines[separatorIndex + 1]
    const description = authoredLines[separatorIndex + 2]
    const featureHeading = authoredLines.find((line) => line.startsWith('## 特色功能'))!
      .replace(/^## /, '').replace(/：【.*$/, '：')
    const scenarioHeading = authoredLines.find((line) => line.startsWith('## 设计应用场景'))!
      .replace(/^## /, '').replace(/：【.*$/, '：')
    const contributors = authoredLines.find((line) => line.startsWith('贡献者：'))!
      .replace(/（[^）]*）/g, '')

    expect(parseRows(featureSource)).toEqual(snlDocFeatures.map((item) => ({
      label: item.label.zh,
      detail: item.detail.zh,
    })))
    expect(parseRows(scenarioSource)).toEqual(snlDocScenarios.map((item) => ({
      label: item.label.zh,
      detail: item.detail.zh,
    })))
    expect(source).toContain('【下面的“ -- ”应是：左侧为实际显示在卡片上的内容')
    expect(source).toContain('【左式本身应用 KaTeX 渲染为其 Logo、下同】')
    expect(source).toContain('\\* * 【卡片内脚注，此处左侧有一个星就是个星号，可视为“被转义了”】')
    expect(source).toContain(snlDocNotice.zh)
    expect(authoredLines.slice(0, 2)).toEqual([
      '把 SJTU AI4Math 官网的屏风猫网上挪一点，下面加一个横切栏（工具 / 论文）',
      '工具栏放第一张卡片：',
    ])
    expect(authoredLines).toContain('【Github 图标】（指向 SNL Doc Extension 的 Github 仓库）')
    expect(authoredLines).toContain('贡献者：猫猫🐱（指向我的 Fulcrum-Nebula 的 Github 空间）、子鱼🐟（指向子鱼的 Github 空间）、Iroha (Subfish\'s AI Agent)')

    render(<App initialEntries={['/']} />)
    const card = await screen.findByRole('article', { name: 'SNL Doc' })
    expect(within(card).getByRole('heading', { name: title })).toBeInTheDocument()
    expect(card.querySelector('.tool-card-tagline')).toHaveTextContent(tagline)
    expect(card.querySelector('.tool-card-body > p')).toHaveTextContent(description)
    expect(within(card).getByRole('heading', { name: featureHeading })).toBeInTheDocument()
    expect(within(card).getByRole('heading', { name: scenarioHeading })).toBeInTheDocument()
    expect(card.querySelector('.tool-contributors')?.textContent?.replace(/\s/g, ''))
      .toBe(contributors.replace(/\s/g, ''))
    expect(card).toHaveTextContent(snlDocNotice.zh)
  })

  it('renders the complete authored feature and scenario inventory as interactive SNL', async () => {
    render(<App initialEntries={['/']} />)
    const card = await screen.findByRole('article', { name: 'SNL Doc' })
    const features = within(card).getByRole('list', { name: '特色功能：' })
    const scenarios = within(card).getByRole('list', { name: '设计应用场景：' })

    expect(within(features).getAllByRole('button').map((item) => item.getAttribute('aria-label'))).toEqual(featureLabels)
    expect(within(scenarios).getAllByRole('button').map((item) => item.getAttribute('aria-label'))).toEqual(scenarioLabels)
    expect(within(card).queryByText('—')).not.toBeInTheDocument()
    await waitFor(() => expect(card.querySelectorAll('[data-kind="const"]')).toHaveLength(15))
    expect(card.querySelector('[data-kind="fvar"]')).not.toBeInTheDocument()
    expect([...card.querySelectorAll('[data-kind="const"]')].map((node) => node.getAttribute('data-name'))).toEqual(macroNames)

    expect(card).toHaveTextContent('Iroha (Subfish\'s AI Agent)')
    expect(card).toHaveTextContent('目前项目处于测试阶段，部分功能尚未实现或不稳定，进行大规模数据生产前建议先与开发者取得联系，以避免后续维护中发生破坏性事件。')
  })

  it('opens the exact macro detail from the rendered SNL node and renders KaTeX logos', async () => {
    render(<App initialEntries={['/']} />)
    const card = await screen.findByRole('article', { name: 'SNL Doc' })
    await waitFor(() => expect(card.querySelectorAll('[data-kind="const"]')).toHaveLength(15))
    const elementsFromPoint = vi.spyOn(document, 'elementsFromPoint')

    const semanticButton = within(card).getByRole('button', { name: '交互式术语语义查询' })
    fireEvent.focus(semanticButton)
    expect(await screen.findByTestId('snl-doc-detail-popover')).toHaveTextContent('可通过鼠标悬浮查询术语定义以及隐式语境。')
    fireEvent.blur(semanticButton)
    await waitFor(() => expect(screen.queryByTestId('snl-doc-detail-popover')).not.toBeInTheDocument())

    const semanticNode = card.querySelector<HTMLElement>('[data-name="SNLDoc.feature.semantic_query"]')!
    elementsFromPoint.mockReturnValue([semanticNode])
    await userEvent.hover(semanticNode)
    let popover = await screen.findByTestId('snl-doc-detail-popover')
    expect(popover).toHaveTextContent('可通过鼠标悬浮查询术语定义以及隐式语境。')
    await userEvent.unhover(semanticNode)

    const formulaNode = card.querySelector<HTMLElement>('[data-name="SNLDoc.feature.math_formula"]')!
    elementsFromPoint.mockReturnValue([formulaNode])
    await userEvent.hover(formulaNode)
    popover = await screen.findByTestId('snl-doc-detail-popover')
    expect(popover).toHaveTextContent('针对数学文本的“单概念多表达、自定义符号习惯”有特制的宏系统支持')
    expect(popover.querySelector('.katex')).toBeInTheDocument()
    expect(popover.querySelector('annotation[encoding="application/x-tex"]')).toHaveTextContent('\\KaTeX')

    await userEvent.click(formulaNode)
    expect(screen.getByTestId('snl-doc-detail-popover')).toBeInTheDocument()
    fireEvent.keyDown(within(card).getByRole('button', { name: '完整数学公式支持' }), { key: 'Escape' })
    expect(screen.queryByTestId('snl-doc-detail-popover')).not.toBeInTheDocument()
  })

  it('localizes every semantic label and detail in English', async () => {
    render(<App initialEntries={['/']} />)
    await userEvent.click(await screen.findByRole('button', { name: 'Switch to English' }))
    const card = await screen.findByRole('article', { name: 'SNL Doc' })
    const terms = [...snlDocFeatures, ...snlDocScenarios]
    expect(terms.map((item) => [item.label.en, item.detail.en])).toEqual(expectedEnglishTerms)
    expect(within(card).getAllByRole('button').map((button) => button.getAttribute('aria-label')))
      .toEqual(expectedEnglishTerms.map(([label]) => label))
    expect(card).toHaveTextContent("Contributors: 猫猫🐱, 子鱼🐟, Iroha (Subfish's AI Agent)")
    await waitFor(() => expect(card.querySelectorAll('[data-kind="const"]')).toHaveLength(15))

    const node = card.querySelector<HTMLElement>('[data-name="SNLDoc.scenario.agent_report"]')!
    vi.spyOn(document, 'elementsFromPoint').mockReturnValue([node])
    await userEvent.hover(node)
    expect(await screen.findByTestId('snl-doc-detail-popover')).toHaveTextContent('reverse learning')
  })

  it('renders every authored KaTeX marker in both content locales', () => {
    const terms = [...snlDocFeatures, ...snlDocScenarios]
    const details = terms.flatMap((item) => [item.detail.zh, item.detail.en])
    const markerCount = details.reduce((total, detail) => total + detail.split('$\\KaTeX$').length - 1, 0)
    const { container } = render(<>{details.map((detail, index) => (
      <RichKatexText key={index} text={detail} />
    ))}</>)

    expect(markerCount).toBe(8)
    expect(container.querySelectorAll('.katex')).toHaveLength(markerCount)
    expect([...container.querySelectorAll('annotation[encoding="application/x-tex"]')]
      .every((annotation) => annotation.textContent === '\\KaTeX')).toBe(true)
  })
})
