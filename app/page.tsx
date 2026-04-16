import ElectricPanel from "@/components/electric-panel"
import HeroMatrix from "@/components/hero-matrix"
import HomeNewsFeed from "@/components/home-news-feed"
import ProfileTiltCard from "@/components/profile-tilt-card"
import ProjectPreviewCard from "@/components/project-preview-card"
import SiteFrame from "@/components/site-frame"
import { defaultHomeNews } from "@/resources/admin-content"
import { dominantProjects, services } from "@/resources/site-content"

export default function Home() {
  return (
    <SiteFrame>
      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">David Kozák</p>
          <HeroMatrix />
          <p className="hero-text">
            Tvořím digitální prezentace, weby a jednoduché systémy, které propojují vizi s realitou.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="/kontakt">
              Domluvit spolupráci
            </a>
            <a className="secondary-action" href="/projekty">
              Prohlédnout práci
            </a>
          </div>
        </div>

        <ElectricPanel className="hero-panel">
          <div className="portrait-wrap">
            <img src="/hero-road-meaning.png" alt="Černobílá cesta k horám s textem Toto je cesta, která má smysl" />
          </div>
          <div className="panel-caption">
            <span>Osobní motto</span>
            <strong>Toto je cesta, která má smysl...</strong>
          </div>
        </ElectricPanel>
      </section>

      <section id="aktuality" className="news-section">
        <div className="section-heading">
          <p className="eyebrow">Aktuality</p>
          <h2>Nové zápisy, změny a pracovní směry.</h2>
        </div>
        <HomeNewsFeed defaultItems={defaultHomeNews} />
      </section>

      <section id="profil" className="split-section">
        <div>
          <p className="eyebrow">Profil</p>
          <h2>Klidný vzhled, ostrá myšlenka a jasný výsledek.</h2>
        </div>
        <div className="section-copy">
          <p>
            Pomáhám převést osobní značku, službu nebo nápad do podoby, která působí profesionálně a dá se hned použít.
          </p>
          <div className="signal-row" aria-label="Zaměření">
            <span>Web</span>
            <span>Brand</span>
            <span>AI</span>
          </div>
          <ProfileTiltCard />
        </div>
      </section>

      <section id="sluzby" className="services-section">
        <div className="section-heading">
          <p className="eyebrow">Služby</p>
          <h2>Od prvního dojmu po funkční systém.</h2>
          <a className="section-inline-link" href="/sluzby">
            Detail služeb
          </a>
        </div>
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

      <section id="projekty" className="projects-section">
        <div className="section-heading">
          <p className="eyebrow">Výběr projektů</p>
          <h2>Na homepage patří jen rychlý průchod. Celý archiv je zvlášť.</h2>
          <a className="section-inline-link" href="/projekty">
            Otevřít všechny projekty
          </a>
        </div>
        <div className="featured-project-grid" aria-label="Vybrané veřejné projekty">
          {dominantProjects.slice(0, 2).map((project, index) => (
            <ProjectPreviewCard key={project.url} project={project} index={index} variant="dominant" />
          ))}
        </div>
      </section>

      <section id="kontakt" className="contact-section">
        <ElectricPanel className="contact-panel">
          <p className="eyebrow">Kontakt</p>
          <h2>Pojďme společně tvořit budoucnost.</h2>
          <p>
            Propojíme vizi s realitou a sny se stanou skutečností.
          </p>
          <a className="primary-action" href="mailto:kontakt@david-kozak.com">
            kontakt@david-kozak.com
          </a>
        </ElectricPanel>
      </section>
    </SiteFrame>
  )
}
