import { useState } from "react"
import { FaLeaf, FaSearch } from "react-icons/fa"
import { Reveal } from "@/components/generated/Reveal"
import { SectionHead } from "@/components/generated/SectionHead"
import { greenProductStandards } from "@/data/content"
import { useLanguage } from "@/i18n"
import { assetUrl } from "@/lib/assets"

export function GreenProductStandards() {
  const { t } = useLanguage()
  const [keyword, setKeyword] = useState("")

  const list = greenProductStandards
    .map((s, i) => ({ ...s, order: i + 1 }))
    .filter((s) => t(s.name).toLowerCase().includes(keyword.trim().toLowerCase()))

  return (
    <section id="green-product-standards" className="scroll-mt-32 bg-mist/60">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead
            eyebrow="Green Product Standards"
            title="绿色产品认证标准目录"
            desc={t("提供绿色产品认证标准解读、认证辅导与培训服务。")}
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-inksoft">
              <FaLeaf className="text-moss" />
              {t("共")} <span className="font-bold text-forest">{greenProductStandards.length}</span> {t("项标准")}
            </div>
            <div className="relative w-full sm:w-72">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-moss" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t("搜索产品类别，如：涂料")}
                className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-inksoft/60 focus:border-moss"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((s, i) => (
            <Reveal key={s.name} delay={(i % 4) * 70}>
              <div className="group h-full overflow-hidden rounded-card border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-moss hover:shadow-[0_14px_30px_rgba(27,67,50,0.14)]">
                <div className="relative aspect-[3/2] overflow-hidden bg-mist">
                  <img
                    src={assetUrl(s.image)}
                    alt={t(s.name)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-forest-deep/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {String(s.order).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3.5">
                  <FaLeaf className="shrink-0 text-xs text-sprout" />
                  <h3 className="text-sm font-bold leading-snug text-forest">{t(s.name)}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-10 rounded-card border border-dashed border-line bg-white py-12 text-center text-sm text-inksoft">
            {t("未找到匹配的产品类别，请尝试其他关键词。")}
          </p>
        )}

        <Reveal delay={120}>
          <p className="mt-8 text-center text-xs leading-relaxed text-inksoft/70">
            {t("以上标准目录用于说明培训与辅导覆盖范围，具体认证要求以现行有效标准文本为准。")}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
