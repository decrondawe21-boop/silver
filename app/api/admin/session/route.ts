import { NextResponse } from "next/server"

import {
  adminSessionCookieName,
  buildAdminSession,
  buildSessionCookieOptions,
  readAuthenticatedAdminFromCookies,
} from "@/lib/admin-auth"

export const runtime = "nodejs"

export async function GET() {
  const admin = await readAuthenticatedAdminFromCookies()

  if (!admin) {
    const response = NextResponse.json({ session: null }, { status: 401 })
    response.cookies.set(adminSessionCookieName, "", buildSessionCookieOptions(0))
    return response
  }

  return NextResponse.json({
    session: buildAdminSession(admin.username, admin.signedInAt),
  })
}
