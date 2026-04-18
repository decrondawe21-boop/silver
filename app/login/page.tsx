import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminLoginPanel from "@/components/admin-login-panel"
import SiteFrame from "@/components/site-frame"
import { readAuthenticatedAdminFromCookies } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Přihlášení | David Kozák Silver",
  description: "Přístupová stránka pro správu webu Silver.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage() {
  const admin = await readAuthenticatedAdminFromCookies()
  if (admin) {
    redirect("/dashboard")
  }

  return (
    <SiteFrame>
      <section className="login-page" aria-labelledby="login-title">
        <div className="login-copy">
          <p className="eyebrow">Správa webu</p>
          <h1 id="login-title">Přístup do administračního prostoru.</h1>
          <p>
            Jeden vstup pro obsah, veřejné projekty, SEO kontrolu a rychlé provozní úpravy webu.
          </p>
          <div className="login-signal-row" aria-label="Oblasti správy">
            <span>Obsah</span>
            <span>SEO</span>
            <span>Projekty</span>
          </div>
        </div>

        <AdminLoginPanel />
      </section>
    </SiteFrame>
  )
}
