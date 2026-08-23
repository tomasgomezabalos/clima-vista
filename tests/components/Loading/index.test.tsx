import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from '../../../src/components/Loading'

describe('Loading', () => {
  it('announces a visible busy status and hides its indicator', () => {
    const { container } = render(<Loading message="Cargando página…" />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Cargando página…')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelector('.loading__indicator')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})
