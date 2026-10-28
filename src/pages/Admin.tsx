import { useCallback, useEffect, useState } from "react"
import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { PageMeta } from "@/components/common/PageMeta"
import { RequireAuth } from "@/components/learning/RequireAuth"
import { PhoneLogin } from "@/components/learning/PhoneLogin"
import { useAuth } from "@/components/learning/AuthProvider"
import { supabase } from "@/lib/supabase"
import { isValidInternationalPhoneNumber, normalizePhoneNumber } from "@/lib/phone"

interface ProfileRow {
  id: string
  email: string | null
  phone: string | null
  display_name: string | null
  role: string
  auth_confirmed_at: string | null
  disabled_at: string | null
  created_at: string
}

interface AttemptSummary {
  id: string
  student_id: string
  score: number | null
  status: "submitted" | "reviewed"
  created_at: string
}

interface AttemptRow extends AttemptSummary {
  answers: Record<string, string>
  feedback: string | null
}

interface AttemptTarget {
  id: string
  studentId: string
}

type AccountFilter = "all" | "active" | "pending" | "disabled"

function isAnswerRecord(value: unknown): value is Record<string, string> {
  return typeof value === "object"
    && value !== null
    && !Array.isArray(value)
    && Object.values(value).every((answer) => typeof answer === "string")
}

interface CertificateRow {
  student_id: string
  course_slug: string
}

function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [attempts, setAttempts] = useState<AttemptSummary[]>([])
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptRow | null>(null)
  const [attemptTarget, setAttemptTarget] = useState<AttemptTarget | null>(null)
  const [attemptScore, setAttemptScore] = useState("")
  const [attemptFeedback, setAttemptFeedback] = useState("")
  const [attemptLoading, setAttemptLoading] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ProfileRow | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [studentActionBusy, setStudentActionBusy] = useState(false)
  const [certificates, setCertificates] = useState<CertificateRow[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [inviteEmail, setInviteEmail] = useState("")
  const [invitePhone, setInvitePhone] = useState("+86")
  const [inviteName, setInviteName] = useState("")
  const [inviting, setInviting] = useState(false)
  const [studentSearch, setStudentSearch] = useState("")
  const [accountFilter, setAccountFilter] = useState<AccountFilter>("all")
  const [gradingFilter, setGradingFilter] = useState<"all" | "none" | "pending" | "reviewed">("all")
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    if (!supabase) return
    setBusy(true)
    setError(null)
    const [profileResult, attemptResult, certificateResult] = await Promise.all([
      supabase.from("profiles").select("id, email, phone, display_name, role, auth_confirmed_at, disabled_at, created_at").order("created_at", { ascending: false }),
      supabase.from("exam_attempts").select("id, student_id, score, status, created_at").order("created_at", { ascending: false }),
      supabase.from("certificates").select("student_id, course_slug").eq("course_slug", "fsc-coc"),
    ])
    if (profileResult.error || attemptResult.error || certificateResult.error) {
      setError(profileResult.error?.message ?? attemptResult.error?.message ?? certificateResult.error?.message ?? "无法加载管理数据。")
      setBusy(false)
      return
    }
    const nextProfiles = profileResult.data ?? []
    const nextAttempts = attemptResult.data ?? []
    setProfiles(nextProfiles)
    setAttempts(nextAttempts)
    setCertificates(certificateResult.data ?? [])
    setNames(Object.fromEntries(nextProfiles.map((profile) => [profile.id, profile.display_name ?? profile.email ?? profile.phone ?? profile.id])))
    setBusy(false)
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (!supabase || !attemptTarget) return
    let active = true
    setAttemptLoading(true)
    setSelectedAttempt(null)
    setError(null)
    void (async () => {
      try {
        const { data, error: attemptError } = await supabase
          .from("exam_attempts")
          .select("id, student_id, answers, score, status, created_at, feedback")
          .eq("id", attemptTarget.id)
          .eq("student_id", attemptTarget.studentId)
          .maybeSingle()
        if (!active) return
        if (attemptError) {
          setError(`无法读取该学员的答卷：${attemptError.message}`)
          setAttemptTarget(null)
          return
        }
        if (!data) {
          setError("该学员答卷不存在或已被删除。")
          setAttemptTarget(null)
          return
        }
        if (!isAnswerRecord(data.answers)) {
          setError("该学员答卷内容格式无效，无法显示。")
          setAttemptTarget(null)
          return
        }
        setSelectedAttempt({
          ...data,
          answers: data.answers,
        })
        setAttemptScore(String(data.score ?? ""))
        setAttemptFeedback(data.feedback ?? "")
      } catch (attemptError) {
        if (active) setError(attemptError instanceof Error ? attemptError.message : "读取学员答卷失败。")
      } finally {
        if (active) setAttemptLoading(false)
      }
    })()
    return () => { active = false }
  }, [attemptTarget])

  const openAttempt = (attempt: AttemptSummary) => {
    setAttemptTarget({ id: attempt.id, studentId: attempt.student_id })
  }

  const closeAttempt = () => {
    setAttemptTarget(null)
    setSelectedAttempt(null)
    setAttemptScore("")
    setAttemptFeedback("")
  }

  const openProfileEditor = (profile: ProfileRow) => {
    setEditingProfile(profile)
    setEditName(profile.display_name ?? "")
    setEditEmail(profile.email ?? "")
    setEditPhone(profile.phone ?? "")
  }

  const manageStudent = async (body: Record<string, string | boolean | null>) => {
    if (!supabase) return false
    setStudentActionBusy(true)
    setError(null)
    setNotice(null)
    try {
      const { data, error: manageError } = await supabase.functions.invoke("manage-student", { body })
      if (manageError) {
        let message = manageError.message
        if ("context" in manageError && manageError.context instanceof Response) {
          try {
            const responseBody: unknown = await manageError.context.clone().json()
            if (
              responseBody
              && typeof responseBody === "object"
              && "error" in responseBody
              && typeof responseBody.error === "string"
            ) {
              message = responseBody.error
            }
          } catch {
            // Keep the Functions SDK error if the response does not contain JSON.
          }
        }
        setError(message)
        return false
      }
      if (data?.updated !== true) {
        setError(typeof data?.error === "string" ? data.error : "学员信息更新失败。")
        return false
      }
      return true
    } catch (manageError) {
      setError(manageError instanceof Error ? manageError.message : "学员管理操作失败。")
      return false
    } finally {
      setStudentActionBusy(false)
    }
  }

  const saveStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingProfile) return
    const email = editEmail.trim().toLowerCase()
    const phone = normalizePhoneNumber(editPhone)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址。")
      return
    }
    if (phone && !isValidInternationalPhoneNumber(phone)) {
      setError("请输入有效的国际格式手机号，例如 +8613800000000。")
      return
    }
    if (!email && !phone) {
      setError("学员至少需要保留邮箱或手机号中的一项。")
      return
    }
    const updated = await manageStudent({
      action: "update",
      studentId: editingProfile.id,
      displayName: editName.trim(),
      email: email || null,
      phone: phone || null,
    })
    if (!updated) return
    setEditingProfile(null)
    setNotice("学员资料已更新。邮箱或手机号变更后，学员可能需要完成新的验证。")
    await loadDashboard()
  }

  const toggleStudentActive = async (profile: ProfileRow) => {
    const active = Boolean(profile.disabled_at)
    if (!active && !window.confirm(`确定停用「${profile.display_name || profile.email || profile.phone || "该学员"}」吗？停用后将无法登录，答卷和证书数据会保留。`)) {
      return
    }
    const updated = await manageStudent({
      action: "set-active",
      studentId: profile.id,
      active,
    })
    if (!updated) return
    setNotice(active ? "学员账号已恢复。" : "学员账号已停用，相关数据已保留。")
    await loadDashboard()
  }

  const inviteStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    const email = inviteEmail.trim()
    const normalizedPhone = normalizePhoneNumber(invitePhone)
    const phone = normalizedPhone === "+86" ? "" : normalizedPhone
    if (Boolean(email) === Boolean(phone)) {
      setError("请填写邮箱或手机号，二者只能选择一项。")
      return
    }
    if (phone && !isValidInternationalPhoneNumber(phone)) {
      setError("请输入有效的国际格式手机号，例如 +8613800000000。")
      return
    }
    setInviting(true)
    setError(null)
    setNotice(null)
    try {
      const { data, error: inviteError } = await supabase.functions.invoke("invite-student", {
        body: { email: email || null, phone: phone || null, displayName: inviteName.trim() },
      })
      if (inviteError) {
        let message = inviteError.message
        if ("context" in inviteError && inviteError.context instanceof Response) {
          try {
            const responseBody: unknown = await inviteError.context.clone().json()
            if (
              responseBody
              && typeof responseBody === "object"
              && "error" in responseBody
              && typeof responseBody.error === "string"
            ) {
              message = responseBody.error
            }
          } catch {
            // Keep the Functions SDK error if the response does not contain JSON.
          }
        }
        setError(message)
        return
      }
      if (data?.invited !== true) {
        setError(typeof data?.error === "string" ? data.error : "邀请未能发送。")
        return
      }
      setNotice(data.method === "phone"
        ? `手机号 ${phone} 的学员账号已创建。学员可使用该手机号接收验证码并登录。`
        : `Supabase 已接受发往 ${email} 的邀请请求。若未收到邮件，请检查垃圾邮件并确认 Supabase Auth SMTP 配置。`)
      setInviteEmail("")
      setInvitePhone("+86")
      setInviteName("")
      await loadDashboard()
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "邀请学员失败。")
    } finally {
      setInviting(false)
    }
  }

  const saveGrade = async () => {
    if (!supabase || !selectedAttempt) return
    const score = Number(attemptScore)
    if (!Number.isInteger(score) || score < 0 || score > 14) {
      setError("分数必须是 0 到 14 之间的整数。")
      return
    }
    setError(null)
    setNotice(null)
    const { error: gradeError } = await supabase
      .from("exam_attempts")
      .update({
        score,
        feedback: attemptFeedback.trim() || null,
        status: "reviewed",
        graded_by: user?.id,
        graded_at: new Date().toISOString(),
      })
      .eq("id", selectedAttempt.id)
      .eq("student_id", selectedAttempt.student_id)
    if (gradeError) {
      setError(gradeError.message)
      return
    }
    setNotice("评分已保存。")
    setSelectedAttempt({
      ...selectedAttempt,
      score,
      status: "reviewed",
      feedback: attemptFeedback.trim() || null,
    })
    await loadDashboard()
  }

  const issueCertificate = async (studentId: string) => {
    if (!supabase || !user) return
    const certificateNumber = `FSC-COC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    const { error: issueError } = await supabase.from("certificates").insert({
      student_id: studentId,
      course_slug: "fsc-coc",
      certificate_number: certificateNumber,
      issued_by: user.id,
    })
    if (issueError) {
      setError(issueError.message)
      return
    }
    setNotice(`证书已登记，证书编号：${certificateNumber}`)
    await loadDashboard()
  }

  const pendingCount = attempts.filter((attempt) => attempt.status === "submitted").length
  const latestAttemptByStudent = new Map<string, AttemptSummary>()
  for (const attempt of attempts) {
    if (!latestAttemptByStudent.has(attempt.student_id)) latestAttemptByStudent.set(attempt.student_id, attempt)
  }
  const normalizedSearch = studentSearch.trim().toLocaleLowerCase()
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = !normalizedSearch || [
      profile.display_name,
      profile.email,
      profile.phone,
    ].some((value) => value?.toLocaleLowerCase().includes(normalizedSearch))
    const matchesAccount = accountFilter === "all"
      || (accountFilter === "disabled"
        ? Boolean(profile.disabled_at)
        : !profile.disabled_at && (accountFilter === "active" ? Boolean(profile.auth_confirmed_at) : !profile.auth_confirmed_at))
    const attempt = latestAttemptByStudent.get(profile.id)
    const matchesGrading = gradingFilter === "all"
      || (gradingFilter === "none" && !attempt)
      || (gradingFilter === "pending" && attempt?.status === "submitted")
      || (gradingFilter === "reviewed" && attempt?.status === "reviewed")
    return matchesSearch && matchesAccount && matchesGrading
  })
  const passedCount = attempts.filter((attempt) => attempt.status === "reviewed" && (attempt.score ?? 0) >= 10).length
  const averageScore = attempts.filter((attempt) => attempt.score !== null)
  const meanScore = averageScore.length
    ? (averageScore.reduce((total, attempt) => total + (attempt.score ?? 0), 0) / averageScore.length).toFixed(1)
    : "—"
  const onSignOut = async () => {
    try {
      await signOut()
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "退出登录失败。")
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 md:px-6 md:py-16">
      <PageMeta title="课程管理后台 | 林扬东方" description="学员、考试批阅和在线课程数据分析。" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-forest">课程管理后台</h1>
          <p className="mt-2 text-sm text-inksoft">学员管理、人工批阅与课程数据分析。</p>
        </div>
        <div className="flex gap-3">
          <Link className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest" to="/studio">课程内容管理</Link>
          <button className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white" onClick={() => void onSignOut()} type="button">退出</button>
        </div>
      </div>
      {error ? <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p> : null}
      {notice ? <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p> : null}

      <section aria-label="课程数据分析" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["学员总数", profiles.filter((profile) => profile.role === "student").length],
          ["提交待批阅", pendingCount],
          ["已评分考试", averageScore.length],
          ["平均分 / 通过数", `${meanScore} / ${passedCount}`],
        ].map(([label, value]) => (
          <div className="rounded-xl border border-line bg-white p-5" key={label}>
            <p className="text-sm text-inksoft">{label}</p>
            <p className="mt-2 text-2xl font-bold text-forest">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-forest">学员管理</h2>
            <p className="mt-1 text-sm text-inksoft">此课程为邀请制；学员不能自行创建账号。</p>
          </div>
        </div>
        <form className="mt-4 grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={inviteStudent}>
          <label className="text-sm font-medium text-forest" htmlFor="invite-email">
            学员邮箱（二选一）
            <input autoComplete="email" className="mt-1 w-full rounded-lg border border-line px-3 py-2" id="invite-email" onChange={(event) => setInviteEmail(event.target.value)} type="email" value={inviteEmail} />
          </label>
          <label className="text-sm font-medium text-forest" htmlFor="invite-phone">
            学员手机号（二选一）
            <input autoComplete="tel" className="mt-1 w-full rounded-lg border border-line px-3 py-2" id="invite-phone" onChange={(event) => setInvitePhone(event.target.value)} type="tel" value={invitePhone} />
          </label>
          <label className="text-sm font-medium text-forest" htmlFor="invite-name">
            学员姓名（选填）
            <input className="mt-1 w-full rounded-lg border border-line px-3 py-2" id="invite-name" onChange={(event) => setInviteName(event.target.value)} value={inviteName} />
          </label>
          <button className="self-end rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60" disabled={inviting} type="submit">
            {inviting ? "正在发送…" : "邀请学员"}
          </button>
          <p className="text-xs leading-5 text-inksoft md:col-span-4">邮箱和手机号填写其中一项。邮箱学员通过邀请邮件激活；手机号学员可在账号创建后使用短信验证码登录。</p>
        </form>
        <div className="mt-4 grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[minmax(220px,1fr)_auto_auto]">
          <label className="text-sm font-medium text-forest" htmlFor="student-search">
            搜索学员
            <input
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              id="student-search"
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="姓名、邮箱或手机号"
              type="search"
              value={studentSearch}
            />
          </label>
          <label className="text-sm font-medium text-forest" htmlFor="account-filter">
            账号状态
            <select
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              id="account-filter"
              onChange={(event) => setAccountFilter(event.target.value as typeof accountFilter)}
              value={accountFilter}
            >
              <option value="all">全部账号</option>
              <option value="active">已激活</option>
              <option value="pending">待验证</option>
              <option value="disabled">已停用</option>
            </select>
          </label>
          <label className="text-sm font-medium text-forest" htmlFor="grading-filter">
            阅卷状态
            <select
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              id="grading-filter"
              onChange={(event) => setGradingFilter(event.target.value as typeof gradingFilter)}
              value={gradingFilter}
            >
              <option value="all">全部答卷状态</option>
              <option value="none">未提交</option>
              <option value="pending">待批阅</option>
              <option value="reviewed">已评分</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm text-inksoft">显示 {filteredProfiles.length} / {profiles.length} 位学员</p>
        {busy ? <p className="mt-4 text-sm text-inksoft">正在加载…</p> : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-mist text-forest"><tr><th className="p-3">学员</th><th className="p-3">邮箱</th><th className="p-3">手机号</th><th className="p-3">账号状态</th><th className="p-3">阅卷状态</th><th className="p-3">角色</th><th className="p-3">创建时间</th><th className="p-3">操作</th></tr></thead>
              <tbody>{filteredProfiles.map((profile) => (
                <tr className="border-t border-line" key={profile.id}>
                  <td className="p-3">{profile.display_name || "未设置"}</td><td className="p-3">{profile.email || "—"}</td><td className="p-3">{profile.phone || "—"}</td>
                  <td className="p-3">{profile.disabled_at ? "已停用" : profile.auth_confirmed_at ? "已激活" : "待验证"}</td>
                  <td className="p-3">
                    {(() => {
                      const attempt = latestAttemptByStudent.get(profile.id)
                      if (!attempt) return <span className="text-inksoft">未提交</span>
                      return (
                        <button
                          className="font-semibold text-moss underline underline-offset-2"
                          onClick={() => openAttempt(attempt)}
                          type="button"
                        >
                          {attempt.status === "reviewed" ? `已评分 · ${attempt.score}/14` : "待批阅 · 前往阅卷"}
                        </button>
                      )
                    })()}
                  </td>
                  <td className="p-3">{profile.role === "admin" ? "管理员" : "学员"}</td><td className="p-3">{new Date(profile.created_at).toLocaleDateString("zh-CN")}</td>
                  <td className="p-3">
                    {profile.role === "student" ? (
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button className="font-semibold text-moss underline underline-offset-2" onClick={() => openProfileEditor(profile)} type="button">编辑</button>
                        <button
                          className="font-semibold text-red-700 underline underline-offset-2 disabled:opacity-50"
                          disabled={studentActionBusy}
                          onClick={() => void toggleStudentActive(profile)}
                          type="button"
                        >
                          {profile.disabled_at ? "恢复" : "停用"}
                        </button>
                      </div>
                    ) : <span className="text-inksoft">—</span>}
                  </td>
                </tr>
              ))}</tbody>
            </table>
            {filteredProfiles.length === 0 ? <p className="p-5 text-sm text-inksoft">没有符合搜索或筛选条件的学员。</p> : null}
          </div>
        )}
      </section>

      {editingProfile ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingProfile(null)}
          role="presentation"
        >
          <section
            aria-labelledby="student-edit-title"
            aria-modal="true"
            className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl md:p-7"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest" id="student-edit-title">编辑学员资料</h2>
                <p className="mt-1 break-all text-xs text-inksoft">用户 ID：{editingProfile.id}</p>
              </div>
              <button className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-forest" onClick={() => setEditingProfile(null)} type="button">关闭</button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={(event) => void saveStudent(event)}>
              <label className="block text-sm font-medium text-forest" htmlFor="edit-student-name">
                姓名
                <input autoComplete="name" className="mt-1 w-full rounded-lg border border-line px-3 py-2" id="edit-student-name" maxLength={100} onChange={(event) => setEditName(event.target.value)} value={editName} />
              </label>
              <label className="block text-sm font-medium text-forest" htmlFor="edit-student-email">
                邮箱
                <input autoComplete="email" className="mt-1 w-full rounded-lg border border-line px-3 py-2" id="edit-student-email" onChange={(event) => setEditEmail(event.target.value)} type="email" value={editEmail} />
              </label>
              <label className="block text-sm font-medium text-forest" htmlFor="edit-student-phone">
                手机号（国际格式）
                <input autoComplete="tel" className="mt-1 w-full rounded-lg border border-line px-3 py-2" id="edit-student-phone" onChange={(event) => setEditPhone(event.target.value)} type="tel" value={editPhone} />
              </label>
              <p className="text-xs leading-5 text-inksoft">至少保留邮箱或手机号中的一项。留空表示不修改现有联系方式；更改联系方式后，学员可能需要重新验证。</p>
              <div className="flex justify-end gap-3">
                <button className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest" onClick={() => setEditingProfile(null)} type="button">取消</button>
                <button className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={studentActionBusy} type="submit">{studentActionBusy ? "保存中…" : "保存修改"}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {attemptTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeAttempt}
          role="presentation"
        >
          <section
            aria-labelledby="grading-dialog-title"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl md:p-7"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest" id="grading-dialog-title">FSC CoC 考试阅卷</h2>
                {selectedAttempt ? (
                  <p className="mt-1 text-sm text-inksoft">
                    {names[selectedAttempt.student_id] ?? "学员"} · {new Date(selectedAttempt.created_at).toLocaleString("zh-CN")}
                  </p>
                ) : null}
              </div>
              <button
                aria-label="关闭阅卷"
                className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-forest"
                onClick={closeAttempt}
                type="button"
              >
                关闭
              </button>
            </div>
            {attemptLoading ? <p className="mt-6 text-sm text-inksoft">正在加载该学员答卷…</p> : null}
            {selectedAttempt ? (
              <>
                <span className="mt-3 inline-block text-sm font-semibold text-moss">
                  {selectedAttempt.status === "reviewed" ? `已评分 · ${selectedAttempt.score}/14` : "待批阅"}
                </span>
                <ol className="mt-5 space-y-4">
                  {Object.entries(selectedAttempt.answers).map(([question, answer]) => (
                    <li className="text-sm" key={question}>
                      <p className="font-semibold text-forest">{question}</p>
                      <p className="mt-1 whitespace-pre-wrap text-inksoft">{answer || "（未作答）"}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 grid gap-3 md:grid-cols-[150px_1fr_auto]">
                  <label className="text-sm text-forest">总分（满分 14）
                    <input
                      className="mt-1 w-full rounded-lg border border-line px-3 py-2"
                      inputMode="numeric"
                      max={14}
                      min={0}
                      onChange={(event) => setAttemptScore(event.target.value)}
                      type="number"
                      value={attemptScore}
                    />
                  </label>
                  <label className="text-sm text-forest">批阅意见
                    <input
                      className="mt-1 w-full rounded-lg border border-line px-3 py-2"
                      onChange={(event) => setAttemptFeedback(event.target.value)}
                      value={attemptFeedback}
                    />
                  </label>
                  <button
                    className="self-end rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => void saveGrade()}
                    type="button"
                  >
                    保存评分
                  </button>
                </div>
                {selectedAttempt.status === "reviewed" && (selectedAttempt.score ?? 0) >= 10 ? (
                  <div className="mt-4">
                    {certificates.some((certificate) => certificate.student_id === selectedAttempt.student_id) ? (
                      <p className="text-sm font-semibold text-forest">该学员的课程证书已登记。</p>
                    ) : (
                      <button
                        className="rounded-lg border border-moss px-4 py-2 text-sm font-semibold text-forest"
                        onClick={() => void issueCertificate(selectedAttempt.student_id)}
                        type="button"
                      >
                        登记并签发证书
                      </button>
                    )}
                    <p className="mt-2 text-xs text-inksoft">通过分数为 10/14。签发记录仅管理员和对应学员可见；纸质/正式证书由管理员线下完成。</p>
                  </div>
                ) : <p className="mt-3 text-xs text-inksoft">考试满分 14 分，通过分数为 10 分；通过后可由管理员登记并签发证书。</p>}
              </>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default function Admin() {
  const { user, role } = useAuth()
  return (
    <>
      <PageMeta title="管理员登录 | 林扬东方课程" description="林扬东方在线课程管理员入口。" />
      {!user || role !== "admin" ? (
        <main className="mx-auto max-w-lg px-5 py-16 md:py-24">
          <div className="rounded-2xl border border-line bg-white p-7 shadow-sm md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Admin access</p>
            <h1 className="mt-3 text-3xl font-bold text-forest">管理员入口</h1>
            <p className="mt-3 text-sm leading-7 text-inksoft">管理员可用邮箱密码或已授权手机号登录。账号还必须由 Supabase 管理员授予管理员角色。</p>
            <div className="mt-7"><PhoneLogin admin /></div>
          </div>
        </main>
      ) : (
        <RequireAuth role="admin"><AdminDashboard /></RequireAuth>
      )}
    </>
  )
}
