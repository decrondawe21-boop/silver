import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import SiteFrame from "@/components/site-frame"
import { createSeoMetadata } from "@/lib/site"
import { getEditablePageByPath, getEditableSection } from "@/lib/site-content-db"
import { services } from "@/resources/site-content"

export const metadata: Metadata = createSeoMetadata({
  title: "Služby",
  description: "Weby, identita, automatizace a digitální strategie pro osobní i veřejné projekty.",
  path: "/sluzby",
})

export const dynamic = "force-dynamic"

export default async function SluzbyPage() {
  const page = await getEditablePageByPath("/sluzby")
  const hero = getEditableSection(page, "services-hero")
  const serviceObjects = hero?.objects.length ? hero.objects : services

  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">{hero?.eyebrow || "Služby"}</p>
        <h1>{hero?.title || "Od prvního dojmu po funkční systém."}</h1>
        <p>{hero?.text || "Stránka, obsah i nástroje mají držet pohromadě. Cílem je rychlý výsledek, který se dá rozvíjet."}</p>
      </section>

      <section className="services-section subpage-section">
        <div className="service-grid">
          {serviceObjects.map((service) => (
            <ElectricPanel key={service.title} className="service-panel">
              <span className="service-label">{service.label}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </ElectricPanel>
          ))}
        </div>
      </section>

      <section className="detail-grid">
        {serviceObjects.slice(0, 3).map((service) => (
          <div key={`detail-${service.title}`}>
            <span>{service.label}</span>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </div>
        ))}
      </section>
    </SiteFrame>
  )
}
