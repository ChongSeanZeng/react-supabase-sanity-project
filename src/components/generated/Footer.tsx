import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { useLanguage } from "@/i18n"
import { assetUrl } from "@/lib/assets";

const quickLinks = [
  { label: "关于我们", path: "/about" },
  { label: "可持续服务", path: "/sustainability" },
  { label: "培训", path: "/training" },
  { label: "符合性验证", labelEn: "Compliance Verification", path: "/verification" },
  { label: "合作伙伴", path: "/partners" },
  { label: "联系我们", path: "/contact" },
]

export function Footer() {
  const { language, t } = useLanguage()

  return (
    <footer className="bg-forest text-mist">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={assetUrl("/assets/logo.png")}
              alt={t("林扬绿创 LInk 标志")}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-white/25"
            />
            <span className="leading-tight">
              <span className="block text-[17px] font-bold text-white">East Inflink</span>
              <span className="block text-[11px] tracking-wide text-mist/80">{t("林扬东方（北京）科技有限公司")}</span>
              <span className="block text-[11px] tracking-wide text-mist/70">East Inflink Sci Tech Co., Ltd.</span>
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-mist/80">
            {t('专注进出口全链条合规与可持续发展，助力企业从"中国制造"走向"中国智造"。')}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sprout">{t("快速导航")}</h3>
          <ul className="mt-5 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="flex flex-col text-sm text-mist/85 transition-colors duration-300 hover:text-white hover:underline"
                >
                  {t(link.label)}
                  {language === "zh" && link.labelEn &&
                  <span data-no-translate className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-sprout/70 no-underline">
                      {t(link.labelEn)}
                    </span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sprout">{t("联系方式")}</h3>
          <ul className="mt-5 space-y-3 text-sm text-mist/85">
            <li className="flex items-start gap-2.5">
              <FaPhoneAlt className="mt-1 text-xs text-sprout" />
              <span>+86 (0)10 5094 3499 / +86 (0)185 1451 5612</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FaEnvelope className="mt-1 text-xs text-sprout" />
              <a href="mailto:east@inflink.cn" className="transition-colors hover:text-white">
                east@inflink.cn
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="mt-1 text-xs text-sprout" />
              <span>{t("北京经济技术开发区科创十四街99号院33号楼C733")}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sprout">{t("关注公众号")}</h3>
          <div className="mt-5 flex h-28 w-28 items-center justify-center rounded-card bg-white p-2">
            <img
              src={assetUrl("/assets/wechat-qr-footer.png")}
              alt={t("林扬东方公众号二维码")}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-xs text-mist/70">{t("扫码关注获取合规资讯")}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-5 py-6 md:px-6">
          {/* <p className="text-xs leading-relaxed text-mist/60">
            {t("FSC® 不对林扬东方（北京）科技有限公司所提供的任何培训、咨询或服务内容承担责任。")}
          </p> */}
          <p className="text-xs leading-relaxed text-mist/60">
            {t("本站使用 Cloudflare Web Analytics 进行无 Cookie 的匿名流量与性能统计，不收集个人隐私数据。")}
          </p>
          <p className="mt-2 text-xs text-mist/60">
            {t("© 2018-2026 林扬东方（北京）科技有限公司 East Inflink Sci Tech Co., Ltd. 版权所有")}
          </p>
        </div>
      </div>
    </footer>
  )
}
