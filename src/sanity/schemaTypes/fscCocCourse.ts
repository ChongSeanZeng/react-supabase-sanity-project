import { defineField, defineType } from "sanity"
import { fscCocCourseDescription, fscCocCourseTitle, fscCocCurriculum } from "@/data/fscCocCurriculum"
import { fscCocVideoAssets } from "@/data/fscCocVideoAssets"

export const fscCocCourse = defineType({
  name: "fscCocCourse",
  title: "课程内容",
  type: "document",
  initialValue: {
    title: fscCocCourseTitle,
    slug: { current: "fsc-coc" },
    description: fscCocCourseDescription,
    published: false,
    lessons: fscCocCurriculum.map((lesson, index) => ({
      _key: `lesson-${index + 1}`,
      title: lesson.title,
      outline: [...lesson.outline],
      ...fscCocVideoAssets[index],
    })),
  },
  fields: [
    defineField({ name: "title", title: "课程名称", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "课程标识",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "课程介绍", type: "text", rows: 3 }),
    defineField({ name: "published", title: "发布课程", type: "boolean", initialValue: false }),
    defineField({
      name: "lessons",
      title: "课程视频（共 6 节）",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "视频标题", type: "string", validation: (rule) => rule.required() }),
          defineField({
            name: "outline",
            title: "本节内容",
            type: "array",
            of: [{ type: "string" }],
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "developmentVideo",
            title: "开发测试 MP4（仅本地开发）",
            type: "file",
            options: {
              accept: "video/mp4",
              storeOriginalFilename: true,
            },
            description: "只用于本地开发环境测试，不会替代阿里云正式播放。Sanity Dataset 文件资源为公开链接。",
          }),
          defineField({ name: "durationMinutes", title: "时长（分钟）", type: "number", validation: (rule) => rule.min(0) }),
          defineField({ name: "videoAssetId", title: "阿里云媒体资源 ID", type: "string", description: "匹配预设课程视频资源 ID，用于正式学员播放。" }),
        ],
        preview: { select: { title: "title", subtitle: "durationMinutes" } },
      }],
      validation: (rule) => rule.required().length(6),
    }),
  ],
  preview: { select: { title: "title", subtitle: "published" } },
})
