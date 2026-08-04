import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY } from '../i18n'
import { writeStorage } from '../lib/storage'
import { useTheme } from '../theme/theme-context'

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14M12 3v2m-2.5 0c-.5 4-2.8 7.2-6.5 9m5-5c1.5 2.5 3.5 4.3 6 5.5M14 21l3.5-9 3.5 9m-5.8-3h4.6" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z" />
    </svg>
  )
}

export function Navbar() {
  const { i18n, t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const isEnglish = i18n.resolvedLanguage === 'en'

  const toggleLanguage = async () => {
    const language = isEnglish ? 'zh-CN' : 'en'
    writeStorage(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'
    await i18n.changeLanguage(language)
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" activeOptions={{ exact: true }}>
        <span className="brand-mark" aria-hidden="true">
          <img className="logo logo-for-light" src="/brand/logo-dark.svg" alt="" />
          <img className="logo logo-for-dark" src="/brand/logo-light.svg" alt="" />
        </span>
        <span className="brand-title">SJTU AI4Math</span>
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        <Link
          to="/summer-school/2026"
          className="nav-link"
          activeProps={{ className: 'nav-link nav-link-active' }}
        >
          {t('navigation.summerSchool2026')}
        </Link>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => void toggleLanguage()}
          aria-label={
            isEnglish
              ? t('navigation.switchToChinese')
              : t('navigation.switchToEnglish')
          }
        >
          <LanguageIcon />
          <span aria-hidden="true">{isEnglish ? '中' : 'EN'}</span>
        </button>
        <button
          type="button"
          className="icon-button icon-button-square"
          onClick={toggleTheme}
          aria-label={
            theme === 'light'
              ? t('navigation.switchToDark')
              : t('navigation.switchToLight')
          }
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}
