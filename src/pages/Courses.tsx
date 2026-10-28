import { useEffect, useState } from "react"
import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { FaBookOpen, FaPlayCircle } from "react-icons/fa"
import { PageMeta } from "@/components/common/PageMeta"
import { RequireAuth } from "@/components/learning/RequireAuth"
import { useAuth } from "@/components/learning/AuthProvider"
import { AliyunVideoPlayer, preloadAliPlayer } from "@/components/learning/AliyunVideoPlayer"
import { sanityClient } from "@/lib/sanity"
import { supabase } from "@/lib/supabase"
import { fscCocCourseDescription, fscCocCourseTitle, fscCocCurriculum } from "@/data/fscCocCurriculum"
import { fscCocVideoAssets, getFscCocVideoUrl } from "@/data/fscCocVideoAssets"

const fallbackLessons = fscCocCurriculum.map((lesson, index) => ({
  _key: `lesson-${index + 1}`,
  title: lesson.title,
  outline: lesson.outline,
  ...fscCocVideoAssets[index],
}))

interface Lesson {
  _key: string
  title: string
  outline?: string[]
  durationMinutes?: number
  videoAssetId?: string
  developmentVideoUrl?: string
}

interface CourseContent {
  title: string
  description?: string
  lessons: Lesson[]
}

const questions = [
  "关键控制点有哪些？",
  "使用的控制体系是什么？",
  "供应商清单的更新频率是多久？",
  "采购控制需要检查哪些信息？",
  "如何进行数量控制记录？",
  "FSC 原材料以及产品的摆放要求是什么？",
  "FSC 商标的使用的第一步是什么？",
]

const coursePublishedFilter = import.meta.env.DEV ? "" : " && published == true"
const courseContentQuery = `coalesce(*[_type == "fscCocCourse" && _id == "fsc-coc-course"${coursePublishedFilter}][0], *[_type == "fscCocCourse" && slug.current == "fsc-coc"${coursePublishedFilter}][0]){title, description, lessons[]{_key, title, outline, durationMinutes, videoAssetId, "developmentVideoUrl": developmentVideo.asset->url}}`

function CourseDashboard() {
  const { user, signOut } = useAuth()
  const [course, setCourse] = useState<CourseContent>({
    title: fscCocCourseTitle,
    description: fscCocCourseDescription,
    lessons: fallbackLessons,
  })
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [examStatus, setExamStatus] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [certificateNumber, setCertificateNumber] = useState<string | null>(null)
  const [playUrl, setPlayUrl] = useState<string | null>(null)
  const [playbackSource, setPlaybackSource] = useState<"aliyun" | "sanity-test">("aliyun")
  const [playingLessonTitle, setPlayingLessonTitle] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void preloadAliPlayer().catch((preloadError: unknown) => {
      console.warn(
        "Aliyun player preloading failed; it will be retried when the learner starts a video.",
        preloadError,
      )
    })
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      if (sanityClient) {
        try {
          const content = await sanityClient.fetch<CourseContent | null>(
            courseContentQuery,
          )
          if (active && content?.lessons?.length) {
            setCourse({
              ...content,
              title: content.title === "FSC CoC 产销监管链" ? fscCocCourseTitle : content.title,
              description: content.description || fscCocCourseDescription,
              lessons: content.lessons.map((lesson, index) => ({
                ...lesson,
                durationMinutes: lesson.durationMinutes || fscCocVideoAssets[index]?.durationMinutes,
                videoAssetId: lesson.videoAssetId || fscCocVideoAssets[index]?.videoAssetId,
                title: /^课程视频 \d+$/.test(lesson.title)
                  ? fscCocCurriculum[index]?.title ?? lesson.title
                  : lesson.title,
                outline: lesson.outline?.length ? lesson.outline : fscCocCurriculum[index]?.outline ?? [],
              })),
            })
          }
        } catch (contentError) {
          if (active) setError(contentError instanceof Error ? contentError.message : "无法加载 Sanity 课程内容。")
        }
      }
      if (!supabase || !user) return
      const [attemptResult, certificateResult] = await Promise.all([
        supabase.from("exam_attempts").select("score, status, feedback").eq("student_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("certificates").select("certificate_number").eq("course_slug", "fsc-coc").maybeSingle(),
      ])
      if (!active) return
      if (attemptResult.error || certificateResult.error) {
        setError(attemptResult.error?.message ?? certificateResult.error?.message ?? "无法读取学习记录。")
      } else {
        setScore(attemptResult.data?.score ?? null)
        setExamStatus(attemptResult.data?.status ?? null)
        setFeedback(attemptResult.data?.feedback ?? null)
        setCertificateNumber(certificateResult.data?.certificate_number ?? null)
      }
      setBusy(false)
    }
    void load().catch((loadError: Error) => {
      if (active) {
        setError(loadError.message)
        setBusy(false)
      }
    })
    return () => { active = false }
  }, [user])

  const playLesson = (lesson: Lesson, source: "aliyun" | "sanity-test" = "aliyun") => {
    if (!user) {
      setError("登录状态无效，请重新登录后播放课程。")
      return
    }
    setError(null)
    if (source === "sanity-test" && !import.meta.env.DEV) {
      setError("Sanity 测试视频仅在本地开发环境可用。")
      return
    }
    const directPlayUrl = source === "sanity-test"
      ? lesson.developmentVideoUrl
      : getFscCocVideoUrl(lesson.videoAssetId)
    if (!directPlayUrl) {
      setPlayUrl(null)
      setError(source === "sanity-test" ? "该章节尚未上传 Sanity 测试 MP4。" : "该章节尚未配置有效的阿里云视频地址。")
      return
    }
    setPlaybackSource(source)
    setPlayingLessonTitle(lesson.title)
    setPlayUrl(directPlayUrl)
  }

  const submitExam = async () => {
    if (!supabase || !user) return
    setError(null)
    const { error: submitError } = await supabase.from("exam_attempts").insert({
      student_id: user.id,
      answers: Object.fromEntries(questions.map((question, index) => [`${index + 1}. ${question}`, answers[index]])),
      status: "submitted",
    })
    if (submitError) {
      setError(submitError.message)
      return
    }
    setSubmitted(true)
    setExamStatus("submitted")
    setScore(null)
  }

  const onSignOut = async () => {
    try {
      await signOut()
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "退出登录失败。")
    }
  }

  return (
    <main id="course" className="mx-auto max-w-[1100px] px-5 py-12 md:px-6 md:py-16">
      <PageMeta title="FSC CoC 在线课程 | 林扬东方" description="FSC 产销监管链在线课程、考试测评和个人成绩。" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Learning center</p>
          <h1 className="mt-2 text-3xl font-bold text-forest">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-inksoft">{course.description}</p>
        </div>
        {user ? (
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-semibold text-forest">{user.email || user.phone || "当前登录用户"}</p>
              <p className="break-all text-xs text-inksoft" title={user.id}>ID: {user.id}</p>
            </div>
            <button className="shrink-0 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest" onClick={() => void onSignOut()} type="button">退出登录</button>
          </div>
        ) : null}
      </div>

      <section className="mt-8 rounded-2xl bg-forest p-6 text-white md:p-8">
        <div className="flex items-start gap-4"><FaBookOpen className="mt-1 text-2xl text-sprout" /><div><h2 className="text-xl font-bold">FSC CoC 产销监管链课程</h2><p className="mt-2 text-sm text-white/80">包含 6 节课程视频与 7 道人工评分测评题。</p></div></div>
        <p className="mt-5 text-xs text-white/70">选择章节即可在本页播放器中观看课程视频。</p>
      </section>

      {error ? <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p> : null}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-3"><h2 className="text-xl font-bold text-forest">课程视频</h2><span className="text-sm text-inksoft">共 {course.lessons.length} 节</span></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {course.lessons.map((lesson, index) => {
            return (
              <article className="flex items-center gap-4 rounded-xl border border-line bg-white p-4" key={lesson._key}>
                <button aria-label={`播放${lesson.title}（阿里云）`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist text-moss" onClick={() => playLesson(lesson)} type="button"><FaPlayCircle /></button>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-forest">{index + 1}. {lesson.title}</h3>
                  <p className="mt-1 text-xs text-inksoft">{lesson.durationMinutes ? `${lesson.durationMinutes} 分钟` : "视频内容待配置"}</p>
                  {lesson.outline?.length ? (
                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-inksoft">
                      {lesson.outline.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ) : null}
                </div>
                {import.meta.env.DEV ? (
                  <button
                    className="shrink-0 rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900"
                    disabled={!lesson.developmentVideoUrl}
                    onClick={() => playLesson(lesson, "sanity-test")}
                    title={lesson.developmentVideoUrl ? "播放 Sanity 中上传的测试 MP4" : "请先在 Sanity 为本节上传测试 MP4"}
                    type="button"
                  >
                    测试 MP4
                  </button>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>
      {playUrl && user ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => { setPlayUrl(null); setPlayingLessonTitle(null) }}
          role="presentation"
        >
          <section
            aria-labelledby="course-player-title"
            aria-modal="true"
            className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="font-semibold text-forest" id="course-player-title">{playingLessonTitle}</h2>
              <button
                aria-label="关闭视频播放器"
                className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-forest"
                onClick={() => { setPlayUrl(null); setPlayingLessonTitle(null) }}
                type="button"
              >
                关闭
              </button>
            </div>
            <AliyunVideoPlayer
              key={playUrl}
              playUrl={playUrl}
              sourceLabel={playbackSource === "sanity-test" && import.meta.env.DEV ? "本地开发测试源 · Sanity MP4" : undefined}
              userId={user.id}
            />
          </section>
        </div>
      ) : null}

      <section className="mt-12 rounded-2xl border border-line bg-white p-5 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Assessment</p><h2 className="mt-2 text-xl font-bold text-forest">FSC 产销监管链考试测评</h2><p className="mt-2 text-sm text-inksoft">共 7 题，满分 14 分；全部为问答题，由管理员人工批阅。</p></div>
          {examStatus === "reviewed" ? <span className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-forest">已评分：{score}/14</span> : examStatus ? <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">答卷已提交，等待人工批阅</span> : null}
        </div>
        {examStatus === "reviewed" && feedback ? <p className="mt-4 rounded-lg bg-mist p-4 text-sm text-forest">批阅意见：{feedback}</p> : null}
        {certificateNumber ? <p className="mt-4 rounded-lg border border-sprout bg-mist p-4 text-sm text-forest">课程证书已登记，证书编号：<strong>{certificateNumber}</strong></p> : null}
        {busy ? <p className="mt-5 text-sm text-inksoft">正在读取学习记录…</p> : null}
        {examStatus === "submitted" && !submitted ? <p className="mt-5 rounded-lg bg-mist p-4 text-sm text-forest">答卷已提交，待管理员评分后可查看成绩。</p> : (
          <div className="mt-6 space-y-5">
            {questions.map((question, index) => (
              <label className="block text-sm font-semibold text-forest" htmlFor={`answer-${index}`} key={question}>
                {index + 1}. {question}（2 分）
                <textarea className="mt-2 min-h-24 w-full rounded-lg border border-line px-4 py-3 font-normal outline-none focus:border-moss" disabled={submitted} id={`answer-${index}`} onChange={(event) => setAnswers((current) => current.map((value, item) => item === index ? event.target.value : value))} value={answers[index]} />
              </label>
            ))}
            {!submitted ? <button className="rounded-lg bg-forest px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={busy || answers.some((answer) => !answer.trim())} onClick={() => void submitExam()} type="button">提交答卷</button> : <p className="rounded-lg bg-mist p-4 text-sm text-forest">已成功提交，管理员批阅后可在本页查看成绩和意见。</p>}
          </div>
        )}
      </section>
      <p className="mt-6 text-sm text-inksoft">证书将在管理员完成评分并审核后人工签发。如需帮助，请 <Link className="text-moss underline" to="/contact">联系我们</Link>。</p>
    </main>
  )
}

export default function Courses() {
  return <RequireAuth><CourseDashboard /></RequireAuth>
}
