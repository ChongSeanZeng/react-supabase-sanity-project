import { defineField, defineType } from "sanity"
import { teamMembers } from "@/data/content"
import { translations } from "@/translations"

export const teamContent = defineType({
  name: "teamContent",
  title: "林扬团队 / Team",
  type: "document",
  initialValue: {
    members: teamMembers.map((member) => ({
      nameZh: member.name,
      nameEn: member.name,
      titleZh: member.nameEn,
      titleEn: member.title,
      experienceZh: member.years,
      experienceEn: translations[member.years] ?? member.years,
      bioZh: member.bio,
      bioEn: member.bioEn,
      legacyAvatarUrl: member.avatar,
    })),
  },
  fields: [
    defineField({
      name: "members",
      title: "团队成员 / Team members",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "nameZh", title: "姓名（中文）/ Name (Chinese)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "nameEn", title: "姓名（英文）/ Name (English)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "titleZh", title: "职位（中文）/ Title (Chinese)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "titleEn", title: "职位（英文）/ Title (English)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "experienceZh", title: "经验标签（中文）/ Experience (Chinese)", type: "string" }),
            defineField({ name: "experienceEn", title: "经验标签（英文）/ Experience (English)", type: "string" }),
            defineField({ name: "bioZh", title: "简介（中文）/ Bio (Chinese)", type: "text", rows: 4, validation: (rule) => rule.required() }),
            defineField({ name: "bioEn", title: "简介（英文）/ Bio (English)", type: "text", rows: 4, validation: (rule) => rule.required() }),
            defineField({
              name: "avatar",
              title: "头像 / Portrait",
              type: "image",
              options: { hotspot: true },
              description: "上传至 Sanity 后，网站会请求适配头像显示尺寸的优化图片。",
            }),
            defineField({
              name: "legacyAvatarUrl",
              title: "现有头像路径 / Existing portrait path",
              type: "string",
              readOnly: true,
              description: "兼容现有网站图片。上传 Sanity 头像后将优先使用 Sanity 图片。",
            }),
          ],
          preview: {
            select: { title: "nameZh", subtitle: "titleZh", media: "avatar" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "林扬团队 / Team" }),
  },
})
