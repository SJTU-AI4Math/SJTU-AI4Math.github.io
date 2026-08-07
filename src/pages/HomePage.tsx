import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../theme/theme-context'

const STARE_SWITCH_COUNT = 3
const STARE_SWITCH_WINDOW_MS = 1_000
const CAT_IMAGE_SOURCES = [
  '/img/day_cat.webp',
  '/img/night_cat.webp',
  '/img/找个彩蛋还作弊真无聊.webp',
] as const

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isStareLocked, setIsStareLocked] = useState(false)
  const [areCatsReady, setAreCatsReady] = useState(false)
  const previousTheme = useRef(theme)
  const themeSwitchTimes = useRef<number[]>([])
  const preloadedCats = useRef<HTMLImageElement[]>([])

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
    </div>
  )
}
