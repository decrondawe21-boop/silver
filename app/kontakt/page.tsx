import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import SiteFrame from "@/components/site-frame"
import { getEditablePageByPath, getEditableSection } from "@/lib/site-content-db"

export const metadata: Metadata = {
  title: "Kontakt | David Kozák Silver",
  description: "Kontakt pro spolupráci na webu, osobní prezentaci, automatizaci a digitální strategii.",
}

export const dynamic = "force-dynamic"

export default async function KontaktPage() {
  const page = await getEditablePageByPath("/kontakt")
  const contact = getEditableSection(page, "contact-main")

  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">{contact?.eyebrow || "Kontakt"}</p>
        <h1>{contact?.title || "Pojďme společně tvořit budoucnost."}</h1>
        <p>{contact?.text || "Propojíme vizi s realitou a sny se stanou skutečností."}</p>
      </section>

      <section className="contact-grid">
        <ElectricPanel className="contact-panel">
          <p className="eyebrow">E-mail</p>
          <h2>{contact?.quote || "Nejrychlejší cesta k domluvě."}</h2>
          <p>{contact?.notes || "Stačí krátce napsat, co chceš posunout a jaký výsledek má dávat smysl."}</p>
          <a className="primary-action" href={contact?.primaryCtaHref || "mailto:kontakt@david-kozak.com"}>
            {contact?.primaryCtaLabel || "kontakt@david-kozak.com"}
          </a>
        </ElectricPanel>

        <div className="contact-notes">
          {(contact?.objects ?? []).slice(0, 3).map((object) => (
            <div key={object.id}>
              <span>{object.label}</span>
              <strong>{object.title}</strong>
              <p>{object.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteFrame>
  )
}
