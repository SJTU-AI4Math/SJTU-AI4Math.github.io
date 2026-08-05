import { useTranslation } from 'react-i18next'
import { useTheme } from '../theme/theme-context'

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="home-page">
      <section className="cat-screen" aria-label={t('home.screenLabel')}>
        <div className="cat-screen-frame">
          <img
            key={theme}
            className="cat-screen-image"
            src={isDark ? '/img/night_cat.webp' : '/img/day_cat.webp'}
            alt={isDark ? t('home.nightCatAlt') : t('home.dayCatAlt')}
            width="1920"
            height="1440"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="publications" aria-labelledby="publications-title">
        <div className="section-heading">
          <span className="section-kicker" aria-hidden="true">01</span>
          <h1 id="publications-title">{t('home.publications')}</h1>
        </div>
        <article
          className="publication-card publication-card-empty"
          aria-label={t('home.emptyPublicationCard')}
        />
      </section>
    </div>
  )
}
