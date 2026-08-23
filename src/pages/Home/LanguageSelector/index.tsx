import { useTranslation } from 'react-i18next'
import type { LanguageSelectorProps } from './types'
import './styles.scss'

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
      <button
        className="language-selector__option"
        type="button"
        aria-pressed={language === 'es'}
        onClick={() => onLanguageChange('es')}
      >
        {t('language.spanish')}
      </button>
      <button
        className="language-selector__option"
        type="button"
        aria-pressed={language === 'en'}
        onClick={() => onLanguageChange('en')}
      >
        {t('language.english')}
      </button>
    </div>
  )
}
