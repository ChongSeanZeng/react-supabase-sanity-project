import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "./schemaTypes"
import { sanityDataset, sanityProjectId } from "./environment"

export const sanityConfig = defineConfig({
  name: "eastinflink",
  title: "East Inflink",
  projectId: sanityProjectId || "missing-sanity-project-id",
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) => S.list()
        .id("content-management")
        .title("内容管理")
        .items([
          S.listItem()
            .title("课程")
            .id("courses")
            .child(
              S.list()
                .id("courses-list")
                .title("课程")
                .items([
                  S.listItem()
                    .title("FSC CoC")
                    .id("fsc-coc-course")
                    .child(
                      S.document()
                        .schemaType("fscCocCourse")
                        .documentId("fsc-coc-course")
                        .title("课程内容"),
                    ),
                ]),
            ),
          S.listItem()
            .title("林扬团队 / Team")
            .id("team-content")
            .child(
              S.document()
                .schemaType("teamContent")
                .documentId("team-content")
                .title("林扬团队 / Team"),
            ),
          ...S.documentTypeListItems().filter((item) => !["fscCocCourse", "teamContent"].includes(item.getId() ?? "")),
        ]),
    }),
  ],
  document: {
    actions: (previous, context) => ["fscCocCourse", "teamContent"].includes(context.schemaType)
      ? previous.filter(({ action }) => action !== "delete")
      : previous,
  },
  schema: { types: schemaTypes },
})
