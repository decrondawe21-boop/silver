import { adminSiteStorageKey, defaultEditablePages, type EditablePage } from "@/resources/admin-content"

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function asRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

export function sanitizeEditablePages(value: unknown): EditablePage[] {
  if (!Array.isArray(value)) {
    return defaultEditablePages
  }

  const pages = value
    .filter(asRecord)
    .map((page, pageIndex) => ({
      id: stringValue(page.id, `page-${pageIndex}`),
      path: stringValue(page.path, "/"),
      navLabel: stringValue(page.navLabel, "Stránka"),
      metaTitle: stringValue(page.metaTitle),
      metaDescription: stringValue(page.metaDescription),
      sections: Array.isArray(page.sections)
        ? page.sections.filter(asRecord).map((section, sectionIndex) => ({
            id: stringValue(section.id, `section-${pageIndex}-${sectionIndex}`),
            label: stringValue(section.label, "Sekce"),
            eyebrow: stringValue(section.eyebrow),
            title: stringValue(section.title),
            text: stringValue(section.text),
            quote: stringValue(section.quote),
            imageUrl: stringValue(section.imageUrl),
            imageAlt: stringValue(section.imageAlt),
            primaryCtaLabel: stringValue(section.primaryCtaLabel),
            primaryCtaHref: stringValue(section.primaryCtaHref),
            secondaryCtaLabel: stringValue(section.secondaryCtaLabel),
            secondaryCtaHref: stringValue(section.secondaryCtaHref),
            notes: stringValue(section.notes),
            objects: Array.isArray(section.objects)
              ? section.objects.filter(asRecord).map((object, objectIndex) => ({
                  id: stringValue(object.id, `object-${pageIndex}-${sectionIndex}-${objectIndex}`),
                  label: stringValue(object.label),
                  title: stringValue(object.title),
                  text: stringValue(object.text),
                  url: stringValue(object.url) || undefined,
                }))
              : [],
          }))
        : [],
    }))
    .filter((page) => page.id && page.path && page.navLabel)

  return pages.length > 0 ? pages : defaultEditablePages
}

export function readStoredEditablePages() {
  if (!isBrowser()) {
    return defaultEditablePages
  }

  try {
    const raw = window.localStorage.getItem(adminSiteStorageKey)
    if (!raw) {
      return defaultEditablePages
    }

    return sanitizeEditablePages(JSON.parse(raw))
  } catch {
    return defaultEditablePages
  }
}

export function writeStoredEditablePages(pages: EditablePage[]) {
  if (!isBrowser()) {
    return false
  }

  try {
    window.localStorage.setItem(adminSiteStorageKey, JSON.stringify(pages))
    return true
  } catch {
    return false
  }
}
