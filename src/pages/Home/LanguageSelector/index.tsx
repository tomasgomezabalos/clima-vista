import { useTranslation } from 'react-i18next'
import type { LanguageSelectorProps } from './types'
import './styles.scss'

const languageOptions = [
  { language: 'es', labelKey: 'language.spanish' },
  { language: 'en', labelKey: 'language.english' },
  { language: 'it', labelKey: 'language.italian' },
] as const

export const LanguageSelector = ({
  language,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const { t } = useTranslation()

  return (
    <div
      className="language-selector"
      role="group"
      aria-label={t('language.label')}
    >
      {languageOptions.map((option) => (
        <button
          className="language-selector__option"
          type="button"
          key={option.language}
          aria-pressed={language === option.language}
          onClick={() => onLanguageChange(option.language)}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  )
}
