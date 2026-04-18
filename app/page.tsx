import { Arrow } from "@once-ui-system/core/components/Arrow"
import DynamicReveal from "@/components/dynamic-reveal"
import ElectricPanel from "@/components/electric-panel"
import HeroImageFlip from "@/components/hero-image-flip"
import HeroMatrix from "@/components/hero-matrix"
import HomeNewsFeed from "@/components/home-news-feed"
import SiteFrame from "@/components/site-frame"
import WeatherLeafLayout from "@/components/weather-leaf-layout"
import { defaultHomeNews } from "@/resources/admin-content"
import { services } from "@/resources/site-content"

export default function Home() {
  return (
    <SiteFrame>
      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">David Kozák</p>
          <HeroMatrix />
          <p className="hero-text">
            Druhou šanci si zaslouží každý. Vize, kreativita a realita tady dostávají konkrétní tvar.
          </p>
          <div className="hero-actions">
            <a id="home-contact-link" className="primary-action" href="/kontakt">
              Domluvit spolupráci
              <Arrow trigger="#home-contact-link" color="onSolid" scale={1} />
            </a>
            <a id="home-projects-link" className="secondary-action" href="/projekty">
              Prohlédnout práci
              <Arrow trigger="#home-projects-link" scale={1} />
            </a>
          </div>
        </div>

        <ElectricPanel className="hero-panel">
          <div className="portrait-wrap">
            <HeroImageFlip />
          </div>
          <div className="panel-caption">
            <span>Osobní motto</span>
            <strong>Druhou šanci si zaslouží každý.</strong>
          </div>
        </ElectricPanel>
      </section>

      <WeatherLeafLayout />

      <section id="aktuality" className="news-section">
        <DynamicReveal className="reveal-block">
          <div className="section-heading">
            <p className="eyebrow">Aktuality</p>
            <h2>Nové zápisy, změny a pracovní směry.</h2>
          </div>
        </DynamicReveal>
        <DynamicReveal className="reveal-block" delay={0.12}>
          <HomeNewsFeed defaultItems={defaultHomeNews} />
        </DynamicReveal>
      </section>

      <section id="profil" className="split-section">
        <DynamicReveal className="reveal-block">
          <div>
            <p className="eyebrow">Profil</p>
            <h2>Klidný vzhled, ostrá myšlenka a jasný výsledek.</h2>
          </div>
        </DynamicReveal>
        <DynamicReveal className="reveal-block" delay={0.1}>
          <div className="section-copy">
            <p>
              Pomáhám převést osobní značku, službu nebo nápad do podoby, která působí profesionálně a dá se hned použít.
            </p>
            <div className="signal-row" aria-label="Zaměření">
              <span>Web</span>
              <span>Brand</span>
              <span>AI</span>
            </div>
            <a id="home-profile-link" className="section-inline-link" href="/profil">
              Otevřít profil
              <Arrow trigger="#home-profile-link" scale={0.9} />
            </a>
          </div>
        </DynamicReveal>
      </section>

      <section id="sluzby" className="services-section">
        <DynamicReveal className="reveal-block">
          <div className="section-heading">
            <p className="eyebrow">Služby</p>
            <h2>Od prvního dojmu po funkční systém.</h2>
            <a id="home-services-link" className="section-inline-link" href="/sluzby">
              Detail služeb
              <Arrow trigger="#home-services-link" scale={0.9} />
            </a>
          </div>
        </DynamicReveal>
        <div className="service-grid">
          {services.map((service, index) => (
            <DynamicReveal key={service.title} className="reveal-grid-item" delay={0.08 * index}>
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
            <p className="eyebrow">Kontakt</p>
            <h2>Pojďme společně tvořit budoucnost.</h2>
            <p>
              Propojíme vizi s realitou a sny se stanou skutečností.
            </p>
            <a id="home-mail-link" className="primary-action" href="mailto:kontakt@david-kozak.com">
              kontakt@david-kozak.com
              <Arrow trigger="#home-mail-link" color="onSolid" scale={1} />
            </a>
          </ElectricPanel>
        </DynamicReveal>
      </section>
    </SiteFrame>
  )
}
