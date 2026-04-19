"use client"

import { useEffect, useRef, useState } from "react"
import {
  BriefcaseBusiness,
  ChevronDown,
  ExternalLink,
  FolderOpen,
  Gauge,
  Home,
  LayoutGrid,
  LogIn,
  Mail,
  MessageSquare,
  UserRound,
  Wrench,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MatrixFx } from "@once-ui-system/core/components/MatrixFx"
import UserAccountMenu from "@/components/user-account-menu"
import { dominantProjects, getProjectHost, navigationPages } from "@/resources/site-content"

function getNavigationIcon(href: string) {
  if (href === "/profil") return UserRound
  if (href === "/sluzby") return Wrench
  if (href === "/projekty") return FolderOpen
  if (href === "/kontakt") return Mail
  return BriefcaseBusiness
}

export default function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isMatrixActive = isOpen || isMenuHovered

  useEffect(() => {
    setIsOpen(false)
    setIsMenuHovered(false)
  }, [pathname])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <header className="site-header" aria-label="Hlavní navigace">
      <MatrixFx
        className="site-header-matrix"
        position="absolute"
        top="0"
        left="0"
        fill
        trigger="manual"
        active={isMatrixActive}
        colors={["brand-solid-medium", "accent-solid-medium"]}
        size={3}
        spacing={5}
        speed={1.45}
        revealFrom="left"
        flicker
        reducedMotion="auto"
      />
      <Link className="brand-mark" href="/" aria-label="David Kozák">
        DK
      </Link>
      <div className="header-actions">
        <nav className="mega-nav" aria-label="Sekce webu">
          <div
            ref={menuRef}
            className={isOpen ? "mega-menu is-open" : "mega-menu"}
            onPointerEnter={() => setIsMenuHovered(true)}
            onPointerLeave={() => setIsMenuHovered(false)}
            onFocusCapture={() => setIsOpen(true)}
            onBlurCapture={(event) => {
              const nextTarget = event.relatedTarget as Node | null

              if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                setIsOpen(false)
                setIsMenuHovered(false)
              }
            }}
          >
            <button
              className="mega-trigger"
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((current) => !current)}
            >
              <LayoutGrid className="mega-trigger-icon" size={16} strokeWidth={2.2} aria-hidden="true" />
              Menu
              <span>Procházet</span>
              <ChevronDown className="mega-trigger-chevron" size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <div className="mega-panel" aria-label="Hlavní menu">
              <MatrixFx
                className="mega-panel-matrix"
                position="absolute"
                top="0"
                left="0"
                fill
                trigger="manual"
                active={isOpen}
                colors={["brand-solid-medium"]}
                size={2}
                spacing={4}
                speed={0.9}
                revealFrom="top"
                flicker
                reducedMotion="auto"
              />
              <div className="mega-column mega-column-main">
                <span className="mega-label">Stránky</span>
                <Link className={pathname === "/" ? "mega-link is-active" : "mega-link"} href="/" onClick={() => setIsOpen(false)}>
                  <strong>
                    <Home className="mega-link-icon" size={16} strokeWidth={2.1} aria-hidden="true" />
                    Domů
                  </strong>
                  <span>Úvod, matrix, profil a rychlý přehled.</span>
                </Link>
                {navigationPages.map((item) => {
                  const NavigationIcon = getNavigationIcon(item.href)

                  return (
                    <Link
                      key={item.href}
                      className={pathname === item.href ? "mega-link is-active" : "mega-link"}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <strong>
                        <NavigationIcon className="mega-link-icon" size={16} strokeWidth={2.1} aria-hidden="true" />
                        {item.label}
                      </strong>
                      <span>{item.description}</span>
                    </Link>
                  )
                })}
              </div>
              <div className="mega-column">
                <span className="mega-label">Dominantní projekty</span>
                {dominantProjects.map((project) => (
                  <a key={project.url} className="mega-link" href={project.url} target="_blank" rel="noreferrer">
                    <strong>
                      <ExternalLink className="mega-link-icon" size={16} strokeWidth={2.1} aria-hidden="true" />
                      {project.name}
                    </strong>
                    <span>{getProjectHost(project.url)}</span>
                  </a>
                ))}
              </div>
              <div className="mega-column mega-column-action">
                <span className="mega-label">Rychle</span>
                <Link className="mega-cta mega-login-cta" href="/login" onClick={() => setIsOpen(false)}>
                  <LogIn className="mega-action-icon" size={16} strokeWidth={2.2} aria-hidden="true" />
                  Přihlášení do správy
                </Link>
                <a className="mega-cta mega-email-cta" href="mailto:kontakt@david-kozak.com">
                  <Mail className="mega-action-icon" size={16} strokeWidth={2.2} aria-hidden="true" />
                  kontakt@david-kozak.com
                </a>
                <Link className="mega-mini-link" href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Gauge className="mega-link-icon" size={15} strokeWidth={2.1} aria-hidden="true" />
                  Dashboard webu
                </Link>
                <Link className="mega-mini-link" href="/projekty" onClick={() => setIsOpen(false)}>
                  <FolderOpen className="mega-link-icon" size={15} strokeWidth={2.1} aria-hidden="true" />
                  Veřejné projekty
                </Link>
                <Link className="mega-mini-link" href="/kontakt" onClick={() => setIsOpen(false)}>
                  <MessageSquare className="mega-link-icon" size={15} strokeWidth={2.1} aria-hidden="true" />
                  Domluvit spolupráci
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="site-account-slot" aria-label="Uživatelský účet">
          <UserAccountMenu />
        </div>
      </div>
    </header>
  )
}
