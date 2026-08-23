import { useTranslation } from 'react-i18next'
import './styles.scss'

export const About = () => {
  const { t } = useTranslation()

  return (
    <main className="about-page">
      <div className="about-page__content">
        <p className="about-page__overline">{t('about.overline')}</p>
        <h1>{t('about.title')}</h1>
        <p>{t('about.description')}</p>
      </div>
    </main>
  )
}
