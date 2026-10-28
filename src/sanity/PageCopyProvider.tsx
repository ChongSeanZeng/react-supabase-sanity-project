import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useLanguage, type LocalizedCopy } from "@/i18n"
import { sanityClient } from "@/lib/sanity"

interface PageCopyEntry extends LocalizedCopy {
  key: string
}

interface PageCopyDocument {
  entries?: PageCopyEntry[]
  sections?: { entries?: PageCopyEntry[] }[]
}

const pageCopyQuery = `*[_type == "sitePageCopy" && _id == $documentId][0]{
  entries[]{key, zh, en},
  sections[]{entries[]{key, zh, en}}
}`

function pageForPath(pathname: string): string | null {
  const normalizedPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/"

  switch (normalizedPath) {
    case "/about":
      return "about"
    case "/sustainability":
      return "sustainability"
    case "/training":
      return "training"
    case "/verification":
      return "verification"
    case "/partners":
      return "partners"
    case "/contact":
      return "contact"
    default:
      return null
  }
}

export function PageCopyProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const { setPageCopy } = useLanguage()
  const page = pageForPath(pathname)

  useEffect(() => {
    let active = true
    setPageCopy({})

    if (!page || !sanityClient) return

    void sanityClient
      .fetch<PageCopyDocument | null>(pageCopyQuery, {
        documentId: `site-page-copy-${page}`,
      })
      .then((document: PageCopyDocument | null) => {
        if (!active) return
        const entries = [
          ...(document?.entries ?? []),
          ...(document?.sections?.flatMap((section) => section.entries ?? []) ?? []),
        ]
        if (!entries.length) {
          console.warn(`No published Sanity copy found for the "${page}" page; using local fallback copy.`)
          return
        }

        setPageCopy(Object.fromEntries(entries.map(({ key, zh, en }) => [key, { zh, en }])))
      })
      .catch((error: unknown) => {
        if (!active) return
        console.warn(`Unable to load published Sanity copy for the "${page}" page; using local fallback copy.`, error)
      })

    return () => {
      active = false
    }
  }, [page, setPageCopy])

  return children
}
