import {
  createLanguageRecord,
  type SupportedLanguage,
} from '../../i18n/languages'

const numberFormatters = createLanguageRecord(
  (locale) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
)

export const formatMeasurement = (
  value: number | null,
  unit: string,
  unavailable: string,
  language: SupportedLanguage,
): string => {
  if (value === null) {
    return unavailable
  }

  return `${numberFormatters[language].format(value)} ${unit}`
}
