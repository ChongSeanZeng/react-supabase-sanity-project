import { useState } from "react"
import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { PageMeta } from "@/components/common/PageMeta"
import { Reveal } from "@/components/generated/Reveal"
import { SectionHead } from "@/components/generated/SectionHead"
import { PageBanner } from "@/components/generated/PageBanner"
import { ImageCarousel } from "@/components/generated/ImageCarousel"
import { verificationShowcaseImages } from "@/data/showcase"
import { EudrCertificateSearch } from "@/components/generated/EudrCertificateSearch"
import { FaChevronDown } from "react-icons/fa"
import { useLanguage } from "@/i18n"

interface VerifyItem {
  code: string
  anchor: string
  name: string
  market: string
  summary: string
  details: string[]
  table?: { head: [string, string]; rows: [string, string][] }
}

const items: VerifyItem[] = [
  {
    code: "EUDR / EUTR / UKTR",
    anchor: "verification-eudr-eutr-uktr",
    name: "欧盟与英国零毁林及木材法规",
    market: "欧盟 / 英国",
    summary:
      "大中型企业自 2026 年 12 月 30 日、微小企业自 2027 年 6 月 30 日起执行 EUDR。我们提供采伐地地理坐标绘制、尽职调查体系落地与批次符合性验证。",
    details: [
      "采伐地地理坐标采集与绘制辅导",
      "尽职调查声明 DDS 体系搭建与验证",
      "按批次的产品符合性验证报告",
    ],
  },
  {
    code: "CE Marking",
    anchor: "verification-ce-marking",
    name: "欧盟 CE 标志符合性（CPR 建筑产品）",
    market: "欧盟",
    summary: "依据欧盟建筑产品法规 CPR，为建材出口企业提供 CE 标志符合性评估与文件审查服务。",
    details: ["工厂生产控制体系审查", "产品性能声明 DoP 文件核对", "CE 标志使用合规审查"],
  },
  {
    code: "REACH",
    anchor: "verification-reach",
    name: "欧盟 REACH 甲醛限制",
    market: "欧盟",
    summary:
      "2026 年 8 月 6 日起，人造板等木制品甲醛释放限值纳入 REACH 管控。提供限值符合性测试方案与供应链合规审查。",
    details: ["甲醛释放限值差距分析", "测试方案与实验室对接", "供应链物质信息收集辅导"],
    table: {
      head: ["产品类别", "甲醛释放限值"],
      rows: [
        ["人造板", "≤ 0.062 mg/m³"],
        ["其他木制品", "≤ 0.080 mg/m³"],
      ],
    },
  },
  {
    code: "CARB / EPA",
    anchor: "verification-carb-epa",
    name: "美国甲醛排放法规",
    market: "美国",
    summary: "依据 CARB ATCM 与美国 EPA TSCA Title VI，为复合木制品出口企业提供排放合规验证。",
    details: ["工厂合规体系审查", "季度测试计划核对", "出口批次标签与记录审查"],
    table: {
      head: ["板材类型", "甲醛排放限值"],
      rows: [
        ["硬木胶合板", "0.05 ppm"],
        ["刨花板", "0.09 ppm"],
        ["中密度纤维板", "0.11 ppm"],
        ["薄型中密度纤维板", "0.13 ppm"],
      ],
    },
  },
  {
    code: "GECA",
    anchor: "verification-geca",
    name: "澳大利亚生态标签认证",
    market: "澳大利亚",
    summary: "对接澳大利亚政府认可生态标签 GECA，协助产品进入澳洲绿色建筑采购清单。",
    details: ["GECA 标准差距分析", "认证申请文件辅导", "绿色采购合规咨询"],
  },
  {
    code: "JIS",
    anchor: "verification-jis",
    name: "日本工业标准符合性",
    market: "日本",
    summary: "面向出口日本市场的木制品与建材，提供 JIS 标准符合性评估与工厂管理审查。",
    details: ["JIS 产品标准解读", "工厂质量管理体系审查", "出口批次符合性验证"],
  },
]

export default function Verification() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(0)

  return (
    <>
      <PageMeta
        title="符合性验证 - EUDR·CE·REACH·CARB | 林扬东方"
        description="提供EUDR/EUTR/UKTR、CE Marking、REACH甲醛限制、CARB/EPA、GECA、JIS等欧美澳日市场准入符合性验证服务。"
        keywords={["EUDR验证", "CE认证", "REACH", "CARB", "GECA", "JIS"]}
      />

      <PageBanner
        eyebrow="Compliance Verification"
        title="符合性验证"
        desc="以审核视角验证产品与体系，覆盖欧美澳日主流市场准入法规。"
        meta={[
        { value: "6", label: "Market Regimes" },
        { value: "EU / US / AU / JP", label: "Coverage" }]
        }
        aside={
        <Reveal delay={120}>
            <ImageCarousel
              images={verificationShowcaseImages}
              label={t("符合性验证现场实景")}
              aspect="aspect-[4/3]"
              interval={2000} />

          </Reveal>
        } />

      <EudrCertificateSearch />

      <section id="verification-services" className="scroll-mt-32 mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead
            eyebrow="Market Access"
            title="验证服务"
            desc="点击展开查看法规要点、限值数据与服务内容。"
          />
        </Reveal>
        <div className="mt-12 space-y-4">
          {items.map((item, i) => (
            <Reveal key={item.code} delay={i * 60}>
              <div
                id={item.anchor}
                className={`scroll-mt-32 overflow-hidden rounded-card border bg-white transition-colors duration-300 ${
                  open === i ? "border-moss" : "border-line"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-8"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-forest md:text-xl">{item.code}</h3>
                      <span className="rounded-full bg-mist px-3 py-0.5 text-xs font-medium text-forest">
                        {t(item.market)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-inksoft">{t(item.name)}</p>
                  </div>
                  <FaChevronDown
                    className={`shrink-0 text-moss transition-transform duration-300 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <div className="border-t border-line px-6 py-6 md:px-8">
                    <p className="text-[15px] leading-relaxed text-inksoft">{t(item.summary)}</p>
                    <ul className="mt-5 grid gap-2.5 md:grid-cols-3">
                      {item.details.map((d) => (
                        <li
                          key={d}
                          className="rounded-card bg-mist/60 px-4 py-3 text-sm leading-relaxed text-forest"
                        >
                          {t(d)}
                        </li>
                      ))}
                    </ul>
                    {item.table && (
                      <div className="mt-6 overflow-x-auto rounded-card border border-line">
                        <table className="w-full min-w-[420px] text-left text-sm">
                          <thead>
                            <tr className="border-b border-line bg-mist/70">
                              <th className="px-5 py-3 font-semibold text-forest">{t(item.table.head[0])}</th>
                              <th className="px-5 py-3 font-semibold text-forest">{t(item.table.head[1])}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.table.rows.map((r, ri) => (
                              <tr
                                key={r[0]}
                                className={`border-b border-line/70 last:border-0 ${ri % 2 === 1 ? "bg-mist/40" : ""}`}
                              >
                                <td className="px-5 py-2.5 text-ink">{t(r[0])}</td>
                                <td className="px-5 py-2.5 font-medium text-forest">{r[1]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-14 rounded-card bg-forest px-8 py-10 text-center md:px-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t("评估我的产品合规路径")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-mist/85">
              {t("告诉我们您的产品与目标市场，合规顾问将给出分阶段的验证与认证建议。")}
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-block rounded-card bg-sprout px-8 py-3.5 text-[15px] font-semibold text-forest transition-colors duration-300 hover:bg-white"
            >
              {t("立即评估")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
