import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { routes } from '../../app/routes'
import './styles.scss'

export const NotFound = () => {
  const { t } = useTranslation()

  return (
    <main className="not-found-page">
      <div className="not-found-page__content">
        <p className="not-found-page__overline">{t('notFound.overline')}</p>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.description')}</p>
        <Link className="not-found-page__link" to={routes.home}>
          {t('notFound.backHome')}
        </Link>
      </div>
    </main>
  )
}
