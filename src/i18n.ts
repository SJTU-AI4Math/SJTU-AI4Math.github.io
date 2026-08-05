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
        publications: '论文发表',
        emptyPublicationCard: '论文占位卡片',
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
        publications: 'Publications',
        emptyPublicationCard: 'Empty publication card',
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
