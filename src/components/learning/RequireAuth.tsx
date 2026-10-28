import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/components/learning/AuthProvider"
import { useLanguage } from "@/i18n"
import { localizedPath } from "@/lib/localized-path"

export function RequireAuth({ children, role }: { children: React.ReactNode; role?: "admin" }) {
  const { user, role: currentRole, disabled, loading, error, signOut } = useAuth()
  const location = useLocation()
  const { language } = useLanguage()

  if (loading) {
    return <main className="grid min-h-[60vh] place-items-center text-sm text-inksoft">正在验证访问权限…</main>
  }
  if (error && !user) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center text-red-700">{error}</main>
  }
  if (!user) {
    return <Navigate to={localizedPath(role === "admin" ? "/admin" : "/login", language)} replace state={{ from: location.pathname }} />
  }
  if (disabled) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-red-700">此账号已停用，无法访问课程。请联系管理员。</p>
        <button className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest" onClick={() => void signOut()} type="button">退出登录</button>
      </main>
    )
  }
  if (role && currentRole !== role) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center text-red-700">当前账号没有管理员权限。</main>
  }
  return children
}
