import { useTranslation } from 'react-i18next'
import {
  resolveSupportedLanguage,
  supportedLanguages,
} from '../../i18n/languages'
import type { LanguageSelectorProps } from './types'
import './styles.scss'

const languageOptions = {
  es: { code: 'ES', labelKey: 'language.spanish' },
  en: { code: 'EN', labelKey: 'language.english' },
  it: { code: 'IT', labelKey: 'language.italian' },
} as const

export const LanguageSelector = ({
  language,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const { t } = useTranslation()
  const activeOption = languageOptions[language]

  return (
    <label className="language-selector">
      <select
        className="language-selector__control"
        aria-label={t('language.label')}
        value={language}
        onChange={(event) =>
          onLanguageChange(resolveSupportedLanguage(event.currentTarget.value))
        }
      >
        {supportedLanguages.map((optionLanguage) => (
          <option key={optionLanguage} value={optionLanguage}>
            {t(languageOptions[optionLanguage].labelKey)}
          </option>
        ))}
      </select>
      <span className="language-selector__visual" aria-hidden="true">
        <svg
          className="language-selector__icon"
          viewBox="0 0 24 24"
          fill="none"
          focusable="false"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18" />
        </svg>
        <span className="language-selector__code">{activeOption.code}</span>
        <span className="language-selector__chevron" />
      </span>
    </label>
  )
}
