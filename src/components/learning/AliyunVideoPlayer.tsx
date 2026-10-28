import { useEffect, useId, useRef, useState } from "react"
import "./AliyunVideoPlayer.css"

const aliPlayerCssUrl = "https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css"
const aliPlayerScriptUrl = "https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js"
const aliPlayerCdnOrigin = new URL(aliPlayerScriptUrl).origin
const videoCdnOrigin = "https://video.inflink.cn"

interface AliPlayerInstance {
  on: (event: string, callback: () => void) => void
  dispose: () => void
}

interface AliPlayerConfig {
  id: string
  source: string
  width: string
  height: string
  autoplay: boolean
  isLive: boolean
  playsinline: boolean
  useH5Prism: boolean
  controlBarVisibility: "hover" | "click" | "always"
}

declare global {
  interface Window {
    Aliplayer?: new (config: AliPlayerConfig, ready?: () => void) => AliPlayerInstance
  }
}

let aliPlayerLoad: Promise<void> | null = null

function addResourceHint(rel: string, href: string, as?: "script" | "style", crossOrigin?: boolean) {
  const existingLink = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"][href="${href}"]`)
  if (existingLink) return
  const link = document.createElement("link")
  link.rel = rel
  link.href = href
  if (as) link.as = as
  if (crossOrigin) link.crossOrigin = "anonymous"
  document.head.append(link)
}

export function preloadAliPlayer() {
  addResourceHint("preconnect", aliPlayerCdnOrigin, undefined, true)
  addResourceHint("preconnect", videoCdnOrigin, undefined, true)
  addResourceHint("dns-prefetch", aliPlayerCdnOrigin)
  addResourceHint("dns-prefetch", videoCdnOrigin)
  addResourceHint("preload", aliPlayerScriptUrl, "script", true)
  addResourceHint("preload", aliPlayerCssUrl, "style", true)
  return loadAliPlayer()
}

function loadAliPlayer() {
  if (window.Aliplayer) return Promise.resolve()
  if (aliPlayerLoad) return aliPlayerLoad

  aliPlayerLoad = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[rel="stylesheet"][href="${aliPlayerCssUrl}"]`)) {
      const stylesheet = document.createElement("link")
      stylesheet.rel = "stylesheet"
      stylesheet.href = aliPlayerCssUrl
      stylesheet.crossOrigin = "anonymous"
      stylesheet.crossOrigin = "anonymous"
      document.head.append(stylesheet)
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${aliPlayerScriptUrl}"]`)
    const script = existingScript ?? document.createElement("script")
    const onLoad = () => window.Aliplayer ? resolve() : reject(new Error("阿里云播放器 SDK 加载后未初始化。"))
    const onError = () => reject(new Error("无法加载阿里云播放器 SDK，请检查网络或 CDN 可用性。"))
    script.addEventListener("load", onLoad, { once: true })
    script.addEventListener("error", onError, { once: true })
    if (!existingScript) {
      script.src = aliPlayerScriptUrl
      script.async = true
      script.crossOrigin = "anonymous"
      document.head.append(script)
    }
  }).catch((error: unknown) => {
    aliPlayerLoad = null
    throw error
  })

  return aliPlayerLoad
}

export function AliyunVideoPlayer({
  playUrl,
  userId,
  sourceLabel,
}: {
  playUrl: string
  userId: string
  sourceLabel?: string
}) {
  const playerId = `ali-player-${useId().replace(/:/g, "")}`
  const instanceRef = useRef<AliPlayerInstance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    void loadAliPlayer().then(() => {
      if (!active) return
      if (!window.Aliplayer) throw new Error("阿里云播放器 SDK 不可用。")
      const player = new window.Aliplayer({
        id: playerId,
        source: new URL(playUrl, window.location.origin).toString(),
        width: "100%",
        height: "100%",
        autoplay: false,
        isLive: false,
        playsinline: true,
        useH5Prism: true,
        controlBarVisibility: "hover",
      }, () => {
        if (active) setLoading(false)
      })
      instanceRef.current = player
      player.on("error", () => {
        if (active) {
          setLoading(false)
          setError("视频播放失败，请稍后重试或联系管理员。")
        }
      })
    }).catch((loadError: unknown) => {
      if (active) {
        setLoading(false)
        setError(loadError instanceof Error ? loadError.message : "视频播放器初始化失败。")
      }
    })

    return () => {
      active = false
      instanceRef.current?.dispose()
      instanceRef.current = null
    }
  }, [playerId, playUrl])

  return (
    <div className="ali-player-frame mt-5 aspect-video w-full rounded-xl bg-black">
      <div className="ali-player-mount" id={playerId} />
      <div aria-hidden="true" className="course-user-watermark">{userId}</div>
      {sourceLabel ? <p className="absolute left-3 top-3 z-50 rounded bg-amber-500/90 px-2 py-1 text-xs font-semibold text-black">{sourceLabel}</p> : null}
      {loading ? <p className="ali-player-status">正在加载播放器…</p> : null}
      {error ? <p className="ali-player-error" role="alert">{error}</p> : null}
    </div>
  )
}
