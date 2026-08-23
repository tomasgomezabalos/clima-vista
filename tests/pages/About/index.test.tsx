import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { About } from '../../../src/pages/About'

describe('About', () => {
  it('describes the existing Clima Vista capabilities', () => {
    render(<About />)

    expect(
      screen.getByRole('heading', { name: 'Acerca de Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/tiempo actual/)).toHaveTextContent(
      'previsión de los próximos siete días',
    )
  })
})
