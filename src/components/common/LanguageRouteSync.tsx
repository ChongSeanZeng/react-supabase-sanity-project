import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useLanguage } from "@/i18n"
import { languageForPath } from "@/lib/localized-path"

export function LanguageRouteSync() {
  const { pathname } = useLocation()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const routeLanguage = languageForPath(pathname)
    if (routeLanguage !== language) setLanguage(routeLanguage)
  }, [language, pathname, setLanguage])

  return <Outlet />
}
