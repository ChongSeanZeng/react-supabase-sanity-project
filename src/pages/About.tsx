import { useEffect, useState } from "react";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { PageMeta } from "@/components/common/PageMeta";
import { Reveal } from "@/components/generated/Reveal";
import { SectionHead } from "@/components/generated/SectionHead";
import { PageBanner } from "@/components/generated/PageBanner";
import { teamMembers } from "@/data/content";
import { TeamAvatar } from "@/components/generated/TeamAvatar";
import { QualificationWall } from "@/components/generated/QualificationWall";
import { useLanguage } from "@/i18n";
import { translations } from "@/translations";
import { assetUrl } from "@/lib/assets";
import { sanityClient } from "@/lib/sanity";

interface AboutTeamMember {
  key: string;
  name: string;
  nameEn: string;
  title: string;
  titleZh: string;
  years: string;
  yearsEn: string;
  bio: string;
  bioEn: string;
  avatar: string;
}

interface SanityTeamMember {
  _key: string;
  nameZh?: string;
  nameEn?: string;
  titleZh?: string;
  titleEn?: string;
  experienceZh?: string;
  experienceEn?: string;
  bioZh?: string;
  bioEn?: string;
  avatarUrl?: string;
  legacyAvatarUrl?: string;
}

const teamContentQuery = `*[_type == "teamContent" && _id == "team-content"][0]{members[]{_key, nameZh, nameEn, titleZh, titleEn, experienceZh, experienceEn, bioZh, bioEn, "avatarUrl": avatar.asset->url, legacyAvatarUrl}}`;

function optimizedSanityAvatar(url: string): string {
  if (!url.startsWith("https://cdn.sanity.io/images/")) return url;

  const imageUrl = new URL(url);
  imageUrl.searchParams.set("w", "256");
  imageUrl.searchParams.set("h", "256");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("auto", "format");
  return imageUrl.toString();
}

export default function About() {
  const { language, t } = useLanguage();
  const [team, setTeam] = useState<AboutTeamMember[]>(() =>
    teamMembers.map((member, index) => ({
      key: `fallback-${index}`,
      name: member.name,
      nameEn: member.name,
      title: member.title,
      titleZh: member.nameEn,
      years: member.years,
      yearsEn: translations[member.years] ?? member.years,
      bio: member.bio,
      bioEn: member.bioEn,
      avatar: member.avatar,
    })),
  );

  useEffect(() => {
    if (!sanityClient) return;

    let active = true;
    void sanityClient
      .fetch<{ members?: SanityTeamMember[] } | null>(teamContentQuery)
      .then((content) => {
        if (!active || !content?.members?.length) return;
        setTeam(
          content.members.map((member, index) => {
            const fallback = teamMembers[index];
            return {
              key: member._key,
              name: member.nameZh || fallback?.name || "",
              nameEn: member.nameEn || fallback?.name || "",
              title: member.titleEn || fallback?.title || "",
              titleZh: member.titleZh || fallback?.nameEn || "",
              years: member.experienceZh || fallback?.years || "",
              yearsEn: member.experienceEn || (fallback ? translations[fallback.years] ?? fallback.years : ""),
              bio: member.bioZh || fallback?.bio || "",
              bioEn: member.bioEn || fallback?.bioEn || "",
              avatar: optimizedSanityAvatar(
                member.avatarUrl || member.legacyAvatarUrl || fallback?.avatar || "",
              ),
            };
          }),
        );
      })
      .catch((error: unknown) => {
        console.warn("Unable to load the team content from Sanity; showing the local team content.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageMeta
        title="关于我们 - 林扬东方 East Inflink 团队与资质"
        description="林扬东方成立于2018年，团队拥有10年以上国际认证机构检查员经验，持有FSC宣传许可等资质，提供可持续发展与进出口合规服务。"
        keywords={["林扬东方", "公司介绍", "FSC许可", "合规团队"]} />


      <PageBanner
        eyebrow="Who We Are"
        title="我们是谁"
        desc="专业团队提供服务"
        meta={[
        { value: "2018", label: "Founded" },
        { value: "9", label: "Core Experts" },
        { value: "500+", label: "Clients Served" }]
        } />

      <section id="company-profile" className="scroll-mt-32 mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold text-forest md:text-4xl">{t("公司简介")}</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-inksoft">
              {t("林扬东方（北京）科技有限公司成立于 2018 年，专注进出口全链条合规与可持续发展服务。我们为森林经营单位、木制品与建材制造商、进出口贸易商提供森林认证、气候碳管理、合规培训与多市场符合性验证服务。")}
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-inksoft">
              {t("团队核心成员人均拥有 10 年以上国际认证机构检查员、审核员与技术经理经验，累计服务 500+ 合规客户。我们相信，合规不是贸易的门槛，而是企业走向全球市场的通行证。")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={assetUrl("/assets/about-company-team.jpg")}
              alt={t("林扬东方团队工作场景")}
              className="w-full rounded-card object-cover"
              loading="lazy" />

          </Reveal>
        </div>
      </section>

      <section id="team" className="scroll-mt-32 bg-mist/60">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
          <Reveal>
            <SectionHead eyebrow="East Inflink's Team" title="林扬团队" desc="" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) =>
            <Reveal key={m.key} delay={i % 3 * 80}>
                <div className="flex h-full flex-col rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(27,67,50,0.12)]">
                  <div className="flex items-center gap-4">
                    <TeamAvatar name={m.name} src={m.avatar} size={64} />

                    <div>
                      <h3 className="text-lg font-bold text-forest">{language === "en" ? m.nameEn : m.name}</h3>
                      <p className="mt-0.5 text-sm font-medium text-moss">
                        {language === "en" ? m.title : m.titleZh}
                      </p>
                      {language === "zh" && <p className="text-xs text-inksoft/70">{m.title}</p>}
                    </div>
                  </div>
                  <span className="mt-4 inline-block self-start rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-forest">
                    {language === "en" ? m.yearsEn : m.years}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-inksoft">
                    {language === "en" ? m.bioEn : m.bio}
                  </p>
                  


                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section id="credentials" className="scroll-mt-32 mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <SectionHead
            eyebrow="Qualifications"
            title="资质与授权"
            desc="FSC® N002971 宣传许可与公司资质授权文件，权威资质是专业能力的底线。" />

        </Reveal>
        <QualificationWall />
        <Reveal delay={100}>
          <div className="mt-14 text-center">
            <Link
              to="/contact"
              className="inline-block rounded-card bg-forest px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-moss">

              {t("与专家对话")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>);

}