import { useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, type CardTone } from './Card'
import {
  campusLocations,
  localize,
  type CampusLocation,
} from '../pages/summerSchoolData'

const markerTones: CardTone[] = ['violet', 'amber', 'blue', 'green']

function markerStyle(location: CampusLocation): CSSProperties {
  return {
    left: `${location.x}%`,
    top: `${location.y}%`,
  }
}

export function CampusMap() {
  const { i18n, t } = useTranslation()
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null)
  const activeIndex = campusLocations.findIndex(({ id }) => id === activeLocationId)
  const activeLocation = activeIndex >= 0 ? campusLocations[activeIndex] : null
  const l = (value: CampusLocation['name']) => localize(value, i18n.resolvedLanguage)

  return (
    <div className="interactive-campus-map">
      <div className="campus-map-stage">
        <img
          className="campus-map"
          src="/img/SJTUmap.webp"
          width="1800"
          height="905"
          loading="lazy"
          decoding="async"
          alt={t('summerSchool.mapAlt')}
        />
        {campusLocations.map((location, index) => (
          <button
            key={location.id}
            className="campus-map-marker"
            style={markerStyle(location)}
            type="button"
            aria-label={t('summerSchool.viewVenue', { venue: l(location.name) })}
            aria-pressed={location.id === activeLocationId}
            onPointerEnter={() => setActiveLocationId(location.id)}
            onFocus={() => setActiveLocationId(location.id)}
            onClick={() => setActiveLocationId(location.id)}
          >
            <span aria-hidden="true">{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="campus-location-preview" aria-live="polite">
        {activeLocation ? (
          <Card
            className="campus-location-card"
            tone={markerTones[activeIndex]}
            eyebrow={`${String(activeIndex + 1).padStart(2, '0')} · ${t('summerSchool.location')}`}
            title={l(activeLocation.name)}
          >
            <p>{l(activeLocation.description)}</p>
          </Card>
        ) : (
          <p className="campus-map-hint">{t('summerSchool.mapHint')}</p>
        )}
      </div>
    </div>
  )
}
