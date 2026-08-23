import { describe, expect, it } from 'vitest'
import { createInvalidResponseError } from '../../../src/services/openMeteo/apiUtils'

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
