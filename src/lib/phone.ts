export function normalizePhoneNumber(phone: string) {
  return phone.replace(/[\s()-]/g, "")
}

export function isValidInternationalPhoneNumber(phone: string) {
  return /^\+[1-9]\d{6,14}$/.test(phone)
}
