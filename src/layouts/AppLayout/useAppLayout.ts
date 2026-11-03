import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import {
  resolveSupportedLanguage,
  type SupportedLanguage,
} from '../../i18n/languages'

export const useAppLayout = () => {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const language = resolveSupportedLanguage(i18n.resolvedLanguage)
  const mainRef = useRef<HTMLElement>(null)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname
      mainRef.current?.focus()
    }
  }, [pathname])

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    void i18n.changeLanguage(nextLanguage)
  }

  return { t, language, pathname, mainRef, handleLanguageChange }
}
