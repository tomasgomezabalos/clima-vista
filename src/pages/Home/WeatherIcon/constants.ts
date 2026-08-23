import type { WeatherCondition } from '../../../services/openMeteo/types'

export const RAINY_CONDITIONS: readonly WeatherCondition[] = [
  'drizzle',
  'freezingDrizzle',
  'rain',
  'freezingRain',
  'rainShowers',
  'thunderstorm',
  'thunderstormWithHail',
]

export const SNOWY_CONDITIONS: readonly WeatherCondition[] = [
  'snow',
  'snowGrains',
  'snowShowers',
]
