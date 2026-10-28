import { Link, NavLink, type LinkProps, type NavLinkProps } from "react-router-dom"
import { useLanguage } from "@/i18n"
import { localizedPath } from "@/lib/localized-path"

export function LocalizedLink(props: LinkProps) {
  const { language } = useLanguage()
  return <Link {...props} to={localizedPath(props.to, language)} />
}

export function LocalizedNavLink(props: NavLinkProps) {
  const { language } = useLanguage()
  return <NavLink {...props} to={localizedPath(props.to, language)} />
}
