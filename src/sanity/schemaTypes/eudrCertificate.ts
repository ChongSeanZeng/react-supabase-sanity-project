import { defineField, defineType } from "sanity"

export const eudrCertificate = defineType({
  name: "eudrCertificate",
  title: "EUDR 验证信息 / EUDR Verification Record",
  type: "document",
  fieldsets: [
    {
      name: "verificationDetails",
      title: "验证信息 / Verification details",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "ddsReference",
      title: "DDS reference 编号 / DDS reference number",
      type: "string",
      fieldset: "verificationDetails",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reportHolder",
      title: "报告持有人 / 公司名称 · Report holder / Company",
      type: "string",
      fieldset: "verificationDetails",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "verificationDate",
      title: "现场验证时间 / On-site verification date",
      type: "date",
      fieldset: "verificationDetails",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reportValidUntil",
      title: "报告有效期至 / Report valid until",
      type: "date",
      fieldset: "verificationDetails",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "productType",
      title: "产品类型 / Product type",
      type: "string",
      fieldset: "verificationDetails",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hsCode",
      title: "HS Code（前 4 位）/ First 4 digits",
      type: "string",
      fieldset: "verificationDetails",
      validation: (rule) => rule.required().regex(/^\d{4}$/),
    }),
    defineField({
      name: "treeSpecies",
      title: "树种 / Tree species",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "verificationDetails",
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: "conclusion",
      title: "结论 / Conclusion",
      type: "text",
      rows: 2,
      fieldset: "verificationDetails",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "ddsReference",
      subtitle: "reportHolder",
    },
  },
})
