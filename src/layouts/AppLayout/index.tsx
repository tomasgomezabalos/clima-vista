import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { AppNavigation } from '../../components/AppNavigation'
import { LanguageSelector } from '../../components/LanguageSelector'
import { Loading } from '../../components/Loading'
import { PageLoadBoundary } from '../../components/PageLoadBoundary'
import { PageLoadFallback } from '../../components/PageLoadFallback'
import { useAppLayout } from './useAppLayout'
import './styles.scss'

export const AppLayout = () => {
  const { t, language, pathname, mainRef, handleLanguageChange } =
    useAppLayout()

  return (
    <div className="app-layout">
      <header className="app-layout__bar">
        <AppNavigation />
        <LanguageSelector
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </header>
      <main className="app-layout__content" ref={mainRef} tabIndex={-1}>
        <PageLoadBoundary key={pathname} fallback={<PageLoadFallback />}>
          <Suspense fallback={<Loading message={t('routing.loading')} />}>
            <Outlet />
          </Suspense>
        </PageLoadBoundary>
      </main>
    </div>
  )
}
