import type { WeatherLocation } from '../../../services/openMeteo/types'

export const formatLocationName = (location: WeatherLocation): string =>
  [location.name, location.admin1, location.country].filter(Boolean).join(', ')
