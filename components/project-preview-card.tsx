import type { PublicProject } from "@/resources/site-content"
import { getProjectHost, getProjectPreviewUrl } from "@/resources/site-content"

export default function ProjectPreviewCard({
  project,
  index,
  variant,
}: {
  project: PublicProject
  index: number
  variant: "dominant" | "compact"
}) {
  const host = getProjectHost(project.url)
  const previewUrl = getProjectPreviewUrl(project.url)

  return (
    <article className={`public-project-card project-card-${variant}`}>
      <a
        className="project-preview"
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Otevřít náhled projektu ${project.name}`}
      >
        <div className="project-preview-browser">
          <span />
          <span />
          <span />
          <strong>{host}</strong>
        </div>
        <div className="project-preview-fallback">
          <span>{project.name}</span>
        </div>
        <img
          alt={`Náhled webu ${project.name}`}
          className="project-preview-image"
          decoding="async"
          loading="lazy"
          src={previewUrl}
        />
      </a>
      <div className="project-card-copy">
        <div className="project-card-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{variant === "dominant" ? "Dominantní" : "Veřejné"}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Otevřít projekt ${project.name}`}>
          {host}
        </a>
      </div>
    </article>
  )
}
