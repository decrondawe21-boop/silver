import type React from "react"

export default function ElectricPanel({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`electric-panel ${className}`}>
      <div className="electric-panel-frame">
        <div className="electric-panel-border"></div>
      </div>
      <div className="glow-layer-1"></div>
      <div className="glow-layer-2"></div>
      <div className="overlay-1"></div>
      <div className="overlay-2"></div>
      <div className="background-glow"></div>
      <div className="electric-content">{children}</div>
    </div>
  )
}
