import { useCallback, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, type CardTone } from './Card'
import { FloatingCardPopover } from './FloatingCardPopover'
import {
  campusLocations,
  localize,
  type CampusLocation,
} from '../pages/summerSchoolData'

const markerTones: CardTone[] = ['violet', 'amber', 'blue', 'green']

type ShowMode = 'transient' | 'pinned'

interface ActiveLocationPopover {
  anchor: HTMLElement
  locationId: string
  pinned: boolean
}

function markerStyle(location: CampusLocation): CSSProperties {
  return {
    left: `${location.x}%`,
    top: `${location.y}%`,
  }
}

export function CampusMap() {
  const { i18n, t } = useTranslation()
  const [activePopover, setActivePopover] = useState<ActiveLocationPopover | null>(null)
  const activeIndex = campusLocations.findIndex(({ id }) => id === activePopover?.locationId)
  const activeLocation = activeIndex >= 0 ? campusLocations[activeIndex] : null
  const l = (value: CampusLocation['name']) => localize(value, i18n.resolvedLanguage)
  const showLocation = useCallback((
    locationId: string,
    anchor: HTMLElement,
    mode: ShowMode,
  ) => {
    setActivePopover((current) => {
      if (mode === 'transient' && current?.locationId === locationId && current.pinned) return current
      if (mode === 'pinned' && current?.locationId === locationId && current.pinned) return null
      return { locationId, anchor, pinned: mode === 'pinned' }
    })
  }, [])
  const hideLocation = useCallback((locationId: string, force = false) => {
    setActivePopover((current) => (
      current?.locationId === locationId && (force || !current.pinned) ? null : current
    ))
  }, [])
  const dismissLocationPopover = useCallback(() => setActivePopover(null), [])
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    locationId: string,
  ) => {
    if (event.key === 'Escape') hideLocation(locationId, true)
  }

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
        {campusLocations.map((location, index) => {
          const isOpen = location.id === activePopover?.locationId
          return (
            <button
              key={location.id}
              className="campus-map-marker campus-map-marker-bubble"
              style={markerStyle(location)}
              type="button"
              aria-label={t('summerSchool.viewVenue', { venue: l(location.name) })}
              aria-pressed={Boolean(isOpen && activePopover?.pinned)}
              aria-expanded={isOpen}
              aria-describedby={isOpen ? 'venue-detail-popover' : undefined}
              onPointerEnter={(event) => showLocation(location.id, event.currentTarget, 'transient')}
              onPointerLeave={() => hideLocation(location.id)}
              onFocus={(event) => showLocation(location.id, event.currentTarget, 'transient')}
              onBlur={() => hideLocation(location.id, true)}
              onClick={(event) => showLocation(location.id, event.currentTarget, 'pinned')}
              onKeyDown={(event) => handleKeyDown(event, location.id)}
            >
              <span aria-hidden="true">{index + 1}</span>
            </button>
          )
        })}
      </div>
      {activeLocation && activePopover ? (
        <FloatingCardPopover
          anchor={activePopover.anchor}
          contentKey={activeLocation.id}
          id="venue-detail-popover"
          onDismiss={dismissLocationPopover}
          testId="venue-popover"
        >
          <Card
            className="campus-location-card"
            tone={markerTones[activeIndex]}
            eyebrow={`${String(activeIndex + 1).padStart(2, '0')} · ${t('summerSchool.location')}`}
            title={l(activeLocation.name)}
          >
            <p>{l(activeLocation.description)}</p>
          </Card>
        </FloatingCardPopover>
      ) : null}
    </div>
  )
}
