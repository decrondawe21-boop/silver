import "server-only"

import { defaultEditablePages, type EditablePage, type EditablePageSection } from "@/resources/admin-content"
import { sanitizeEditablePages } from "@/lib/admin-site-storage"
import { getPostgresPool } from "@/lib/postgres"

const editablePagesDocumentKey = "editable_pages"

export async function readEditablePagesFromDb() {
  const result = await getPostgresPool().query<{ document_json: string }>(
    `
      SELECT document_json
      FROM site_content_documents
      WHERE document_key = $1
      LIMIT 1
    `,
    [editablePagesDocumentKey],
  )

  const document = result.rows[0]?.document_json
  if (!document) {
    return defaultEditablePages
  }

  try {
    return sanitizeEditablePages(JSON.parse(document))
  } catch {
    return defaultEditablePages
  }
}

export async function writeEditablePagesToDb(pages: EditablePage[]) {
  const sanitized = sanitizeEditablePages(pages)

  await getPostgresPool().query(
    `
      INSERT INTO site_content_documents (document_key, document_json)
      VALUES ($1, $2)
      ON CONFLICT (document_key) DO UPDATE SET
        document_json = EXCLUDED.document_json,
        updated_at = CURRENT_TIMESTAMP
    `,
    [editablePagesDocumentKey, JSON.stringify(sanitized)],
  )

  return sanitized
}

export async function seedEditablePagesIfMissing() {
  const result = await getPostgresPool().query<{ document_key: string }>(
    `
      SELECT document_key
      FROM site_content_documents
      WHERE document_key = $1
      LIMIT 1
    `,
    [editablePagesDocumentKey],
  )

  if (result.rows.length > 0) {
    return readEditablePagesFromDb()
  }

  return writeEditablePagesToDb(defaultEditablePages)
}

export async function getEditablePageByPath(path: string) {
  try {
    const pages = await readEditablePagesFromDb()
    return pages.find((page) => page.path === path) ?? defaultEditablePages.find((page) => page.path === path) ?? null
  } catch {
    return defaultEditablePages.find((page) => page.path === path) ?? null
  }
}

export function getEditableSection(page: EditablePage | null, sectionId: string): EditablePageSection | null {
  return page?.sections.find((section) => section.id === sectionId) ?? null
}
