import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { routes } from '../../app/routes'
import './styles.scss'

export const AppNavigation = () => {
  const { t } = useTranslation()

  return (
    <nav className="app-navigation" aria-label={t('navigation.label')}>
      <NavLink className="app-navigation__link" end to={routes.home}>
        {t('navigation.home')}
      </NavLink>
      <NavLink className="app-navigation__link" to={routes.about}>
        {t('navigation.about')}
      </NavLink>
    </nav>
  )
}
