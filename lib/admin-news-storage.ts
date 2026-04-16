import type { HomeNewsItem } from "@/resources/admin-content"
import { adminStorageKey } from "@/resources/admin-content"

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
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

export function writeStoredNews(items: HomeNewsItem[]) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(adminStorageKey, JSON.stringify(items))
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
