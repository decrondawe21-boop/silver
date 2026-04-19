"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AccordionGroup, Badge, Button, Column, Icon, Row, Text, User } from "@once-ui-system/core"
import {
  adminSessionEvent,
  defaultAdminSession,
  logoutAdminSession,
  refreshAdminSessionFromServer,
  readAdminSession,
  type AdminSession,
} from "@/lib/admin-session"

type AdminSidebar6Props = {
  activePanel: AdminPanelId
  activeDraftTitle: string
  onSelectPanel: (panelId: AdminPanelId) => void
  publishedItems: number
  totalItems: number
}

export type AdminPanelId =
  | "overview"
  | "pages"
  | "news"
  | "ads"
  | "owner"
  | "data"
  | "preview"
  | "database"
  | "structure"

type SidebarLink = {
  description: string
  icon: string
  label: string
  href?: string
  panelId?: AdminPanelId
  meta?: string
}

function SidebarTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <Row className="admin-sidebar6-title" gap="8" vertical="center">
      <Icon name={icon} size="s" onBackground="neutral-weak" />
      <span>{label}</span>
    </Row>
  )
}

type SidebarLinkItemProps = SidebarLink & {
  activePanel: AdminPanelId
  onSelectPanel: (panelId: AdminPanelId) => void
}

function SidebarLinkItem({ activePanel, description, href, icon, label, meta, onSelectPanel, panelId }: SidebarLinkItemProps) {
  const body = (
    <>
      <span>
        <Icon name={icon} size="s" onBackground="neutral-weak" />
        <strong>{label}</strong>
      </span>
      <small>{description}</small>
      {meta ? <em>{meta}</em> : null}
    </>
  )

  if (panelId) {
    return (
      <button
        className={activePanel === panelId ? "admin-sidebar6-link is-active" : "admin-sidebar6-link"}
        type="button"
        onClick={() => onSelectPanel(panelId)}
        aria-current={activePanel === panelId ? "page" : undefined}
      >
        {body}
      </button>
    )
  }

  return (
    <a className="admin-sidebar6-link" href={href}>
      {body}
    </a>
  )
}

export default function AdminSidebar6({
  activePanel,
  activeDraftTitle,
  onSelectPanel,
  publishedItems,
  totalItems,
}: AdminSidebar6Props) {
  const router = useRouter()
  const [session, setSession] = useState<AdminSession>(defaultAdminSession)
  const draftTitle = activeDraftTitle.trim() || "Nový příspěvek"

  useEffect(() => {
    const syncSession = () => {
      setSession(readAdminSession() ?? defaultAdminSession)
    }

    syncSession()

    let isMounted = true
    const syncWithServer = async () => {
      const nextSession = await refreshAdminSessionFromServer()
      if (!isMounted || !nextSession) return
      setSession(nextSession)
    }

    void syncWithServer()

    window.addEventListener(adminSessionEvent, syncSession)

    return () => {
      isMounted = false
      window.removeEventListener(adminSessionEvent, syncSession)
    }
  }, [])

  const logout = async () => {
    await logoutAdminSession()
    router.push("/login")
    router.refresh()
  }

  const navGroups: Array<{ title: ReactNode; links: SidebarLink[] }> = [
    {
      title: <SidebarTitle icon="document" label="Pracovní plocha" />,
      links: [
        {
          panelId: "overview",
          icon: "radialGauge",
          label: "Přehled",
          description: "Stav obsahu a rychlá orientace.",
        },
        {
          panelId: "news",
          icon: "wordmark",
          label: "Aktuality",
          description: "Editor, upload a fronta příspěvků.",
          meta: draftTitle,
        },
        {
          panelId: "preview",
          icon: "eye",
          label: "Náhled",
          description: "Kontrola karty před publikací.",
        },
        {
          panelId: "ads",
          icon: "plus",
          label: "Reklama",
          description: "Vkládání, úpravy a viditelnost.",
        },
      ],
    },
    {
      title: <SidebarTitle icon="world" label="Homepage" />,
      links: [
        {
          panelId: "pages",
          icon: "document",
          label: "Stránky a sekce",
          description: "Texty, citáty, CTA, objekty.",
        },
        {
          panelId: "structure",
          icon: "chevronsLeftRight",
          label: "Mapa sekcí",
          description: "Kam patří homepage bloky.",
        },
        {
          href: "/#aktuality",
          icon: "arrowUpRight",
          label: "Aktuality na webu",
          description: "Otevřít publikovaný výstup.",
          meta: `${publishedItems} live`,
        },
        {
          href: "/",
          icon: "computer",
          label: "Zpět na web",
          description: "Veřejná homepage.",
        },
      ],
    },
    {
      title: <SidebarTitle icon="security" label="Systém" />,
      links: [
        {
          panelId: "data",
          icon: "document",
          label: "Import / export",
          description: "Upload, stahování a obnova dat.",
        },
        {
          panelId: "database",
          icon: "radialGauge",
          label: "Supabase",
          description: "Schéma pro produkční data.",
        },
        {
          href: "/login",
          icon: "person",
          label: "Login stránka",
          description: "Lokální vstup do administrace.",
        },
      ],
    },
  ]

  return (
    <aside className="admin-sidebar6" aria-label="Sidebar6 administrace">
      <div className="admin-sidebar6-head">
        <Badge title="Sidebar6" icon="document" arrow={false} effect={false} />
        <h2>Správa webu</h2>
        <Text as="p" variant="body-default-s" onBackground="neutral-weak">
          Rychlá navigace po editoru, databázi a homepage sekcích.
        </Text>
      </div>

      <div className="admin-sidebar6-metrics" aria-label="Souhrn obsahu">
        <span>
          <strong>{publishedItems}</strong>
          publikované
        </span>
        <span>
          <strong>{totalItems}</strong>
          celkem
        </span>
      </div>

      <AccordionGroup
        className="admin-sidebar6-nav"
        autoCollapse={false}
        size="s"
        items={navGroups.map((group) => ({
          title: group.title,
          content: (
            <Column gap="8" fillWidth>
              {group.links.map((link) => (
                <SidebarLinkItem
                  key={`${link.label}-${link.href ?? link.panelId}`}
                  {...link}
                  activePanel={activePanel}
                  onSelectPanel={onSelectPanel}
                />
              ))}
            </Column>
          ),
        }))}
      />

      <div className="admin-sidebar6-profile" aria-label="Profil správce">
        <User
          name={session.name}
          subline={session.role}
          avatarProps={{ value: session.initials, statusIndicator: { color: "green" } }}
        />
        <Text as="p" variant="body-default-s" onBackground="neutral-weak">
          {session.email}
        </Text>
        <Row className="admin-sidebar6-actions" gap="8" fillWidth>
          <Button variant="secondary" size="s" fillWidth onClick={() => onSelectPanel("owner")}>
            Upravit profil
          </Button>
          <Button variant="danger" size="s" fillWidth onClick={logout}>
            Odhlásit
          </Button>
        </Row>
      </div>
    </aside>
  )
}
