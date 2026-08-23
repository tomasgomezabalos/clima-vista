import type {
  CurrentWeatherData,
  WeatherLocation,
} from '../../../services/openMeteo/types'

export type CurrentWeatherProps = Readonly<{
  location: WeatherLocation
  data: CurrentWeatherData
}>

export type CurrentWeatherDetail = Readonly<{
  labelKey:
    | 'current.apparentTemperature'
    | 'current.humidity'
    | 'current.wind'
  value: number | null
  unit: '°C' | '%' | 'km/h'
}>
