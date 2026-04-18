"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@once-ui-system/core/components/User"
import { defaultAdminSession, type AdminSession, writeAdminSession } from "@/lib/admin-session"

type LoginResponse = {
  session?: AdminSession
  error?: string
}

export default function AdminLoginPanel() {
  const router = useRouter()
  const [username, setUsername] = useState(defaultAdminSession.username)
  const [password, setPassword] = useState("")
  const [rememberDevice, setRememberDevice] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const normalizedUsername = username.trim()
    if (!normalizedUsername || !password) {
      setErrorMessage("Vyplň uživatelské jméno i heslo.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: normalizedUsername,
          password,
          rememberDevice,
        }),
      })

      const payload = (await response.json()) as LoginResponse
      if (!response.ok || !payload.session) {
        setErrorMessage(payload.error || "Přihlášení se nepodařilo.")
        return
      }

      writeAdminSession(payload.session)
      setPassword("")
      router.push("/dashboard")
      router.refresh()
    } catch {
      setErrorMessage("Přihlášení se nepodařilo dokončit. Zkus to znovu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="login-panel" onSubmit={handleSubmit}>
      <div className="login-panel-heading">
        <span>Administrace</span>
        <h2>Přihlášení</h2>
        <p>Přihlášení používá produkční admin účet a případně MySQL tabulku `admin_users`.</p>
      </div>

      <div className="login-user-preview">
        <User
          name={defaultAdminSession.name}
          subline={defaultAdminSession.role}
          avatarProps={{ value: defaultAdminSession.initials, statusIndicator: { color: "green" } }}
        />
        <span>Po vstupu se v hlavičce zobrazí Once UI UserMenu.</span>
      </div>

      <label className="form-field">
        <span>Uživatelské jméno</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="admin"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <label className="form-field">
        <span>Heslo</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <div className="login-options">
        <label>
          <input
            type="checkbox"
            name="remember"
            checked={rememberDevice}
            onChange={(event) => setRememberDevice(event.target.checked)}
            disabled={isSubmitting}
          />
          <span>Zapamatovat zařízení</span>
        </label>
        <Link href="/login/obnovit-pristup">Obnovit přístup</Link>
      </div>

      {errorMessage ? <p className="form-error-message">{errorMessage}</p> : null}

      <button className="primary-action login-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ověřuji..." : "Otevřít dashboard"}
      </button>
    </form>
  )
}
