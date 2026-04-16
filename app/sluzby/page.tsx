import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import SiteFrame from "@/components/site-frame"
import { services } from "@/resources/site-content"

export const metadata: Metadata = {
  title: "Služby | David Kozák Silver",
  description: "Weby, identita, automatizace a digitální strategie pro osobní i veřejné projekty.",
}

export default function SluzbyPage() {
  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">Služby</p>
        <h1>Od prvního dojmu po funkční systém.</h1>
        <p>Stránka, obsah i nástroje mají držet pohromadě. Cílem je rychlý výsledek, který se dá rozvíjet.</p>
      </section>

      <section className="services-section subpage-section">
        <div className="service-grid">
          {services.map((service) => (
            <ElectricPanel key={service.title} className="service-panel">
              <span className="service-label">{service.label}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </ElectricPanel>
          ))}
        </div>
      </section>

      <section className="detail-grid">
        <div>
          <span>01</span>
          <h2>Rychlá prezentace</h2>
          <p>Jasná struktura, texty a vizuální výraz pro první dojem.</p>
        </div>
        <div>
          <span>02</span>
          <h2>Digitální úklid</h2>
          <p>Zpřehlednění procesu, obsahu nebo malého interního workflow.</p>
        </div>
        <div>
          <span>03</span>
          <h2>Směr další verze</h2>
          <p>Konkrétní plán, co ponechat, co zjednodušit a co posunout.</p>
        </div>
      </section>
    </SiteFrame>
  )
}
