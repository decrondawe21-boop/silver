import { NextResponse } from "next/server"

import { adminSessionCookieName, buildSessionCookieOptions } from "@/lib/admin-auth"

export const runtime = "nodejs"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminSessionCookieName, "", buildSessionCookieOptions(0))
  return response
}
