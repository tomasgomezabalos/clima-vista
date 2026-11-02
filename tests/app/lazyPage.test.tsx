import { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { lazyPage, PageLoadError } from '../../src/app/lazyPage'
import { PageLoadBoundary } from '../../src/components/PageLoadBoundary'

const LoadedPage = () => <h1>Loaded page</h1>

describe('PageLoadError', () => {
  it('is an Error that keeps the original cause', () => {
    const cause = new TypeError('Failed to fetch dynamically imported module')
    const error = new PageLoadError(cause)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('PageLoadError')
    expect(error.cause).toBe(cause)
  })
})

describe('lazyPage', () => {
  it('renders the page when the module loads', async () => {
    const Page = lazyPage(() => Promise.resolve({ default: LoadedPage }))

    render(
      <Suspense fallback={null}>
        <Page />
      </Suspense>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Loaded page' }),
    ).toBeInTheDocument()
  })

  it('turns a failed import into a page load failure that the boundary catches', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const Page = lazyPage(() =>
      Promise.reject(new TypeError('Failed to fetch dynamically imported module')),
    )

    render(
      <PageLoadBoundary fallback={<p>Page load fallback</p>}>
        <Suspense fallback={null}>
          <Page />
        </Suspense>
      </PageLoadBoundary>,
    )

    expect(await screen.findByText('Page load fallback')).toBeInTheDocument()
  })
})
