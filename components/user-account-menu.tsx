"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Column } from "@once-ui-system/core/components/Column"
import { Icon } from "@once-ui-system/core/components/Icon"
import { Option } from "@once-ui-system/core/components/Option"
import { UserMenu } from "@once-ui-system/core/components/UserMenu"
import {
  adminSessionEvent,
  logoutAdminSession,
  refreshAdminSessionFromServer,
  readAdminSession,
  type AdminSession,
} from "@/lib/admin-session"

export default function UserAccountMenu({ className = "" }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<AdminSession | null>(null)

  useEffect(() => {
    setSession(readAdminSession())

    let isMounted = true
    const syncWithServer = async () => {
      const nextSession = await refreshAdminSessionFromServer()
      if (!isMounted) return
      setSession(nextSession)
    }

    void syncWithServer()

    return () => {
      isMounted = false
    }
  }, [pathname])

  useEffect(() => {
    const syncSession = () => {
      setSession(readAdminSession())
    }

    syncSession()
    window.addEventListener("storage", syncSession)
    window.addEventListener(adminSessionEvent, syncSession)

    return () => {
      window.removeEventListener("storage", syncSession)
      window.removeEventListener(adminSessionEvent, syncSession)
    }
  }, [])

  if (!session) return null

  const handleLogout = async () => {
    await logoutAdminSession()
    setSession(null)
    router.push("/login")
    router.refresh()
  }

  return (
    <UserMenu
      className={`account-user-menu ${className}`.trim()}
      name={session.name}
      subline={session.role}
      placement="bottom-end"
      minWidth={16}
      avatarProps={{ value: session.initials, statusIndicator: { color: "green" } }}
      dropdown={
        <Column gap="4" padding="4" minWidth={14}>
          <Option
            fillWidth
            value="dashboard"
            href="/dashboard"
            hasPrefix={<Icon size="xs" onBackground="neutral-weak" name="document" />}
            label="Dashboard"
          />
          <Option
            fillWidth
            value="contact"
            href="/kontakt"
            hasPrefix={<Icon size="xs" onBackground="neutral-weak" name="symbol" />}
            label="Kontakt"
          />
          <Option
            fillWidth
            danger
            value="logout"
            hasPrefix={<Icon size="xs" onBackground="danger-weak" name="close" />}
            label="Odhlásit"
            onClick={handleLogout}
          />
        </Column>
      }
    />
  )
}
