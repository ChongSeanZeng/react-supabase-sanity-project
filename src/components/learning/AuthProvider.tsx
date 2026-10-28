import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase, supabaseConfigured } from "@/lib/supabase"

export type UserRole = "student" | "admin"

interface AuthContextValue {
  session: Session | null
  user: User | null
  role: UserRole | null
  disabled: boolean
  loading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  requestCode: (phone: string) => Promise<void>
  verifyCode: (phone: string, code: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRole = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("role, disabled_at")
      .eq("id", userId)
      .single()

    if (profileError) {
      setError(profileError.message)
      setRole(null)
      setDisabled(false)
      return
    }
    setRole(data.role)
    setDisabled(Boolean(data.disabled_at))
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setError(null)
      if (!nextSession) {
        setRole(null)
        setDisabled(false)
        setLoading(false)
        return
      }
      setDisabled(false)
      window.setTimeout(() => {
        if (active) void loadRole(nextSession.user.id).finally(() => setLoading(false))
      }, 0)
    })

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError(sessionError.message)
      setSession(data.session)
      if (data.session) {
        void loadRole(data.session.user.id).finally(() => {
          if (active) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [loadRole])

  const requestCode = useCallback(async (phone: string) => {
    if (!supabase) throw new Error("Supabase 尚未配置，请联系管理员。")
    const { error: requestError } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: false },
    })
    if (requestError) throw requestError
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase 尚未配置，请联系管理员。")
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) throw signInError
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) throw new Error("Supabase 尚未配置，请联系管理员。")
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })
    if (updateError) throw updateError
  }, [])

  const verifyCode = useCallback(async (phone: string, code: string) => {
    if (!supabase) throw new Error("Supabase 尚未配置，请联系管理员。")
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    })
    if (verifyError) throw verifyError
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        role,
        disabled,
        loading,
        error: error ?? (supabaseConfigured ? null : "请配置 Supabase URL 与 publishable key。"),
        signInWithEmail,
        updatePassword,
        requestCode,
        verifyCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
