import { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import type { ShowImage } from "@/data/showcase"
import { useLanguage } from "@/i18n"
import { assetUrl } from "@/lib/assets"

interface ImageCarouselProps {
  images: ShowImage[]
  label: string
  interval?: number
  rounded?: string
  aspect?: string
  showCaption?: boolean
}

export function ImageCarousel({
  images,
  label,
  interval = 2000,
  rounded = "rounded-card",
  aspect = "aspect-[4/5]",
  showCaption = true,
}: ImageCarouselProps) {
  const { language, t } = useLanguage()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = images.length
  const current = images[index]

  useEffect(() => {
    if (paused || total <= 1) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % total), interval)
    return () => window.clearInterval(t)
  }, [paused, total, interval])

  const go = (next: number) => setIndex(((next % total) + total) % total)

  return (
    <div
      className={`group relative overflow-hidden ${rounded} bg-forest-deep shadow-[0_18px_44px_rgba(15,42,31,0.22)] ring-1 ring-white/10`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t(label)}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_95%_at_12%_0%,#2D6A4F_0%,#1B4332_48%,#14352A_100%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14] mix-blend-luminosity"
        style={{
          backgroundImage:
            `url(${assetUrl("/assets/forest-valley-map.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-white/[0.06]" />

      <div className={`relative w-full ${aspect}`}>
        {images.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-500 ${
              i === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0 scale-[1.03]"
            }`}
            aria-hidden={i !== index}
          >
            {s.fit === "contain" ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                  <img
                    src={assetUrl(s.image)}
                    alt=""
                    className="h-full w-full scale-110 object-cover opacity-45 blur-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-mist/80" />
                </div>
                <img
                  src={assetUrl(s.image)}
                  alt={t(s.alt)}
                  className="relative h-full w-full object-contain p-4"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </>
            ) : (
              <img
                src={assetUrl(s.image)}
                alt={t(s.alt)}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            )}
            {showCaption && s.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/85 to-transparent px-5 pb-4 pt-12">
                <p className="text-sm font-semibold text-white">{t(s.caption)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label={t("上一张")}
        className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-forest-deep/55 text-sm text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-forest-deep/85 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <FaChevronLeft />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label={t("下一张")}
        className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-forest-deep/55 text-sm text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-forest-deep/85 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <FaChevronRight />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 pb-3">
        {images.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={language === "en" ? `Go to slide ${i + 1}` : `切换到第 ${i + 1} 张`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-sprout" : "w-3 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {total > 1 && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-forest-deep/45 px-2.5 py-1 font-display text-[11px] font-semibold tracking-[0.12em] text-mist/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      )}

      {total > 0 && !current && (
        <p className="sr-only">{label}</p>
      )}
    </div>
  )
}
