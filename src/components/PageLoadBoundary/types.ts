import type { ReactNode } from 'react'

export type PageLoadBoundaryProps = Readonly<{
  children: ReactNode
  fallback: ReactNode
}>

export type PageLoadBoundaryState = Readonly<{
  hasError: boolean
  error: unknown
}>
