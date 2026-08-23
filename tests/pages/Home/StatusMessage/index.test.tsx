import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusMessage } from '../../../../src/pages/Home/StatusMessage'

describe('StatusMessage', () => {
  it('uses a polite status for non-error messages', () => {
    render(<StatusMessage message="Escribe una localidad." tone="neutral" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('status')).toHaveTextContent('Escribe una localidad.')
  })

  it('uses an assertive alert for errors', () => {
    render(<StatusMessage message="No se ha podido completar." tone="error" />)

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })
})
