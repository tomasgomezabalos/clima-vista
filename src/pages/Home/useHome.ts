import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLazyGetForecastQuery } from '../../services/openMeteo/forecastApi'
import { useLazySearchLocationsQuery } from '../../services/openMeteo/geocodingApi'
import type { WeatherLocation } from '../../services/openMeteo/types'

export const useHome = () => {
  const { t } = useTranslation()
  const [term, setTerm] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [selectedLocation, setSelectedLocation] =
    useState<WeatherLocation | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchLocations, locationQuery] = useLazySearchLocationsQuery()
  const [getForecast, forecastQuery] = useLazyGetForecastQuery()

  const handleTermChange = (value: string) => {
    setTerm(value)

    if (validationMessage && value.trim().length >= 2) {
      setValidationMessage('')
    }
  }

  const handleSearch = () => {
    const trimmedTerm = term.trim()

    if (trimmedTerm.length < 2) {
      setValidationMessage(t('search.validation'))
      return
    }

    setTerm(trimmedTerm)
    setValidationMessage('')
    setHasSearched(true)
    setSelectedLocation(null)
    forecastQuery.reset()
    void searchLocations(trimmedTerm)
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
  const showInitialStatus =
    hasSearched === false && validationMessage.length === 0
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
  }
}
