import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '../../../../src/i18n/config'
import { CurrentWeather } from '../../../../src/pages/Home/CurrentWeather'

const location = {
  id: 1,
  name: 'Madrid',
  latitude: 40.4,
  longitude: -3.7,
  admin1: 'Comunidad de Madrid',
  country: 'España',
} as const

describe('CurrentWeather', () => {
  it('shows the selected location, measurements and translated condition', () => {
    render(
      <CurrentWeather
        location={location}
        data={{
          temperature: 24.3,
          apparentTemperature: 24.8,
          humidity: 42,
          windSpeed: 11.7,
          weatherCode: 1,
          condition: 'mainlyClear',
          isDay: true,
        }}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Tiempo actual en Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('24,3 °C')).toBeInTheDocument()
    expect(screen.getAllByText('Principalmente despejado')).toHaveLength(2)
    expect(screen.getByText('11,7 km/h')).toBeInTheDocument()
  })

  it('keeps valid values visible when isolated data is unavailable', () => {
    render(
      <CurrentWeather
        location={location}
        data={{
          temperature: 24,
          apparentTemperature: null,
          humidity: 42,
          windSpeed: null,
          weatherCode: 999,
          condition: 'unknown',
          isDay: null,
        }}
      />,
    )

    expect(screen.getByText('24 °C')).toBeInTheDocument()
    expect(screen.getAllByText('No disponible')).toHaveLength(2)
    expect(screen.getAllByText('Estado no disponible')).toHaveLength(2)
  })

  it('localizes conditions, labels and decimal values in English', async () => {
    await i18n.changeLanguage('en')

    render(
      <CurrentWeather
        location={location}
        data={{
          temperature: 24.3,
          apparentTemperature: 24.8,
          humidity: 42,
          windSpeed: 11.7,
          weatherCode: 1,
          condition: 'mainlyClear',
          isDay: true,
        }}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Current weather in Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('24.3 °C')).toBeInTheDocument()
    expect(screen.getAllByText('Mainly clear')).toHaveLength(2)
    expect(screen.getByText('11.7 km/h')).toBeInTheDocument()
  })

  it('localizes conditions, labels and decimal values in Italian', async () => {
    await i18n.changeLanguage('it')

    render(
      <CurrentWeather
        location={location}
        data={{
          temperature: 24.3,
          apparentTemperature: null,
          humidity: 42,
          windSpeed: 11.7,
          weatherCode: 1,
          condition: 'mainlyClear',
          isDay: true,
        }}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Meteo attuale per Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('24,3 °C')).toBeInTheDocument()
    expect(screen.getAllByText('Prevalentemente sereno')).toHaveLength(2)
    expect(screen.getByText('Temperatura percepita')).toBeInTheDocument()
    expect(screen.getByText('Non disponibile')).toBeInTheDocument()
  })
})
