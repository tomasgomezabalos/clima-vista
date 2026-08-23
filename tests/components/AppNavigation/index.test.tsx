import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { AppNavigation } from '../../../src/components/AppNavigation'

describe('AppNavigation', () => {
  it('identifies the exact active page and navigates with links', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/acerca-de']}>
        <AppNavigation />
      </MemoryRouter>,
    )

    const navigation = screen.getByRole('navigation', {
      name: 'Navegación principal',
    })
    const homeLink = screen.getByRole('link', { name: 'El tiempo' })
    const aboutLink = screen.getByRole('link', { name: 'Acerca de' })

    expect(navigation).toContainElement(homeLink)
    expect(homeLink).not.toHaveAttribute('aria-current')
    expect(aboutLink).toHaveAttribute('aria-current', 'page')

    homeLink.focus()
    await user.keyboard('{Enter}')

    expect(homeLink).toHaveFocus()
    expect(homeLink).toHaveAttribute('aria-current', 'page')
    expect(aboutLink).not.toHaveAttribute('aria-current')
  })
})
