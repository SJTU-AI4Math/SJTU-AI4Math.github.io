export interface LocalizedText {
  zh: string
  en: string
}

export interface ScheduleSlot {
  time: LocalizedText
  content: LocalizedText
}

export interface ScheduleDay {
  id: string
  date: LocalizedText
  location: LocalizedText
  slots: ScheduleSlot[]
}

export interface Course {
  id: string
  slug: string
  code: string
  title: LocalizedText
  speaker: LocalizedText
  topics: LocalizedText[]
  tone: 'violet' | 'blue' | 'green' | 'amber' | 'rose'
}

export interface Project {
  id: string
  category: LocalizedText
  title: LocalizedText
  description: LocalizedText
  examples?: LocalizedText[]
  tone: 'violet' | 'blue' | 'green' | 'amber' | 'rose'
}

export interface CampusLocation {
  id: string
  name: LocalizedText
  description: LocalizedText
  x: number
  y: number
}

const time = {
  morning: { zh: '上午 · 9:00–11:00', en: 'Morning · 9:00–11:00' },
  afternoon: { zh: '下午 · 14:00–17:00', en: 'Afternoon · 14:00–17:00' },
  evening: { zh: '晚间 · 19:00–21:00', en: 'Evening · 19:00–21:00' },
}

const text = (zh: string, en: string): LocalizedText => ({ zh, en })
const slot = (timeLabel: LocalizedText, zh: string, en: string): ScheduleSlot => ({
  time: timeLabel,
  content: text(zh, en),
})

export const schedule: ScheduleDay[] = [
  {
    id: 'aug-24',
    date: text('8 月 24 日', 'August 24'),
    location: text('光彪楼 206', 'Guangbiao Building, Room 206'),
    slots: [
      slot(time.morning, '类型论', 'Type Theory'),
      slot(time.afternoon, '归纳法', 'Induction'),
      slot(time.evening, '课题分组与组内破冰', 'Project grouping and team introductions'),
    ],
  },
  {
    id: 'aug-25',
    date: text('8 月 25 日', 'August 25'),
    location: text('光彪楼 206', 'Guangbiao Building, Room 206'),
    slots: [
      slot(time.morning, 'Curry-Howard 对应', 'Curry–Howard Correspondence'),
      slot(time.afternoon, '稷下证鸣', 'Jixia Proof Exploration'),
      slot(time.evening, 'MIL 习题与课题确认', 'MIL exercises and project confirmation'),
    ],
  },
  {
    id: 'aug-26',
    date: text('8 月 26 日', 'August 26'),
    location: text('光彪楼 206', 'Guangbiao Building, Room 206'),
    slots: [
      slot(time.morning, '形式化库', 'Formal Libraries'),
      slot(time.afternoon, '类型类与代数结构', 'Typeclasses and Algebraic Structures'),
      slot(time.evening, 'MIL 习题与课题实践', 'MIL exercises and project work'),
    ],
  },
  {
    id: 'aug-27',
    date: text('8 月 27 日', 'August 27'),
    location: text('光彪楼 206', 'Guangbiao Building, Room 206'),
    slots: [
      slot(time.morning, '抽象分析', 'Abstract Analysis'),
      slot(time.afternoon, '函数式编程', 'Functional Programming'),
      slot(time.evening, '课题实践', 'Project work'),
    ],
  },
  {
    id: 'aug-28',
    date: text('8 月 28 日', 'August 28'),
    location: text('下院113', 'XiaYuan113'),
    slots: [
      slot(time.morning, 'AI4Math', 'AI4Math'),
      slot(time.afternoon, '元编程', 'Metaprogramming'),
      slot(time.evening, '课题实践', 'Project work'),
    ],
  },
  {
    id: 'aug-29',
    date: text('8 月 29 日', 'August 29'),
    location: text('光彪楼 206', 'Guangbiao Building, Room 206'),
    slots: [
      slot(time.morning, '子鱼的完美证明术工坊', "Subfish's Perfect Tactics Workshop"),
      slot(time.afternoon, '课题实践', 'Project work'),
      slot(time.evening, '课题实践', 'Project work'),
    ],
  },
  {
    id: 'aug-30',
    date: text('8 月 30 日', 'August 30'),
    location: text('光彪楼 206', 'Guangbiao Building, Room 206'),
    slots: [
      slot(time.morning, '课题报告', 'Project presentations'),
      slot(time.afternoon, '课题报告', 'Project presentations'),
    ],
  },
]

export const courses: Course[] = [
  {
    id: 'course-1a', slug: 'type-theory', code: '1A', tone: 'violet',
    title: text('类型论', 'Type Theory'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('数学语言：元语言与对象语言、语言直谓性、数学概念的语法结构、良定性与形式化', 'Mathematical language: metalanguage and object language, directness, syntactic structure, well-definedness, and formalization'),
      text('无类型 λ-演算：表达式、项、λ-抽象、应用、规约、标准型、Curry 化', 'Untyped lambda calculus: expressions, terms, abstraction, application, reduction, normal forms, and currying'),
      text('实例：SKI 组合子、ι-组合子、Ω-组合子、Church 编码', 'Examples: SKI, iota and omega combinators, and Church encoding'),
      text('简单类型 λ-演算：类型系统、类型宇宙、函数类型、标准型', 'Simply typed lambda calculus: type systems, universes, function types, and normal forms'),
      text('Lean 4 实践：信息视图、#check 语法、#eval 语法、def 语法、fun 语法', 'Lean 4 practice: Infoview, #check, #eval, def, and fun'),
    ],
  },
  {
    id: 'course-1b', slug: 'induction', code: '1B', tone: 'violet',
    title: text('归纳法', 'Induction'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('依值类型：Π-类型、依值函数', 'Dependent types: Pi types and dependent functions'),
      text('归纳构造演算：归纳类型、依值归纳类型、构造子、消去子、模式匹配', 'Calculus of inductive constructions: inductive types, dependent inductive types, constructors, eliminators, and pattern matching'),
      text('实例：枚举类型、自然数类型、列表类型、向量类型、表达式树', 'Examples: enumerations, natural numbers, lists, vectors, and expression trees'),
      text('结构体：结构体类型、Σ-类型', 'Structures: structure types and Sigma types'),
      text('Lean 4 实践：inductive 语法、structure 语法、match 语法', 'Lean 4 practice: inductive, structure, and match'),
    ],
  },
  {
    id: 'course-2a', slug: 'curry-howard', code: '2A', tone: 'blue',
    title: text('Curry-Howard 对应', 'Curry–Howard Correspondence'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('Curry-Howard 对应：直觉主义逻辑、命题即类型、证明即程序、规约即求值', 'Intuitionistic logic, propositions as types, proofs as programs, and reduction as evaluation'),
      text('项证明：theorem 语法、sorry 语法、let 语法、have 语法', 'Term proofs: theorem, sorry, let, and have'),
    ],
  },
  {
    id: 'course-2b', slug: 'jixia-proof-exploration', code: '2B', tone: 'blue',
    title: text('稷下证鸣', 'Jixia Proof Exploration'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('证明蓝图：语境、目标、证明状态、证明术', 'Proof blueprints: context, goals, proof states, and tactics'),
      text('证明术：半自动证明术、全自动证明术', 'Semi-automated and fully automated tactics'),
      text('稷下：术证明信息的提取', 'Jixia: extracting tactic-proof information'),
      text('Lean 4 实践：MIL Logic 题目演示', 'Lean 4 practice: MIL Logic demonstrations'),
    ],
  },
  {
    id: 'course-3a', slug: 'formal-libraries', code: '3A', tone: 'green',
    title: text('形式化库', 'Formal Libraries'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('形式化库：包管理器、语法、模块、命名空间、文档注释', 'Package managers, syntax, modules, namespaces, and doc comments'),
      text('Mathlib：Mathlib 简介、库查询、文档、朴素集合论与初等数论简介', 'Mathlib: library search, documentation, naive set theory, and elementary number theory'),
      text('类型论的麻烦：类型转换、定义域、符号系统、语法糖', 'Type-theoretic friction: coercions, domains, notation, and syntax sugar'),
    ],
  },
  {
    id: 'course-3b', slug: 'typeclasses-algebraic-structures', code: '3B', tone: 'green',
    title: text('类型类与代数结构', 'Typeclasses and Algebraic Structures'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('类型类：类型类、类继承、实例自动合成、可解参数', 'Typeclasses, inheritance, automatic instance synthesis, and output parameters'),
      text('代数结构：代数结构的类型类实现', 'Implementing algebraic structures with typeclasses'),
    ],
  },
  {
    id: 'course-4a', slug: 'abstract-analysis', code: '4A', tone: 'amber',
    title: text('抽象分析', 'Abstract Analysis'),
    speaker: text('解淑涵（算算）', 'Shuhan Xie (Suansuan)'),
    topics: [text('分析学结构化：ε-δ 语言、度量空间、拓扑空间、滤子', 'Structuring analysis: epsilon–delta language, metric spaces, topological spaces, and filters')],
  },
  {
    id: 'course-4b', slug: 'functional-programming', code: '4B', tone: 'amber',
    title: text('函数式编程', 'Functional Programming'),
    speaker: text('刘云天（猫猫）', 'Yuntian Liu (Maomao)'),
    topics: [
      text('副作用：语境阅读、语境写入、多值函数、异步函数、异常处理、IO 操作', 'Effects: context reads and writes, multivalued functions, async, exceptions, and IO'),
      text('单子：单子、绑定、do 语法', 'Monads, bind, and do notation'),
    ],
  },
  {
    id: 'course-5a', slug: 'ai4math', code: '5A', tone: 'rose',
    title: text('AI4Math', 'AI4Math'),
    speaker: text('周子喻（子鱼）', 'Ziyu Zhou (Subfish)'),
    topics: [],
  },
  {
    id: 'course-5b', slug: 'metaprogramming', code: '5B', tone: 'rose',
    title: text('元编程', 'Metaprogramming'),
    speaker: text('周子喻（子鱼）', 'Ziyu Zhou (Subfish)'),
    topics: [],
  },
  {
    id: 'course-6a', slug: 'perfect-tactics-workshop', code: '6A', tone: 'rose',
    title: text('子鱼的完美证明术工坊', "Subfish's Perfect Tactics Workshop"),
    speaker: text('周子喻（子鱼）', 'Ziyu Zhou (Subfish)'),
    topics: [],
  },
]

export const projects: Project[] = [
  {
    id: 'domain-formalization', tone: 'violet',
    category: text('形式化', 'Formalization'), title: text('专一领域数学形式化', 'Domain-focused Mathematical Formalization'),
    description: text('选择一个感兴趣的数学方向，未在 Mathlib 或其他主流 Lean 4 形式化数学库中形式化，或 Mathlib 中代码质量较差的数学方向，对该领域进行形式化，尝试向 Mathlib 提出 PR 或独立成库、或者书写与形式化代码深度结合的教科书籍。', 'Choose a mathematical area not yet covered by Mathlib or other major Lean 4 libraries—or one whose existing Mathlib code needs substantial improvement. Formalize it and aim for a Mathlib PR, an independent library, or a textbook closely integrated with formal code.'),
  },
  {
    id: 'mathlib-learners', tone: 'violet',
    category: text('形式化', 'Formalization'), title: text('Mathlib 学员', 'Mathlib for Learners'),
    description: text('Lean 能否应用于数学教育是一个常被讨论的问题，却鲜有切实可行的尝试。Mathlib 对于中小学乃至本科学生来说过于抽象晦涩，尝试建立更加适合中小学或本科教育的形式化库并配合以适当的前端框架以支持学习。', 'Explore practical uses of Lean in mathematics education by building a formal library and learning interface suitable for school or undergraduate students.'),
  },
  {
    id: 'creative-verification', tone: 'violet',
    category: text('形式化', 'Formalization'), title: text('创造性形式化验证', 'Creative Formal Verification'),
    description: text('对于目前与数学、数理逻辑、软硬件验证等领域相距较远的方向进行形式化验证的可能性与潜在价值（尤其是形式语言验证与直接计算验证的差异如何体现、各自优劣为何），或仅仅进行创造性的形式化验证尝试。主题不限，一些可能有趣的方向包括：', 'Explore the value of formal verification far beyond traditional mathematics, logic, and hardware/software verification—especially how formal-language verification differs from direct computational verification and the strengths of each—or simply attempt an inventive formalization.'),
    examples: [
      text('哲学', 'Philosophy'),
      text('物理学', 'Physics'),
      text('法学', 'Law'),
      text('Conway 生命游戏', "Conway's Game of Life"),
      text('三国杀或类似卡牌游戏', 'Sanguosha or similar card games'),
      text('推箱子或类似谜题游戏（Parabox、麦克斯韦解谜妖等等）', 'Sokoban-like puzzle games, such as Parabox or Maxwell’s puzzling demon'),
      text('围棋死活题', 'Go life-and-death problems'),
      text('象棋残局', 'Chess endgames'),
      text('我的世界红石电路或生电机械', 'Minecraft redstone circuits and technical builds'),
      text('……', '…'),
    ],
  },
  {
    id: 'lean-software-verification', tone: 'violet',
    category: text('形式化', 'Formalization'), title: text('基于 Lean 4 的软件形式化', 'Software Verification with Lean 4'),
    description: text('调研程序验证领域使用 Rocq(Coq) 与 Lean 4 等不同形式化验证器的体验差异，尝试基于 Lean 4 实现更覆盖流程更加全面的程序验证。', 'Compare Rocq (Coq) and Lean 4 for program verification, then prototype a more comprehensive software-verification workflow in Lean 4.'),
  },
  {
    id: 'agent-framework', tone: 'blue',
    category: text('AI4Math', 'AI4Math'), title: text('智能体框架搭建', 'Agent Framework Engineering'),
    description: text('在自动形式化、自动语义对齐、自动定理证明等领域，调研领域内先进成果以及主要痛点，尝试优化上下文管理、智能体工具调用等工作流，搭建智能体框架，精炼 Skill 文档或补齐、优化现有的 Lean MCP 及配套 CLI 工具。', 'Study advances and bottlenecks in autoformalization, semantic alignment, and theorem proving; improve context and tool workflows; build agent frameworks and refine Skills, Lean MCPs, and CLI tools.'),
  },
  {
    id: 'assisted-research', tone: 'blue',
    category: text('AI4Math', 'AI4Math'), title: text('形式化辅助数学研究', 'Formalization-assisted Mathematical Research'),
    description: text('尝试使用现有智能体框架进行数学研究，并对结果进行形式化表述和验证。', 'Use existing agent frameworks for mathematical research, then formally state and verify the results.'),
  },
  {
    id: 'verified-game', tone: 'green',
    category: text('函数式编程', 'Functional Programming'), title: text('小游戏开发与验证', 'Small-game Development and Verification'),
    description: text('Lean 4 在形式化验证器之余亦可作为函数式编程语言使用。尝试开发一个小游戏，并尝试发挥 Lean 4 的形式化验证能力保障游戏规则严格性。', 'Use Lean 4 as both a functional language and a verifier: build a small game and formally enforce the integrity of its rules.'),
  },
  {
    id: 'lean4-type-theory', tone: 'green',
    category: text('函数式编程', 'Functional Programming'), title: text('Lean4TypeTheory', 'Lean4TypeTheory'),
    description: text('使用 Lean 4 作为元语言进行函数式编程，在无类型 λ-演算、简单类型 λ-演算以及各类不同类型论中选择一至多种重新建模，实现基本的自动化以及尝试对部分算法、理论的正确性和一致性进行证明。', 'Use Lean 4 as a metalanguage for functional programming. Re-model one or more of the untyped lambda calculus, simply typed lambda calculus, and various type theories; implement basic automation; and attempt to prove the correctness and consistency of selected algorithms and theories.'),
  },
  {
    id: 'lean-concurrency', tone: 'amber',
    category: text('元编程', 'Metaprogramming'), title: text('Lean 并发性能优化', 'Lean Concurrency Optimization'),
    description: text('Lean 4 并发性能较差，这为许多工具的制作以及 Lean 4 的推广带来困难。尝试优化 Lean 4 的并发问题，并部署 Lean 4 Game 等项目进行并发性能测试。', 'Lean 4 concurrency limitations make tooling and adoption harder. Improve its concurrency performance and benchmark it with deployments such as Lean 4 Game.'),
  },
  {
    id: 'automation-infrastructure', tone: 'amber',
    category: text('元编程', 'Metaprogramming'), title: text('自动化基础设施建设', 'Automation Infrastructure'),
    description: text('对于 Lean 本体及 Mathlib 中自动化较弱的区域，补齐或优化自动化基础设施或开发具体 Tactic，并尝试向 Lean 或 Mathlib 提出 PR 或独立成库。', 'Strengthen weak areas of Lean or Mathlib automation, develop tactics, and pursue upstream PRs or an independent library.'),
  },
  {
    id: 'proof-widget', tone: 'rose',
    category: text('元编程与前端开发', 'Metaprogramming & Frontend'), title: text('Proof Widget 重制', 'Proof Widget Rebuild'),
    description: text('Proof Widget 只接受单一打包字符串，与现代前端开发习惯严重不符。尝试重构 Proof Widget，使其兼容现代前端开发框架，实现无打包集成。', 'Refactor Proof Widget beyond its single bundled-string interface so it works with modern frontend frameworks and unbundled integration.'),
  },
  {
    id: 'formal-visualization', tone: 'rose',
    category: text('元编程与前端开发', 'Metaprogramming & Frontend'), title: text('形式数学可视化', 'Formal Mathematics Visualization'),
    description: text('形式语言读起来较为晦涩、与人类的语言习惯不符。调研 Lean Pretty-Printer、Infoview 与 Proof Widget 的实现与应用方式，尝试制作形式语言的自动自然语言化或可视化工具。例如公式和证明的自然语言化、交换图的自动绘制等。', 'Formal languages are difficult to read and unlike ordinary human language. Study Lean Pretty-Printer, Infoview, and Proof Widget, then prototype natural-language or visual renderings of formulas, proofs, and commutative diagrams.'),
  },
  {
    id: 'mathlib-analysis', tone: 'rose',
    category: text('元编程与前端开发', 'Metaprogramming & Frontend'), title: text('Mathlib 定量分析与可视化', 'Quantitative Analysis and Visualization of Mathlib'),
    description: text('Mathlib 作为人类历史上最大的形式化数学库，其代码量之大、结构之复杂，对人类来说几乎不可能完全理解。尝试对 Mathlib 进行定量分析，表征其内部结构以作为日后形式化库管理的参照，并尝试制作可视化工具。', 'Mathlib is so large and structurally complex that no person can understand it in full. Quantitatively analyze it, characterize its internal structure, and build visual tools that inform future formal-library management.'),
  },
]

export const notes = [
  text('Lean 4 安装问题尽量在暑校开始前解决。如遇到问题，建议求助 AI，亦可在学员群内询问。如无法在暑校开始前解决，请在 8.24 午休、晚修或晚间求助助教。', 'Please resolve Lean 4 installation issues before the summer school where possible. Ask AI or the student group for help; remaining issues can be brought to teaching assistants during breaks and evening study on August 24.'),
  text('除 8.24 晚外，晚间均不强制要求到场；“无穷类型咖啡”暑校会同时在线上进行，学员可与线上社区成员共同结队参与课题、讨论、答疑。', 'Except for the evening of August 24, evening attendance is optional. The Infinite Type Café summer school will also run online, allowing students to team up with online community members for projects, discussion, and Q&A.'),
]

// Percent centers measured from the four red rings in the 1823×914 annotated reference.
export const campusLocations: CampusLocation[] = [
  {
    id: 'science-buildings',
    name: text('理科群楼 5-6 号楼', 'Science Buildings 5–6'),
    description: text(
      '8 月 28 日上课地点。300 房间位于五号楼与六号楼之间的连廊上。',
      'Venue for the August 28 classes. Room 300 is on the connecting corridor between Buildings 5 and 6.',
    ),
    x: 5.76,
    y: 27.46,
  },
  {
    id: 'yulan-canteen',
    name: text('玉兰苑', 'Yulan Canteen'),
    description: text(
      '食堂，支持微信 / 支付宝直接支付。',
      'Campus canteen accepting direct payment by WeChat Pay or Alipay.',
    ),
    x: 26.44,
    y: 54.16,
  },
  {
    id: 'guangbiao-building',
    name: text('光彪楼', 'Guangbiao Building'),
    description: text('主要上课地点。', 'The main teaching venue.'),
    x: 37.41,
    y: 63.89,
  },
  {
    id: 'second-dining-building',
    name: text('第二餐饮大楼', 'Second Dining Building'),
    description: text(
      '二楼有餐厅，支持微信 / 支付宝直接支付。',
      'Restaurants are available on the second floor and accept direct payment by WeChat Pay or Alipay.',
    ),
    x: 43.39,
    y: 70.62,
  },
]

export function localize(value: LocalizedText, language: string | undefined): string {
  return language === 'en' ? value.en : value.zh
}
