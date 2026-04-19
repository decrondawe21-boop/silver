import type { Metadata } from "next"
import { Badge, Column, Row, Scroller, Text } from "@once-ui-system/core"
import DynamicReveal from "@/components/dynamic-reveal"
import ProjectPreviewCard from "@/components/project-preview-card"
import SiteFrame from "@/components/site-frame"
import { createSeoMetadata } from "@/lib/site"
import { getEditablePageByPath, getEditableSection } from "@/lib/site-content-db"
import { dominantProjects, otherProjects } from "@/resources/site-content"

export const metadata: Metadata = createSeoMetadata({
  title: "Projekty",
  description: "Veřejné projekty Davida Kozáka s automatickými miniaturami, odkazy a krátkým popisem.",
  path: "/projekty",
})

export const dynamic = "force-dynamic"

export default async function ProjektyPage() {
  const page = await getEditablePageByPath("/projekty")
  const catalog = getEditableSection(page, "projects-catalog")
  const dbProjects = (catalog?.objects ?? [])
    .filter((object) => object.url)
    .map((object) => ({
      name: object.title,
      url: object.url ?? "",
      description: object.text,
      tier: object.label.toLowerCase().includes("dominant") ? ("dominant" as const) : ("other" as const),
    }))
  const activeDominantProjects = dbProjects.filter((project) => project.tier === "dominant")
  const activeOtherProjects = dbProjects.filter((project) => project.tier === "other")
  const visibleDominantProjects = activeDominantProjects.length > 0 ? activeDominantProjects : dominantProjects
  const visibleOtherProjects = activeOtherProjects.length > 0 ? activeOtherProjects : otherProjects

  return (
    <SiteFrame>
      <section className="subpage-hero">
        <p className="eyebrow">{catalog?.eyebrow || "Projekty"}</p>
        <h1>{catalog?.title || "Veřejné projekty propojené jednou digitální stopou."}</h1>
        <p>{catalog?.text || "Dominantní weby, experimenty a pracovní plochy na jednom místě."}</p>
      </section>

      <section className="projects-section subpage-section projects-page-layout">
        <DynamicReveal className="reveal-block">
          <Row className="project-page-intro" fillWidth horizontal="between" vertical="end" gap="24" wrap>
            <Column gap="12" maxWidth={48}>
              <Badge title="Live katalog" icon="document" arrow={false} effect={false} />
              <h2>{catalog?.quote || "Náhledy veřejných webů v jednom přehledu."}</h2>
            </Column>
            <Text as="p" variant="body-default-m" onBackground="neutral-weak">
              Každá karta má vlastní screenshot rám, host a krátký popis. Homepage zůstává čistá, celý katalog žije tady.
            </Text>
          </Row>
        </DynamicReveal>

        <div className="public-project-showcase">
          <DynamicReveal className="reveal-block" delay={0.1}>
            <section className="project-scroll-block" aria-labelledby="dominant-projects-title">
              <div className="project-scroll-heading">
                <span>Dominantní výběr</span>
                <h3 id="dominant-projects-title">Čtyři nejsilnější směry v jednom posuvném pásu.</h3>
              </div>
              <Scroller className="project-scroller" fadeColor="brand-medium">
                <Row className="project-scroll-row" gap="16">
                  {visibleDominantProjects.map((project, index) => (
                    <ProjectPreviewCard key={project.url} project={project} index={index} variant="dominant" />
                  ))}
                </Row>
              </Scroller>
            </section>
          </DynamicReveal>

          <DynamicReveal className="reveal-block" delay={0.1}>
            <section className="project-scroll-block" aria-labelledby="other-projects-title">
              <div className="project-scroll-heading project-scroll-heading-muted">
                <span>Ostatní</span>
                <h3 id="other-projects-title">Další veřejné směry bez dlouhé mřížky pod sebou.</h3>
              </div>
              <Scroller className="project-scroller project-scroller-compact" fadeColor="brand-medium">
                <Row className="project-scroll-row" gap="16">
                  {visibleOtherProjects.map((project, index) => (
                    <ProjectPreviewCard
                      key={project.url}
                      project={project}
                      index={index + visibleDominantProjects.length}
                      variant="compact"
                    />
                  ))}
                </Row>
              </Scroller>
            </section>
          </DynamicReveal>
        </div>
      </section>
    </SiteFrame>
  )
}
