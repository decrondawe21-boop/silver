import { NextResponse } from "next/server"

import { readAuthenticatedAdminFromCookies } from "@/lib/admin-auth"
import { readEditablePagesFromDb, seedEditablePagesIfMissing, writeEditablePagesToDb } from "@/lib/site-content-db"
import { sanitizeEditablePages } from "@/lib/admin-site-storage"

type SiteContentBody = {
  pages?: unknown
}

export const runtime = "nodejs"

async function requireAdmin() {
  const admin = await readAuthenticatedAdminFromCookies()
  return Boolean(admin)
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nepřihlášený přístup." }, { status: 401 })
  }

  try {
    const pages = await seedEditablePagesIfMissing()
    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Failed to read site content:", error)
    return NextResponse.json({ error: "Obsah webu se nepodařilo načíst z MySQL." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nepřihlášený přístup." }, { status: 401 })
  }

  let body: SiteContentBody

  try {
    body = (await request.json()) as SiteContentBody
  } catch {
    return NextResponse.json({ error: "Neplatný JSON požadavek." }, { status: 400 })
  }

  try {
    const pages = await writeEditablePagesToDb(sanitizeEditablePages(body.pages))
    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Failed to save site content:", error)
    return NextResponse.json({ error: "Obsah webu se nepodařilo uložit do MySQL." }, { status: 500 })
  }
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nepřihlášený přístup." }, { status: 401 })
  }

  try {
    const pages = await readEditablePagesFromDb()
    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Failed to refresh site content:", error)
    return NextResponse.json({ error: "Obsah webu se nepodařilo obnovit z MySQL." }, { status: 500 })
  }
}
