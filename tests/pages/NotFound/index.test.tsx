import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { NotFound } from '../../../src/pages/NotFound'

describe('NotFound', () => {
  it('explains the unknown route and links back home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al tiempo' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
