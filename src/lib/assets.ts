const assetBaseUrl = import.meta.env.VITE_ASSET_BASE_URL?.trim().replace(/\/+$/, "")

export function assetUrl(path: string): string {
  if (!path.startsWith("/assets/") || !assetBaseUrl) return path

  const base = assetBaseUrl.endsWith("/assets") ? assetBaseUrl : `${assetBaseUrl}/assets`
  const assetPath = path
    .slice("/assets/".length)
    .replace(/\.(?:jpe?g|png)(?=$|[?#])/i, ".webp")
  return `${base}/${assetPath}`
}
