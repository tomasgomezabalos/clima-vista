import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useDocumentTitle } from '../../src/app/useDocumentTitle'

describe('useDocumentTitle', () => {
  const originalTitle = document.title

  afterEach(() => {
    document.title = originalTitle
  })

  it('sets the document title and follows later changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'First title' },
    })

    expect(document.title).toBe('First title')

    rerender({ title: 'Second title' })

    expect(document.title).toBe('Second title')
  })
})
