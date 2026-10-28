import { useEffect, useRef, useState } from "react"
import { milestones } from "@/data/content"
import { useLanguage } from "@/i18n"

export function MilestoneTimeline() {
  const { language, t } = useLanguage()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh * 0.4
      const passed = vh * 0.8 - rect.top
      const ratio = Math.min(Math.max(passed / total, 0), 1)
      setProgress(ratio)
      setActive(Math.min(Math.floor(ratio * milestones.length), milestones.length - 1))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative mt-10">
      <div className="absolute left-[19px] top-0 h-full w-px bg-white/15 md:left-1/2 md:-translate-x-1/2">
        <span
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-sprout to-moss transition-[height] duration-200 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      <div className="space-y-5 md:space-y-1">
        {milestones.map((m, i) => {
          const right = i % 2 === 1
          const reached = progress * milestones.length > i
          return (
            <div
              key={m.year}
              className={`relative flex items-start gap-5 pl-0 md:min-h-[150px] md:w-1/2 md:gap-10 ${
                right ? "md:ml-auto md:flex-row md:pl-10" : "md:pr-10 md:flex-row-reverse md:text-right"
              }`}
            >
              <span
                className={`relative z-10 mt-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500 md:absolute md:top-6 md:mt-0 ${
                  right
                    ? "md:-left-[calc(1.25rem+1px)]"
                    : "md:-right-[calc(1.25rem+1px)]"
                } ${
                  reached
                    ? "border-sprout bg-sprout text-forest-deep shadow-[0_0_0_6px_rgba(116,198,157,0.18)]"
                    : "border-white/25 bg-forest-deep text-white/60"
                }`}
              >
                {m.year.slice(2)}
              </span>

              <div
                className={`flex-1 rounded-card border bg-white/[0.06] p-5 backdrop-blur-sm transition-all duration-500 md:mt-0 ${
                  reached
                    ? "translate-y-0 border-white/20 opacity-100"
                    : "translate-y-6 border-white/10 opacity-40"
                }`}
              >
                <p className="text-sm font-semibold tracking-[0.2em] text-sprout">{m.year}</p>
                <h3 className="mt-1.5 text-lg font-bold text-white">{t(m.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist/80">{t(m.desc)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-xs text-mist/60">
        <span className="h-1.5 w-1.5 rounded-full bg-sprout" />
        {language === "en"
          ? `Showing ${active + 1} of ${milestones.length} milestones`
          : `已展示 ${active + 1} / ${milestones.length} 个发展节点`}
      </div>
    </div>
  )
}
