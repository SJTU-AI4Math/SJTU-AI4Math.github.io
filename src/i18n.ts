import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { readStorage } from './lib/storage'

export const LANGUAGE_STORAGE_KEY = 'sjtu-ai4math-language'

const resources = {
  'zh-CN': {
    translation: {
      navigation: {
        summerSchool2026: '2026 暑期学校',
        switchToEnglish: 'Switch to English',
        switchToChinese: '切换到中文',
        switchToDark: '切换到深色模式',
        switchToLight: '切换到浅色模式',
      },
      home: {
        screenLabel: '校园猫屏风',
        dayCatAlt: '白日校园猫',
        nightCatAlt: '夜间校园猫',
      },
      summerSchool: {
        title: '2026 暑期学校',
        dates: '8 月 24–30 日',
        lead: '类型论、Lean 4、形式化数学与 AI4Math 的七日暑期学校',
        onThisPage: '本页导航',
        schedule: '日程安排',
        scheduleIntro: '8 月 23 日晚报到，正式课程与课题实践为 8 月 24–30 日。',
        scheduleDate: '日期',
        scheduleMorning: '上午 9:00–11:00',
        scheduleAfternoon: '下午 14:00–17:00',
        scheduleEvening: '晚间 19:00–21:00',
        courses: '课程内容',
        coursesNav: '课程',
        coursesIntro: '从类型论基础出发，逐步进入形式化库、函数式编程、AI4Math 与元编程。',
        projects: '课题实践',
        projectsIntro: '以下为推荐的课题方向，如果有其他感兴趣的方向亦可自行尝试。其中部分（尤其是元编程部分）课题也许是相当困难的，几乎不可能在短短一周内完成，因此我们也并不要求你在暑校期间达成全部目标。',
        projectsVision: '你完全可以以暑校期间的尝试作为某种 Toy Example、进行初步的技术验证，在探索之后也许可以找到更加合适的团队和更加成熟的方法论来真正完成这些项目，也许这些工作会为你的学术生涯带来转变、也许它们会成为社区的关键工具。',
        aiPolicy: '课题在 API 预算范围内不限制 AI 使用，但建议 Vibe Coding 成果配合适当文档。',
        venue: '地点与校园地图',
        venueNav: '地点',
        venueIntro: '地图标出了报到、上课与用餐地点。',
        mapAlt: '上海交通大学校园地图',
        openMap: '打开方块交大地图',
        viewVenue: '查看{{venue}}介绍',
        notes: '行前须知',
        notesIntro: '安装、出席与线上参与说明。',
        info: 'INFO',
        speaker: '主讲',
        location: '地点',
        day: 'DAY',
        course: '课程',
        project: '课题',
        daysUnit: '天',
        coursesUnit: '门课程',
        projectsUnit: '个课题',
        lectureNotice: '讲义将在课程前一天公布',
        lectureNotes: '课程讲义',
        backToSummerSchool: '返回 2026 暑期学校',
      },
    },
  },
  en: {
    translation: {
      navigation: {
        summerSchool2026: '2026 Summer School',
        switchToEnglish: 'Switch to English',
        switchToChinese: '切换到中文',
        switchToDark: 'Switch to dark mode',
        switchToLight: 'Switch to light mode',
      },
      home: {
        screenLabel: 'Campus cat screen',
        dayCatAlt: 'Campus cat by day',
        nightCatAlt: 'Campus cat at night',
      },
      summerSchool: {
        title: '2026 Summer School',
        dates: 'August 24–30',
        lead: 'Seven days of type theory, Lean 4, formal mathematics, and AI4Math',
        onThisPage: 'On this page',
        schedule: 'Schedule',
        scheduleIntro: 'Check-in is on the evening of August 23; courses and project work run August 24–30.',
        scheduleDate: 'Date',
        scheduleMorning: 'Morning 9:00–11:00',
        scheduleAfternoon: 'Afternoon 14:00–17:00',
        scheduleEvening: 'Evening 19:00–21:00',
        courses: 'Courses',
        coursesNav: 'Courses',
        coursesIntro: 'Beginning with type theory and progressing through formal libraries, functional programming, AI4Math, and metaprogramming.',
        projects: 'Projects',
        projectsIntro: 'These are recommended project directions, though students may pursue other interests. Some—especially metaprogramming projects—may be extremely difficult and nearly impossible to finish in one week, so completing every goal during the summer school is not required.',
        projectsVision: 'Summer-school attempts may remain toy examples or initial technical validation. Further exploration may lead to a more suitable team and mature methodology; the work may redirect an academic career or become a key community tool.',
        aiPolicy: 'AI use is unrestricted within the API budget, but Vibe Coding results should be accompanied by appropriate documentation.',
        venue: 'Venues & Campus Map',
        venueNav: 'Venues',
        venueIntro: 'The map marks check-in, teaching, and dining locations.',
        mapAlt: 'Shanghai Jiao Tong University campus map',
        openMap: 'Open the SJTU voxel map',
        viewVenue: 'View details for {{venue}}',
        notes: 'Before You Arrive',
        notesIntro: 'Installation, attendance, and online participation.',
        info: 'INFO',
        speaker: 'Speaker',
        location: 'Venue',
        day: 'DAY',
        course: 'COURSE',
        project: 'PROJECT',
        daysUnit: 'days',
        coursesUnit: 'courses',
        projectsUnit: 'projects',
        lectureNotice: 'Lecture notes will be published one day before the course',
        lectureNotes: 'Lecture Notes',
        backToSummerSchool: 'Back to 2026 Summer School',
      },
    },
  },
} as const

function storedLanguage(): 'zh-CN' | 'en' {
  return readStorage(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'zh-CN'
}

export function createAppI18n() {
  const instance = createInstance()
  const language = storedLanguage()

  void instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'zh-CN',
    interpolation: { escapeValue: false },
  })
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'

  return instance
}
