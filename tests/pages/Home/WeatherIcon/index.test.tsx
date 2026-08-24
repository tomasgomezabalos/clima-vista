import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherIcon } from '../../../../src/pages/Home/WeatherIcon'

describe('WeatherIcon', () => {
  it('is complementary and identifies the visual condition and daytime', () => {
    const { container } = render(<WeatherIcon condition="rain" isDay />)
    const icon = container.querySelector('svg')

    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('data-condition', 'rain')
    expect(icon).toHaveAttribute('data-daytime', 'day')
  })

  it('renders a visual fallback for an unknown condition', () => {
    const { container } = render(<WeatherIcon condition="unknown" isDay={null} />)

    expect(container.querySelector('svg')).toHaveAttribute('data-daytime', 'unknown')
    expect(container.querySelector('text')).toHaveTextContent('?')
  })

  it('renders the night, fog, snow and storm visual layers', () => {
    const { container, rerender } = render(
      <WeatherIcon condition="clear" isDay={false} />,
    )

    expect(container.querySelector('svg')).toHaveAttribute(
      'data-daytime',
      'night',
    )
    expect(container.querySelector('path[fill="#d7e6ff"]')).toBeInTheDocument()

    rerender(<WeatherIcon condition="fog" isDay />)
    expect(container.querySelector('.weather-icon__mist')).toBeInTheDocument()

    rerender(<WeatherIcon condition="snow" isDay />)
    expect(container.querySelector('.weather-icon__snow')).toBeInTheDocument()

    rerender(<WeatherIcon condition="thunderstorm" isDay />)
    expect(container.querySelector('path[fill="#ffd76f"]')).toBeInTheDocument()
  })
})
