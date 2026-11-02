import { Component, type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PageLoadError } from '../../../src/app/lazyPage'
import { PageLoadBoundary } from '../../../src/components/PageLoadBoundary'

const Throwing = ({ error }: Readonly<{ error: Error }>): ReactNode => {
  throw error
}

type OuterBoundaryState = Readonly<{ message: string | null }>

class OuterBoundary extends Component<
  Readonly<{ children: ReactNode }>,
  OuterBoundaryState
> {
  state: OuterBoundaryState = { message: null }

  static getDerivedStateFromError(error: Error): OuterBoundaryState {
    return { message: error.message }
  }

  render() {
    const { message } = this.state

    return message === null ? this.props.children : <p>Outer: {message}</p>
  }
}

describe('PageLoadBoundary', () => {
  it('renders its children while nothing fails', () => {
    render(
      <PageLoadBoundary fallback={<p>Fallback</p>}>
        <p>Page content</p>
      </PageLoadBoundary>,
    )

    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument()
  })

  it('shows the fallback when a page fails to load', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <PageLoadBoundary fallback={<p>Fallback</p>}>
        <Throwing error={new PageLoadError(new Error('chunk'))} />
      </PageLoadBoundary>,
    )

    expect(screen.getByText('Fallback')).toBeInTheDocument()
  })

  it('does not handle other errors and leaves them to the outer boundary', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <OuterBoundary>
        <PageLoadBoundary fallback={<p>Fallback</p>}>
          <Throwing error={new Error('render failure')} />
        </PageLoadBoundary>
      </OuterBoundary>,
    )

    expect(screen.getByText('Outer: render failure')).toBeInTheDocument()
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument()
  })

  it('renders the children again when its key changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { rerender } = render(
      <PageLoadBoundary key="/about" fallback={<p>Fallback</p>}>
        <Throwing error={new PageLoadError(new Error('chunk'))} />
      </PageLoadBoundary>,
    )
    expect(screen.getByText('Fallback')).toBeInTheDocument()

    rerender(
      <PageLoadBoundary key="/" fallback={<p>Fallback</p>}>
        <p>Page content</p>
      </PageLoadBoundary>,
    )

    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument()
  })
})
