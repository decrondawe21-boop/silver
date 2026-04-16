import type { Metadata } from "next"
import ElectricPanel from "@/components/electric-panel"
import ProjectCarousel from "@/components/project-carousel"
import ProjectPreviewCard from "@/components/project-preview-card"
import SiteFrame from "@/components/site-frame"
import { dominantProjects, otherProjects } from "@/resources/site-content"

export const metadata: Metadata = {
  title: "Projekty | David Kozák Silver",
  description: "Veřejné projekty Davida Kozáka s automatickými miniaturami, odkazy a krátkým popisem.",
}

export default function ProjektyPage() {
  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">Projekty</p>
        <h1>Veřejné projekty propojené jednou digitální stopou.</h1>
        <p>Dominantní weby, experimenty a pracovní plochy na jednom místě.</p>
      </section>

      <section className="projects-section subpage-section">
        <div className="public-project-showcase">
          <ElectricPanel className="project-carousel-panel">
            <div className="project-carousel-heading">
              <span>Dominantní výběr</span>
              <p>Čtyři nejsilnější směry pro první průchod.</p>
            </div>
            <ProjectCarousel projects={dominantProjects} />
          </ElectricPanel>

          <div className="featured-project-grid" aria-label="Dominantní veřejné projekty">
            {dominantProjects.map((project, index) => (
              <ProjectPreviewCard key={project.url} project={project} index={index} variant="dominant" />
            ))}
          </div>

          <div className="project-archive-heading">
            <span>Ostatní</span>
            <p>Další veřejné směry a pracovní plochy.</p>
          </div>

          <div className="project-mini-grid" aria-label="Ostatní veřejné projekty">
            {otherProjects.map((project, index) => (
              <ProjectPreviewCard
                key={project.url}
                project={project}
                index={index + dominantProjects.length}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
