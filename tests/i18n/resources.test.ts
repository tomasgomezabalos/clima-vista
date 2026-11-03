import { describe, expect, it } from 'vitest'
import englishCommon from '../../src/locales/en/common.json'
import italianCommon from '../../src/locales/it/common.json'
import spanishCommon from '../../src/locales/es/common.json'
import { resources } from '../../src/i18n/resources'

type CatalogLeaf = Readonly<{
  key: string
  value: unknown
}>

const collectLeaves = (value: unknown, prefix = ''): readonly CatalogLeaf[] => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [{ key: prefix, value }]
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nestedPrefix = prefix ? `${prefix}.${key}` : key
    return collectLeaves(nestedValue, nestedPrefix)
  })
}

describe('translation resources', () => {
  it('registers complete Spanish, English and Italian catalogs with identical non-empty keys', () => {
    const spanishLeaves = collectLeaves(spanishCommon)
    const englishLeaves = collectLeaves(englishCommon)
    const italianLeaves = collectLeaves(italianCommon)
    const sortedKeys = (leaves: readonly CatalogLeaf[]) =>
      leaves.map(({ key }) => key).sort()

    expect(resources.es.common).toBe(spanishCommon)
    expect(resources.en.common).toBe(englishCommon)
    expect(resources.it.common).toBe(italianCommon)
    expect(spanishLeaves).toHaveLength(66)
    expect(sortedKeys(englishLeaves)).toEqual(sortedKeys(spanishLeaves))
    expect(sortedKeys(italianLeaves)).toEqual(sortedKeys(spanishLeaves))
    expect(
      [...spanishLeaves, ...englishLeaves, ...italianLeaves].every(
        ({ value }) => typeof value === 'string' && value.trim().length > 0,
      ),
    ).toBe(true)
  })

  it('keeps the same interpolation variables in every language', () => {
    const variablesByKey = (catalog: unknown) =>
      Object.fromEntries(
        collectLeaves(catalog).map(({ key, value }) => [
          key,
          [...String(value).matchAll(/\{\{\s*(\w+)\s*\}\}/g)]
            .map(([, name]) => name)
            .sort(),
        ]),
      )
    const spanishVariables = variablesByKey(spanishCommon)

    expect(variablesByKey(englishCommon)).toEqual(spanishVariables)
    expect(variablesByKey(italianCommon)).toEqual(spanishVariables)
    expect(
      Object.values(spanishVariables).some((names) => names.length > 0),
    ).toBe(true)
  })

  it.each([
    ['es', spanishCommon],
    ['en', englishCommon],
    ['it', italianCommon],
  ] as const)(
    'translates every weather condition in %s',
    (_language, catalog) => {
      expect(Object.keys(catalog.weather).sort()).toEqual(
        [
          'clear',
          'drizzle',
          'fog',
          'freezingDrizzle',
          'freezingRain',
          'mainlyClear',
          'overcast',
          'partlyCloudy',
          'rain',
          'rainShowers',
          'snow',
          'snowGrains',
          'snowShowers',
          'thunderstorm',
          'thunderstormWithHail',
          'unknown',
        ].sort(),
      )
    },
  )
})
