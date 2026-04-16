import Link from "next/link"
import { dominantProjects, navigationPages } from "@/resources/site-content"

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Patička webu">
      <div className="footer-brand">
        <Link className="brand-mark" href="/" aria-label="David Kozák">
          DK
        </Link>
        <div>
          <strong>David Kozák | Silver</strong>
          <p>Osobní web, veřejné projekty a digitální pracovní plocha ve stříbrném směru.</p>
        </div>
      </div>

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
