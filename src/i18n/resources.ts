import englishCommon from '../locales/en/common.json'
import spanishCommon from '../locales/es/common.json'
export { defaultLanguage } from './languages'
export const defaultNamespace = 'common'

export const resources = {
  es: {
    common: spanishCommon,
  },
  en: {
    common: englishCommon,
  },
} as const
