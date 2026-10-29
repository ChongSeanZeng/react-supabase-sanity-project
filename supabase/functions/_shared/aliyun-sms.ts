interface AliyunSmsOptions {
  accessKeyId: string
  accessKeySecret: string
  endpoint: string
  phone: string
  signName: string
  templateCode: string
  templateParam: Record<string, string>
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
    TemplateParam: JSON.stringify(templateParam),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    Version: "2017-05-25",
  }
  parameters.Signature = await signAliyunParameters(parameters, accessKeySecret)

  const response = await fetch(`https://${endpoint}/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(parameters),
  })
  const result: unknown = await response.json()
  const resultCode = result && typeof result === "object" && "Code" in result
    ? result.Code
    : undefined
  if (!response.ok || resultCode !== "OK") {
    throw new Error(`Aliyun SMS request was rejected (${resultCode ?? response.status}).`)
  }
}
