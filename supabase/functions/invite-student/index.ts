import { createClient } from "npm:@supabase/supabase-js@2"

interface InviteRequest {
  email?: unknown
  phone?: unknown
  displayName?: unknown
}

function allowedOrigins() {
  return (Deno.env.get("APP_ALLOWED_ORIGINS") ?? Deno.env.get("APP_SITE_URL") ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string,
) {
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
    return Response.json({ error: "此来源不允许发送邀请。" }, { status: 403 })
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

  const authorization = request.headers.get("Authorization")
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!accessToken) {
    return jsonResponse({ error: "请先使用管理员账号登录。" }, 401, origin)
  }

  let payload: InviteRequest
  try {
    payload = await request.json() as InviteRequest
  } catch {
    return jsonResponse({ error: "邀请请求格式无效。" }, 400, origin)
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : ""
  const displayName = typeof payload.displayName === "string" ? payload.displayName.trim() : ""
  if (Boolean(email) === Boolean(phone)) {
    return jsonResponse({ error: "请填写邮箱或手机号，二者只能选择一项。" }, 400, origin)
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return jsonResponse({ error: "请输入有效的学员邮箱地址。" }, 400, origin)
  }
  if (phone && !/^\+[1-9]\d{6,14}$/.test(phone)) {
    return jsonResponse({ error: "请输入有效的国际格式手机号，例如 +8613800000000。" }, 400, origin)
  }
  if (displayName.length > 100) {
    return jsonResponse({ error: "学员姓名不能超过 100 个字符。" }, 400, origin)
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  const appSiteUrl = Deno.env.get("APP_SITE_URL")
  if (!supabaseUrl || !serviceRoleKey || !appSiteUrl) {
    console.error("Student invite function is missing required server configuration.")
    return jsonResponse({ error: "邀请服务尚未配置，请联系系统管理员。" }, 503, origin)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: authData, error: authError } = await adminClient.auth.getUser(accessToken)
  if (authError || !authData.user) {
    return jsonResponse({ error: "登录状态无效，请重新登录。" }, 401, origin)
  }

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle()
  if (profileError) {
    console.error("Unable to check inviter role.", profileError.message)
    return jsonResponse({ error: "无法验证管理员权限。" }, 500, origin)
  }
  if (profile?.role !== "admin") {
    return jsonResponse({ error: "只有管理员可以邀请学员。" }, 403, origin)
  }

  if (email) {
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: displayName ? { display_name: displayName } : {},
      redirectTo: `${appSiteUrl.replace(/\/$/, "")}/login`,
    })
    if (inviteError) {
      console.error("Supabase rejected a learner email invitation.", {
        code: inviteError.code,
        status: inviteError.status,
        message: inviteError.message,
      })
      return jsonResponse({
        error: `Supabase 拒绝了邀请：${inviteError.message}`,
      }, inviteError.status && inviteError.status >= 400 && inviteError.status < 600
        ? inviteError.status
        : 400, origin)
    }
    return jsonResponse({ invited: true, method: "email" }, 200, origin)
  }

  const { error: createError } = await adminClient.auth.admin.createUser({
    phone,
    phone_confirm: false,
    user_metadata: displayName ? { display_name: displayName } : {},
  })
  if (createError) {
    console.error("Supabase rejected a learner phone account.", {
      code: createError.code,
      status: createError.status,
      message: createError.message,
    })
    return jsonResponse({
      error: `Supabase 无法创建手机号学员账号：${createError.message}`,
    }, createError.status && createError.status >= 400 && createError.status < 600
      ? createError.status
      : 400, origin)
  }

  return jsonResponse({ invited: true, method: "phone" }, 200, origin)
})
