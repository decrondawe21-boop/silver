import "server-only"

import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export function getMysqlPool() {
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
