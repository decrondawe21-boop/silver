"use client"

import { Carousel } from "@once-ui-system/core/components/Carousel"
import type { PublicProject } from "@/resources/site-content"
import { getProjectHost, getProjectPreviewUrl } from "@/resources/site-content"

export default function ProjectCarousel({ projects }: { projects: PublicProject[] }) {
  const items = projects.map((project, index) => ({
    alt: project.name,
    slide: (
      <article className="project-carousel-slide">
        <span
          className="project-carousel-image"
          style={{ backgroundImage: `url("${getProjectPreviewUrl(project.url)}")` }}
        />
        <div className="project-carousel-copy">
          <span className="project-carousel-meta">{String(index + 1).padStart(2, "0")} / Dominantní</span>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Otevřít projekt ${project.name}`}>
            {getProjectHost(project.url)}
          </a>
        </div>
      </article>
    ),
  }))

  return (
    <div className="project-carousel">
      <Carousel
        items={items}
        aspectRatio="auto"
        controls
        indicator="line"
        revealedByDefault
        play={{ auto: true, interval: 4600, controls: true, progress: true }}
      />
    </div>
  )
}
