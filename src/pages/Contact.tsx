import { PageMeta } from "@/components/common/PageMeta";
import { Reveal } from "@/components/generated/Reveal";
import { SectionHead } from "@/components/generated/SectionHead";
import { PageBanner } from "@/components/generated/PageBanner";
import { InquiryForm } from "@/components/generated/InquiryForm";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWeixin } from "react-icons/fa";
import { useLanguage } from "@/i18n";
import { assetUrl } from "@/lib/assets";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <>
      <PageMeta
        title="联系我们 - 咨询可持续发展与合规服务 | 林扬东方"
        description="联系林扬东方（北京）科技有限公司，获取森林认证、合规培训与符合性验证咨询。电话+86(0)10 5094 3499，邮箱east@inflink.cn。"
        keywords={["联系林扬东方", "合规咨询", "认证咨询"]} />


      <PageBanner
        eyebrow="Contact"
        title="联系我们"
        desc="留下需求，合规顾问将在 1 个工作日内回复。"
        meta={[
        { value: "+86 (0)10 5094 3499", label: "Phone" },
        { value: "east@inflink.cn", label: "Email" }]
        } />

      <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-24">
        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div id="contact-form" className="scroll-mt-32 rounded-card border border-line bg-white p-8 md:p-10">
              <h2 className="text-2xl font-bold text-forest">{t("联系我们")}</h2>
              <p className="mt-2 text-sm text-inksoft">{t("带 * 为必填项，提交后我们将通过邮箱与您联系。")}</p>
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-2">
            <div className="space-y-6">
              <div id="contact-details" className="scroll-mt-32 rounded-card border border-line bg-white p-7">
                <h3 className="text-lg font-bold text-forest">{t("联系方式")}</h3>
                <ul className="mt-5 space-y-4 text-sm text-inksoft">
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-mist text-moss">
                      <FaPhoneAlt className="text-xs" />
                    </span>
                    <span className="pt-2">+86 (0)10 5094 3499<br />+86 (0)185 1451 5612</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-mist text-moss">
                      <FaEnvelope className="text-xs" />
                    </span>
                    <a href="mailto:east@inflink.cn" className="pt-2 transition-colors hover:text-forest">
                      east@inflink.cn
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-mist text-moss">
                      <FaMapMarkerAlt className="text-xs" />
                    </span>
                    <span className="pt-2">{t("北京经济技术开发区科创十四街99号院33号楼C733")}</span>
                  </li>
                </ul>
              </div>

              <div id="wechat" className="scroll-mt-32 rounded-card border border-line bg-white p-7">
                <h3 className="flex items-center gap-2 text-lg font-bold text-forest">
                  <FaWeixin className="text-moss" />
                  {t("关注公众号")}
                </h3>
                <div className="mt-5 flex h-40 w-40 items-center justify-center rounded-card border border-line bg-paper p-2">
                  <img
                    src={assetUrl("/assets/wechat-qr-footer.png")}
                    alt={t("林扬东方公众号二维码")}
                    className="h-full w-full object-cover"
                    loading="lazy" />

                </div>
                <p className="mt-4 text-sm leading-relaxed text-inksoft">
                  {t("扫码关注，获取 EUDR、FSC 等法规动态与培训开课信息。")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>);

}