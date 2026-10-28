import { useCallback, useEffect, useRef, useState } from "react";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";
import { bannerSlides, bannerSettings } from "@/data/banners";
import { heroShowcaseImages } from "@/data/showcase";
import { ImageCarousel } from "@/components/generated/ImageCarousel";
import { useLanguage } from "@/i18n";
import { assetUrl } from "@/lib/assets";

export function HeroCarousel() {
  const { language, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);
  const total = bannerSlides.length;
  const current = bannerSlides[index];

  const go = useCallback(
    (next: number) => {
      setIndex((next % total + total) % total);
      setProgress(0);
    },
    [total]
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    const step = 50;
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        if (p + step >= bannerSettings.interval) {
          setIndex((i) => (i + 1) % total);
          return 0;
        }
        return p + step;
      });
    }, step);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  return (
    <section
      className={`group relative overflow-hidden bg-forest ${bannerSettings.height}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t("首页焦点图")}>

      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(115%_90%_at_18%_8%,#2D6A4F_0%,#1B4332_46%,#14352A_100%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.13] mix-blend-luminosity"
        style={{
          backgroundImage:
            `url(${assetUrl("/assets/forest-valley-map.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />

      {bannerSlides.map((s, i) =>
      <div
        key={s.id}
        className={`absolute inset-0 transition-opacity duration-500 ${
        i === index ? "opacity-100" : "pointer-events-none opacity-0"}`
        }
        aria-hidden={i !== index}>

          <img
          src={assetUrl(s.image)}
          alt={t(s.alt)}
          className={`h-full w-full object-cover ${
          i === index ? "animate-kenburns" : ""}`
          }
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async" />

          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/85 via-forest/55 to-transparent" />
        </div>
      )}

      <div className="relative mx-auto flex h-full max-w-[1200px] items-center gap-8 px-5 md:px-6 lg:gap-12">
        <div
          key={current.id}
          className="max-w-xl animate-fade-up lg:flex-1"
          role="group"
          aria-roledescription="slide"
          aria-label={language === "en" ? `Slide ${index + 1} of ${total}` : `第 ${index + 1} 张，共 ${total} 张`}>

          <span className="inline-flex items-center rounded-full border border-sprout/50 bg-forest-deep/40 px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-sprout">
            East Inflink
          </span>
          <h1 className="mt-4 max-w-lg font-display text-3xl font-bold leading-[1.18] tracking-[-0.02em] text-white md:text-[40px] md:leading-[1.2]">
            {t(current.title)}
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mist">{t(current.desc)}</p>
          {current.linkPath &&
          <Link
            to={current.linkPath}
            className="mt-6 inline-flex items-center gap-2 rounded-card bg-sprout px-6 py-3 text-[15px] font-semibold text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">

              {t(current.linkText ?? "")}
              <FaArrowRight className="text-xs" />
            </Link>
          }
        </div>
                <div className="relative hidden w-[480px] shrink-0 self-center py-6 lg:block xl:w-[540px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-5 inset-y-1 rounded-[24px] border border-white/10 bg-white/[0.05]" />

          <ImageCarousel
            images={heroShowcaseImages}
            label={t("公司实景展示")}
            aspect="aspect-[4/3]"
            interval={2000}
            rounded="rounded-[18px]" />

        </div>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label={t("上一张")}
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-forest-deep/40 text-white opacity-0 transition-all duration-300 hover:bg-forest-deep/70 focus-visible:opacity-100 group-hover:opacity-100 md:left-6">

                        <FaChevronLeft />
      </button>

      








      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 pb-5 md:px-6">
          <div className="flex items-center gap-2.5">
            {bannerSlides.map((s, i) =>
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={language === "en" ? `Go to slide ${i + 1}` : `切换到第 ${i + 1} 张`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-9 bg-sprout" : "w-4 bg-white/45 hover:bg-white/75"}`
              } />

            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-mist/85">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? t("继续播放") : t("暂停播放")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white/15">

              {paused ? <FaPlay className="text-[10px]" /> : <FaPause className="text-[10px]" />}
            </button>
          </div>
        </div>
        <div className="h-[3px] w-full bg-white/15">
          <div
            className="h-full bg-sprout transition-[width] duration-100 ease-linear"
            style={{ width: `${progress / bannerSettings.interval * 100}%` }} />

        </div>
      </div>
    </section>);

}