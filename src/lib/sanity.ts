import { createClient } from "@sanity/client"
import { sanityDataset, sanityProjectId } from "@/sanity/environment"

export const sanityClient = sanityProjectId
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: "2025-02-19",
      useCdn: false,
      perspective: "published",
    })
  : null
