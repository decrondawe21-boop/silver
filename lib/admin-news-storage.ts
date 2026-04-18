import type { HomeNewsItem } from "@/resources/admin-content"
import { adminStorageKey } from "@/resources/admin-content"

export type StoredNewsResult =
  | {
      status: "saved"
      items: HomeNewsItem[]
    }
  | {
      status: "saved-without-images"
      items: HomeNewsItem[]
    }
  | {
      status: "failed"
      items: HomeNewsItem[]
    }

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function withoutEmbeddedImages(items: HomeNewsItem[]) {
  return items.map(({ imageDataUrl, ...item }) => item)
}

export function readStoredNews() {
  if (!isBrowser()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(adminStorageKey)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as HomeNewsItem[]) : []
  } catch {
    return []
  }
}

export function writeStoredNews(items: HomeNewsItem[]): StoredNewsResult {
  if (!isBrowser()) {
    return { status: "saved", items }
  }

  try {
    window.localStorage.setItem(adminStorageKey, JSON.stringify(items))
    return { status: "saved", items }
  } catch {
    const compactItems = withoutEmbeddedImages(items)

    try {
      window.localStorage.setItem(adminStorageKey, JSON.stringify(compactItems))
      return { status: "saved-without-images", items: compactItems }
    } catch {
      return { status: "failed", items }
    }
  }
}

export function mergePublishedNews(defaultItems: HomeNewsItem[], storedItems: HomeNewsItem[]) {
  const byId = new Map<string, HomeNewsItem>()

  for (const item of defaultItems) {
    if (item.status === "published") {
      byId.set(item.id, item)
    }
  }

  for (const item of storedItems) {
    if (item.status === "published") {
      byId.set(item.id, item)
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.date.localeCompare(a.date))
}
