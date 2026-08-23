import { useTranslation } from 'react-i18next'
import { resolveSupportedLanguage } from '../../../i18n/languages'
import { formatForecastDate } from '../../../services/openMeteo/utils'
import { formatMeasurement } from '../utils'
import type { ForecastProps } from './types'
import './styles.scss'

export const Forecast = ({ days }: ForecastProps) => {
  const { t, i18n } = useTranslation()
  const language = resolveSupportedLanguage(i18n.resolvedLanguage)
  const unavailable = t('common.unavailable')

  return (
    <section className="forecast" aria-labelledby="forecast-title">
      <div className="forecast__heading">
        <p>{t('forecast.overline')}</p>
        <h2 id="forecast-title">{t('forecast.heading')}</h2>
      </div>
      <ol className="forecast__list" aria-labelledby="forecast-title">
        {days.map((day) => (
          <li className="forecast__day" key={day.date}>
            <h3>{formatForecastDate(day.date, language)}</h3>
            <dl>
              <div>
                <dt>{t('forecast.maximum')}</dt>
                <dd>
                  {formatMeasurement(
                    day.maxTemperature,
                    '°C',
                    unavailable,
                    language,
                  )}
                </dd>
              </div>
              <div>
                <dt>{t('forecast.minimum')}</dt>
                <dd>
                  {formatMeasurement(
                    day.minTemperature,
                    '°C',
                    unavailable,
                    language,
                  )}
                </dd>
              </div>
              <div>
                <dt>{t('forecast.precipitation')}</dt>
                <dd>
                  {formatMeasurement(
                    day.precipitationProbability,
                    '%',
                    unavailable,
                    language,
                  )}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  )
}
