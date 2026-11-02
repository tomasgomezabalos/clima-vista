import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PageLoadFallback } from '../../../src/components/PageLoadFallback'
import { i18n } from '../../../src/i18n/config'

describe('PageLoadFallback', () => {
  it.each([
    [
      'es',
      'No se pudo cargar esta página',
      'Puede haber una versión nueva de la aplicación o haberse perdido la conexión.',
      'Recargar',
    ],
    [
      'en',
      'This page could not be loaded',
      'A new version of the app may be available, or the connection may have been lost.',
      'Reload',
    ],
    [
      'it',
      'Impossibile caricare questa pagina',
      "Potrebbe esserci una nuova versione dell'app o la connessione potrebbe essersi interrotta.",
      'Ricarica',
    ],
  ] as const)(
    'announces the failure and offers a reload in %s',
    async (language, title, description, action) => {
      await i18n.changeLanguage(language)
      render(<PageLoadFallback />)

      expect(screen.getByRole('alert')).toHaveTextContent(title)
      expect(screen.getByText(description)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: action })).toBeInTheDocument()
    },
  )

  it('updates its texts when the language changes while it is visible', async () => {
    render(<PageLoadFallback />)
    expect(screen.getByRole('button', { name: 'Recargar' })).toBeInTheDocument()

    await act(async () => {
      await i18n.changeLanguage('en')
    })

    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'This page could not be loaded',
    )
  })

  it('reloads the current page when the action is pressed', async () => {
    const user = userEvent.setup()
    const reload = vi.fn()
    vi.stubGlobal('location', { ...globalThis.location, reload })
    render(<PageLoadFallback />)

    await user.click(screen.getByRole('button', { name: 'Recargar' }))

    expect(reload).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })
})
