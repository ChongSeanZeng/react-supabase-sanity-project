import { AuthProvider } from "@/components/learning/AuthProvider"
import { LanguageProvider, type Language } from "@/i18n"
import { languageForPath } from "@/lib/localized-path"
import { RouterProvider } from "react-router-dom"

interface AppProps {
  router: Parameters<typeof RouterProvider>[0]["router"]
  initialLanguage?: Language
}

export function App({ router, initialLanguage }: AppProps) {
  const language = initialLanguage ?? (
    typeof window === "undefined" ? "zh" : languageForPath(window.location.pathname)
  )

  return (
    <LanguageProvider initialLanguage={language}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  )
}
