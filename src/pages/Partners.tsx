import { PageMeta } from "@/components/common/PageMeta"
import { Reveal } from "@/components/generated/Reveal"
import { SectionHead } from "@/components/generated/SectionHead"
import { PageBanner } from "@/components/generated/PageBanner"
import { clientLogosImage, partners } from "@/data/content"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useLanguage } from "@/i18n"
import { assetUrl } from "@/lib/assets"

export default function Partners() {
  const { t } = useLanguage()

  return (
    <>
      <PageMeta
        title="合作伙伴与客户 - 林扬东方 East Inflink"
        description="林扬东方与FSC、WWF、PEFC、Soil Association、MPA、KBS等国际权威机构长期合作，服务500+合规客户。"
        keywords={["FSC合作", "WWF", "PEFC", "Soil Association", "合规客户"]}
      />

      <PageBanner
        eyebrow="Partners"
        title="合作伙伴"
        desc="与国际权威可持续机构并肩，把全球标准带入中国供应链。"
        meta={[
        { value: "6+", label: "Global Institutions" },
        { value: "500+", label: "Clients Served" }]
        } />

      <section id="institutions" className="scroll-mt-32 mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead eyebrow="Institutions" title="全球合作" desc="点击图标可访问合作方官网" />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((p, i) => (
              <Reveal key={p.name} delay={(i % 4) * 70}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-mist/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <FaExternalLinkAlt className="absolute right-5 top-5 text-xs text-inksoft/40 transition-colors duration-300 group-hover:text-moss" />
                  <div className="relative">
                    <p data-no-translate className="text-2xl font-bold text-forest">{p.name}</p>
                    <p data-no-translate className="mt-3 text-sm leading-relaxed text-inksoft">{p.full}</p>
                  </div>
                  <span className="relative mt-6 inline-block h-[2px] w-10 bg-sprout transition-all duration-300 group-hover:w-16" />
                </a>
              </Reveal>
            ))}
        </div>
      </section>

      <section id="clients" className="scroll-mt-32 bg-mist/60">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
          <Reveal>
            <SectionHead
              eyebrow="Clients"
              title="服务客户"
              desc="500+ 合规客户，覆盖木制品、建材、家具、造纸与大宗商品贸易行业。"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="group overflow-hidden rounded-card border border-line bg-white p-6 shadow-[0_8px_24px_rgba(27,67,50,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(27,67,50,0.14)] md:p-10">
              <img
                src={assetUrl(clientLogosImage)}
                alt={t("林扬东方服务客户 Logo 墙")}
                className="mx-auto h-auto w-full max-w-[1000px] object-contain opacity-90 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-center text-sm text-inksoft/80">
              {t("客户覆盖木制品、建材、家具、造纸与大宗商品贸易等行业，部分客户 Logo 经授权展示。")}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
