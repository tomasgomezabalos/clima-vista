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
})
