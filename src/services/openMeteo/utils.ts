import type {
  ForecastDay,
  WeatherCondition,
  WeatherData,
  WeatherLocation,
} from './types'
import type { SupportedLanguage } from '../../i18n/languages'

const FORECAST_DAYS = 7
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const dateFormatters: Readonly<
  Record<SupportedLanguage, Intl.DateTimeFormat>
> = {
  es: new Intl.DateTimeFormat('es', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }),
  en: new Intl.DateTimeFormat('en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }),
}

const WEATHER_CONDITION_BY_CODE: Readonly<Record<number, WeatherCondition>> = {
  0: 'clear',
  1: 'mainlyClear',
  2: 'partlyCloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'freezingDrizzle',
  57: 'freezingDrizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'freezingRain',
  67: 'freezingRain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snowGrains',
  80: 'rainShowers',
  81: 'rainShowers',
  82: 'rainShowers',
  85: 'snowShowers',
  86: 'snowShowers',
  95: 'thunderstorm',
  96: 'thunderstormWithHail',
  99: 'thunderstormWithHail',
}

export class InvalidOpenMeteoResponseError extends Error {
  constructor() {
    super('Invalid Open-Meteo response')
    this.name = 'InvalidOpenMeteoResponseError'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const requireRecord = (value: unknown): Record<string, unknown> => {
  if (isRecord(value)) {
    return value
  }

  throw new InvalidOpenMeteoResponseError()
}

const requireFiniteNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  throw new InvalidOpenMeteoResponseError()
}

const readNullableNumber = (value: unknown): number | null => {
  if (value === undefined || value === null) {
    return null
  }

  return requireFiniteNumber(value)
}

const requireNonEmptyString = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  throw new InvalidOpenMeteoResponseError()
}

const readOptionalString = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  return requireNonEmptyString(value)
}

const parseLocation = (value: unknown): WeatherLocation => {
  const location = requireRecord(value)
  const admin1 = readOptionalString(location.admin1)
  const country = readOptionalString(location.country)

  return {
    id: requireFiniteNumber(location.id),
    name: requireNonEmptyString(location.name),
    latitude: requireFiniteNumber(location.latitude),
    longitude: requireFiniteNumber(location.longitude),
    ...(admin1 === undefined ? {} : { admin1 }),
    ...(country === undefined ? {} : { country }),
  }
}

export const parseGeocodingResponse = (
  response: unknown,
): readonly WeatherLocation[] => {
  const body = requireRecord(response)

  if (body.results === undefined) {
    return []
  }

  if (Array.isArray(body.results)) {
    return body.results.map(parseLocation)
  }

  throw new InvalidOpenMeteoResponseError()
}

const isValidIsoDate = (value: string): boolean => {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

const requireDates = (value: unknown): readonly string[] => {
  if (
    Array.isArray(value) &&
    value.length === FORECAST_DAYS &&
    value.every(
      (date) => typeof date === 'string' && isValidIsoDate(date),
    )
  ) {
    return value
  }

  throw new InvalidOpenMeteoResponseError()
}

const requireNullableNumberArray = (value: unknown): readonly (number | null)[] => {
  if (Array.isArray(value) && value.length === FORECAST_DAYS) {
    return value.map(readNullableNumber)
  }

  throw new InvalidOpenMeteoResponseError()
}

const readIsDay = (value: unknown): boolean | null => {
  if (value === undefined || value === null) {
    return null
  }

  if (value === 1) {
    return true
  }

  if (value === 0) {
    return false
  }

  throw new InvalidOpenMeteoResponseError()
}

export const getWeatherCondition = (
  weatherCode: number | null,
): WeatherCondition => {
  if (weatherCode === null) {
    return 'unknown'
  }

  return WEATHER_CONDITION_BY_CODE[weatherCode] ?? 'unknown'
}

export const parseForecastResponse = (response: unknown): WeatherData => {
  const body = requireRecord(response)
  const current = requireRecord(body.current)
  const daily = requireRecord(body.daily)
  const dates = requireDates(daily.time)
  const maxTemperatures = requireNullableNumberArray(daily.temperature_2m_max)
  const minTemperatures = requireNullableNumberArray(daily.temperature_2m_min)
  const precipitationProbabilities = requireNullableNumberArray(
    daily.precipitation_probability_max,
  )
  const weatherCode = readNullableNumber(current.weather_code)

  const forecastDays: readonly ForecastDay[] = dates.map((date, index) => ({
    date,
    maxTemperature: maxTemperatures[index] ?? null,
    minTemperature: minTemperatures[index] ?? null,
    precipitationProbability: precipitationProbabilities[index] ?? null,
  }))

  return {
    current: {
      temperature: readNullableNumber(current.temperature_2m),
      apparentTemperature: readNullableNumber(current.apparent_temperature),
      humidity: readNullableNumber(current.relative_humidity_2m),
      windSpeed: readNullableNumber(current.wind_speed_10m),
      weatherCode,
      condition: getWeatherCondition(weatherCode),
      isDay: readIsDay(current.is_day),
    },
    daily: forecastDays,
  }
}

export const formatForecastDate = (
  date: string,
  language: SupportedLanguage,
): string => {
  if (!isValidIsoDate(date)) {
    throw new InvalidOpenMeteoResponseError()
  }

  const [year, month, day] = date.split('-').map(Number)

  return dateFormatters[language].format(new Date(year, month - 1, day))
}
