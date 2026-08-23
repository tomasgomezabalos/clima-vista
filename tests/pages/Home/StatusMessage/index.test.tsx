import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusMessage } from '../../../../src/pages/Home/StatusMessage'

describe('StatusMessage', () => {
  it('uses a polite status for non-error messages', () => {
    render(<StatusMessage message="Buscando localidades…" tone="loading" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('status')).toHaveTextContent('Buscando localidades…')
  })

  it('uses an assertive alert for errors', () => {
    render(<StatusMessage message="No se ha podido completar." tone="error" />)

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })
})
