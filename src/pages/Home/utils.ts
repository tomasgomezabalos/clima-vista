import type { SupportedLanguage } from '../../i18n/languages'

const numberFormatters: Readonly<Record<SupportedLanguage, Intl.NumberFormat>> = {
  es: new Intl.NumberFormat('es', { maximumFractionDigits: 1 }),
  en: new Intl.NumberFormat('en', { maximumFractionDigits: 1 }),
}

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
