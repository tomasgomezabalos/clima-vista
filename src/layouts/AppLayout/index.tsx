import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { AppNavigation } from '../../components/AppNavigation'
import { LanguageSelector } from '../../components/LanguageSelector'
import { Loading } from '../../components/Loading'
import { useAppLayout } from './useAppLayout'
import './styles.scss'

export const AppLayout = () => {
  const { t, language, handleLanguageChange } = useAppLayout()

  return (
    <div className="app-layout">
      <header className="app-layout__bar">
        <AppNavigation />
        <LanguageSelector
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </header>
      <div className="app-layout__content">
        <Suspense fallback={<Loading message={t('routing.loading')} />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
