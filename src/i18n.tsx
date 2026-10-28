import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations } from "./translations"
import { languageForPath } from "@/lib/localized-path"

export type Language = "zh" | "en"

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (text: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguage] = useState<Language>(
    () => initialLanguage ?? (
      typeof window === "undefined" ? "zh" : languageForPath(window.location.pathname)
    ),
  )

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-CN"
    try {
      window.localStorage.setItem("eastinflink-language", language)
    } catch {
      // Language selection still works when storage is unavailable.
    }
  }, [language])

  const value: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "zh" ? "en" : "zh"),
    t: (text) => language === "en" ? translations[text] ?? text : text,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}