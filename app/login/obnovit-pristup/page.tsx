import type { Metadata } from "next"
import Link from "next/link"
import SiteFrame from "@/components/site-frame"

export const metadata: Metadata = {
  title: "Obnovit přístup | David Kozák Silver",
  description: "Postup pro obnovení přístupu do administrace webu Silver.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RecoverAccessPage() {
  return (
    <SiteFrame>
      <section className="login-page access-recovery-page" aria-labelledby="recover-title">
        <div className="login-copy">
          <p className="eyebrow">Obnova přístupu</p>
          <h1 id="recover-title">Reset admin účtu běží přes produkční nastavení.</h1>
          <p>
            Přístup se obnovuje změnou hodnoty produkční proměnné `ADMIN_PASSWORD_HASH`. Po novém deployi bude platit nové heslo.
          </p>
          <div className="login-signal-row" aria-label="Kroky obnovy">
            <span>Hash</span>
            <span>Env</span>
            <span>Deploy</span>
          </div>
        </div>

        <div className="login-panel access-recovery-panel">
          <div className="login-panel-heading">
            <span>Postup</span>
            <h2>Obnovit heslo</h2>
            <p>Nové heslo se nastavuje mimo veřejný web, aby reset nebyl dostupný návštěvníkům.</p>
          </div>

          <ol className="recovery-steps">
            <li>Vygeneruj nový bcrypt hash hesla.</li>
            <li>Nastav ho ve Vercelu jako `ADMIN_PASSWORD_HASH` pro Production.</li>
            <li>Spusť nový produkční deploy.</li>
          </ol>

          <div className="recovery-command" aria-label="Příklad příkazu pro hash">
            <span>Hash příkaz</span>
            <code>node -e "require('bcryptjs').hash('NOVE_HESLO', 12).then(console.log)"</code>
          </div>

          <div className="login-options access-recovery-actions">
            <Link href="/login">Zpět na přihlášení</Link>
            <a href="mailto:kontakt@david-kozak.com?subject=Obnova%20admin%20p%C5%99%C3%ADstupu">Napsat správci</a>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
