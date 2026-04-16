import type { MetadataRoute } from "next"
import { productionUrl, siteDescription, siteName } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "Silver DK",
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070809",
    theme_color: "#070809",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: `${productionUrl}/opengraph-image`,
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  }
}
