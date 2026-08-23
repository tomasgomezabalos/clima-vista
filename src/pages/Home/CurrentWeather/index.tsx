import { formatMeasurement } from '../utils'
import { WeatherIcon } from '../WeatherIcon'
import type { CurrentWeatherProps } from './types'
import { useCurrentWeather } from './useCurrentWeather'
import './styles.scss'

export const CurrentWeather = ({ location, data }: CurrentWeatherProps) => {
  const { t, language, locationName, details } = useCurrentWeather(location, data)
  const condition = t(`weather.${data.condition}`)
  const unavailable = t('common.unavailable')

  return (
    <section className="current-weather" aria-labelledby="current-weather-title">
      <div className="current-weather__heading">
        <div>
          <p className="current-weather__overline">{t('current.overline')}</p>
          <h2 id="current-weather-title">
            {t('current.heading', { location: locationName })}
          </h2>
        </div>
        <p className="current-weather__condition">{condition}</p>
      </div>

      <div className="current-weather__summary">
        <WeatherIcon condition={data.condition} isDay={data.isDay} />
        <div className="current-weather__primary">
          <span>{t('current.temperature')}</span>
          <strong>
            {formatMeasurement(data.temperature, '°C', unavailable, language)}
          </strong>
        </div>
      </div>

      <dl className="current-weather__details">
        {details.map((detail) => (
          <div key={detail.labelKey}>
            <dt>{t(detail.labelKey)}</dt>
            <dd>
              {formatMeasurement(
                detail.value,
                detail.unit,
                unavailable,
                language,
              )}
            </dd>
          </div>
        ))}
        <div>
          <dt>{t('current.condition')}</dt>
          <dd>{condition}</dd>
        </div>
      </dl>
    </section>
  )
}
