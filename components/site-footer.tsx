import Link from "next/link"
import FooterWeatherMark from "@/components/footer-weather-mark"
import { dominantProjects, navigationPages } from "@/resources/site-content"

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Patička webu">
      <FooterWeatherMark />

      <div className="footer-brand">
        <Link className="brand-mark" href="/" aria-label="David Kozák">
          DK
        </Link>
        <div>
          <strong>David Kozák | Silver</strong>
          <p>Osobní web, veřejné projekty a digitální pracovní plocha ve stříbrném směru.</p>
        </div>
      </div>

      <aside className="footer-ad-slot" aria-label="Reklamní prostor">
        <span>Reklama</span>
        <a
          className="footer-ad-card"
          href="https://www.creativefabrica.com/freebies/free-fonts/ref/17041091/"
          title="Font Banner - Free Fonts"
          target="_blank"
          rel="sponsored noopener"
        >
          <img
            src="https://www.creativefabrica.com/wp-content/uploads/2018/01/freebie-banners3-party-04.png"
            alt="Font Banner - Free Fonts"
            loading="lazy"
            decoding="async"
          />
        </a>
      </aside>

      <div className="footer-grid">
        <nav aria-label="Footer navigace">
          <span>Stránky</span>
          <Link href="/">Domů</Link>
          {navigationPages.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Vybrané projekty">
          <span>Projekty</span>
          {dominantProjects.map((project) => (
            <a href={project.url} key={project.url} target="_blank" rel="noreferrer">
              {project.name}
            </a>
          ))}
        </nav>

        <div>
          <span>Správa</span>
          <Link href="/login">Přihlášení</Link>
          <Link href="/dashboard">Admin panel</Link>
          <a href="mailto:kontakt@david-kozak.com">kontakt@david-kozak.com</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 David Kozák</span>
        <span>Silver web system</span>
      </div>
    </footer>
  )
}
