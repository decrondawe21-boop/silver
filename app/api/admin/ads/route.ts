import { NextResponse } from "next/server"

import { readAuthenticatedAdminFromCookies } from "@/lib/admin-auth"
import { readFooterAdsFromDb, seedFooterAdsIfMissing, writeFooterAdsToDb } from "@/lib/site-ads-db"
import { sanitizeFooterAds, type FooterAd } from "@/resources/advertisements"

type AdsRequestBody = {
  ads?: FooterAd[]
}

export const runtime = "nodejs"

async function requireAdmin() {
  const admin = await readAuthenticatedAdminFromCookies()
  return Boolean(admin)
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Přihlášení vypršelo. Přihlas se znovu." }, { status: 401 })
  }

  try {
    const ads = await seedFooterAdsIfMissing()
    return NextResponse.json({ ads })
  } catch (error) {
    console.error("Admin ads GET failed:", error)
    return NextResponse.json({ error: "Reklamy se nepodařilo načíst ze Supabase." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Přihlášení vypršelo. Přihlas se znovu." }, { status: 401 })
  }

  let body: AdsRequestBody

  try {
    body = (await request.json()) as AdsRequestBody
  } catch {
    return NextResponse.json({ error: "Neplatný JSON payload." }, { status: 400 })
  }

  try {
    const ads = await writeFooterAdsToDb(sanitizeFooterAds(body.ads))
    return NextResponse.json({ ads })
  } catch (error) {
    console.error("Admin ads PUT failed:", error)
    return NextResponse.json({ error: "Reklamy se nepodařilo uložit do Supabase." }, { status: 500 })
  }
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Přihlášení vypršelo. Přihlas se znovu." }, { status: 401 })
  }

  try {
    const ads = await readFooterAdsFromDb()
    return NextResponse.json({ ads })
  } catch (error) {
    console.error("Admin ads POST failed:", error)
    return NextResponse.json({ error: "Reklamy se nepodařilo obnovit ze Supabase." }, { status: 500 })
  }
}
