import { useState } from "react"
import { assetUrl } from "@/lib/assets"

interface TeamAvatarProps {
  name: string
  src?: string
  size?: number
}

function initialsOf(name: string): string {
  const cleaned = name.trim()
  if (!cleaned) return "EI"
  const latin = cleaned.match(/[A-Za-z]+/g)
  if (latin && latin.length > 0) {
    return latin
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("")
  }
  return cleaned.slice(0, 1)
}

export function TeamAvatar({ name, src, size = 64 }: TeamAvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  if (!showImage) {
    return (
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center rounded-full border border-line bg-mist font-display text-lg font-bold text-forest"
        style={{ width: size, height: size }}>
        {initialsOf(name)}
      </span>
    )
  }

  return (
    <img
      src={assetUrl(src ?? "")}
      alt={`${name} 头像`}
      className="shrink-0 rounded-full border border-line bg-mist object-cover"
      style={{ width: size, height: size }}
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      onError={() => setFailed(true)} />
  )
}
