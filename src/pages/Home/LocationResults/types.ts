import type { WeatherLocation } from '../../../services/openMeteo/types'

export type LocationResultsProps = Readonly<{
  locations: readonly WeatherLocation[]
  selectedLocationId?: number
  onSelect: (location: WeatherLocation) => void
}>
