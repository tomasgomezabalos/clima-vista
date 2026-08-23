import { useTranslation } from 'react-i18next'
import {
  resolveSupportedLanguage,
  type SupportedLanguage,
} from '../../i18n/languages'

export const useAppLayout = () => {
  const { t, i18n } = useTranslation()
  const language = resolveSupportedLanguage(i18n.resolvedLanguage)

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    void i18n.changeLanguage(nextLanguage)
  }

  return { t, language, handleLanguageChange }
}
