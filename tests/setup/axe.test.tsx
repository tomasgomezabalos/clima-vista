import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from './axe'

describe('expectNoAccessibilityViolations', () => {
  const originalTitle = document.title
  const originalLanguage = document.documentElement.lang

  beforeEach(() => {
    document.documentElement.lang = 'es'
  })

  afterEach(() => {
    document.title = originalTitle
    document.documentElement.lang = originalLanguage
  })

  it('resolves for an accessible document', async () => {
    document.title = 'Accessible page'
    render(
      <main>
        <h1>Accessible page</h1>
      </main>,
    )

    await expect(expectNoAccessibilityViolations()).resolves.toBeUndefined()
  })

  it('rejects naming the rule when the markup has a violation', async () => {
    document.title = 'Accessible page'
    render(
      <main>
        <h1>Accessible page</h1>
        {/* Violación intencionada: axe debe detectarla. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src="x.png" />
      </main>,
    )

    await expect(expectNoAccessibilityViolations()).rejects.toThrow(/image-alt/)
  })

  it('rejects page-level violations outside the rendered container', async () => {
    document.title = ''
    render(
      <main>
        <h1>Accessible page</h1>
      </main>,
    )

    await expect(expectNoAccessibilityViolations()).rejects.toThrow(
      /document-title/,
    )
  })
})
