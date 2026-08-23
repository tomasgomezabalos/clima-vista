import { configureStore } from '@reduxjs/toolkit'
import { forecastApi } from '../services/openMeteo/forecastApi'
import { geocodingApi } from '../services/openMeteo/geocodingApi'

export const createAppStore = () =>
  configureStore({
    reducer: {
      [geocodingApi.reducerPath]: geocodingApi.reducer,
      [forecastApi.reducerPath]: forecastApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        geocodingApi.middleware,
        forecastApi.middleware,
      ),
  })

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
