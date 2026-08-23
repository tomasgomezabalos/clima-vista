import { useTranslation } from 'react-i18next'
import type { LocationResultsProps } from './types'
import { formatLocationName } from './utils'
import './styles.scss'

export const LocationResults = ({
  locations,
  selectedLocationId,
  onSelect,
}: LocationResultsProps) => {
  const { t } = useTranslation()

  return (
    <section className="location-results" aria-labelledby="location-results-title">
      <h2 id="location-results-title">{t('locations.heading')}</h2>
      <ul className="location-results__list">
        {locations.map((location) => {
          const label = formatLocationName(location)

          return (
            <li key={location.id}>
              <button
                className="location-results__button"
                type="button"
                aria-pressed={selectedLocationId === location.id}
                aria-label={t('locations.choose', { location: label })}
                onClick={() => onSelect(location)}
              >
                <span className="location-results__pin" aria-hidden="true">
                  ●
                </span>
                <span>{label}</span>
                <span className="location-results__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
