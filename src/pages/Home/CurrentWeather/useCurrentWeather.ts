import { useTranslation } from 'react-i18next'
import { resolveSupportedLanguage } from '../../../i18n/languages'
import type {
  CurrentWeatherData,
  WeatherLocation,
} from '../../../services/openMeteo/types'
import { formatLocationName } from '../LocationResults/utils'
import type { CurrentWeatherDetail } from './types'

export const useCurrentWeather = (
  location: WeatherLocation,
  data: CurrentWeatherData,
) => {
  const { t, i18n } = useTranslation()
  const details: readonly CurrentWeatherDetail[] = [
    {
      labelKey: 'current.apparentTemperature',
      value: data.apparentTemperature,
      unit: '°C',
    },
    {
      labelKey: 'current.humidity',
      value: data.humidity,
      unit: '%',
    },
    {
      labelKey: 'current.wind',
      value: data.windSpeed,
      unit: 'km/h',
    },
  ]

  return {
    t,
    language: resolveSupportedLanguage(i18n.resolvedLanguage),
    locationName: formatLocationName(location),
    details,
  }
}
