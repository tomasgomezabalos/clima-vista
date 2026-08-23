import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createInvalidResponseError } from './apiUtils'
import type { WeatherLocation } from './types'
import { parseGeocodingResponse } from './utils'

export const geocodingApi = createApi({
  reducerPath: 'geocodingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://geocoding-api.open-meteo.com/v1/',
  }),
  endpoints: (build) => ({
    searchLocations: build.query<readonly WeatherLocation[], string>({
      queryFn: async (term, _api, _extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: 'search',
          params: {
            name: term,
            language: 'es',
            format: 'json',
            count: 10,
          },
        })

        if (response.error) {
          return { error: response.error }
        }

        try {
          return { data: parseGeocodingResponse(response.data) }
        } catch {
          return {
            error: createInvalidResponseError(
              'Invalid geocoding response',
              response.data,
            ),
          }
        }
      },
    }),
  }),
})

export const { useLazySearchLocationsQuery } = geocodingApi
