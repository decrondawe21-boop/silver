import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import ProfileTiltCard from "@/components/profile-tilt-card"
import SiteFrame from "@/components/site-frame"

export const metadata: Metadata = {
  title: "Profil | David Kozák Silver",
  description: "Osobní profil Davida Kozáka, digitální styl práce a směr webu Silver.",
}

export default function ProfilPage() {
  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">Profil</p>
        <h1>Klidný vzhled, ostrá myšlenka a jasný výsledek.</h1>
        <p>
          Osobní značka, web a digitální systém mají působit přirozeně. Tady je prostor pro nápady, které se dají
          opravdu použít.
        </p>
      </section>

      <section className="split-section subpage-split">
        <div>
          <p className="eyebrow">Směr</p>
          <h2>Vizuál, obsah a technické řešení drží jednu linku.</h2>
        </div>
        <div className="section-copy">
          <p>
            Stavím jednoduché digitální cesty pro prezentaci, spolupráci a rychlé ověření nových nápadů. Všechno má
            zůstat čitelné, osobní a dostatečně ostré.
          </p>
          <div className="signal-row" aria-label="Zaměření profilu">
            <span>Web</span>
            <span>Brand</span>
            <span>AI</span>
          </div>
          <ProfileTiltCard />
        </div>
      </section>

      <section className="page-panel-section">
        <ElectricPanel className="contact-panel">
          <p className="eyebrow">Princip</p>
          <h2>Méně šumu, víc směru.</h2>
          <p>Každá stránka má mít jasnou úlohu, vlastní atmosféru a rychlou cestu k další akci.</p>
        </ElectricPanel>
      </section>
    </SiteFrame>
  )
}
