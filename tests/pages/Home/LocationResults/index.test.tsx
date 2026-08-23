import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LocationResults } from '../../../../src/pages/Home/LocationResults'

const locations = [
  {
    id: 1,
    name: 'Madrid',
    latitude: 40.4,
    longitude: -3.7,
    admin1: 'Comunidad de Madrid',
    country: 'España',
  },
  {
    id: 2,
    name: 'Madrid',
    latitude: 4.7,
    longitude: -74.2,
    country: 'Colombia',
  },
] as const

describe('LocationResults', () => {
  it('renders optional location context without empty separators', () => {
    render(<LocationResults locations={locations} onSelect={vi.fn()} />)

    expect(screen.getByText('Madrid, Comunidad de Madrid, España')).toBeInTheDocument()
    expect(screen.getByText('Madrid, Colombia')).toBeInTheDocument()
    expect(screen.queryByText(/Madrid, , Colombia/)).not.toBeInTheDocument()
  })

  it('selects a location with a native button', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <LocationResults locations={locations} selectedLocationId={1} onSelect={onSelect} />,
    )

    const firstLocation = screen.getByRole('button', {
      name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
    })
    expect(firstLocation).toHaveAttribute('aria-pressed', 'true')

    await user.click(firstLocation)
    expect(onSelect).toHaveBeenCalledWith(locations[0])
  })
})
