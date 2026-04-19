import type { MetadataRoute } from "next"
import { createAbsoluteUrl, siteDescription, siteName } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: createAbsoluteUrl("/"),
    name: siteName,
    short_name: "Silver DK",
    description: siteDescription,
    start_url: createAbsoluteUrl("/"),
    scope: createAbsoluteUrl("/"),
    display: "standalone",
    background_color: "#070809",
    theme_color: "#070809",
    categories: ["portfolio", "business", "productivity"],
    icons: [
      {
        src: createAbsoluteUrl("/icon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: createAbsoluteUrl("/opengraph-image"),
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  }
}
