import { describe, expect, it } from 'vitest'
import { getWeatherIconState } from '../../../../src/pages/Home/WeatherIcon/utils'

describe('WeatherIcon state', () => {
  it('distinguishes day, night and unknown daytime variants', () => {
    expect(getWeatherIconState('clear', true)).toMatchObject({
      daytime: 'day',
      showDayOrb: true,
      showNightOrb: false,
    })
    expect(getWeatherIconState('clear', false)).toMatchObject({
      daytime: 'night',
      showDayOrb: false,
      showNightOrb: true,
    })
    expect(getWeatherIconState('clear', null).daytime).toBe('unknown')
  })

  it('selects the visual layers for fog, rain, snow and storms', () => {
    expect(getWeatherIconState('fog', true)).toMatchObject({
      showCloud: false,
      showFog: true,
    })
    expect(getWeatherIconState('rain', true)).toMatchObject({
      showCloud: true,
      showRain: true,
      showStorm: false,
    })
    expect(getWeatherIconState('snow', true)).toMatchObject({
      showCloud: true,
      showSnow: true,
    })
    expect(getWeatherIconState('thunderstorm', true)).toMatchObject({
      showCloud: true,
      showRain: false,
      showStorm: true,
    })
  })

  it('shows only the fallback for an unknown condition', () => {
    expect(getWeatherIconState('unknown', null)).toMatchObject({
      showCloud: false,
      showFog: false,
      showRain: false,
      showSnow: false,
      showStorm: false,
      showUnknown: true,
    })
  })
})
