import { createClient } from "npm:@supabase/supabase-js@2"

interface ManageStudentRequest {
  action?: unknown
  studentId?: unknown
  displayName?: unknown
  email?: unknown
  phone?: unknown
  active?: unknown
}

function allowedOrigins() {
  return (Deno.env.get("APP_ALLOWED_ORIGINS") ?? Deno.env.get("APP_SITE_URL") ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)
}

function jsonResponse(body: Record<string, unknown>, status: number, origin: string) {
  return Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
      "Cache-Control": "no-store",
    },
  })
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin") ?? ""
  const normalizedOrigin = origin.replace(/\/$/, "")
  if (!allowedOrigins().includes(normalizedOrigin)) {
    return Response.json({ error: "此来源不允许管理学员。" }, { status: 403 })
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      },
    })
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, origin)
  }

  const accessToken = request.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!accessToken) {
    return jsonResponse({ error: "请先使用管理员账号登录。" }, 401, origin)
  }

  let payload: ManageStudentRequest
  try {
    payload = await request.json() as ManageStudentRequest
  } catch {
    return jsonResponse({ error: "学员管理请求格式无效。" }, 400, origin)
  }

  const action = payload.action
  const studentId = typeof payload.studentId === "string" ? payload.studentId : ""
  if (!studentId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(studentId)) {
    return jsonResponse({ error: "学员账号 ID 无效。" }, 400, origin)
  }
  if (action !== "update" && action !== "set-active") {
    return jsonResponse({ error: "不支持的学员管理操作。" }, 400, origin)
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Student management function is missing required server configuration.")
    return jsonResponse({ error: "学员管理服务尚未配置，请联系系统管理员。" }, 503, origin)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: authData, error: authError } = await adminClient.auth.getUser(accessToken)
  if (authError || !authData.user) {
    return jsonResponse({ error: "登录状态无效，请重新登录。" }, 401, origin)
  }

  const { data: adminProfile, error: adminProfileError } = await adminClient
    .from("profiles")
    .select("role, disabled_at")
    .eq("id", authData.user.id)
    .maybeSingle()
  if (adminProfileError) {
    console.error("Unable to verify student management caller.", adminProfileError.message)
    return jsonResponse({ error: "无法验证管理员权限。" }, 500, origin)
  }
  if (adminProfile?.role !== "admin" || adminProfile.disabled_at) {
    return jsonResponse({ error: "只有启用中的管理员可以管理学员。" }, 403, origin)
  }
  if (studentId === authData.user.id) {
    return jsonResponse({ error: "不能通过学员管理操作修改自己的账号。" }, 400, origin)
  }

  const { data: studentProfile, error: studentProfileError } = await adminClient
    .from("profiles")
    .select("id, role, disabled_at")
    .eq("id", studentId)
    .maybeSingle()
  if (studentProfileError) {
    console.error("Unable to load target student profile.", studentProfileError.message)
    return jsonResponse({ error: "无法读取目标学员资料。" }, 500, origin)
  }
  if (!studentProfile || studentProfile.role !== "student") {
    return jsonResponse({ error: "目标账号不存在或不是学员账号。" }, 404, origin)
  }

  if (action === "set-active") {
    if (typeof payload.active !== "boolean") {
      return jsonResponse({ error: "账号启用状态无效。" }, 400, origin)
    }
    const disabling = !payload.active
    const disabledAt = disabling ? new Date().toISOString() : null
    const { error: profileUpdateError } = await adminClient
      .from("profiles")
      .update({ disabled_at: disabledAt })
      .eq("id", studentId)
    if (profileUpdateError) {
      console.error("Unable to update student active status.", profileUpdateError.message)
      return jsonResponse({ error: "无法更新学员账号状态。" }, 500, origin)
    }

    const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(studentId, {
      ban_duration: disabling ? "876000h" : "none",
    })
    if (authUpdateError) {
      const { error: rollbackError } = await adminClient
        .from("profiles")
        .update({ disabled_at: studentProfile.disabled_at })
        .eq("id", studentId)
      if (rollbackError) {
        console.error("Failed to roll back student active status after Auth update failure.", rollbackError.message)
      }
      console.error("Unable to update student Auth ban status.", authUpdateError.message)
      return jsonResponse({ error: `无法更新学员登录状态：${authUpdateError.message}` }, 502, origin)
    }
    return jsonResponse({ updated: true }, 200, origin)
  }

  const displayName = typeof payload.displayName === "string" ? payload.displayName.trim() : ""
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  const phone = typeof payload.phone === "string" ? payload.phone.replace(/[\s()-]/g, "") : ""
  if (displayName.length > 100) {
    return jsonResponse({ error: "学员姓名不能超过 100 个字符。" }, 400, origin)
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return jsonResponse({ error: "请输入有效的学员邮箱地址。" }, 400, origin)
  }
  if (phone && !/^\+[1-9]\d{6,14}$/.test(phone)) {
    return jsonResponse({ error: "请输入有效的国际格式手机号，例如 +8613800000000。" }, 400, origin)
  }
  const { data: targetResult, error: targetError } = await adminClient.auth.admin.getUserById(studentId)
  if (targetError || !targetResult.user) {
    console.error("Unable to load target Auth user.", targetError?.message)
    return jsonResponse({ error: "无法读取学员登录账号。" }, 500, origin)
  }
  if (!email && !phone && !targetResult.user.email && !targetResult.user.phone) {
    return jsonResponse({ error: "学员至少需要保留邮箱或手机号中的一项。" }, 400, origin)
  }

  const updates: {
    user_metadata: Record<string, unknown>
    email?: string
    email_confirm?: boolean
    phone?: string
    phone_confirm?: boolean
  } = {
    user_metadata: {
      ...targetResult.user.user_metadata,
      display_name: displayName || null,
    },
  }
  if (email) {
    updates.email = email
    updates.email_confirm = false
  }
  if (phone) {
    updates.phone = phone
    updates.phone_confirm = false
  }

  const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(studentId, updates)
  if (authUpdateError) {
    console.error("Unable to update student Auth details.", {
      code: authUpdateError.code,
      status: authUpdateError.status,
      message: authUpdateError.message,
    })
    return jsonResponse({ error: `无法更新学员登录资料：${authUpdateError.message}` }, 400, origin)
  }

  const { error: profileUpdateError } = await adminClient
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", studentId)
  if (profileUpdateError) {
    console.error("Auth details updated but profile name synchronization failed.", profileUpdateError.message)
    return jsonResponse({ error: "登录资料已更新，但姓名同步失败，请重新编辑姓名后保存。" }, 500, origin)
  }

  return jsonResponse({ updated: true }, 200, origin)
})
