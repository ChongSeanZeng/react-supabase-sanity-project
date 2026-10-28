import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { PageMeta } from "@/components/common/PageMeta"
import { Reveal } from "@/components/generated/Reveal"
import { SectionHead } from "@/components/generated/SectionHead"
import { PageBanner } from "@/components/generated/PageBanner"
import { ImageCarousel } from "@/components/generated/ImageCarousel"
import { forestryShowcaseImages } from "@/data/showcase"
import { FaTree, FaSeedling, FaCloud, FaRecycle, FaHandsHelping, FaExternalLinkAlt } from "react-icons/fa"
import { useLanguage } from "@/i18n"

const anchors = [
  { id: "forest", label: "森林认证" },
  { id: "forestry", label: "林业咨询" },
  { id: "climate", label: "气候" },
  { id: "circular", label: "循环经济" },
  { id: "esg", label: "ESG" },
]

const forestCerts = [
  {
    code: "FSC FM",
    name: "森林经营认证",
    desc: "面向森林经营单位，依据 FSC 原则与标准评估森林管理的经济、社会与环境表现。",
  },
  {
    code: "FSC CoC",
    name: "产销监管链认证",
    desc: "面向加工与贸易企业，建立从原料采购到销售标识的全流程监管链管理体系。",
  },
  {
    code: "PEFC",
    name: "PEFC 认证",
    desc: "对接国际森林认证认可体系，服务出口欧洲市场的林产品供应链企业。",
  },
  {
    code: "CFCC",
    name: "中国森林认证",
    desc: "依据中国森林认证体系标准，支持国内森林经营与林产品产销监管链建设。",
  },
]

const climateItems = [
  { code: "ISCC", desc: "国际可持续发展与碳认证，覆盖生物质与循环经济供应链。", url: "https://www.iscc-system.org/" },
  { code: "EPD", desc: "国际环境产品声明，量化产品全生命周期环境影响。", url: "https://www.environdec.com/" },
  { code: "VCS / Verra", desc: "核证碳标准，支持碳信用项目开发与管理。", url: "https://verra.org/" },
  { code: "GCC", desc: "全球碳委员会标准，服务碳减排项目注册与签发。", url: "https://www.globalcarboncouncil.com/" },
]

export default function Sustainability() {
  const { t } = useLanguage()

  return (
    <>
      <PageMeta
        title="可持续服务 - 森林认证·气候·循环经济 | 林扬东方"
        description="提供FSC FM/CoC、PEFC、CFCC森林认证，WWF-FSC可持续项目林业咨询，ISCC、EPD、VCS气候碳管理，PPWR循环经济与ESG服务。"
        keywords={["FSC认证", "PEFC", "CFCC", "ISCC", "EPD", "VCS", "PPWR", "ESG"]}
      />

      <PageBanner
        eyebrow="Sustainability"
        title="可持续项目"
        desc="从森林经营到产品声明，构建可验证的可持续供应链。"
        meta={[
        { value: "5", label: "Service Lines" },
        { value: "FSC / PEFC / CFCC", label: "Certification" }]
        } />

      <div className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur md:top-[72px]">
        <div className="mx-auto flex max-w-[1200px] gap-2 overflow-x-auto px-5 py-3 md:px-6">
          {anchors.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="shrink-0 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-inksoft transition-colors duration-300 hover:border-moss hover:bg-forest hover:text-white"
            >
              {t(a.label)}
            </a>
          ))}
        </div>
      </div>

      <section id="forest" className="mx-auto max-w-[1200px] scroll-mt-32 px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead
            eyebrow="Forest Certification"
            title="森林认证"
            desc="森林认证（FSC、PEFC、CFCC）是林扬的核心业务，已助力500+客户实现合规化进出口。我们将合规转化为企业战略基石，支持市场准入与可持续发展。 随着中国企业全球化布局，我们的服务已从中国本土扩展至东南亚、欧洲及非洲市场，推动客户从“Made in China”迈向“Made by Chinese”，建立可持续的全球竞争优势。"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {forestCerts.map((c, i) => (
            <Reveal key={c.code} delay={(i % 2) * 80}>
              <div className="h-full rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]">
                <span className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-sm font-bold text-forest">
                  <FaTree className="text-xs text-moss" />
                  {c.code}
                </span>
                <h3 className="mt-4 text-xl font-bold text-forest">{t(c.name)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-inksoft">{t(c.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="forestry" className="scroll-mt-32 bg-mist/60">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHead
                eyebrow="Forestry Industrial Consulting"
                title="林业咨询"
                desc="连接负责任供应链上下游，推动可持续林业项目落地。"
              />
              <div className="mt-8 space-y-5">
                <div className="rounded-card border border-line bg-white p-6">
                  <h3 className="flex items-center gap-2 font-bold text-forest">
                    <FaSeedling className="text-moss" />
                    {t("WWF-FSC 可持续项目")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-inksoft">
                    {t("参与世界自然基金会与 FSC 联合推动的可持续林业项目，协助企业与森林经营单位建立负责任采购关系。")}
                  </p>
                </div>
                <div className="rounded-card border border-line bg-white p-6">
                  <h3 className="flex items-center gap-2 font-bold text-forest">
                    <FaHandsHelping className="text-moss" />
                    {t("需求对接 Match-Making")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-inksoft">
                    {t("组织 FSC 供需对接会，为认证林地资源与采购需求搭建直接沟通桥梁。")}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ImageCarousel
                images={forestryShowcaseImages}
                label="林业咨询项目实景"
                aspect="aspect-[3/2]"
                interval={2000}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="climate" className="mx-auto max-w-[1200px] scroll-mt-32 px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead
            eyebrow="Climate"
            title="气候变化与碳管理"
            desc="以国际标准量化与披露产品碳足迹，回应全球买家气候要求。"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {climateItems.map((c, i) => (
            <Reveal key={c.code} delay={i * 80}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.code} official website (opens in a new tab)`}
                className="block h-full rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-card bg-mist text-moss">
                    <FaCloud className="text-lg" />
                  </span>
                  <FaExternalLinkAlt aria-hidden="true" className="mt-1 text-xs text-inksoft/50" />
                </div>
                <h3 className="mt-4 font-bold text-forest">{c.code}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inksoft">{t(c.desc)}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="circular" className="scroll-mt-32 bg-mist/60">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 md:px-6 md:py-24 lg:grid-cols-2">
          <Reveal>
            <SectionHead
              eyebrow="Circular Economy"
              title="循环经济"
              desc="PPWR 欧盟包装与包装废弃物法规合规服务。"
            />
            <p className="mt-6 text-[15px] leading-relaxed text-inksoft">
              {t("针对出口欧盟的包装与带包装产品，提供 PPWR 法规解读、可回收性设计评估、再生材料含量核算与标识合规审查，帮助企业提前满足欧盟包装新规要求。")}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-card bg-white px-4 py-2 text-sm font-medium text-forest">
              <FaRecycle className="text-moss" />
              {t("PPWR 合规评估")}
            </span>
          </Reveal>
          <Reveal delay={120} className="lg:pt-10">
            <div id="esg" className="scroll-mt-40 rounded-card border border-line bg-white p-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-moss">ESG</p>
              <h3 className="mt-3 text-2xl font-bold text-forest">{t("企业责任与 ESG 框架")}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">
                {t("协助企业梳理环境、社会与治理议题，对标国际买家 ESG 问卷与披露要求，将可持续实践转化为可沟通的商业语言。")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-14 text-center md:px-6">
        <Reveal>
          <p className="text-lg font-medium text-forest">{t("不确定哪项认证适合您的产品？")}</p>
          <Link
            to="/contact"
            className="mt-5 inline-block rounded-card bg-forest px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-moss"
          >
            {t("咨询该服务")}
          </Link>
        </Reveal>
      </section>
    </>
  )
}
