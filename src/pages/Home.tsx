import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { PageMeta } from "@/components/common/PageMeta";
import { Reveal, CountUp } from "@/components/generated/Reveal";
import { SectionHead } from "@/components/generated/SectionHead";
import { InquiryForm } from "@/components/generated/InquiryForm";
import { HeroCarousel } from "@/components/generated/HeroCarousel";
import { ImageCarousel } from "@/components/generated/ImageCarousel";
import { aboutShowcaseImages } from "@/data/showcase";
import { MilestoneTimeline } from "@/components/generated/MilestoneTimeline";
import { useLanguage } from "@/i18n";
import {
  FaTree,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaComments,
  FaArrowRight,
  FaNewspaper,
  FaBolt,
  FaHandshake,
  FaCoins,
  FaGlobeAsia } from
"react-icons/fa";

const services = [
{
  icon: FaTree,
  title: "可持续项目",
  en: "Sustainability",
  desc: "FSC / PEFC / CFCC 森林认证，气候碳管理与循环经济、ESG 全链条服务。",
  path: "/sustainability"
},
{
  icon: FaChalkboardTeacher,
  title: "合规培训",
  en: "Training",
  desc: "EUDR、FSC 审核员课程与企业线上公开课，15+ 场培训、300+ 学员人次。",
  path: "/training"
},
{
  icon: FaShieldAlt,
  title: "符合性验证",
  en: "Compliance Verification",
  desc: "EUDR / CE / REACH / CARB / GECA / JIS 多市场准入验证与尽职调查。",
  path: "/verification"
},
{
  icon: FaComments,
  title: "产业咨询",
  en: "Consulting",
  desc: "林业咨询、WWF-FSC 可持续项目与供需对接，连接全球负责任供应链。",
  path: "/sustainability"
}];


const advantages = [
{
  icon: FaBolt,
  title: "快速响应",
  desc: "扁平化项目小组制，需求 24 小时内响应，关键节点专人跟进。"
},
{
  icon: FaHandshake,
  title: "可靠交付",
  desc: "核心成员均为前国际认证机构检查员，交付流程对标审核标准。"
},
{
  icon: FaCoins,
  title: "成本优化",
  desc: "以供应链视角规划认证路径，避免重复审核与无效投入。"
},
{
  icon: FaGlobeAsia,
  title: "全球视野",
  desc: "跟踪欧盟、美国、澳洲、日本法规动态，提前布局合规方案。"
}];


const stats = [
{ end: 500, suffix: "+", label: "合规客户" },
{ end: 15, suffix: "+", label: "场专业培训" },
{ end: 300, suffix: "+", label: "学员人次" },
{ end: 10, suffix: "+", label: "年行业深耕" }];


export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta
        title="林扬东方 East Inflink - 可持续发展与进出口合规认证服务"
        description="林扬东方（北京）科技有限公司提供森林认证、气候碳管理、合规培训与符合性验证等全链条可持续发展服务，助力企业全球市场准入。"
        keywords={["森林认证", "FSC认证", "EUDR", "可持续发展", "进出口合规"]} />


      <HeroCarousel />

      <section className="bg-forest-deep">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 md:grid-cols-4 md:px-6">
          {stats.map((s, i) =>
          <Reveal key={s.label} delay={i * 100} className="text-center">
              <p className="text-4xl font-bold text-sprout md:text-5xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-mist/85">{t(s.label)}</p>
            </Reveal>
          )}
        </div>
      </section>

      <section id="core-services" className="scroll-mt-32 mx-auto max-w-[1200px] px-5 py-14 md:px-6 md:py-16">
        <Reveal>
          <SectionHead
            eyebrow="Our Services"
            title="四大核心服务"
            desc="覆盖可持续发展与市场准入的关键环节，一个伙伴解决全链条合规需求。" />

        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) =>
          <Reveal key={s.title} delay={i * 80}>
              <Link
              to={s.path}
              className="group flex h-full flex-col rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.14)]">

                <span className="flex h-11 w-11 items-center justify-center rounded-card bg-mist text-moss transition-colors duration-300 group-hover:bg-forest group-hover:text-sprout">
                  <s.icon className="text-lg" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-forest">{t(s.title)}</h3>
                <p data-no-translate className="mt-1 text-xs uppercase tracking-[0.12em] text-inksoft/70">{s.en}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-inksoft">{t(s.desc)}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-moss">
                  {t("了解更多")}
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          )}
        </div>
        <Reveal delay={160}>
          <a
            href="https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU2Mzg0MzgwMw==&action=getalbum&album_id=4730107550820761601"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 flex flex-col gap-5 rounded-card border border-line bg-mist/50 p-6 transition-all duration-300 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.10)] sm:flex-row sm:items-center sm:gap-8 md:px-10"
          >
            <FaNewspaper aria-hidden="true" className="shrink-0 text-xl text-moss" />
            <div className="flex-1">
              <h3 className="font-bold text-forest">{t("了解更多林扬观点")}</h3>
              <p className="mt-1 text-sm leading-relaxed text-inksoft">
                {t("合规解读、认证动态与行业观察，全部收录在林扬观点专栏，点击查看新闻列表。")}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-card bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-moss sm:self-auto">
              {t("查看新闻列表")}
              <FaArrowRight aria-hidden="true" className="text-xs transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </Reveal>
      </section>

      <section id="about-summary" className="scroll-mt-32 mx-auto max-w-[1200px] px-5 py-14 md:px-6 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <Reveal>
            <SectionHead
              eyebrow="Who We Are"
              title="懂国际标准，更懂中国供应链"
              desc="林扬东方（北京）科技有限公司成立于 2018 年，团队核心成员均拥有 10 年以上国际认证机构检查员与审核员经验，服务网络覆盖森林经营单位与木制品、建材、家具、造纸等制造行业。" />

            <Link
              to="/about"
              className="mt-6 inline-block rounded-card border border-forest px-6 py-2.5 text-[15px] font-medium text-forest transition-colors duration-300 hover:bg-forest hover:text-white">

              {t("认识我们")}
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <ImageCarousel
              images={aboutShowcaseImages}
              label="公司团队与项目实景"
              aspect="aspect-[4/3]"
              interval={2000} />

          </Reveal>
        </div>
      </section>

      <section id="advantages" className="scroll-mt-32 border-t border-line bg-mist/40">
        <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-6 md:py-16">
          <Reveal>
            <SectionHead
              eyebrow="Advantages"
              title="公司优势"
              desc="审核视角、国际网络与供应链经验，让合规落地更高效。" />

          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a, i) =>
            <Reveal key={a.title} delay={i * 80}>
                <div className="h-full rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.10)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-card bg-mist text-moss">
                    <a.icon className="text-lg" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-forest">{t(a.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-inksoft">{t(a.desc)}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section id="milestones" className="scroll-mt-32 bg-forest-deep">
        <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-6 md:py-16">
          <Reveal>
            <SectionHead
              light
              eyebrow="Milestones"
              title="发展历程"
              desc="从 2018 年创立到可持续全链条服务矩阵，每一步都围绕合规与生态价值展开。" />

          </Reveal>
          <MilestoneTimeline />
        </div>
      </section>

      <section id="home-inquiry" className="scroll-mt-32 bg-mist">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-14 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          <Reveal>
            <SectionHead
              eyebrow="Get In Touch"
              title="需要合规支持？"
              desc="留下您的联系方式与需求类型，合规顾问将在 1 个工作日内回复。" />

          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-card border border-line bg-white p-6 shadow-[0_10px_30px_rgba(27,67,50,0.08)]">
              <InquiryForm compact />
            </div>
          </Reveal>
        </div>
      </section>
    </>);

}