import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../theme/theme-context'

const STARE_SWITCH_COUNT = 3
const STARE_SWITCH_WINDOW_MS = 1_000
const CAT_IMAGE_SOURCES = [
  '/img/day_cat.webp',
  '/img/night_cat.webp',
  '/img/找个彩蛋还作弊真无聊.webp',
] as const
const CATALOG_TABS = ['tools', 'papers'] as const

type CatalogTab = (typeof CATALOG_TABS)[number]

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.84c-2.67.58-3.23-1.13-3.23-1.13-.44-1.11-1.07-1.4-1.07-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.46 2.25 1.04 2.8.8.09-.62.34-1.04.61-1.28-2.13-.24-4.37-1.07-4.37-4.7 0-1.04.37-1.89.99-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.61.98A9.1 9.1 0 0 1 12 6.99a9 9 0 0 1 2.38.32c1.81-1.24 2.61-.98 2.61-.98.52 1.31.19 2.28.09 2.52.62.67.99 1.52.99 2.56 0 3.64-2.25 4.46-4.39 4.7.35.3.65.88.65 1.78v2.67c0 .25.18.55.66.46A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isStareLocked, setIsStareLocked] = useState(false)
  const [areCatsReady, setAreCatsReady] = useState(false)
  const [activeTab, setActiveTab] = useState<CatalogTab>('tools')
  const previousTheme = useRef(theme)
  const themeSwitchTimes = useRef<number[]>([])
  const preloadedCats = useRef<HTMLImageElement[]>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    let active = true
    const images = CAT_IMAGE_SOURCES.map(async (source) => {
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = source === '/img/找个彩蛋还作弊真无聊.webp' ? 'high' : 'auto'
      image.src = source
      await image.decode()
      return image
    })
    void Promise.all(images).then((decodedImages) => {
      if (active) {
        preloadedCats.current = decodedImages
        setAreCatsReady(true)
      }
    }).catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (previousTheme.current === theme) return
    previousTheme.current = theme
    if (isStareLocked) return
    if (!areCatsReady) {
      themeSwitchTimes.current = []
      return
    }

    const now = performance.now()
    themeSwitchTimes.current = [
      ...themeSwitchTimes.current.filter((time) => now - time <= STARE_SWITCH_WINDOW_MS),
      now,
    ]
    if (themeSwitchTimes.current.length >= STARE_SWITCH_COUNT) setIsStareLocked(true)
  }, [areCatsReady, isStareLocked, theme])

  const catSrc = isStareLocked
    ? '/img/找个彩蛋还作弊真无聊.webp'
    : isDark ? '/img/night_cat.webp' : '/img/day_cat.webp'
  const catAlt = isStareLocked
    ? t('home.stareCatAlt')
    : isDark ? t('home.nightCatAlt') : t('home.dayCatAlt')

  const selectAdjacentTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % CATALOG_TABS.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + CATALOG_TABS.length) % CATALOG_TABS.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = CATALOG_TABS.length - 1
    else return
    event.preventDefault()
    setActiveTab(CATALOG_TABS[nextIndex])
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="home-page">
      <section className="cat-screen" aria-label={t('home.screenLabel')}>
        <div className="cat-screen-frame">
          <img
            key={catSrc}
            className="cat-screen-image"
            src={catSrc}
            alt={catAlt}
            width="1920"
            height="1440"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="home-catalog" aria-label={t('home.catalogLabel')}>
        <div className="home-catalog-tabs" role="tablist" aria-label={t('home.catalogLabel')}>
          {CATALOG_TABS.map((tab, index) => (
            <button
              key={tab}
              ref={(element) => { tabRefs.current[index] = element }}
              id={`home-tab-${tab}`}
              className="home-catalog-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`home-panel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => selectAdjacentTab(event, index)}
            >
              {t(`home.${tab}`)}
            </button>
          ))}
        </div>

        <div
          id="home-panel-tools"
          className="home-catalog-panel"
          role="tabpanel"
          aria-labelledby="home-tab-tools"
          hidden={activeTab !== 'tools'}
        >
            <article className="tool-card" aria-labelledby="snl-doc-title">
              <header className="tool-card-header">
                <img className="tool-card-logo" src="/brand/snl-logo.svg" width="512" height="512" alt={t('home.snlLogoAlt')} />
                <div>
                  <span className="tool-card-kicker">SNL</span>
                  <h2 id="snl-doc-title">SNL Doc</h2>
                  <p className="tool-card-tagline">{t('home.snlTagline')}</p>
                </div>
              </header>
              <div className="tool-card-divider" />
              <div className="tool-card-body">
                <p>{t('home.snlDescription')}</p>
                <section aria-labelledby="snl-features-title">
                  <h3 id="snl-features-title">{t('home.coreFeatures')}</h3>
                  <ul className="tool-feature-list" aria-label={t('home.coreFeatures')}>
                    {['semanticQueries', 'mathSupport', 'frontendCompatibility', 'naturalLanguageCompatibility'].map((feature) => (
                      <li key={feature}><span>{t(`home.${feature}`)}</span><span aria-hidden="true">—</span></li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="snl-scenarios-title">
                  <h3 id="snl-scenarios-title">{t('home.applicationScenarios')}</h3>
                  <ul aria-label={t('home.applicationScenarios')}>
                    <li>{t('home.formalBlueprint')}</li>
                  </ul>
                </section>
              </div>
              <footer className="tool-card-footer">
                <a
                  className="tool-github-link"
                  href="https://github.com/SJTU-AI4Math/SNL-Doc-Extension"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('home.snlGithub')}
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </a>
                <p className="tool-contributors">
                  <span>{t('home.contributors')}：</span>
                  <a href="https://github.com/Fulcrum-Nebula" target="_blank" rel="noreferrer">猫猫🐱</a>
                  <span>、</span>
                  <a href="https://github.com/subfish-zhou" target="_blank" rel="noreferrer">子鱼🐟</a>
                </p>
              </footer>
            </article>
        </div>
        <div
          id="home-panel-papers"
          className="home-catalog-panel"
          role="tabpanel"
          aria-labelledby="home-tab-papers"
          hidden={activeTab !== 'papers'}
        />
      </section>
    </div>
  )
}
