import type { WeatherIconProps } from './types'
import { getWeatherIconState } from './utils'
import './styles.scss'

export const WeatherIcon = ({ condition, isDay }: WeatherIconProps) => {
  const {
    daytime,
    showDayOrb,
    showNightOrb,
    showCloud,
    showFog,
    showRain,
    showSnow,
    showStorm,
    showUnknown,
  } = getWeatherIconState(condition, isDay)

  return (
    <svg
      className="weather-icon"
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
      data-condition={condition}
      data-daytime={daytime}
    >
      <defs>
        <linearGradient id="weather-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe9a6" />
          <stop offset="1" stopColor="#ffad66" />
        </linearGradient>
        <linearGradient id="weather-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fbff" />
          <stop offset="1" stopColor="#b8c9df" />
        </linearGradient>
      </defs>

      {showDayOrb && (
        <circle cx="70" cy="62" r="30" fill="url(#weather-sun)" />
      )}
      {showNightOrb && (
        <path
          d="M94 28a34 34 0 1 0 25 50 40 40 0 1 1-25-50Z"
          fill="#d7e6ff"
        />
      )}
      {showCloud && (
        <path
          d="M43 105c-13 0-23-9-23-21 0-11 8-19 19-21 4-18 18-29 36-29 17 0 31 10 36 26 16 0 29 10 29 24 0 12-10 21-23 21H43Z"
          fill="url(#weather-cloud)"
        />
      )}
      {showFog && (
        <g className="weather-icon__mist" stroke="#c5d5e8" strokeWidth="7">
          <path d="M30 62h100" />
          <path d="M20 84h105" />
          <path d="M36 106h104" />
        </g>
      )}
      {showRain && (
        <g className="weather-icon__rain" stroke="#79c7ff" strokeWidth="7">
          <path d="m48 119-7 15" />
          <path d="m79 119-7 15" />
          <path d="m110 119-7 15" />
        </g>
      )}
      {showSnow && (
        <g className="weather-icon__snow" fill="#d9efff">
          <circle cx="45" cy="126" r="5" />
          <circle cx="78" cy="133" r="5" />
          <circle cx="112" cy="124" r="5" />
        </g>
      )}
      {showStorm && (
        <path d="m86 104-20 28h15l-8 22 27-33H84l12-17Z" fill="#ffd76f" />
      )}
      {showUnknown && (
        <g className="weather-icon__unknown">
          <circle cx="80" cy="80" r="51" fill="#d5deea" />
          <text x="80" y="101" textAnchor="middle" fontSize="62" fill="#53657c">
            ?
          </text>
        </g>
      )}
    </svg>
  )
}
