import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import React from "react"
import { renderToString } from "react-dom/server"
import { createServer } from "vite"

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(rootDir, "dist")
const templatePath = path.join(distDir, "index.html")
const template = await readFile(templatePath, "utf8")

const server = await createServer({
  configFile: path.join(rootDir, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
})

try {
  const [{ App }, { routes }, routerDom, helmetAsync] = await Promise.all([
    server.ssrLoadModule("/src/App.tsx"),
    server.ssrLoadModule("/src/routes.tsx"),
    server.ssrLoadModule("react-router-dom"),
    server.ssrLoadModule("react-helmet-async"),
  ])
  const { createMemoryRouter } = routerDom
  const { HelmetProvider } = helmetAsync

  for (const [pathname, language, outputPath] of [
    ["/", "zh", templatePath],
    ["/en/", "en", path.join(distDir, "en", "index.html")],
  ]) {
    const router = createMemoryRouter(routes, { initialEntries: [pathname] })
    const helmetContext = {}
    const appHtml = renderToString(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(App, { router, initialLanguage: language }),
      ),
    )
    const helmet = helmetContext.helmet
    let html = template
      .replace(/<title>[\s\S]*?<\/title>\s*/, "")
      .replace(/<meta name="description"[^>]*>\s*/, "")
      .replace('lang="zh-CN"', `lang="${language === "en" ? "en" : "zh-CN"}"`)
      .replace(
        '<div id="root"><!--app-html--></div>',
        `<div id="root" data-prerendered="true">${appHtml}</div>`,
      )
      .replace(
        "</head>",
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`,
      )

    if (html === template) {
      throw new Error(`Failed to prerender ${pathname}: the HTML template was unchanged.`)
    }

    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html, "utf8")
    router.dispose()
    console.log(`Prerendered ${pathname} -> ${path.relative(rootDir, outputPath)}`)
  }

  await writeFile(path.join(distDir, "spa.txt"), template, "utf8")
} finally {
  await server.close()
}
