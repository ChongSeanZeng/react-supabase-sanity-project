import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"
import { createClient } from "@sanity/client"
import { loadEnv } from "vite"

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dryRun = process.argv.includes("--dry-run")
const pageFiles = {
  about: [
    "src/pages/About.tsx",
    "src/components/generated/QualificationWall.tsx",
  ],
  sustainability: ["src/pages/Sustainability.tsx"],
  training: [
    "src/pages/Training.tsx",
    "src/components/generated/GreenProductStandards.tsx",
  ],
  verification: [
    "src/pages/Verification.tsx",
    "src/components/generated/EudrCertificateSearch.tsx",
  ],
  partners: ["src/pages/Partners.tsx"],
  contact: [
    "src/pages/Contact.tsx",
    "src/components/generated/InquiryForm.tsx",
  ],
}
const importedCopy = {
  about: { "src/data/content.ts": ["qualificationTiles", "fscDisclaimer"] },
  sustainability: {
    "src/data/showcase.ts": ["forestryShowcaseImages"],
  },
  training: {
    "src/data/content.ts": ["greenProductStandards"],
    "src/data/showcase.ts": ["trainingShowcaseImages"],
  },
  verification: {
    "src/data/showcase.ts": ["verificationShowcaseImages"],
  },
  partners: { "src/data/content.ts": ["partners"] },
  contact: { "src/data/content.ts": ["inquiryTypes"] },
}
const sectionTitles = {
  about: {
    "src/pages/About.tsx": "页面介绍 / Page introduction",
    "src/components/generated/QualificationWall.tsx": "资质与授权 / Qualifications",
    "src/data/content.ts": "资质与授权 / Qualifications",
  },
  sustainability: {
    "src/pages/Sustainability.tsx": "服务介绍 / Service overview",
    "src/data/showcase.ts": "林业咨询项目图片说明 / Forestry image captions",
  },
  training: {
    "src/pages/Training.tsx": "培训介绍与课程 / Training and courses",
    "src/components/generated/GreenProductStandards.tsx": "绿色产品标准目录 / Green product standards",
    "src/data/content.ts": "绿色产品标准目录 / Green product standards",
    "src/data/showcase.ts": "培训图片说明 / Training image captions",
  },
  verification: {
    "src/pages/Verification.tsx": "法规与验证服务 / Regulations and verification services",
    "src/components/generated/EudrCertificateSearch.tsx": "EUDR 查询 / EUDR search",
    "src/data/showcase.ts": "验证图片说明 / Verification image captions",
  },
  partners: {
    "src/pages/Partners.tsx": "合作机构与客户 / Partners and clients",
    "src/data/content.ts": "合作机构与客户 / Partners and clients",
  },
  contact: {
    "src/pages/Contact.tsx": "联系信息 / Contact information",
    "src/components/generated/InquiryForm.tsx": "咨询表单 / Inquiry form",
    "src/data/content.ts": "咨询表单 / Inquiry form",
  },
}

function parseSource(relativePath, contents) {
  return ts.createSourceFile(
    relativePath,
    contents,
    ts.ScriptTarget.Latest,
    true,
    relativePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
}

function findVariableInitializer(sourceFile, variableName) {
  let initializer
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName
    ) {
      initializer = node.initializer
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return initializer
}

function collectStrings(node, onString) {
  if (!node) return
  if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    onString(node.text)
    return
  }
  if (
    ts.isPropertyAssignment(node) &&
    ts.isIdentifier(node.name) &&
    ["anchor", "fit", "id", "image", "url"].includes(node.name.text)
  ) {
    return
  }
  ts.forEachChild(node, (child) => collectStrings(child, onString))
}

function collectTranslationCalls(sourceFile, add) {
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "t" &&
      node.arguments.length > 0 &&
      (ts.isStringLiteralLike(node.arguments[0]) ||
        ts.isNoSubstitutionTemplateLiteral(node.arguments[0]))
    ) {
      add(node.arguments[0].text)
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
}

function isAssetOrUrl(value) {
  return /^(?:https?:\/\/|\/assets\/|data:)/i.test(value)
}

async function loadTranslations() {
  const source = await readFile(path.join(rootDir, "src/translations.ts"), "utf8")
  const sourceFile = parseSource("src/translations.ts", source)
  const initializer = findVariableInitializer(sourceFile, "translations")
  if (!initializer || !ts.isObjectLiteralExpression(initializer)) {
    throw new Error("Unable to read the existing translation dictionary.")
  }

  const translations = new Map()
  for (const property of initializer.properties) {
    if (
      ts.isPropertyAssignment(property) &&
      (ts.isStringLiteralLike(property.name) || ts.isIdentifier(property.name)) &&
      (ts.isStringLiteralLike(property.initializer) ||
        ts.isNoSubstitutionTemplateLiteral(property.initializer))
    ) {
      translations.set(property.name.text, property.initializer.text)
    }
  }
  return translations
}

async function collectPageSections(page, translations) {
  const reverseTranslations = new Map()
  for (const [key, value] of translations) {
    if (!reverseTranslations.has(value)) reverseTranslations.set(value, key)
  }

  const sections = new Map()
  const add = (sectionTitle, value, includeUntranslated = false) => {
    if (!value || isAssetOrUrl(value)) return
    const key = translations.has(value)
      ? value
      : reverseTranslations.get(value) ?? (includeUntranslated ? value : null)
    if (!key) return
    const section = sections.get(sectionTitle) ?? new Map()
    if (section.has(key)) return
    section.set(key, {
      _key: createHash("sha1").update(key).digest("hex").slice(0, 20),
      key,
      zh: key,
      en: translations.get(key) ?? key,
    })
    sections.set(sectionTitle, section)
  }

  for (const relativePath of pageFiles[page]) {
    const contents = await readFile(path.join(rootDir, relativePath), "utf8")
    const sourceFile = parseSource(relativePath, contents)
    const sectionTitle = sectionTitles[page][relativePath]
    if (!sectionTitle) throw new Error(`Missing section title for ${page}: ${relativePath}`)
    const visit = (node) => {
      if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        add(sectionTitle, node.text)
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    collectTranslationCalls(sourceFile, (value) => add(sectionTitle, value, true))
  }

  for (const [relativePath, variables] of Object.entries(importedCopy[page])) {
    const contents = await readFile(path.join(rootDir, relativePath), "utf8")
    const sourceFile = parseSource(relativePath, contents)
    const sectionTitle = sectionTitles[page][relativePath]
    if (!sectionTitle) throw new Error(`Missing section title for ${page}: ${relativePath}`)
    for (const variableName of variables) {
      const initializer = findVariableInitializer(sourceFile, variableName)
      if (!initializer) {
        throw new Error(`Unable to find ${variableName} in ${relativePath}.`)
      }
      collectStrings(initializer, (value) => add(sectionTitle, value, true))
    }
  }

  return [...sections].map(([section, entries]) => ({
    _key: createHash("sha1").update(section).digest("hex").slice(0, 20),
    section,
    entries: [...entries.values()],
  }))
}

const translations = await loadTranslations()
const pageDocuments = []
for (const page of Object.keys(pageFiles)) {
  const sections = await collectPageSections(page, translations)
  pageDocuments.push({
    _id: `site-page-copy-${page}`,
    _type: "sitePageCopy",
    page,
    sections,
  })
  console.log(`${page}: ${sections.length} sections, ${sections.reduce((count, section) => count + section.entries.length, 0)} copy fields`)
}

if (dryRun) {
  console.log("Dry run complete; no Sanity documents were written.")
  process.exit(0)
}

const env = loadEnv("development", rootDir, "")
const token = process.env.SANITY_API_TOKEN || env.SANITY_API_TOKEN
const projectId = process.env.VITE_SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || env.VITE_SANITY_DATASET || "production"
if (!token || !projectId) {
  throw new Error("Set SANITY_API_TOKEN and VITE_SANITY_PROJECT_ID locally before seeding.")
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: false,
  token,
})

for (const document of pageDocuments) {
  const draftId = `drafts.${document._id}`
  const [existingPublished, existingDraft] = await Promise.all([
    client.getDocument(document._id),
    client.getDocument(draftId),
  ])
  if (existingPublished || existingDraft) {
    if (
      existingDraft &&
      Array.isArray(existingDraft.entries) &&
      !Array.isArray(existingDraft.sections)
    ) {
      const sectionForKey = new Map(
        document.sections.flatMap((section) =>
          section.entries.map((entry) => [entry.key, section.section]),
        ),
      )
      const migratedSections = new Map()
      for (const entry of existingDraft.entries) {
        const sectionTitle = sectionForKey.get(entry.key) ?? "其他文案 / Other copy"
        const section = migratedSections.get(sectionTitle) ?? new Map()
        if (!section.has(entry.key)) {
          section.set(entry.key, {
            _key: entry._key ?? createHash("sha1").update(entry.key).digest("hex").slice(0, 20),
            key: entry.key,
            zh: entry.zh ?? entry.key,
            en: entry.en ?? entry.key,
          })
        }
        migratedSections.set(sectionTitle, section)
      }
      const sections = [...migratedSections].map(([section, entries]) => ({
        _key: createHash("sha1").update(section).digest("hex").slice(0, 20),
        section,
        entries: [...entries.values()],
      }))
      await client.patch(draftId).unset(["entries"]).set({ sections }).commit()
      console.log(`${document.page}: migrated existing draft into grouped sections.`)
      continue
    }
    console.log(`${document.page}: grouped draft or published document already exists; left unchanged.`)
    continue
  }
  await client.createIfNotExists({ ...document, _id: draftId })
  console.log(`${document.page}: created a draft; review and publish it in Studio to make the copy live.`)
}
