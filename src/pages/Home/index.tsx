import { CurrentWeather } from './CurrentWeather'
import { Forecast } from './Forecast'
import { LanguageSelector } from './LanguageSelector'
import { LocationResults } from './LocationResults'
import { SearchForm } from './SearchForm'
import { StatusMessage } from './StatusMessage'
import { useHome } from './useHome'
import './styles.scss'

export const Home = () => {
  const {
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
  } = useHome()

  return (
    <main className="home">
      <div className="home__glow home__glow--top" aria-hidden="true" />
      <div className="home__glow home__glow--bottom" aria-hidden="true" />

      <div className="home__content">
        <header className="home__header">
          <LanguageSelector
            language={language}
            onLanguageChange={handleLanguageChange}
          />
          <p className="home__eyebrow">{t('app.eyebrow')}</p>
          <h1>{t('app.title')}</h1>
          <p className="home__subtitle">{t('app.subtitle')}</p>
        </header>

        <section className="home__search" aria-label={t('search.regionLabel')}>
          <SearchForm
            term={term}
            isLoading={showSearchLoading}
            validationMessage={validationMessage}
            onTermChange={handleTermChange}
            onSubmit={handleSearch}
          />

          {showInitialStatus && (
            <StatusMessage message={t('status.initial')} tone="neutral" />
          )}
          {showSearchLoading && (
            <StatusMessage message={t('status.searchLoading')} tone="loading" />
          )}
          {showSearchError && (
            <StatusMessage message={t('status.searchError')} tone="error" />
          )}
          {showEmptySearch && (
            <StatusMessage message={t('status.noResults')} tone="empty" />
          )}
          {showLocationResults && (
            <LocationResults
              locations={locations}
              selectedLocationId={selectedLocation?.id}
              onSelect={handleLocationSelect}
            />
          )}
        </section>

        {showWeatherLoading && (
          <StatusMessage message={t('status.weatherLoading')} tone="loading" />
        )}
        {showWeatherError && (
          <StatusMessage message={t('status.weatherError')} tone="error" />
        )}
        {weatherResult && (
          <div className="home__weather">
            <CurrentWeather
              location={weatherResult.location}
              data={weatherResult.data.current}
            />
            <Forecast days={weatherResult.data.daily} />
          </div>
        )}
      </div>
    </main>
  )
}
