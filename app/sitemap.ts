import type { MetadataRoute } from "next"
import { createAbsoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/profil", priority: 0.78 },
    { path: "/sluzby", priority: 0.82 },
    { path: "/projekty", priority: 0.86 },
    { path: "/kontakt", priority: 0.72 },
  ]

  return pages.map((page) => ({
    url: createAbsoluteUrl(page.path),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: page.priority,
  }))
}
