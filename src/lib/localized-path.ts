import type { To } from "react-router-dom"
import type { Language } from "@/i18n"

export function isEnglishPath(pathname: string): boolean {
  return pathname === "/en" || pathname.startsWith("/en/")
}

export function languageForPath(pathname: string): Language {
  return isEnglishPath(pathname) ? "en" : "zh"
}

export function localizedPath(to: To, language: Language): To {
  const pathname = typeof to === "string" ? to.split(/[?#]/, 1)[0] : to.pathname ?? ""
  if (!pathname.startsWith("/") || pathname === "/studio" || pathname.startsWith("/studio/")) {
    return to
  }

  const unlocalizedPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/"
  const nextPath = language === "en"
    ? unlocalizedPath === "/" ? "/en/" : `/en${unlocalizedPath}`
    : unlocalizedPath

  if (typeof to === "string") {
    const suffix = to.slice(pathname.length)
    return `${nextPath}${suffix}`
  }

  return { ...to, pathname: nextPath }
}
