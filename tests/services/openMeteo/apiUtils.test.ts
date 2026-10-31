import { describe, expect, it } from 'vitest'
import {
  createInvalidResponseError,
  parseQueryResponse,
} from '../../../src/services/openMeteo/apiUtils'

describe('createInvalidResponseError', () => {
  it('creates the expected RTK Query custom error without changing the data', () => {
    const data = { reason: 'invalid response' }

    const error = createInvalidResponseError('Invalid forecast response', data)

    expect(error).toEqual({
      status: 'CUSTOM_ERROR',
      error: 'Invalid forecast response',
      data,
    })
    expect(error.data).toBe(data)
  })
})

describe('parseQueryResponse', () => {
  const parse = (data: unknown) => {
    if (typeof data === 'number') {
      return data * 2
    }

    throw new Error('invalid')
  }

  it('returns the parsed data when the response is valid', () => {
    expect(parseQueryResponse({ data: 2 }, parse, 'Invalid')).toEqual({
      data: 4,
    })
  })

  it('forwards the transport error untouched without parsing', () => {
    const error = { status: 500, data: 'boom' } as const

    expect(parseQueryResponse({ error }, parse, 'Invalid')).toEqual({ error })
  })

  it('maps a parsing failure to the invalid response error', () => {
    expect(parseQueryResponse({ data: 'x' }, parse, 'Invalid thing')).toEqual({
      error: { status: 'CUSTOM_ERROR', error: 'Invalid thing', data: 'x' },
    })
  })
})
