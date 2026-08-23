import type { WeatherCondition } from '../../../services/openMeteo/types'

export type WeatherIconProps = Readonly<{
  condition: WeatherCondition
  isDay: boolean | null
}>

export type WeatherIconDaytime = 'day' | 'night' | 'unknown'

export type WeatherIconState = Readonly<{
  daytime: WeatherIconDaytime
  showDayOrb: boolean
  showNightOrb: boolean
  showCloud: boolean
  showFog: boolean
  showRain: boolean
  showSnow: boolean
  showStorm: boolean
  showUnknown: boolean
}>
