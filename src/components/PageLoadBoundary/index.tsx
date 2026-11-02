import { Component } from 'react'
import { PageLoadError } from '../../app/lazyPage'
import type { PageLoadBoundaryProps, PageLoadBoundaryState } from './types'

export class PageLoadBoundary extends Component<
  PageLoadBoundaryProps,
  PageLoadBoundaryState
> {
  state: PageLoadBoundaryState = { hasError: false, error: undefined }

  static getDerivedStateFromError(error: unknown): PageLoadBoundaryState {
    return { hasError: true, error }
  }

  render() {
    const { hasError, error } = this.state

    if (hasError) {
      if (error instanceof PageLoadError) {
        return this.props.fallback
      }

      throw error
    }

    return this.props.children
  }
}
