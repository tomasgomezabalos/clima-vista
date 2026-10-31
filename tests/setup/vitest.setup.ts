import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { i18n } from '../../src/i18n/config'
import { defaultLanguage } from '../../src/i18n/resources'
import { server } from '../../mocks/server'

// Hoisted above the imports so the i18n config starts from the Spanish default.
vi.hoisted(() => {
  Object.defineProperty(navigator, 'languages', {
    value: ['es-ES'],
    configurable: true,
  })
})

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(async () => {
  cleanup()
  server.resetHandlers()
  await i18n.changeLanguage(defaultLanguage)
  localStorage.clear()
})

afterAll(() => server.close())
