import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createInvalidResponseError } from './apiUtils'
import type { ForecastQuery, WeatherData } from './types'
import { parseForecastResponse } from './utils'

export const forecastApi = createApi({
  reducerPath: 'forecastApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.open-meteo.com/v1/' }),
  endpoints: (build) => ({
    getForecast: build.query<WeatherData, ForecastQuery>({
      queryFn: async (
        { latitude, longitude },
        _api,
        _extraOptions,
        baseQuery,
      ) => {
        const response = await baseQuery({
          url: 'forecast',
          params: {
            latitude,
            longitude,
            current:
              'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
            daily:
              'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
            temperature_unit: 'celsius',
            wind_speed_unit: 'kmh',
            timezone: 'auto',
            forecast_days: 7,
            timeformat: 'iso8601',
          },
        })

        if (response.error) {
          return { error: response.error }
        }

        try {
          return { data: parseForecastResponse(response.data) }
        } catch {
          return {
            error: createInvalidResponseError(
              'Invalid forecast response',
              response.data,
            ),
          }
        }
      },
    }),
  }),
})

export const { useLazyGetForecastQuery } = forecastApi
