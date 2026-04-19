import "server-only"

import { getPostgresPool } from "@/lib/postgres"
import { defaultFooterAds, sanitizeFooterAds, type FooterAd } from "@/resources/advertisements"

const footerAdsDocumentKey = "footer_ads"

export async function readFooterAdsFromDb() {
  const result = await getPostgresPool().query<{ document_json: string }>(
    `
      SELECT document_json
      FROM site_content_documents
      WHERE document_key = $1
      LIMIT 1
    `,
    [footerAdsDocumentKey],
  )

  const document = result.rows[0]?.document_json
  if (!document) return defaultFooterAds

  try {
    return sanitizeFooterAds(JSON.parse(document))
  } catch {
    return defaultFooterAds
  }
}

export async function writeFooterAdsToDb(items: FooterAd[]) {
  const sanitized = sanitizeFooterAds(items)

  await getPostgresPool().query(
    `
      INSERT INTO site_content_documents (document_key, document_json)
      VALUES ($1, $2)
      ON CONFLICT (document_key) DO UPDATE SET
        document_json = EXCLUDED.document_json,
        updated_at = CURRENT_TIMESTAMP
    `,
    [footerAdsDocumentKey, JSON.stringify(sanitized)],
  )

  return sanitized
}

export async function seedFooterAdsIfMissing() {
  const result = await getPostgresPool().query<{ document_key: string }>(
    `
      SELECT document_key
      FROM site_content_documents
      WHERE document_key = $1
      LIMIT 1
    `,
    [footerAdsDocumentKey],
  )

  if (result.rows.length > 0) {
    return readFooterAdsFromDb()
  }

  return writeFooterAdsToDb(defaultFooterAds)
}
