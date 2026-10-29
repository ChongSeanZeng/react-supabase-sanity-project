import { createClient } from "npm:@supabase/supabase-js@2"

interface CompleteInvitationRequest {
  password?: unknown
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
    return Response.json({ error: "此来源不允许设置密码。" }, { status: 403 })
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
    return jsonResponse({ error: "请先通过邮件邀请链接打开页面。" }, 401, origin)
  }

  let payload: CompleteInvitationRequest
  try {
    payload = await request.json() as CompleteInvitationRequest
  } catch {
    return jsonResponse({ error: "密码设置请求格式无效。" }, 400, origin)
  }

  const password = typeof payload.password === "string" ? payload.password : ""
  if (password.length < 8 || password.length > 128) {
    return jsonResponse({ error: "密码长度必须为 8 至 128 个字符。" }, 400, origin)
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Student invitation completion function is missing required server configuration.")
    return jsonResponse({ error: "密码设置服务尚未配置，请联系系统管理员。" }, 503, origin)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: authData, error: authError } = await adminClient.auth.getUser(accessToken)
  if (authError || !authData.user) {
    return jsonResponse({ error: "邀请链接登录状态无效，请重新打开邀请邮件。" }, 401, origin)
  }

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("role, disabled_at, password_setup_required")
    .eq("id", authData.user.id)
    .maybeSingle()
  if (profileError) {
    console.error("Unable to verify invited learner profile.", profileError.message)
    return jsonResponse({ error: "无法验证学员账号，请联系系统管理员。" }, 500, origin)
  }
  if (
    !profile
    || profile.role !== "student"
    || profile.disabled_at
    || !profile.password_setup_required
  ) {
    return jsonResponse({ error: "此账号当前不需要完成邮件邀请密码设置。" }, 403, origin)
  }

  const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(authData.user.id, {
    password,
    user_metadata: {
      ...authData.user.user_metadata,
      requires_password_setup: false,
    },
  })
  if (authUpdateError) {
    console.error("Unable to set invited learner password.", authUpdateError.message)
    return jsonResponse({ error: `无法设置密码：${authUpdateError.message}` }, 400, origin)
  }

  const { error: profileUpdateError } = await adminClient
    .from("profiles")
    .update({ password_setup_required: false })
    .eq("id", authData.user.id)
  if (profileUpdateError) {
    console.error("Unable to clear invited learner password setup requirement.", profileUpdateError.message)
    return jsonResponse({ error: "密码已设置，但账号状态暂未更新，请重试完成设置。" }, 500, origin)
  }

  return jsonResponse({ completed: true }, 200, origin)
})
