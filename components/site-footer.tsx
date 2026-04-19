import Link from "next/link"
import FooterWeatherMark from "@/components/footer-weather-mark"
import { readFooterAdsFromDb } from "@/lib/site-ads-db"
import { defaultFooterAds, getVisibleFooterAds } from "@/resources/advertisements"
import { dominantProjects, navigationPages } from "@/resources/site-content"

export default async function SiteFooter() {
  let footerAds = defaultFooterAds

  try {
    footerAds = await readFooterAdsFromDb()
  } catch {
    footerAds = defaultFooterAds
  }

  const visibleFooterAds = getVisibleFooterAds(footerAds)
  const getMediaStyle = (ad: (typeof visibleFooterAds)[number]) => ({
    objectPosition: ad.objectPosition,
    transform: `scale(${ad.mediaZoom || 1})`,
    transformOrigin: ad.objectPosition,
  })

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
        <div className="footer-ad-list">
          {visibleFooterAds.map((ad) => (
            <a
              className="footer-ad-card"
              href={ad.href}
              title={ad.title}
              target="_blank"
              rel="sponsored noopener"
              key={ad.id}
            >
              {ad.mediaType === "video" ? (
                <video
                  src={ad.imageUrl}
                  aria-label={ad.imageAlt}
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  style={getMediaStyle(ad)}
                />
              ) : (
                <img
                  src={ad.imageUrl}
                  alt={ad.imageAlt}
                  loading="lazy"
                  decoding="async"
                  style={getMediaStyle(ad)}
                />
              )}
            </a>
          ))}
        </div>
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
