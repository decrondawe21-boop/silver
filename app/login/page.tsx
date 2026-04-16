import type { Metadata } from "next"
import Link from "next/link"
import SiteFrame from "@/components/site-frame"

export const metadata: Metadata = {
  title: "Přihlášení | David Kozák Silver",
  description: "Přístupová stránka pro správu webu Silver.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
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

        <form className="login-panel">
          <div className="login-panel-heading">
            <span>Administrace</span>
            <h2>Přihlášení</h2>
            <p>Formulář je připravený pro napojení na ověřování účtu.</p>
          </div>

          <label className="form-field">
            <span>E-mail</span>
            <input type="email" name="email" autoComplete="email" placeholder="admin@david-kozak.com" />
          </label>

          <label className="form-field">
            <span>Heslo</span>
            <input type="password" name="password" autoComplete="current-password" placeholder="••••••••••••" />
          </label>

          <div className="login-options">
            <label>
              <input type="checkbox" name="remember" />
              <span>Zapamatovat zařízení</span>
            </label>
            <a href="mailto:kontakt@david-kozak.com">Obnovit přístup</a>
          </div>

          <Link className="primary-action login-submit" href="/dashboard">
            Otevřít dashboard
          </Link>
        </form>
      </section>
    </SiteFrame>
  )
}
