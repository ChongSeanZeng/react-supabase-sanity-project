import { useEffect, useState } from "react"
import { FaTimes, FaSearchPlus, FaSearchMinus, FaCertificate } from "react-icons/fa"
import { Reveal } from "@/components/generated/Reveal"
import { useLanguage } from "@/i18n"
import { assetUrl } from "@/lib/assets"
import {
  fscLicenseImage,
  fscDisclaimer,
  qualificationTiles,
  qualificationTileCrop,
} from "@/data/content"

const tiles = qualificationTiles

export function QualificationWall() {
  const { language, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % tiles.length)
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + tiles.length) % tiles.length)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  const openViewer = (index: number) => {
    setActive(index)
    setZoom(1)
    setOpen(true)
  }

  const current = tiles[active]

  return (
    <div className="mt-12">
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-card border border-line bg-mist/50 p-7 md:flex-row md:gap-10 md:p-9">
          <a
            href={assetUrl(fscLicenseImage)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-card border border-line bg-white p-4 transition-shadow duration-300 hover:shadow-[0_10px_24px_rgba(27,67,50,0.14)]"
          >
            <img
              src={assetUrl(fscLicenseImage)}
              alt={t("FSC 宣传许可 FSC® N002971")}
              className="h-32 w-auto object-contain"
              loading="lazy"
            />
          </a>
          <div className="text-center md:text-left">
            <p className="text-base font-bold text-forest">{t("FSC®N002971 www.fsc.org")}</p>
            <p className="mt-1 text-sm text-moss">{t("选择 FSC®，支持负责任采购")}</p>
            <p className="mt-4 text-xs leading-relaxed text-inksoft/80">
              {t(fscDisclaimer.zh)}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile, i) => (
          <Reveal key={tile.id} delay={i * 90}>
            <button
              type="button"
              onClick={() => openViewer(i)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-white text-left shadow-[0_2px_10px_rgba(27,67,50,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-moss hover:shadow-[0_18px_38px_rgba(27,67,50,0.16)]"
              aria-label={language === "en" ? `View ${tile.nameEn}` : `查看${tile.name}大图`}
            >
              <span className="relative block w-full overflow-hidden bg-mist/70 p-4">
                <span
                  className="block w-full overflow-hidden rounded-[10px] bg-white ring-1 ring-line/80 transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ aspectRatio: qualificationTileCrop.aspectRatio }}
                >
                  <img
                    src={assetUrl(tile.image)}
                    alt={t(tile.name)}
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                </span>
                <span className="pointer-events-none absolute inset-4 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),inset_0_18px_28px_-24px_rgba(27,67,50,0.45)]" />
                <span className="pointer-events-none absolute right-6 top-6 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-forest/90 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <FaSearchPlus className="text-xs" />
                </span>
              </span>
              <span className="mt-auto flex items-start gap-2.5 border-t border-line px-5 py-4">
                <FaCertificate className="mt-0.5 shrink-0 text-moss" />
                <span>
                  <span className="block text-sm font-bold leading-snug text-forest">
                    {t(tile.name)}
                  </span>
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-forest-deep/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("资质与授权大图")}
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/15 px-5 py-4">
            <p className="text-sm font-semibold text-white">
              {t(current.name)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15"
                aria-label={t("缩小")}
              >
                <FaSearchMinus />
              </button>
              <span className="w-14 text-center text-xs text-mist">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(4, Number((z + 0.25).toFixed(2))))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15"
                aria-label={t("放大")}
              >
                <FaSearchPlus />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15"
                aria-label={t("关闭")}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-5">
            <div
              key={`${current.id}-${zoom}`}
              className="mx-auto w-full max-w-[860px] animate-fade-up"
            >
              <span
                className="block w-full overflow-hidden rounded-card bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                style={{ aspectRatio: qualificationTileCrop.aspectRatio }}
              >
                <span
                  className="block h-full w-full overflow-hidden rounded-[10px]"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                >
                  <img
                    src={assetUrl(current.image)}
                    alt={t(current.name)}
                    className="h-full w-full object-contain"
                  />
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 border-t border-white/15 px-5 py-4">
            {tiles.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActive(i)
                  setZoom(1)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-sprout" : "w-2 bg-white/35 hover:bg-white/60"
                }`}
                aria-label={language === "en" ? `Switch to ${t.nameEn}` : `切换到${t.name}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
