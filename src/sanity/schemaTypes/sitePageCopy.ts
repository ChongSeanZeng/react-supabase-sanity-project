import { defineField, defineType } from "sanity"

export const sitePageCopy = defineType({
  name: "sitePageCopy",
  title: "网站页面文案 / Website page copy",
  type: "document",
  fields: [
    defineField({
      name: "page",
      title: "页面 / Page",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "关于我们 / About", value: "about" },
          { title: "可持续服务 / Sustainability", value: "sustainability" },
          { title: "培训 / Training", value: "training" },
          { title: "符合性验证 / Verification", value: "verification" },
          { title: "合作伙伴 / Partners", value: "partners" },
          { title: "联系我们 / Contact", value: "contact" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "页面内容分组 / Page sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "section",
              title: "板块 / Section",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "entries",
              title: "文案字段 / Copy fields",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "key",
                      title: "文案标识（勿修改）/ Copy key (do not edit)",
                      type: "string",
                      readOnly: true,
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "zh",
                      title: "中文",
                      type: "text",
                      rows: 3,
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "en",
                      title: "English",
                      type: "text",
                      rows: 3,
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "key", subtitle: "zh" },
                  },
                },
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "section" },
          },
        },
      ],
      validation: (rule) => rule.required().unique(),
    }),
  ],
  preview: {
    select: { title: "page" },
    prepare: ({ title }) => {
      const labels: Record<string, string> = {
        about: "关于我们 / About",
        sustainability: "可持续服务 / Sustainability",
        training: "培训 / Training",
        verification: "符合性验证 / Verification",
        partners: "合作伙伴 / Partners",
        contact: "联系我们 / Contact",
      }
      return { title: labels[title] ?? "网站页面文案 / Website page copy" }
    },
  },
})
