export const geocodingSuccessFixture = {
  results: [
    {
      id: 3117735,
      name: 'Madrid',
      latitude: 40.4165,
      longitude: -3.70256,
      admin1: 'Comunidad de Madrid',
      country: 'España',
    },
    {
      id: 3674962,
      name: 'Madrid',
      latitude: 4.73245,
      longitude: -74.26419,
      country: 'Colombia',
    },
  ],
}

export const geocodingEnglishSuccessFixture = {
  results: [
    {
      id: 3117735,
      name: 'Madrid',
      latitude: 40.4165,
      longitude: -3.70256,
      admin1: 'Community of Madrid',
      country: 'Spain',
    },
    {
      id: 3674962,
      name: 'Madrid',
      latitude: 4.73245,
      longitude: -74.26419,
      country: 'Colombia',
    },
  ],
}

export const geocodingItalianSuccessFixture = {
  results: [
    {
      id: 3117735,
      name: 'Madrid',
      latitude: 40.4165,
      longitude: -3.70256,
      admin1: 'Comunità di Madrid',
      country: 'Spagna',
    },
    {
      id: 3674962,
      name: 'Madrid',
      latitude: 4.73245,
      longitude: -74.26419,
      country: 'Colombia',
    },
  ],
}

export const forecastSuccessFixture = {
  current: {
    temperature_2m: 24.3,
    apparent_temperature: 24.8,
    relative_humidity_2m: 42,
    wind_speed_10m: 11.7,
    weather_code: 1,
    is_day: 1,
  },
  daily: {
    time: [
      '2026-08-23',
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
      '2026-08-28',
      '2026-08-29',
    ],
    temperature_2m_max: [31, 32, 33, 31, 29, 30, 31],
    temperature_2m_min: [19, 20, 21, 19, 18, 18, 19],
    precipitation_probability_max: [5, 10, 15, 25, 35, 20, 10],
  },
}

export const geocodingEmptyFixture = {}

export const geocodingPartialFixture = {
  results: [
    {
      id: 9001,
      name: 'Datos parciales',
      latitude: 1,
      longitude: 1,
      country: 'Escenario simulado',
    },
  ],
}

export const geocodingWeatherErrorFixture = {
  results: [
    {
      id: 9002,
      name: 'Error meteorológico',
      latitude: 2,
      longitude: 2,
      country: 'Escenario simulado',
    },
  ],
}

export const geocodingInvalidWeatherFixture = {
  results: [
    {
      id: 9003,
      name: 'Respuesta inválida',
      latitude: 3,
      longitude: 3,
      country: 'Escenario simulado',
    },
  ],
}

export const geocodingSlowFixture = {
  results: [
    {
      id: 9004,
      name: 'Carga lenta',
      latitude: 4,
      longitude: 4,
      country: 'Escenario simulado',
    },
  ],
}

export const forecastPartialFixture = {
  ...forecastSuccessFixture,
  current: {
    ...forecastSuccessFixture.current,
    apparent_temperature: null,
    weather_code: 999,
  },
  daily: {
    ...forecastSuccessFixture.daily,
    precipitation_probability_max: [5, null, 15, 25, 35, 20, 10],
  },
}

export const forecastInvalidFixture = {
  current: forecastSuccessFixture.current,
  daily: {
    ...forecastSuccessFixture.daily,
    time: forecastSuccessFixture.daily.time.slice(0, 6),
  },
}
