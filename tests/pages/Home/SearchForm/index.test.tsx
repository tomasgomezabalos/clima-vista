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

  it('presents the button as unavailable while loading and available otherwise', () => {
    const { rerender } = render(
      <SearchForm
        term="Madrid"
        isLoading
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    const button = screen.getByRole('button', { name: 'Buscar' })

    expect(button).toHaveAttribute('aria-disabled', 'true')

    rerender(
      <SearchForm
        term="Madrid"
        isLoading={false}
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    expect(button).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('keeps the keyboard focus on the button while a search starts and ends', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const { rerender } = render(
      <SearchForm
        term="Madrid"
        isLoading={false}
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    )
    const button = screen.getByRole('button', { name: 'Buscar' })

    button.focus()
    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledOnce()

    rerender(
      <SearchForm
        term="Madrid"
        isLoading
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    )
    expect(button).toHaveFocus()

    rerender(
      <SearchForm
        term="Madrid"
        isLoading={false}
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    )
    expect(button).toHaveFocus()
  })

  it('does not submit again while a search is in progress', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <SearchForm
        term="Madrid"
        isLoading
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    )
    const button = screen.getByRole('button', { name: 'Buscar' })

    button.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    await user.click(button)
    await user.type(screen.getByRole('searchbox', { name: 'Localidad' }), '{Enter}')

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('links the field to the error message through aria-describedby', () => {
    render(
      <SearchForm
        term="M"
        isLoading={false}
        validationMessage="Introduce al menos dos caracteres."
        onTermChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    const input = screen.getByRole('searchbox', { name: 'Localidad' })
    const error = screen.getByRole('alert')

    expect(error.id).not.toBe('')
    expect(input).toHaveAttribute('aria-describedby', error.id)
    expect(input).toHaveAccessibleDescription('Introduce al menos dos caracteres.')
  })

  it('does not set aria-describedby when there is no validation error', () => {
    render(
      <SearchForm
        term="Madrid"
        isLoading={false}
        validationMessage=""
        onTermChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByRole('searchbox', { name: 'Localidad' })).not.toHaveAttribute(
      'aria-describedby',
    )
  })
})
