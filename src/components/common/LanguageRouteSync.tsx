import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/components/learning/AuthProvider"
import { useLanguage } from "@/i18n"
import { languageForPath, localizedPath } from "@/lib/localized-path"

export function LanguageRouteSync() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isPasswordRecovery } = useAuth()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const routeLanguage = languageForPath(pathname)
    if (routeLanguage !== language) setLanguage(routeLanguage)
  }, [language, pathname, setLanguage])

  useEffect(() => {
    if (!isPasswordRecovery || pathname === "/login" || pathname === "/en/login") return
    navigate(localizedPath("/login", languageForPath(pathname)), { replace: true })
  }, [isPasswordRecovery, navigate, pathname])

  return <Outlet />
}
