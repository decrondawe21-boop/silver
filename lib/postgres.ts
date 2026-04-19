import "server-only"

import { Pool } from "pg"

let pool: Pool | null = null

function getPostgresUrl() {
  return (process.env.SUPABASE_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL)?.trim()
}

export function getPostgresPool() {
  if (pool) return pool

  const connectionString = getPostgresUrl()
  if (!connectionString) {
    throw new Error("SUPABASE_DATABASE_URL, POSTGRES_URL, or DATABASE_URL must be set.")
  }

  pool = new Pool({
    connectionString,
    max: 5,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  return pool
}
