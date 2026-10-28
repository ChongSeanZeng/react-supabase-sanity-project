import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { PageMeta } from "@/components/common/PageMeta";
import { Reveal } from "@/components/generated/Reveal";
import { SectionHead } from "@/components/generated/SectionHead";
import { PageBanner } from "@/components/generated/PageBanner";
import { ImageCarousel } from "@/components/generated/ImageCarousel";
import { trainingShowcaseImages } from "@/data/showcase";
import { GreenProductStandards } from "@/components/generated/GreenProductStandards";
import { FaLaptop, FaUsers, FaBookOpen, FaCertificate } from "react-icons/fa";
import { useLanguage } from "@/i18n";

const courses = [
{
  id: "eudr-training",
  icon: FaBookOpen,
  title: "EUDR 培训",
  tags: ["线上", "线下"],
  points: [
  "欧盟零毁林法规 EUDR 义务主体与时间线解读",
  "尽职调查声明 DDS 提交实操",
  "供应链追溯体系与地理坐标采集方案"]

},
{
  id: "fsc-auditor-training",
  icon: FaUsers,
  title: "FSC-COC 审核员培训课程",
  tags: ["与 Soil Association 合作"],
  points: [
  "对标国际认证机构审核员能力要求",
  "累计开设 15+ 场，培养 300+ 学员人次",
  "覆盖 FM 与 CoC 标准条款与审核技巧"]

},
{
  id: "online-courses",
  icon: FaLaptop,
  title: "企业线上公开课",
  tags: ["随报随学"],
  points: [
  "FSC CoC 产销监管链通用标准在线课程",
  "学习进度管理，支持企业全员培训",
  "适配认证企业年度监督培训要求"]

},
{
  id: "standard-training",
  icon: FaCertificate,
  title: "标准培训",
  tags: ["国内标准"],
  points: [
  "国内森林认证与林产品标准解读",
  "水性内墙涂料 CCC 认证流程辅导",
  "绿色产品认证与 QEO 三体系培训"]

}];


export default function Training() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta
        title="合规培训 - EUDR·FSC审核员课程 | 林扬东方"
        description="提供EUDR法规培训、FSC审核员培训课程、企业线上CoC公开课与国内标准培训，累计15+场培训、300+学员人次。"
        keywords={["EUDR培训", "FSC审核员培训", "CoC课程", "绿色产品认证培训"]} />


      <PageBanner
        eyebrow="Training"
        title="培训"
        desc="把法规与标准讲透，让团队具备自主合规的能力。"
        meta={[
        { value: "15+", label: "Sessions Delivered" },
        { value: "300+", label: "Trainees" }]
        }
        aside={
        <Reveal delay={120}>
            <ImageCarousel
            images={trainingShowcaseImages}
            label={t("培训课堂实景")}
            aspect="aspect-[4/3]"
            interval={2000} />

          </Reveal>
        } />

            <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead eyebrow="Courses" title="课程体系" desc="四类课程覆盖法规、审核能力与企业内训需求。" />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {courses.map((c, i) =>
          <Reveal key={c.title} delay={i % 2 * 80}>
              <div id={c.id} className="scroll-mt-32 flex h-full flex-col rounded-card border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-card bg-mist text-moss">
                    <c.icon className="text-xl" />
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {c.tags.map((tag) =>
                  <span
                    key={tag}
                    className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-forest">

                        {t(tag)}
                      </span>
                  )}
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-bold text-forest">{t(c.title)}</h3>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {c.points.map((point) =>
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-inksoft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sprout" />
                      {t(point)}
                    </li>
                )}
                </ul>
                <Link
                to="/contact"
                className="mt-6 inline-block self-start rounded-card border border-forest px-5 py-2.5 text-sm font-medium text-forest transition-colors duration-300 hover:bg-forest hover:text-white">

                  {t("报名咨询")}
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <GreenProductStandards />
    </>);

}