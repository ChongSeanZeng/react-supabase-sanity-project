import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { PhoneLogin } from "@/components/learning/PhoneLogin"
import { PageMeta } from "@/components/common/PageMeta"
import { useLanguage } from "@/i18n"

export default function Login() {
  const { t } = useLanguage()

  return (
    <>
      <PageMeta title="学员登录 | 林扬东方课程" description="通过邮箱密码或手机号验证码登录林扬东方在线课程。" />
      <main className="mx-auto max-w-lg px-5 py-16 md:py-24">
        <div className="rounded-2xl border border-line bg-white p-7 shadow-sm md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Learner portal</p>
          <h1 className="mt-3 text-3xl font-bold text-forest">{t("学员登录")}</h1>
          <p className="mt-3 text-sm leading-7 text-inksoft">{t("可以先用邮箱和密码测试登录；也可使用手机号验证码登录，进入课程后查看学习进度和考试成绩。")}</p>
          <div className="mt-7"><PhoneLogin /></div>
          <p className="mt-6 text-xs leading-6 text-inksoft">
            {t("本课程仅接受管理员邀请的学员账号。管理员请前往")}{" "}
            <Link className="text-moss underline" to="/admin">{t("管理后台")}</Link>{t("。")}
          </p>
        </div>
      </main>
    </>
  )
}
