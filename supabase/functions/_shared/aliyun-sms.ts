interface AliyunSmsOptions {
  accessKeyId: string
  accessKeySecret: string
  endpoint: string
  phone: string
  signName: string
  templateCode: string
  templateParam: Record<string, string>
}

export function getAliyunSmsSignName() {
  const encodedSignName = Deno.env.get("ALIYUN_SMS_SIGN_NAME_BASE64")
  if (encodedSignName === undefined) return Deno.env.get("ALIYUN_SMS_SIGN_NAME")

  try {
    const bytes = Uint8Array.from(atob(encodedSignName), (character) =>
      character.charCodeAt(0)
    )
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    console.error("Aliyun SMS signature must be valid Base64-encoded UTF-8.")
    return undefined
  }
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

export async function sendAliyunSms({
  accessKeyId,
  accessKeySecret,
  endpoint,
  phone,
  signName,
  templateCode,
  templateParam,
}: AliyunSmsOptions) {
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
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    Version: "2017-05-25",
  }
  if (Object.keys(templateParam).length > 0) {
    parameters.TemplateParam = JSON.stringify(templateParam)
  }
  parameters.Signature = await signAliyunParameters(parameters, accessKeySecret)

  const response = await fetch(`https://${endpoint}/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(parameters),
  })
  const result: unknown = await response.json()
  const resultObject = result && typeof result === "object" ? result : undefined
  const resultCode = resultObject && "Code" in resultObject
    && typeof resultObject.Code === "string"
    ? resultObject.Code
    : undefined
  const resultMessage = resultObject && "Message" in resultObject
    && typeof resultObject.Message === "string"
    ? resultObject.Message
    : undefined
  const requestId = resultObject && "RequestId" in resultObject
    && typeof resultObject.RequestId === "string"
    ? resultObject.RequestId
    : undefined
  if (!response.ok || resultCode !== "OK") {
    const details = [
      `HTTP ${response.status}`,
      `Code ${resultCode ?? "missing"}`,
      resultMessage ? `Message: ${resultMessage}` : undefined,
      requestId ? `RequestId: ${requestId}` : undefined,
    ].filter(Boolean).join("; ")
    throw new Error(`Aliyun SMS request was rejected (${details}).`)
  }
}
