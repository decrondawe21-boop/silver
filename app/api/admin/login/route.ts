import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import {
  adminSessionCookieName,
  buildAdminSession,
  buildSessionCookieOptions,
  createSessionToken,
  findAdminByUsername,
  getSessionTtlSeconds,
  updateAdminLastLogin,
} from "@/lib/admin-auth"

type LoginBody = {
  username?: string
  password?: string
  rememberDevice?: boolean
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  let body: LoginBody

  try {
    body = (await request.json()) as LoginBody
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 })
  }

  const username = body.username?.trim() || ""
  const password = body.password || ""
  const rememberDevice = Boolean(body.rememberDevice)

  if (!username || !password) {
    return NextResponse.json({ error: "Vyplň uživatelské jméno i heslo." }, { status: 400 })
  }

  try {
    const admin = await findAdminByUsername(username)
    if (!admin) {
      return NextResponse.json({ error: "Neplatné přihlašovací údaje." }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash)
    if (!passwordMatches) {
      return NextResponse.json({ error: "Neplatné přihlašovací údaje." }, { status: 401 })
    }

    await updateAdminLastLogin(admin)

    const ttlSeconds = getSessionTtlSeconds(rememberDevice)
    const token = createSessionToken(admin.id, admin.username, ttlSeconds)
    const signedInAt = new Date().toISOString()

    const response = NextResponse.json({
      session: buildAdminSession(admin.username, signedInAt),
    })

    response.cookies.set(adminSessionCookieName, token, buildSessionCookieOptions(ttlSeconds))
    return response
  } catch (error) {
    console.error("Admin login failed:", error)
    return NextResponse.json({ error: "Server nedokázal ověřit přihlášení." }, { status: 500 })
  }
}
