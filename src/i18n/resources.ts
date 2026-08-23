import englishCommon from '../locales/en/common.json'
import italianCommon from '../locales/it/common.json'
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
  it: {
    common: italianCommon,
  },
} as const
