import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { navItems } from "@/data/nav";
import { useLanguage } from "@/i18n";
import { assetUrl } from "@/lib/assets";
import { LocalizedLink as Link, LocalizedNavLink as NavLink } from "@/components/common/LocalizedLink";
import { localizedPath } from "@/lib/localized-path";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const switchLanguage = () => {
    const nextLanguage = language === "zh" ? "en" : "zh";
    toggleLanguage();
    navigate(localizedPath(`${location.pathname}${location.search}${location.hash}`, nextLanguage));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(null);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] border-b bg-paper/95 backdrop-blur-md transition-all duration-300 ${
      scrolled ?
      "border-line/80 shadow-[0_6px_24px_rgba(27,67,50,0.10)]" :
      "border-transparent shadow-none"}`
      }>

      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:h-[72px] md:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label={t("林扬绿创 LInk 首页")}>
          <img
            src={assetUrl("/assets/logo.png")}
            alt={t("林扬绿创 LInk 标志")}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-line" />

          <span className="leading-tight">
              <span className="block font-display text-[13px] font-bold tracking-[0.02em] text-forest">{t("East Inflink 林扬东方")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item, i) => {
            const align =
            i < 2 ?
            "left-0 translate-x-0" :
            i > navItems.length - 3 ?
            "left-auto right-0 translate-x-0" :
            "left-1/2 -translate-x-1/2";
            return (
              <div key={item.path} className="group relative">
              <NavLink
                  to={item.path} className={({ isActive }) =>
                  `relative block px-3.5 py-2 font-display text-[15px] font-semibold tracking-[0.01em] transition-colors duration-300 after:absolute after:bottom-0.5 after:left-3.5 after:h-[2px] after:rounded-full after:bg-sprout after:transition-all after:duration-300 ${
                  isActive ?
                  "text-forest after:w-[calc(100%-28px)]" :
                  "text-inksoft after:w-0 hover:text-forest hover:after:w-[calc(100%-28px)]"}`
                  }>

                <span className="leading-tight text-xs">{t(item.label)}</span>
              </NavLink>
              <div
                  className={`invisible absolute top-full z-[60] w-[min(760px,calc(100vw-32px))] translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${align}`}>

                <div className="flex items-start gap-8 overflow-hidden rounded-[14px] border border-line/90 bg-white p-6 shadow-[0_28px_70px_rgba(15,42,31,0.16)]">
                  <div className="w-[240px] shrink-0">
                    <span className="flex h-11 w-11 items-center justify-center rounded-card bg-forest text-lg text-sprout">
                      <item.icon />
                    </span>
                    
                    <h3 className="mt-4 font-display text-base font-bold text-forest">{t(item.label)}</h3>
                    {item.labelEn &&
                      <p data-no-translate className="mt-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-moss">
                        {item.labelEn}
                      </p>}
                    <p className="mt-2 text-sm leading-relaxed text-ink">{t(item.summary)}</p>
                    <Link
                        to={item.path}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline decoration-sprout decoration-2 underline-offset-4 transition-colors hover:text-moss">

                      {t("进入页面")}
                      <FaChevronRight className="text-[10px]" />
                    </Link>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-1 border-l border-line pl-8">
                    {item.points.map((point) =>
                      <Link
                        key={point.anchor}
                        to={`${item.path}#${point.anchor}`} className="group/item flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-mist hover:text-forest">

                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sprout transition-transform duration-200 group-hover/item:scale-125" />
                        {t(point.label)}
                      </Link>
                      )}
                  </div>
                </div>
              </div>
            </div>);

          })}
          <Link
            to="/contact" className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2 font-display text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-[0_10px_24px_rgba(27,67,50,0.22)]">

            {t("联系林扬")}
            <FaChevronRight className="text-[10px]" />
          </Link>
          <button
            type="button"
            onClick={switchLanguage}
            className="ml-2 rounded-full border border-line bg-white/70 px-3 py-2 font-display text-xs font-semibold text-forest transition-colors hover:border-moss hover:bg-mist"
            aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
          >
            {language === "zh" ? "EN" : "中文"}
          </button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={switchLanguage}
            className="rounded-full border border-line bg-white/70 px-3 py-2 font-display text-xs font-semibold text-forest"
            aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
          >
            {language === "zh" ? "EN" : "中文"}
          </button>
          <button
            type="button"
            aria-label={t("打开菜单")}
            className="flex h-10 w-10 items-center justify-center rounded-card text-forest"
            onClick={() => setOpen(!open)}>

            {open ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {open &&
      <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-white px-5 pb-6 pt-2 shadow-[0_18px_40px_rgba(15,42,31,0.16)] lg:hidden">
          {navItems.map((item) => {
          const expanded = mobileOpen === item.path;
          return (
            <div key={item.path} className="border-b border-line/70">
                <div className="flex items-center justify-between">
                  <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                  `flex flex-1 items-center gap-2.5 py-3.5 font-display text-base font-semibold tracking-[0.01em] ${
                  isActive ? "text-forest" : "text-ink"}`

                  }>

                    <item.icon className="text-xs text-moss" />
                    <span className="flex flex-col leading-tight">
                      {t(item.label)}
                    </span>
                  </NavLink>
                  <button
                  type="button"
                  aria-label={language === "en" ? `Show ${t(item.label)} preview` : `展开${item.label}内容预览`}
                  onClick={() => setMobileOpen(expanded ? null : item.path)}
                  className="flex h-9 w-9 items-center justify-center text-moss">

                    <FaChevronDown
                    className={`text-xs transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />

                  </button>
                </div>
                {expanded &&
              <div className="animate-fade-up rounded-card bg-mist/70 px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-ink">{t(item.summary)}</p>
                    <p className="mt-3 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">
                      {t("本页主要内容")}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {item.points.map((point) =>
                  <li key={point.anchor} className="flex items-start gap-2.5 text-sm font-medium text-forest">
                          <Link
                            to={`${item.path}#${point.anchor}`}
                            onClick={() => {
                              setOpen(false)
                              setMobileOpen(null)
                            }}
                            className="flex items-start gap-2.5 transition-colors hover:text-moss"
                          >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sprout" />
                          {t(point.label)}
                          </Link>
                        </li>
                  )}
                    </ul>
                  </div>
              }
              </div>);

        })}
          <Link
          to="/contact"
          className="mt-4 block rounded-card bg-forest px-5 py-3 text-center text-[15px] font-medium text-white">

            {t("咨询")}
          </Link>
        </nav>
      }
    </header>);

}