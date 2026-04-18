export type AdminSession = {
  username: string
  name: string
  role: string
  email: string
  initials: string
  signedInAt: string
}

export const adminSessionKey = "silver-admin-session-v1"
export const adminSessionEvent = "silver-admin-session-change"

export const defaultAdminSession: AdminSession = {
  username: "admin",
  name: "Admin",
  role: "Správce webu",
  email: "admin@localhost",
  initials: "AD",
  signedInAt: "",
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function notifySessionChange() {
  window.dispatchEvent(new Event(adminSessionEvent))
}

export function readAdminSession() {
  if (!canUseStorage()) return null

  try {
    const raw = window.localStorage.getItem(adminSessionKey)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<AdminSession>
    if (!parsed.name || !parsed.email) return null

    return {
      ...defaultAdminSession,
      ...parsed,
    }
  } catch {
    return null
  }
}

export function writeAdminSession(session: AdminSession) {
  if (!canUseStorage()) return

  window.localStorage.setItem(adminSessionKey, JSON.stringify(session))
  notifySessionChange()
}

export function clearAdminSession() {
  if (!canUseStorage()) return

  window.localStorage.removeItem(adminSessionKey)
  notifySessionChange()
}

type AdminSessionResponse = {
  session?: AdminSession | null
}

export async function refreshAdminSessionFromServer() {
  if (typeof window === "undefined") return null

  try {
    const response = await fetch("/api/admin/session", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      clearAdminSession()
      return null
    }

    const payload = (await response.json()) as AdminSessionResponse
    if (!payload.session) {
      clearAdminSession()
      return null
    }

    writeAdminSession(payload.session)
    return payload.session
  } catch {
    return readAdminSession()
  }
}

export async function logoutAdminSession() {
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch {
      // Ignore network errors and clear local state anyway.
    }
  }

  clearAdminSession()
}
