export interface LocalizedText {
  zh: string
  en: string
}

export interface SnlDocTerm {
  id: string
  macroName: string
  label: LocalizedText
  detail: LocalizedText
}

export const snlDocFeatures: SnlDocTerm[] = [
  {
    id: 'semantic-query',
    macroName: 'SNLDoc.feature.semantic_query',
    label: { zh: '交互式术语语义查询', en: 'Interactive terminology queries' },
    detail: {
      zh: '可通过鼠标悬浮查询术语定义以及隐式语境。',
      en: 'Hover over a term to inspect its definition and implicit context.',
    },
  },
  {
    id: 'math-formula',
    macroName: 'SNLDoc.feature.math_formula',
    label: { zh: '完整数学公式支持', en: 'Complete mathematical formula support' },
    detail: {
      zh: '支持 $\\KaTeX$、且针对数学文本的“单概念多表达、自定义符号习惯”有特制的宏系统支持；',
      en: 'Supports $\\KaTeX$, with a specialized macro system for multiple expressions of one mathematical concept and custom notation conventions.',
    },
  },
  {
    id: 'commutative-diagram',
    macroName: 'SNLDoc.feature.commutative_diagram',
    label: { zh: '交换图支持', en: 'Commutative diagram support' },
    detail: {
      zh: '支持 $\\KaTeX$ 原生的轻量矩形交换图动态绘制；复杂交换图或图表目前无内置处理，仍需静态提供。可将由 tikz 等方法绘制的复杂交换图表（如 $\\KaTeX$ 无法处理的高阶箭头、曲线箭头）等复杂非线性语言纳入术语宏体系。',
      en: 'Supports dynamic drawing of lightweight rectangular commutative diagrams native to $\\KaTeX$. Complex diagrams are not yet handled internally and must still be supplied as static assets. Complex nonlinear visual languages produced with tools such as TikZ, including higher-order or curved arrows that $\\KaTeX$ cannot handle, can be incorporated into the term-macro system.',
    },
  },
  {
    id: 'frontend-component',
    macroName: 'SNLDoc.feature.frontend_component',
    label: { zh: '图表与一般前端组件兼容', en: 'Diagram and general frontend component compatibility' },
    detail: {
      zh: '支持 SVG 作为术语宏节点并纳入交互；块模式术语宏支持包括可展开块、列表、表格、图片等多种可交互 React 组件，未来考虑进一步开放自定义。',
      en: 'Supports SVG as interactive term-macro nodes. Block-mode term macros support interactive React components including collapsible blocks, lists, tables, and images, with broader customization planned.',
    },
  },
  {
    id: 'natural-language',
    macroName: 'SNLDoc.feature.natural_language',
    label: { zh: '兼容自然语言表达', en: 'Natural-language compatibility' },
    detail: {
      zh: '条目支持 Markdown 作为内容、SNL 语法树支持临时的可含 $\\KaTeX$ 自然语言宏节点，不强制对语言进行完全结构化。',
      en: 'Entries support Markdown content, while SNL syntax trees permit temporary natural-language macro nodes containing $\\KaTeX$; language does not have to be completely structured.',
    },
  },
  {
    id: 'cross-language',
    macroName: 'SNLDoc.feature.cross_language',
    label: { zh: '跨语言性', en: 'Cross-language authoring' },
    detail: {
      zh: '支持充分的 I18N，可支持多种不同内容语言的一体化文档，且可以自定义内容语言以兼容非人类自然语言内容（如伪代码、额外的同语法树表达方式等）',
      en: 'Provides extensive I18N for unified documents spanning multiple content languages. Custom content languages can also represent non-human natural-language content such as pseudocode or alternative expressions of the same syntax tree.',
    },
  },
  {
    id: 'data-structure',
    macroName: 'SNLDoc.feature.data_structure',
    label: { zh: '多样数据结构管理', en: 'Diverse data-structure management' },
    detail: {
      zh: '以单概念条目为最小知识组织单位。较传统意义上单文档、单章节等级的数据管理更为细致，且支持以自定义章节树为主导结构的单库组织和以图结构为主导的全局组织等多种数据结构管理。',
      en: 'Uses one-concept Entries as the smallest unit of knowledge organization, offering finer granularity than document- or chapter-level systems. It supports both custom chapter-tree organization within a Library and graph-oriented global organization.',
    },
  },
  {
    id: 'advanced-search',
    macroName: 'SNLDoc.feature.advanced_search',
    label: { zh: '内置高级搜索系统', en: 'Built-in advanced search' },
    detail: {
      zh: '综合命名空间分级、标签等多样信息的术语宏和条目查找系统，未来考虑支持更多搜索抓手和自定义组合方式。',
      en: 'Finds term macros and Entries using namespace hierarchy, tags, and other metadata. More search dimensions and custom combinations are planned.',
    },
  },
  {
    id: 'ide-integration',
    macroName: 'SNLDoc.feature.ide_integration',
    label: { zh: 'IDE 集成', en: 'IDE integration' },
    detail: {
      zh: 'VS Code / Cursor 插件，可与代码项目嵌合、并实现条目级索引同步。',
      en: 'VS Code and Cursor extension integration that embeds into code projects and synchronizes indexes at Entry granularity.',
    },
  },
  {
    id: 'agent-toolkit',
    macroName: 'SNLDoc.feature.agent_toolkit',
    label: { zh: '智能体工具集', en: 'Agent toolkit' },
    detail: {
      zh: '未来考虑提供含完整 Skill 文档 + CLI 工具链的 Codex / Hermes / Claude Code / DeepSeek Harness 编写和检查插件，预期可在 DeepSeek V4 Flash 0731 同级模型下稳定运行。',
      en: 'Planned authoring and validation plugins for Codex, Hermes, Claude Code, and DeepSeek Harness, combining complete Skill documentation with a CLI toolchain and targeting stable operation on models comparable to DeepSeek V4 Flash 0731.',
    },
  },
]

export const snlDocScenarios: SnlDocTerm[] = [
  {
    id: 'formal-blueprint',
    macroName: 'SNLDoc.scenario.formal_blueprint',
    label: { zh: '形式化项目蓝图', en: 'Formalization project blueprints' },
    detail: {
      zh: '支持大规模的数学或其他领域形式化的计划和文档生成。未来将对 Lean 4 通过类 Pretty Printer 元编程进行 Info View 内的 Widget 显示及自动文档生成的特别支持，项目本体则只要求 VS Code / Cursor 而不依赖具体语言。',
      en: 'Supports planning and document generation for large-scale formalization in mathematics and other fields. Future Lean 4 support will use Pretty Printer-like metaprogramming for Info View widgets and automatic documentation, while the core project requires only VS Code or Cursor and remains language-independent.',
    },
  },
  {
    id: 'knowledge-management',
    macroName: 'SNLDoc.scenario.knowledge_management',
    label: { zh: '笔记或知识管理', en: 'Notes and knowledge management' },
    detail: {
      zh: '尤其适合数学、亦可支持诸多其他对严谨性有要求或涉及大量抽象术语领域（包括一般理工科、语言学、哲学等）对于抽象概念、公式、术语、图表进行知识管理的需求。设计对人类个人作者而言略重，可能不适合手动编写。',
      en: 'Especially suited to mathematics, while also supporting rigorous fields rich in abstract terminology, including science, engineering, linguistics, and philosophy. It manages abstract concepts, formulas, terminology, and diagrams, though its design may be too heavyweight for an individual human author writing everything manually.',
    },
  },
  {
    id: 'code-project',
    macroName: 'SNLDoc.scenario.code_project',
    label: { zh: '代码项目管理', en: 'Code project management' },
    detail: {
      zh: '项目需求表述的细化与精炼、代码架构与实现细节的文档管理等。',
      en: 'Refines project requirements and manages documentation for code architecture and implementation details.',
    },
  },
  {
    id: 'syntax-analysis',
    macroName: 'SNLDoc.scenario.syntax_analysis',
    label: { zh: '语言学句法分析或传统 NLP', en: 'Linguistic syntax analysis and traditional NLP' },
    detail: {
      zh: '对自然语言的句法结构进行显式表达，可作为领域术语标准化、形式化的前置思考工具。',
      en: 'Expresses natural-language syntactic structure explicitly and can serve as a preliminary reasoning tool for standardizing and formalizing domain terminology.',
    },
  },
  {
    id: 'agent-report',
    macroName: 'SNLDoc.scenario.agent_report',
    label: { zh: '智能体报告', en: 'Agent reports' },
    detail: {
      zh: '让大模型的冗长回复得以精炼，借助逆向学习大幅提升信息获取与学习效率，以少量的额外 token 消耗优化人类的阅读效率与注意力分配。',
      en: 'Refines verbose model responses and uses reverse learning to improve information acquisition and learning efficiency, spending a small number of extra tokens to optimize human reading efficiency and attention allocation.',
    },
  },
]

export const snlDocNotice: LocalizedText = {
  zh: '目前项目处于测试阶段，部分功能尚未实现或不稳定，进行大规模数据生产前建议先与开发者取得联系，以避免后续维护中发生破坏性事件。',
  en: 'The project is currently in testing. Some features are not yet implemented or may be unstable. Contact the developers before producing data at scale to avoid disruptive changes during later maintenance.',
}

export function localize(value: LocalizedText, language: string | undefined) {
  return language?.startsWith('en') ? value.en : value.zh
}
