import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import ProfileTiltCard from "@/components/profile-tilt-card"
import SiteFrame from "@/components/site-frame"
import { getEditablePageByPath, getEditableSection } from "@/lib/site-content-db"

export const metadata: Metadata = {
  title: "Profil | David Kozák Silver",
  description: "Osobní profil Davida Kozáka, digitální styl práce a směr webu Silver.",
}

export const dynamic = "force-dynamic"

export default async function ProfilPage() {
  const page = await getEditablePageByPath("/profil")
  const hero = getEditableSection(page, "profile-hero")

  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">{hero?.eyebrow || "Profil"}</p>
        <h1>{hero?.title || "Klidný vzhled, ostrá myšlenka a jasný výsledek."}</h1>
        <p>
          {hero?.text || "Osobní značka, web a digitální systém mají působit přirozeně. Tady je prostor pro nápady, které se dají opravdu použít."}
        </p>
      </section>

      <section className="split-section subpage-split">
        <div>
          <p className="eyebrow">Směr</p>
          <h2>{hero?.quote || "Vizuál, obsah a technické řešení drží jednu linku."}</h2>
        </div>
        <div className="section-copy">
          <p>
            {hero?.notes || "Stavím jednoduché digitální cesty pro prezentaci, spolupráci a rychlé ověření nových nápadů. Všechno má zůstat čitelné, osobní a dostatečně ostré."}
          </p>
          <div className="signal-row" aria-label="Zaměření profilu">
            {(hero?.objects.length ? hero.objects : [
              { id: "web", title: "Web" },
              { id: "brand", title: "Brand" },
              { id: "ai", title: "AI" },
            ]).slice(0, 3).map((object) => (
              <span key={object.id}>{object.title}</span>
            ))}
          </div>
          <ProfileTiltCard />
        </div>
      </section>

      <section className="page-panel-section">
        <ElectricPanel className="contact-panel">
          <p className="eyebrow">Princip</p>
          <h2>{hero?.quote || "Méně šumu, víc směru."}</h2>
          <p>{hero?.notes || "Každá stránka má mít jasnou úlohu, vlastní atmosféru a rychlou cestu k další akci."}</p>
        </ElectricPanel>
      </section>
    </SiteFrame>
  )
}
