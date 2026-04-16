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

  return (
    <article className={`public-project-card project-card-${variant}`}>
      <div className="project-preview" aria-hidden="true">
        <div className="project-preview-fallback">
          <span>{project.name}</span>
        </div>
        <span
          className="project-preview-image"
          style={{ backgroundImage: `url("${getProjectPreviewUrl(project.url)}")` }}
        />
      </div>
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
