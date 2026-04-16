import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import SiteFrame from "@/components/site-frame"

export const metadata: Metadata = {
  title: "Kontakt | David Kozák Silver",
  description: "Kontakt pro spolupráci na webu, osobní prezentaci, automatizaci a digitální strategii.",
}

export default function KontaktPage() {
  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">Kontakt</p>
        <h1>Pojďme společně tvořit budoucnost.</h1>
        <p>Propojíme vizi s realitou a sny se stanou skutečností.</p>
      </section>

      <section className="contact-grid">
        <ElectricPanel className="contact-panel">
          <p className="eyebrow">E-mail</p>
          <h2>Nejrychlejší cesta k domluvě.</h2>
          <p>Stačí krátce napsat, co chceš posunout a jaký výsledek má dávat smysl.</p>
          <a className="primary-action" href="mailto:kontakt@david-kozak.com">
            kontakt@david-kozak.com
          </a>
        </ElectricPanel>

        <div className="contact-notes">
          <div>
            <span>01</span>
            <strong>Web nebo identita</strong>
            <p>Nová prezentace, úprava směru nebo jasnější texty.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Automatizace</strong>
            <p>Jednodušší procesy a méně ruční práce.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Digitální strategie</strong>
            <p>Plán pro další verzi, veřejný projekt nebo pracovní plochu.</p>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
