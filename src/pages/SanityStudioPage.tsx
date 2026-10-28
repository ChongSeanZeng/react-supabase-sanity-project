import { Studio } from "sanity"
import { useLanguage } from "@/i18n"
import { sanityConfig } from "@/sanity/config"
import { sanityProjectId } from "@/sanity/environment"

export default function SanityStudioPage() {
  const { t } = useLanguage()

  if (!sanityProjectId) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-5 py-16">
        <div className="max-w-xl rounded-card border border-line bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-forest">{t("Sanity 尚未配置")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-inksoft">
            {t("请在部署环境中设置 VITE_SANITY_PROJECT_ID 和 VITE_SANITY_DATASET，然后重新构建网站。")}
          </p>
        </div>
      </main>
    )
  }

  return <div className="min-h-screen"><Studio config={sanityConfig} /></div>
}
