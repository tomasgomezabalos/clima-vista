import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react'

export const createInvalidResponseError = (
  message: string,
  data: unknown,
): FetchBaseQueryError => ({
  status: 'CUSTOM_ERROR',
  error: message,
  data,
})

export const parseQueryResponse = <T>(
  response: QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    FetchBaseQueryMeta | undefined
  >,
  parse: (data: unknown) => T,
  invalidMessage: string,
): { data: T } | { error: FetchBaseQueryError } => {
  if (response.error) {
    return { error: response.error }
  }

  try {
    return { data: parse(response.data) }
  } catch {
    return {
      error: createInvalidResponseError(invalidMessage, response.data),
    }
  }
}
