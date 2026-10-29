import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/components/learning/AuthProvider"
import { isValidInternationalPhoneNumber, normalizePhoneNumber } from "@/lib/phone"
import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { localizedPath } from "@/lib/localized-path"
import { useLanguage } from "@/i18n"

export function PhoneLogin({ admin = false }: { admin?: boolean }) {
  const {
    user,
    role,
    disabled,
    isPasswordSetupRequired,
    isPasswordRecovery,
    loading,
    error: authError,
    signInWithEmail,
    updatePassword,
    requestCode,
    verifyCode,
    signOut,
  } = useAuth()
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const invitationPhone = searchParams.get("phone")
  const normalizedInvitationPhone = normalizePhoneNumber(invitationPhone ?? "")
  const hasValidInvitationPhone = isValidInternationalPhoneNumber(normalizedInvitationPhone)
  const [method, setMethod] = useState<"email" | "phone">(hasValidInvitationPhone ? "phone" : "email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordFormOpen, setPasswordFormOpen] = useState(false)
  const [phone, setPhone] = useState(hasValidInvitationPhone ? normalizedInvitationPhone : "+86")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasValidInvitationPhone) return
    setPhone(normalizedInvitationPhone)
    setMethod("phone")
  }, [hasValidInvitationPhone, normalizedInvitationPhone])

  const onEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await signInWithEmail(email.trim(), password)
      navigate(localizedPath(admin ? "/admin" : "/courses", language), { replace: true })
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : t("邮箱认证失败。"))
    } finally {
      setBusy(false)
    }
  }

  const onUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    const wasPasswordRecovery = isPasswordRecovery
    const wasPasswordSetupRequired = isPasswordSetupRequired
    try {
      await updatePassword(newPassword)
      setNewPassword("")
      setPasswordFormOpen(false)
      setMessage(t(
        wasPasswordRecovery
          ? "密码已重置，请使用新密码登录。"
          : wasPasswordSetupRequired
            ? "密码设置成功，现在可以进入课程。"
            : "登录密码已设置。",
      ))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t("设置密码失败。"))
    } finally {
      setBusy(false)
    }
  }

  const onRequestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    const normalizedPhone = normalizePhoneNumber(phone)
    if (!isValidInternationalPhoneNumber(normalizedPhone)) {
      setError(t("请输入有效的国际格式手机号，例如 +8613800000000。"))
      return
    }
    setBusy(true)
    try {
      await requestCode(normalizedPhone)
      setCodeSent(true)
      setMessage(t("验证码已发送，请查看手机短信。"))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("验证码发送失败。"))
    } finally {
      setBusy(false)
    }
  }

  const onVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const normalizedPhone = normalizePhoneNumber(phone)
    if (!isValidInternationalPhoneNumber(normalizedPhone)) {
      setError(t("请输入有效的国际格式手机号，例如 +8613800000000。"))
      return
    }
    setBusy(true)
    try {
      await verifyCode(normalizedPhone, code.trim())
      navigate(localizedPath(admin ? "/admin" : "/courses", language), { replace: true })
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : t("验证码验证失败。"))
    } finally {
      setBusy(false)
    }
  }

  const passwordForm = (
    <form className="space-y-3" onSubmit={onUpdatePassword}>
      <label className="block text-sm font-medium text-forest" htmlFor={isPasswordRecovery ? "recovery-new-password" : "new-password"}>
        {t("新密码（至少 8 位）")}
        <input
          autoComplete="new-password"
          className="mt-2 w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-moss"
          id={isPasswordRecovery ? "recovery-new-password" : "new-password"}
          maxLength={128}
          minLength={8}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          type="password"
          value={newPassword}
        />
      </label>
      <button className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} type="submit">
        {busy
          ? t("请稍候…")
          : isPasswordRecovery
            ? t("重置密码")
            : isPasswordSetupRequired
              ? t("设置密码并继续")
              : t("保存密码")}
      </button>
    </form>
  )

  if (loading) return <p className="text-sm text-inksoft">{t("正在检查登录状态…")}</p>
  if (user) {
    if (isPasswordRecovery) {
      return (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-forest">{t("重置登录密码")}</h2>
          <p className="text-sm text-inksoft">{t("请输入新密码（至少 8 位）。")}</p>
          {passwordForm}
          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
          {authError ? <p role="alert" className="text-sm text-red-700">{authError}</p> : null}
        </div>
      )
    }
    if (disabled) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-red-700">{t("此账号已停用，无法登录课程。请联系管理员。")}</p>
          <button
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest"
            onClick={() => void signOut().catch((signOutError: Error) => setError(signOutError.message))}
            type="button"
          >
            {t("退出登录")}
          </button>
          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        </div>
      )
    }
    if (isPasswordSetupRequired) {
      return (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-forest">{t("设置登录密码")}</h2>
          <p className="text-sm text-inksoft">{t("首次进入课程前，请先设置登录密码（至少 8 位）。")}</p>
          {passwordForm}
          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
          {authError ? <p role="alert" className="text-sm text-red-700">{authError}</p> : null}
        </div>
      )
    }
    return (
      <div className="space-y-3">
        <p className="text-sm text-inksoft">
          {t("当前登录账号：")}{user.email ?? user.phone}（{t(role === "admin" ? "管理员" : role === "student" ? "学员" : "角色尚未加载")}）
        </p>
        {admin && role !== "admin" ? (
          <p className="text-sm text-red-700">{t("该账号尚未获得管理员权限，请联系项目管理员配置角色。")}</p>
        ) : null}
        {authError ? <p role="alert" className="text-sm text-red-700">{authError}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white"
            to={admin && role === "admin" ? "/admin" : "/courses"}
          >
            {t(admin && role === "admin" ? "打开管理后台" : "进入课程")}
          </Link>
          <button
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest"
            onClick={() => void signOut().catch((signOutError: Error) => setError(signOutError.message))}
            type="button"
          >
            {t("退出登录")}
          </button>
        </div>
        {user.email ? (
          <div className="border-t border-line pt-3">
            <button
              className="text-sm text-moss underline"
              onClick={() => setPasswordFormOpen(!passwordFormOpen)}
              type="button"
            >
              {t(passwordFormOpen ? "取消设置密码" : "设置或更改登录密码")}
            </button>
            {passwordFormOpen ? <div className="mt-3">{passwordForm}</div> : null}
          </div>
        ) : null}
        {message ? <p role="status" className="text-sm text-forest">{message}</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div aria-label={t("选择登录方式")} className="grid grid-cols-2 rounded-lg bg-mist p-1" role="tablist">
        <button
          aria-selected={method === "email"}
          className={`rounded-md px-3 py-2 text-sm font-semibold ${method === "email" ? "bg-white text-forest shadow-sm" : "text-inksoft"}`}
          onClick={() => { setMethod("email"); setError(null); setMessage(null) }}
          role="tab"
          type="button"
        >
          {t("邮箱和密码")}
        </button>
        <button
          aria-selected={method === "phone"}
          className={`rounded-md px-3 py-2 text-sm font-semibold ${method === "phone" ? "bg-white text-forest shadow-sm" : "text-inksoft"}`}
          onClick={() => { setMethod("phone"); setError(null); setMessage(null) }}
          role="tab"
          type="button"
        >
          {t("手机验证码")}
        </button>
      </div>
      {method === "email" ? (
        <form className="space-y-4" onSubmit={onEmailSubmit}>
          <label className="block text-sm font-medium text-forest" htmlFor="email">
            {t("邮箱")}
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-moss"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium text-forest" htmlFor="password">
            {t("密码")}
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-moss"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          <button
            className="w-full rounded-lg bg-forest px-5 py-3 font-semibold text-white disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? t("请稍候…") : t("邮箱登录")}
          </button>
        </form>
      ) : !codeSent ? (
        <form className="space-y-4" onSubmit={onRequestCode}>
          <label className="block text-sm font-medium text-forest" htmlFor="phone">
            {t("手机号（含国家区号）")}
            <input
              autoComplete="tel"
              className="mt-2 w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-moss"
              id="phone"
              onChange={(event) => setPhone(event.target.value)}
              required
              type="tel"
              value={phone}
            />
          </label>
          <button
            className="w-full rounded-lg bg-forest px-5 py-3 font-semibold text-white disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? t("正在发送…") : t("发送短信验证码")}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onVerifyCode}>
          <p className="text-sm text-inksoft">
            {language === "en" ? `A verification code was sent to ${phone}.` : `验证码已发送至 ${phone}。`}
          </p>
          <label className="block text-sm font-medium text-forest" htmlFor="otp">
            {t("短信验证码")}
            <input
              autoComplete="one-time-code"
              className="mt-2 w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-moss"
              id="otp"
              inputMode="numeric"
              onChange={(event) => setCode(event.target.value)}
              required
              value={code}
            />
          </label>
          <button
            className="w-full rounded-lg bg-forest px-5 py-3 font-semibold text-white disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? t("正在验证…") : t("验证并登录")}
          </button>
          <button
            className="w-full text-sm text-moss underline"
            onClick={() => {
              setCodeSent(false)
              setCode("")
            }}
            type="button"
          >
            {t("更换手机号")}
          </button>
        </form>
      )}
      {message ? <p className="text-sm text-forest">{message}</p> : null}
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    </div>
  )
}
