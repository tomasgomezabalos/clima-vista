import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { parseQueryResponse } from './apiUtils'
import type { GeocodingQuery, WeatherLocation } from './types'
import { parseGeocodingResponse } from './utils'

export const geocodingApi = createApi({
  reducerPath: 'geocodingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://geocoding-api.open-meteo.com/v1/',
  }),
  endpoints: (build) => ({
    searchLocations: build.query<readonly WeatherLocation[], GeocodingQuery>({
      queryFn: async ({ term, language }, _api, _extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: 'search',
          params: {
            name: term,
            language,
            format: 'json',
            count: 10,
          },
        })

        return parseQueryResponse(
          response,
          parseGeocodingResponse,
          'Invalid geocoding response',
        )
      },
    }),
  }),
})

export const { useLazySearchLocationsQuery } = geocodingApi
