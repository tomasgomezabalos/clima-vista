import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const createInvalidResponseError = (
  message: string,
  data: unknown,
): FetchBaseQueryError => ({
  status: 'CUSTOM_ERROR',
  error: message,
  data,
})
