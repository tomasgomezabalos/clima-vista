import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Forecast } from '../../../../src/pages/Home/Forecast'

const days = Array.from({ length: 7 }, (_, index) => ({
  date: `2026-08-${String(index + 23).padStart(2, '0')}`,
  maxTemperature: index === 1 ? null : 30 + index,
  minTemperature: 18 + index,
  precipitationProbability: index * 5,
}))

describe('Forecast', () => {
  it('shows exactly seven days and all daily measurements', () => {
    render(<Forecast days={days} />)

    const list = screen.getByRole('list', { name: 'Previsión de siete días' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(7)
    expect(within(items[0]!).getByText('30 °C')).toBeInTheDocument()
    expect(within(items[0]!).getByText('18 °C')).toBeInTheDocument()
    expect(within(items[0]!).getByText('0 %')).toBeInTheDocument()
  })

  it('shows unavailable for an isolated missing forecast value', () => {
    render(<Forecast days={days} />)

    expect(screen.getByText('No disponible')).toBeInTheDocument()
  })
})
