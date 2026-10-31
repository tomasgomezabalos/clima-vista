import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { defaultNamespace, resources } from './resources'
import {
  detectInitialLanguage,
  getLanguageStorage,
  storeLanguage,
} from './initialLanguage'
import {
  resolveSupportedLanguage,
  supportedLanguages,
} from './languages'

await i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(getLanguageStorage(), navigator.languages),
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

const persistLanguage = (language: string | undefined) => {
  storeLanguage(getLanguageStorage(), resolveSupportedLanguage(language))
}

syncDocumentLanguage(i18n.resolvedLanguage)
i18n.on('languageChanged', syncDocumentLanguage)
i18n.on('languageChanged', persistLanguage)

export { i18n }
