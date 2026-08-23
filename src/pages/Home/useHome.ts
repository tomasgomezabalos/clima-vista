import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  resolveSupportedLanguage,
  type SupportedLanguage,
} from '../../i18n/languages'
import { useLazyGetForecastQuery } from '../../services/openMeteo/forecastApi'
import { useLazySearchLocationsQuery } from '../../services/openMeteo/geocodingApi'
import type { WeatherLocation } from '../../services/openMeteo/types'

export const useHome = () => {
  const { t, i18n } = useTranslation()
  const [term, setTerm] = useState('')
  const [hasValidationError, setHasValidationError] = useState(false)
  const [selectedLocation, setSelectedLocation] =
    useState<WeatherLocation | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchLocations, locationQuery] = useLazySearchLocationsQuery()
  const [getForecast, forecastQuery] = useLazyGetForecastQuery()
  const language = resolveSupportedLanguage(i18n.resolvedLanguage)

  const handleTermChange = (value: string) => {
    setTerm(value)

    if (hasValidationError && value.trim().length >= 2) {
      setHasValidationError(false)
    }
  }

  const handleSearch = () => {
    const trimmedTerm = term.trim()

    if (trimmedTerm.length < 2) {
      setHasValidationError(true)
      return
    }

    setTerm(trimmedTerm)
    setHasValidationError(false)
    setHasSearched(true)
    setSelectedLocation(null)
    forecastQuery.reset()
    void searchLocations({ term: trimmedTerm, language })
  }

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    void i18n.changeLanguage(nextLanguage)
  }

  const handleLocationSelect = (location: WeatherLocation) => {
    setSelectedLocation(location)
    void getForecast({
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }

  const locations = locationQuery.currentData ?? []
  const weather = forecastQuery.currentData
  const validationMessage = hasValidationError ? t('search.validation') : ''
  const showInitialStatus =
    hasSearched === false && hasValidationError === false
  const showSearchLoading = locationQuery.isFetching
  const showSearchError = locationQuery.isError
  const showEmptySearch =
    hasSearched &&
    showSearchLoading === false &&
    showSearchError === false &&
    locations.length === 0
  const showLocationResults =
    showSearchLoading === false &&
    showSearchError === false &&
    locations.length > 0
  const showWeatherLoading = forecastQuery.isFetching
  const showWeatherError = forecastQuery.isError
  const weatherResult =
    selectedLocation &&
    weather &&
    showWeatherLoading === false &&
    showWeatherError === false
      ? { location: selectedLocation, data: weather }
      : null

  return {
    term,
    language,
    validationMessage,
    selectedLocation,
    locations,
    showInitialStatus,
    showSearchLoading,
    showSearchError,
    showEmptySearch,
    showLocationResults,
    showWeatherLoading,
    showWeatherError,
    weatherResult,
    t,
    handleTermChange,
    handleSearch,
    handleLocationSelect,
    handleLanguageChange,
  }
}
