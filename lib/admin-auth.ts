import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import mysql, { type RowDataPacket } from "mysql2/promise"
import { cookies } from "next/headers"

import type { AdminSession } from "@/lib/admin-session"

type AdminRow = RowDataPacket & {
  id: number
  username: string
  password_hash: string
  is_active: number
}

export type AdminAccount = {
  id: number
  username: string
  password_hash: string
  is_active: number
  source: "env" | "mysql"
}

type SessionPayload = {
  adminId: number
  username: string
  iat: number
  exp: number
}

export type AuthenticatedAdmin = {
  adminId: number
  username: string
  signedInAt: string
}

export const adminSessionCookieName = "silver_admin_session"

const shortSessionTtlSeconds = 60 * 60 * 12
const longSessionTtlSeconds = 60 * 60 * 24 * 30

let pool: mysql.Pool | null = null

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 characters long.")
  }
  return secret
}

function getMysqlPool() {
  if (pool) return pool

  const url = process.env.MYSQL_URL
  if (url) {
    pool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
    return pool
  }

  const password = process.env.MYSQL_PASSWORD
  if (!password) {
    throw new Error("MYSQL_PASSWORD is required when MYSQL_URL is not set.")
  }

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST ?? "127.0.0.1",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? "personal_web_app",
    password,
    database: process.env.MYSQL_DATABASE ?? "personal_web",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  return pool
}

function getEnvAdminAccount(username: string): AdminAccount | null {
  const envUsername = process.env.ADMIN_USERNAME?.trim() || "admin"
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim()

  if (!passwordHash || username !== envUsername) {
    return null
  }

  return {
    id: 1,
    username: envUsername,
    password_hash: passwordHash,
    is_active: 1,
    source: "env",
  }
}

function createInitials(value: string) {
  const parts = value
    .split(/[\s._-]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return "AD"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url")
}

function parseSessionPayload(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) return null

  const expectedSignature = signPayload(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedBuffer.length) return null
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<SessionPayload>
    if (
      typeof payload.adminId !== "number" ||
      typeof payload.username !== "string" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) return null

    return {
      adminId: payload.adminId,
      username: payload.username,
      iat: payload.iat,
      exp: payload.exp,
    }
  } catch {
    return null
  }
}

export function getSessionTtlSeconds(rememberDevice: boolean) {
  return rememberDevice ? longSessionTtlSeconds : shortSessionTtlSeconds
}

export function createSessionToken(adminId: number, username: string, ttlSeconds: number) {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    adminId,
    username,
    iat: nowSeconds,
    exp: nowSeconds + ttlSeconds,
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  const signature = signPayload(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function buildSessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}

export function buildAdminSession(username: string, signedInAt: string): AdminSession {
  const displayName = process.env.ADMIN_PROFILE_NAME?.trim() || username
  const displayEmail = process.env.ADMIN_PROFILE_EMAIL?.trim() || `${username}@localhost`
  const displayRole = process.env.ADMIN_PROFILE_ROLE?.trim() || "Správce webu"

  return {
    username,
    name: displayName,
    email: displayEmail,
    role: displayRole,
    initials: createInitials(displayName),
    signedInAt,
  }
}

export async function findAdminByUsername(username: string) {
  const envAdmin = getEnvAdminAccount(username)
  if (envAdmin) {
    return envAdmin
  }

  try {
    const [rows] = await getMysqlPool().execute<AdminRow[]>(
      `
        SELECT id, username, password_hash, is_active
        FROM admin_users
        WHERE username = ? AND singleton = 1
        LIMIT 1
      `,
      [username],
    )

    const admin = rows[0]
    if (!admin || admin.is_active !== 1) return null

    return {
      ...admin,
      source: "mysql" as const,
    }
  } catch (error) {
    if (process.env.ADMIN_PASSWORD_HASH) {
      console.error("MySQL admin lookup failed; env admin fallback was checked first.", error)
      return null
    }

    throw error
  }
}

async function findAdminById(adminId: number) {
  const envUsername = process.env.ADMIN_USERNAME?.trim() || "admin"
  const envAdmin = getEnvAdminAccount(envUsername)
  if (envAdmin && adminId === envAdmin.id) {
    return envAdmin
  }

  try {
    const [rows] = await getMysqlPool().execute<AdminRow[]>(
      `
        SELECT id, username, password_hash, is_active
        FROM admin_users
        WHERE id = ? AND singleton = 1
        LIMIT 1
      `,
      [adminId],
    )

    const admin = rows[0]
    if (!admin || admin.is_active !== 1) return null

    return {
      ...admin,
      source: "mysql" as const,
    }
  } catch (error) {
    if (process.env.ADMIN_PASSWORD_HASH) {
      console.error("MySQL admin session lookup failed; env admin fallback was checked first.", error)
      return null
    }

    throw error
  }
}

export async function updateAdminLastLogin(admin: AdminAccount) {
  if (admin.source === "env") {
    return
  }

  await getMysqlPool().execute(
    `
      UPDATE admin_users
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = ? AND singleton = 1
    `,
    [admin.id],
  )
}

export async function readAuthenticatedAdminFromCookies(): Promise<AuthenticatedAdmin | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(adminSessionCookieName)?.value
    if (!token) return null

    const payload = parseSessionPayload(token)
    if (!payload) return null

    const admin = await findAdminById(payload.adminId)
    if (!admin || admin.username !== payload.username) return null

    return {
      adminId: admin.id,
      username: admin.username,
      signedInAt: new Date(payload.iat * 1000).toISOString(),
    }
  } catch {
    return null
  }
}
