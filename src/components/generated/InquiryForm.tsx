import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa"
import { inquiryTypes } from "@/data/content"
import { useLanguage } from "@/i18n"

interface InquiryFormProps {
  compact?: boolean
  defaultType?: string
}

const inputClass =
  "w-full rounded-card border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-inksoft/60 outline-none transition-colors duration-300 focus:border-moss focus:ring-2 focus:ring-sprout/30"

export function InquiryForm({ compact = false, defaultType = "" }: InquiryFormProps) {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [country, setCountry] = useState("")
  const [type, setType] = useState(defaultType || inquiryTypes[0])
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      toast.error(t("咨询表单暂未配置，请直接联系 east@inflink.cn"))
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: name.trim(),
          email: email.trim(),
          phone: telephone.trim(),
          subject: `${t("网站咨询 - ")}${t(type)}`,
          message: [
            `${t("需求类型：")}${t(type)}`,
            company.trim() && `${t("公司：")}${company.trim()}`,
            telephone.trim() && `${t("电话：")}${telephone.trim()}`,
            country.trim() && `${t("国家 / 地区：")}${country.trim()}`,
            message.trim() && `${t("留言：")}${message.trim()}`,
          ].filter(Boolean).join("\n"),
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.success) throw new Error("Web3Forms request failed")

      setDone(true)
      toast.success(t("提交成功，我们将尽快与您联系"))
    } catch {
      toast.error(t("提交失败，请稍后重试或直接邮件联系 east@inflink.cn"))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-white px-6 py-12 text-center">
        <FaCheckCircle className="text-4xl text-moss" />
        <p className="text-lg font-semibold text-forest">{t("咨询已提交")}</p>
        <p className="max-w-sm text-sm leading-relaxed text-inksoft">
          {t("感谢您的信任，我们的合规顾问将在 1 个工作日内通过邮箱与您联系。")}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-name">
            {t("姓名 *")}
          </label>
          <input
            id="inq-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("您的姓名")}
            required
          />
        </div>
        {!compact && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-company">
              {t("公司")}
            </label>
            <input
              id="inq-company"
              className={inputClass}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t("公司名称")}
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-email">
            {t("邮箱 *")}
          </label>
          <input
            id="inq-email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </div>
        {!compact && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-telephone">
              {t("电话（可选）")}
            </label>
            <input
              id="inq-telephone"
              type="tel"
              autoComplete="tel"
              className={inputClass}
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder={t("请输入电话号码")}
            />
          </div>
        )}
        {!compact && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-country">
              {t("国家 / 地区")}
            </label>
            <input
              id="inq-country"
              className={inputClass}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t("如 Germany")}
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-type">
            {t("需求类型")}
          </label>
          <select
            id="inq-type"
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {inquiryTypes.map((inquiryType) => (
              <option key={inquiryType} value={inquiryType}>
                {t(inquiryType)}
              </option>
            ))}
          </select>
        </div>
        {!compact && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-message">
              {t("留言")}
            </label>
            <textarea
              id="inq-message"
              rows={4}
              className={inputClass}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("请简述您的产品、目标市场与合规需求")}
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-card bg-forest px-7 py-3 text-[15px] font-medium text-white transition-all duration-300 hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaPaperPlane className="text-xs" />
        {submitting ? t("发送中…") : t("提交咨询")}
      </button>
    </form>
  )
}
