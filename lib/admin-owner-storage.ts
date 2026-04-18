export type OwnerProfile = {
  fullName: string
  role: string
  shortBio: string
  longBio: string
  email: string
  phone: string
  location: string
  website: string
  avatarDataUrl?: string
  resumeDataUrl?: string
  resumeFileName?: string
  updatedAt: string
}

export const adminOwnerStorageKey = "silver-admin-owner-v1"

export const defaultOwnerProfile: OwnerProfile = {
  fullName: "David Kozak",
  role: "Spravce webu",
  shortBio: "Osobni znacka, web a digitalni system maji pusobit prirozene a citelne.",
  longBio:
    "Stavim jednoduche digitalni cesty pro prezentaci, spolupraci a rychle overeni novych napadu. Vsechno ma zustat osobni, prehledne a prakticke.",
  email: "kontakt@david-kozak.com",
  phone: "+420 000 000 000",
  location: "Ceska republika",
  website: "https://silver.david-kozak.com",
  updatedAt: "",
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function normalizeOwnerProfile(raw: Partial<OwnerProfile>): OwnerProfile {
  return {
    ...defaultOwnerProfile,
    ...raw,
    fullName: typeof raw.fullName === "string" && raw.fullName.trim() ? raw.fullName.trim() : defaultOwnerProfile.fullName,
    role: typeof raw.role === "string" && raw.role.trim() ? raw.role.trim() : defaultOwnerProfile.role,
    shortBio:
      typeof raw.shortBio === "string" && raw.shortBio.trim() ? raw.shortBio.trim() : defaultOwnerProfile.shortBio,
    longBio: typeof raw.longBio === "string" && raw.longBio.trim() ? raw.longBio.trim() : defaultOwnerProfile.longBio,
    email: typeof raw.email === "string" && raw.email.trim() ? raw.email.trim() : defaultOwnerProfile.email,
    phone: typeof raw.phone === "string" ? raw.phone.trim() : defaultOwnerProfile.phone,
    location: typeof raw.location === "string" ? raw.location.trim() : defaultOwnerProfile.location,
    website: typeof raw.website === "string" ? raw.website.trim() : defaultOwnerProfile.website,
    avatarDataUrl: typeof raw.avatarDataUrl === "string" ? raw.avatarDataUrl : undefined,
    resumeDataUrl: typeof raw.resumeDataUrl === "string" ? raw.resumeDataUrl : undefined,
    resumeFileName: typeof raw.resumeFileName === "string" ? raw.resumeFileName : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
  }
}

export function readStoredOwnerProfile() {
  if (!isBrowser()) {
    return defaultOwnerProfile
  }

  try {
    const raw = window.localStorage.getItem(adminOwnerStorageKey)
    if (!raw) {
      return defaultOwnerProfile
    }

    return normalizeOwnerProfile(JSON.parse(raw) as Partial<OwnerProfile>)
  } catch {
    return defaultOwnerProfile
  }
}

export function writeStoredOwnerProfile(profile: OwnerProfile) {
  if (!isBrowser()) {
    return
  }

  const normalized = normalizeOwnerProfile(profile)

  try {
    window.localStorage.setItem(adminOwnerStorageKey, JSON.stringify(normalized))
  } catch {
    const compactProfile: OwnerProfile = {
      ...normalized,
      avatarDataUrl: undefined,
      resumeDataUrl: undefined,
      resumeFileName: undefined,
    }

    try {
      window.localStorage.setItem(adminOwnerStorageKey, JSON.stringify(compactProfile))
    } catch {
      // Local storage is a convenience cache for the admin preview. Keep the UI running if the browser refuses the write.
    }
  }
}

export function sanitizeOwnerProfile(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return defaultOwnerProfile
  }

  return normalizeOwnerProfile(raw as Partial<OwnerProfile>)
}
