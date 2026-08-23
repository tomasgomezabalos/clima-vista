import { describe, expect, it } from 'vitest'
import englishCommon from '../../src/locales/en/common.json'
import spanishCommon from '../../src/locales/es/common.json'
import { resources } from '../../src/i18n/resources'

const collectLeafKeys = (value: unknown, prefix = ''): readonly string[] => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [prefix]
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nestedPrefix = prefix ? `${prefix}.${key}` : key
    return collectLeafKeys(nestedValue, nestedPrefix)
  })
}

describe('translation resources', () => {
  it('registers complete Spanish and English catalogs with identical keys', () => {
    expect(resources.es.common).toBe(spanishCommon)
    expect(resources.en.common).toBe(englishCommon)
    expect([...collectLeafKeys(englishCommon)].sort()).toEqual(
      [...collectLeafKeys(spanishCommon)].sort(),
    )
  })
})
