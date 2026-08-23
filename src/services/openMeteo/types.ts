import type { SupportedLanguage } from '../../i18n/languages'

export type GeocodingQuery = Readonly<{
  term: string
  language: SupportedLanguage
}>

export type WeatherLocation = Readonly<{
  id: number
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}>

export type WeatherCondition =
  | 'clear'
  | 'mainlyClear'
  | 'partlyCloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'freezingDrizzle'
  | 'rain'
  | 'freezingRain'
  | 'snow'
  | 'snowGrains'
  | 'rainShowers'
  | 'snowShowers'
  | 'thunderstorm'
  | 'thunderstormWithHail'
  | 'unknown'

export type CurrentWeatherData = Readonly<{
  temperature: number | null
  apparentTemperature: number | null
  humidity: number | null
  windSpeed: number | null
  weatherCode: number | null
  condition: WeatherCondition
  isDay: boolean | null
}>

export type ForecastDay = Readonly<{
  date: string
  maxTemperature: number | null
  minTemperature: number | null
  precipitationProbability: number | null
}>

export type WeatherData = Readonly<{
  current: CurrentWeatherData
  daily: readonly ForecastDay[]
}>

export type ForecastQuery = Readonly<{
  latitude: number
  longitude: number
}>
