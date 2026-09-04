export interface LocalizedText {
  'zh-CN': string
  en: string
}

export interface SnlExternalCard {
  kind: 'external'
  title: string
  description: LocalizedText
  href: string
}

export interface SnlInternalCard {
  kind: 'internal'
  title: string
  description: LocalizedText
  to: '/snl/documents/fulcrum-notes-snl' | '/snl/documents/snl4gaokao'
}

export type SnlCardData = SnlExternalCard | SnlInternalCard

export const documentCards: readonly SnlCardData[] = [
  {
    kind: 'external',
    title: '使用文档',
    description: {
      'zh-CN': 'SNL Doc 的使用说明与操作文档。',
      en: 'Usage and operation guides for SNL Doc.',
    },
    href: 'https://github.com/SJTU-AI4Math/SNL-Doc-Extension/tree/main/docs',
  },
  {
    kind: 'internal',
    title: 'Fulcrum Notes SNL',
    description: {
      'zh-CN': '以 SNL 编写的 Fulcrum Notes 自然语言文档。',
      en: 'Fulcrum Notes natural-language documents authored in SNL.',
    },
    to: '/snl/documents/fulcrum-notes-snl',
  },
  {
    kind: 'internal',
    title: 'SNL4GaoKao',
    description: {
      'zh-CN': '面向高考语文知识组织的 SNL 文档。',
      en: 'SNL documents for organizing Chinese-language exam knowledge.',
    },
    to: '/snl/documents/snl4gaokao',
  },
]

export const repositoryCards: readonly SnlExternalCard[] = [
  {
    kind: 'external',
    title: 'SNL Basics',
    description: {
      'zh-CN': 'SNL 语法树、宏系统与渲染基础库。',
      en: 'The base library for SNL syntax trees, macros, and rendering.',
    },
    href: 'https://github.com/SJTU-AI4Math/SNL-Basics',
  },
  {
    kind: 'external',
    title: 'SNL Doc Extension',
    description: {
      'zh-CN': '用于编写、浏览与维护 SNL 文档的 VS Code 扩展。',
      en: 'A VS Code extension for authoring, reading, and maintaining SNL documents.',
    },
    href: 'https://github.com/SJTU-AI4Math/SNL-Doc-Extension',
  },
  {
    kind: 'external',
    title: 'SNL Agent Toolkit',
    description: {
      'zh-CN': '供智能体读写与验证 SNL 工作区的工具集。',
      en: 'Agent tools for reading, writing, and validating SNL workspaces.',
    },
    href: 'https://github.com/SJTU-AI4Math/SNL-Agent-Toolkit',
  },
  {
    kind: 'external',
    title: 'SNL4Lean',
    description: {
      'zh-CN': '连接 SNL 文档与 Lean 形式化内容的仓库。',
      en: 'A repository connecting SNL documents with Lean formalization.',
    },
    href: 'https://github.com/SJTU-AI4Math/SNL4Lean',
  },
]

export function localizeSnlText(text: LocalizedText, language?: string) {
  return language === 'en' ? text.en : text['zh-CN']
}
