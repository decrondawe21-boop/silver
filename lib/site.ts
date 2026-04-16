export const productionUrl = "https://silver.david-kozak.com"

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    productionUrl

  const withProtocol = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`

  return withProtocol.replace(/\/$/, "")
}

export const siteName = "David Kozák | Silver"
export const siteDescription =
  "Osobní web Davida Kozáka ve stříbrném elektrickém stylu s veřejnými projekty, digitální identitou a kontaktem."
