import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchForm } from '../../../../src/pages/Home/SearchForm'

describe('SearchForm', () => {
  it('updates the term and submits with the button', async () => {
    const user = userEvent.setup()
    const onTermChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <SearchForm
        term=""
        isLoading={false}
        validationMessage=""
        onTermChange={onTermChange}
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByRole('searchbox', { name: 'Localidad' }), 'M')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(onTermChange).toHaveBeenCalledWith('M')
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('submits with Enter and exposes validation accessibly', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <SearchForm
        term="M"
        isLoading={false}
        validationMessage="Introduce al menos dos caracteres."
        onTermChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    )

    const input = screen.getByRole('searchbox', { name: 'Localidad' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Introduce al menos dos caracteres.')

    await user.type(input, '{Enter}')
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables search while loading', () => {
    render(
      <SearchForm
        term="Madrid"
        isLoading
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled()
  })
})
