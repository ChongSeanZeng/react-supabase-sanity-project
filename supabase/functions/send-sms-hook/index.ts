import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0"
import { sendAliyunSms } from "../_shared/aliyun-sms.ts"

interface SmsHookEvent {
  user?: { phone?: string }
  sms?: { otp?: string }
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return jsonError("Method not allowed.", 405)

  const hookSecrets = Deno.env.get("SEND_SMS_HOOK_SECRETS")
  const accessKeyId = Deno.env.get("ALIYUN_ACCESS_KEY_ID")
  const accessKeySecret = Deno.env.get("ALIYUN_ACCESS_KEY_SECRET")
  const signName = Deno.env.get("ALIYUN_SMS_SIGN_NAME")
  const templateCode = Deno.env.get("ALIYUN_SMS_TEMPLATE_CODE")
  const endpoint = Deno.env.get("ALIYUN_SMS_ENDPOINT") ?? "dysmsapi.aliyuncs.com"
  if (!hookSecrets || !accessKeyId || !accessKeySecret || !signName || !templateCode) {
    console.error("SMS hook is missing required server-side configuration.")
    return jsonError("SMS service is not configured.", 503)
  }
  if (!/^[A-Za-z0-9.-]+$/.test(endpoint) || !endpoint.endsWith(".aliyuncs.com")) {
    console.error("SMS hook has an invalid Aliyun SMS endpoint.")
    return jsonError("SMS service is not configured.", 503)
  }

  let event: SmsHookEvent
  try {
    const payload = await request.text()
    const headers = Object.fromEntries(request.headers)
    let verifiedEvent: unknown
    for (const configuredSecret of hookSecrets.split("|")) {
      try {
        const secret = configuredSecret.replace(/^v1,whsec_/, "")
        verifiedEvent = new Webhook(secret).verify(payload, headers)
        break
      } catch {
        continue
      }
    }
    if (!verifiedEvent) return jsonError("Invalid SMS hook signature.", 401)
    event = verifiedEvent as SmsHookEvent
  } catch {
    return jsonError("Invalid SMS hook signature.", 401)
  }

  const phone = event.user?.phone
  const otp = event.sms?.otp
  if (!phone || !/^\+[1-9]\d{6,14}$/.test(phone) || !otp || !/^\d{6}$/.test(otp)) {
    return jsonError("Invalid phone number or one-time code.", 400)
  }

  try {
    await sendAliyunSms({
      accessKeyId,
      accessKeySecret,
      endpoint,
      phone,
      signName,
      templateCode,
      templateParam: { code: otp },
    })
    return new Response(null, { status: 200 })
  } catch (error) {
    console.error("Aliyun SMS request failed.", error)
    return jsonError("The SMS provider could not send the verification code.", 502)
  }
})
