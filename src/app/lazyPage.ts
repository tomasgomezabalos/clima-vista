import { lazy, type ComponentType } from 'react'

export class PageLoadError extends Error {
  constructor(cause: unknown) {
    super('The page could not be loaded', { cause })
    this.name = 'PageLoadError'
  }
}

export const lazyPage = <Page extends ComponentType>(
  load: () => Promise<{ default: Page }>,
) =>
  lazy(() =>
    load().catch((error: unknown) => {
      throw new PageLoadError(error)
    }),
  )
