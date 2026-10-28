import type { ReactNode } from "react";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { FaChevronRight, FaHome, FaLeaf } from "react-icons/fa";
import { useLanguage } from "@/i18n";
import { assetUrl } from "@/lib/assets";

interface PageBannerProps {
  eyebrow: string;
  title: string;
  desc: string;
  crumbs?: {label: string;path?: string;}[];
  meta?: {value: string;label: string;}[];
  aside?: ReactNode;
}

const bannerBackdrop =
assetUrl("/assets/forest-valley-map.jpg");

function ContourLines() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      fill="none">

      <path d="M-40 320 C 160 260 260 340 420 300 S 760 220 940 280 S 1160 240 1260 290" stroke="#8FD694" strokeWidth="1.2" />
      <path d="M-40 280 C 180 220 300 300 460 260 S 780 180 960 240 S 1160 200 1260 250" stroke="#8FD694" strokeWidth="1" />
      <path d="M-40 240 C 200 180 320 260 480 220 S 800 140 980 200 S 1160 160 1260 210" stroke="#8FD694" strokeWidth="0.9" />
      <path d="M-40 200 C 220 140 340 220 500 180 S 820 100 1000 160 S 1160 120 1260 170" stroke="#8FD694" strokeWidth="0.8" />
      <path d="M-40 160 C 240 100 360 180 520 140 S 840 60 1020 120 S 1160 80 1260 130" stroke="#8FD694" strokeWidth="0.7" />
      <circle cx="980" cy="120" r="46" stroke="#8FD694" strokeWidth="0.8" />
      <circle cx="980" cy="120" r="78" stroke="#8FD694" strokeWidth="0.6" />
      <circle cx="980" cy="120" r="112" stroke="#8FD694" strokeWidth="0.5" />
      <circle cx="240" cy="300" r="38" stroke="#8FD694" strokeWidth="0.7" />
      <circle cx="240" cy="300" r="66" stroke="#8FD694" strokeWidth="0.5" />
    </svg>);

}

export function PageBanner({ eyebrow, title, desc, crumbs, meta, aside }: PageBannerProps) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-forest pt-28 pb-14 md:pt-36 md:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-[0.16] mix-blend-luminosity"
        style={{ backgroundImage: `url(${bannerBackdrop})` }} />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest/80 to-forest/40" />

      <ContourLines />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sprout/20" />

      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-sprout/25" />


      <div className="relative mx-auto max-w-[1200px] px-5 md:px-6">
        <nav aria-label={t("面包屑")} className="flex items-center gap-2 text-xs font-medium text-mist/70">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-sprout">
            <FaHome className="text-[10px]" />
            {t("首页")}
          </Link>
          {(crumbs ?? [{ label: title }]).map((c) =>
          <span key={c.label} className="flex items-center gap-2">
              <FaChevronRight className="text-[8px] text-sprout/60" />
              {c.path ?
            <Link to={c.path} className="transition-colors hover:text-sprout">
                  {t(c.label)}
                </Link> :

            <span className="text-mist/90">{t(c.label)}</span>
            }
            </span>
          )}
        </nav>

        <div className={`mt-7 grid items-center gap-10 ${aside ? "md:grid-cols-[1fr_minmax(0,440px)] md:gap-14" : "md:grid-cols-[minmax(0,720px)_1fr]"}`}>
          <div>
            <p className="flex items-center gap-3 font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-sprout">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-sprout/40 bg-forest-deep/40">
                <FaLeaf className="text-[11px]" />
              </span>
              <span>{t(eyebrow)}</span>
              <span className="hidden h-px w-16 bg-gradient-to-r from-sprout/70 to-transparent sm:block" />
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-[42px]">
              {t(title)}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mist/85 md:text-base">
              {t(desc)}
            </p>
            {meta && meta.length > 0 &&
            <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-3">
              {meta.map((item) => (
                <div key={item.label}>
                  <dd className="font-display text-lg font-semibold text-white">{t(item.value)}</dd>
                  <dt className="mt-1 text-xs text-mist/70">{t(item.label)}</dt>
                </div>
              ))}










            </dl>
            }
          </div>
          {aside && <div className="hidden md:block">{aside}</div>}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sprout/40 to-transparent" />

    </section>);

}