import { useTranslation } from 'react-i18next'
import './styles.scss'

export const PageLoadFallback = () => {
  const { t } = useTranslation()

  return (
    <div className="page-load-fallback" role="alert">
      <p className="page-load-fallback__title">
        {t('routing.loadError.title')}
      </p>
      <p className="page-load-fallback__description">
        {t('routing.loadError.description')}
      </p>
      <button
        type="button"
        className="page-load-fallback__action"
        onClick={() => globalThis.location.reload()}
      >
        {t('routing.loadError.reload')}
      </button>
    </div>
  )
}
