import { Arrow } from "@once-ui-system/core/components/Arrow"
import DynamicReveal from "@/components/dynamic-reveal"
import ElectricPanel from "@/components/electric-panel"
import HeroImageFlip from "@/components/hero-image-flip"
import HeroMatrix from "@/components/hero-matrix"
import HomeNewsFeed from "@/components/home-news-feed"
import SiteFrame from "@/components/site-frame"
import WeatherLeafLayout from "@/components/weather-leaf-layout"
import { getEditablePageByPath, getEditableSection } from "@/lib/site-content-db"
import { defaultHomeNews } from "@/resources/admin-content"

export const dynamic = "force-dynamic"

export default async function Home() {
  const page = await getEditablePageByPath("/")
  const hero = getEditableSection(page, "home-hero")
  const news = getEditableSection(page, "home-news")
  const profile = getEditableSection(page, "home-profile")
  const services = getEditableSection(page, "home-services")
  const contact = getEditableSection(page, "home-contact")

  return (
    <SiteFrame>
      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">{hero?.eyebrow || "David Kozák"}</p>
          <HeroMatrix />
          <p className="hero-text">
            {hero?.text || "Druhou šanci si zaslouží každý. Vize, kreativita a realita tady dostávají konkrétní tvar."}
          </p>
          <div className="hero-actions">
            <a id="home-contact-link" className="primary-action" href={hero?.primaryCtaHref || "/kontakt"}>
              {hero?.primaryCtaLabel || "Domluvit spolupráci"}
              <Arrow trigger="#home-contact-link" color="onSolid" scale={1} />
            </a>
            <a id="home-projects-link" className="secondary-action" href={hero?.secondaryCtaHref || "/projekty"}>
              {hero?.secondaryCtaLabel || "Prohlédnout práci"}
              <Arrow trigger="#home-projects-link" scale={1} />
            </a>
          </div>
        </div>

        <ElectricPanel className="hero-panel">
          <div className="portrait-wrap">
            <HeroImageFlip
              imageUrl={hero?.imageUrl || "/hero-road-meaning.png"}
              imageAlt={hero?.imageAlt || "Černobílá cesta k horám s osobním mottem"}
              quote={hero?.quote || hero?.title || "Druhou šanci si zaslouží každý."}
              text={hero?.text}
            />
          </div>
          <div className="panel-caption">
            <span>Osobní motto</span>
            <strong>{hero?.quote || hero?.title || "Druhou šanci si zaslouží každý."}</strong>
          </div>
        </ElectricPanel>
      </section>

      <WeatherLeafLayout />

      <section id="aktuality" className="news-section">
        <DynamicReveal className="reveal-block">
          <div className="section-heading">
            <p className="eyebrow">{news?.eyebrow || "Aktuality"}</p>
            <h2>{news?.title || "Nové zápisy, změny a pracovní směry."}</h2>
          </div>
        </DynamicReveal>
        <DynamicReveal className="reveal-block" delay={0.12}>
          <HomeNewsFeed defaultItems={defaultHomeNews} />
        </DynamicReveal>
      </section>

      <section id="profil" className="split-section">
        <DynamicReveal className="reveal-block">
          <div>
            <p className="eyebrow">{profile?.eyebrow || "Profil"}</p>
            <h2>{profile?.title || "Klidný vzhled, ostrá myšlenka a jasný výsledek."}</h2>
          </div>
        </DynamicReveal>
        <DynamicReveal className="reveal-block" delay={0.1}>
          <div className="section-copy">
            <p>
              {profile?.text || "Pomáhám převést osobní značku, službu nebo nápad do podoby, která působí profesionálně a dá se hned použít."}
            </p>
            <div className="signal-row" aria-label="Zaměření">
              {(profile?.objects.length ? profile.objects : [
                { id: "web", title: "Web" },
                { id: "brand", title: "Brand" },
                { id: "ai", title: "AI" },
              ]).slice(0, 3).map((object) => (
                <span key={object.id}>{object.title}</span>
              ))}
            </div>
            <a id="home-profile-link" className="section-inline-link" href={profile?.primaryCtaHref || "/profil"}>
              {profile?.primaryCtaLabel || "Otevřít profil"}
              <Arrow trigger="#home-profile-link" scale={0.9} />
            </a>
          </div>
        </DynamicReveal>
      </section>

      <section id="sluzby" className="services-section">
        <DynamicReveal className="reveal-block">
          <div className="section-heading">
            <p className="eyebrow">{services?.eyebrow || "Služby"}</p>
            <h2>{services?.title || "Od prvního dojmu po funkční systém."}</h2>
            <a id="home-services-link" className="section-inline-link" href={services?.primaryCtaHref || "/sluzby"}>
              {services?.primaryCtaLabel || "Detail služeb"}
              <Arrow trigger="#home-services-link" scale={0.9} />
            </a>
          </div>
        </DynamicReveal>
        <div className="service-grid">
          {(services?.objects ?? []).map((service, index) => (
            <DynamicReveal key={service.id} className="reveal-grid-item" delay={0.08 * index}>
              <ElectricPanel className="service-panel">
                <span className="service-label">{service.label}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </ElectricPanel>
            </DynamicReveal>
          ))}
        </div>
      </section>

      <section id="kontakt" className="contact-section">
        <DynamicReveal className="reveal-block">
          <ElectricPanel className="contact-panel">
            <p className="eyebrow">{contact?.eyebrow || "Kontakt"}</p>
            <h2>{contact?.title || "Pojďme společně tvořit budoucnost."}</h2>
            <p>
              {contact?.text || "Propojíme vizi s realitou a sny se stanou skutečností."}
            </p>
            <a id="home-mail-link" className="primary-action" href={contact?.primaryCtaHref || "mailto:kontakt@david-kozak.com"}>
              {contact?.primaryCtaLabel || "kontakt@david-kozak.com"}
              <Arrow trigger="#home-mail-link" color="onSolid" scale={1} />
            </a>
          </ElectricPanel>
        </DynamicReveal>
      </section>
    </SiteFrame>
  )
}
