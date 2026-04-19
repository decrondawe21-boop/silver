import type { Metadata } from "next"

export const productionUrl = "https://silver.david-kozak.com"
export const alternateProductionUrls = ["https://d-international.eu"] as const

const productionUrlCandidates = [productionUrl, ...alternateProductionUrls]

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    productionUrl

  const withProtocol = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`

  const normalizedUrl = withProtocol.replace(/\/$/, "")
  const isKnownProductionUrl = productionUrlCandidates.some((candidate) => candidate === normalizedUrl)

  if (process.env.NEXT_PUBLIC_SITE_URL || isKnownProductionUrl) {
    return normalizedUrl
  }

  return productionUrl
}

export function createAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, productionUrl).toString()
}

export const siteName = "David Kozák | Silver"
export const siteDescription =
  "Osobní web Davida Kozáka ve stříbrném elektrickém stylu s veřejnými projekty, digitální identitou a kontaktem."

export function createSeoMetadata({
  description,
  path = "/",
  title,
}: {
  description: string
  path?: string
  title?: string
}): Metadata {
  const canonical = createAbsoluteUrl(path)
  const metadataTitle = title ? `${title} | ${siteName}` : siteName

  return {
    title: title ?? siteName,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "cs_CZ",
      url: canonical,
      siteName,
      title: metadataTitle,
      description,
      images: [
        {
          url: createAbsoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: metadataTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [createAbsoluteUrl("/twitter-image")],
    },
  }
}
