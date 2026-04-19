export type FooterAd = {
  id: string
  title: string
  href: string
  imageUrl: string
  imageAlt: string
  mediaType: "image" | "video"
  visible: boolean
}

export const defaultFooterAds: FooterAd[] = [
  {
    id: "repas-mobile",
    title: "Repas Mobile",
    href: "https://repasmobile.david-kozak.com",
    imageUrl: "/ads/repas-mobile-ad.png",
    imageAlt: "Repas Mobile reklama na repasované telefony",
    mediaType: "image",
    visible: true,
  },
  {
    id: "f-studio-growth",
    title: "F-Studio",
    href: "https://studio.david-kozak.com",
    imageUrl: "/ads/f-studio-growth-ad.png",
    imageAlt: "F-Studio reklama s grafem růstu",
    mediaType: "image",
    visible: true,
  },
  {
    id: "restart-integrace",
    title: "Restart Integrace",
    href: "https://restartintegrace.david-kozak.com",
    imageUrl: "/ads/restart-integrace-ad.mp4",
    imageAlt: "Restart Integrace video reklama",
    mediaType: "video",
    visible: true,
  },
  {
    id: "creative-fabrica-fonts",
    title: "Creative Fabrica fonts",
    href: "https://www.creativefabrica.com/freebies/free-fonts/ref/17041091/",
    imageUrl: "https://www.creativefabrica.com/wp-content/uploads/2018/01/freebie-banners3-party-04.png",
    imageAlt: "Font Banner - Free Fonts",
    mediaType: "image",
    visible: true,
  },
]

function sanitizeAd(candidate: unknown): FooterAd | null {
  if (typeof candidate !== "object" || candidate === null) return null

  const record = candidate as Record<string, unknown>
  const title = typeof record.title === "string" ? record.title.trim() : ""
  const href = typeof record.href === "string" ? record.href.trim() : ""
  const imageUrl = typeof record.imageUrl === "string" ? record.imageUrl.trim() : ""
  if (!title || !href || !imageUrl) return null

  return {
    id:
      typeof record.id === "string" && record.id.trim()
        ? record.id.trim()
        : `ad-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    href,
    imageUrl,
    imageAlt: typeof record.imageAlt === "string" && record.imageAlt.trim() ? record.imageAlt.trim() : title,
    mediaType: record.mediaType === "video" || imageUrl.toLowerCase().endsWith(".mp4") ? "video" : "image",
    visible: record.visible !== false,
  }
}

export function sanitizeFooterAds(value: unknown) {
  if (!Array.isArray(value)) return defaultFooterAds

  const sanitized = value.map(sanitizeAd).filter((item): item is FooterAd => Boolean(item))
  return sanitized.length > 0 ? sanitized : defaultFooterAds
}

export function getVisibleFooterAds(items: FooterAd[]) {
  return items.filter((item) => item.visible)
}
