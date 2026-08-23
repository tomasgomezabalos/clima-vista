import type { WeatherCondition } from '../../../services/openMeteo/types'
import { RAINY_CONDITIONS, SNOWY_CONDITIONS } from './constants'
import type { WeatherIconDaytime, WeatherIconState } from './types'

const getDaytime = (isDay: boolean | null): WeatherIconDaytime => {
  if (isDay === null) {
    return 'unknown'
  }

  return isDay ? 'day' : 'night'
}

export const getWeatherIconState = (
  condition: WeatherCondition,
  isDay: boolean | null,
): WeatherIconState => {
  const isClear = condition === 'clear' || condition === 'mainlyClear'
  const hasSkyOrb = isClear || condition === 'partlyCloudy'
  const isFoggy = condition === 'fog'
  const isRainy = RAINY_CONDITIONS.includes(condition)
  const isStormy =
    condition === 'thunderstorm' || condition === 'thunderstormWithHail'

  return {
    daytime: getDaytime(isDay),
    showDayOrb: hasSkyOrb && isDay !== false,
    showNightOrb: hasSkyOrb && isDay === false,
    showCloud:
      condition !== 'unknown' && isClear === false && isFoggy === false,
    showFog: isFoggy,
    showRain: isRainy && isStormy === false,
    showSnow: SNOWY_CONDITIONS.includes(condition),
    showStorm: isStormy,
    showUnknown: condition === 'unknown',
  }
}
