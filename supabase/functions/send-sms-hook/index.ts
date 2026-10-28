import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0"

interface SmsHookEvent {
  user?: { phone?: string }
  sms?: { otp?: string }
}

function encodeRfc3986(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

async function signAliyunParameters(parameters: Record<string, string>, secret: string) {
  const canonicalQuery = Object.entries(parameters)
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join("&")
  const stringToSign = `POST&${encodeRfc3986("/")}&${encodeRfc3986(canonicalQuery)}`
  const signingKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${secret}&`),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    signingKey,
    new TextEncoder().encode(stringToSign),
  )
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
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

  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z")
  const parameters: Record<string, string> = {
    AccessKeyId: accessKeyId,
    Action: "SendSms",
    Format: "JSON",
    PhoneNumbers: phone,
    SignName: signName,
    SignatureMethod: "HMAC-SHA1",
    SignatureNonce: crypto.randomUUID(),
    SignatureVersion: "1.0",
    TemplateCode: templateCode,
    TemplateParam: JSON.stringify({ code: otp }),
    Timestamp: timestamp,
    Version: "2017-05-25",
  }

  try {
    parameters.Signature = await signAliyunParameters(parameters, accessKeySecret)
    const smsResponse = await fetch(`https://${endpoint}/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(parameters),
    })
    const result = await smsResponse.json() as { Code?: string; Message?: string }
    if (!smsResponse.ok || result.Code !== "OK") {
      console.error("Aliyun SMS request was rejected.", result.Code ?? smsResponse.status)
      return jsonError("The SMS provider could not send the verification code.", 502)
    }
    return new Response(null, { status: 200 })
  } catch (error) {
    console.error("Aliyun SMS request failed.", error)
    return jsonError("The SMS provider could not send the verification code.", 502)
  }
})
