import "server-only"

import { type RowDataPacket } from "mysql2/promise"

import { defaultEditablePages, type EditablePage, type EditablePageSection } from "@/resources/admin-content"
import { sanitizeEditablePages } from "@/lib/admin-site-storage"
import { getMysqlPool } from "@/lib/mysql"

const editablePagesDocumentKey = "editable_pages"

type SiteContentRow = RowDataPacket & {
  document_json: string
}

export async function readEditablePagesFromDb() {
  const [rows] = await getMysqlPool().execute<SiteContentRow[]>(
    `
      SELECT document_json
      FROM site_content_documents
      WHERE document_key = ?
      LIMIT 1
    `,
    [editablePagesDocumentKey],
  )

  const document = rows[0]?.document_json
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

  await getMysqlPool().execute(
    `
      INSERT INTO site_content_documents (document_key, document_json)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        document_json = VALUES(document_json),
        updated_at = CURRENT_TIMESTAMP
    `,
    [editablePagesDocumentKey, JSON.stringify(sanitized)],
  )

  return sanitized
}

export async function seedEditablePagesIfMissing() {
  const [rows] = await getMysqlPool().execute<RowDataPacket[]>(
    `
      SELECT document_key
      FROM site_content_documents
      WHERE document_key = ?
      LIMIT 1
    `,
    [editablePagesDocumentKey],
  )

  if (rows.length > 0) {
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
