import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  defaultLanguage,
  defaultNamespace,
  resources,
} from './resources'
import {
  resolveSupportedLanguage,
  supportedLanguages,
} from './languages'

await i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: false,
  supportedLngs: supportedLanguages,
  defaultNS: defaultNamespace,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

const syncDocumentLanguage = (language: string | undefined) => {
  document.documentElement.lang = resolveSupportedLanguage(language)
}

syncDocumentLanguage(i18n.resolvedLanguage)
i18n.on('languageChanged', syncDocumentLanguage)

export { i18n }
