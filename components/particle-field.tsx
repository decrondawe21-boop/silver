"use client"

import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"

const particles = Array.from({ length: 160 }, (_, index) => {
  const sizes = [0.9, 1, 1.15, 1.3, 1.5, 1.7, 1.9, 2.2, 2.6, 3]

  return {
    id: index,
    x: (index * 29 + 7 + Math.floor(index / 9) * 11) % 100,
    y: (index * 47 + 13 + Math.floor(index / 7) * 17) % 100,
    size: sizes[index % sizes.length],
    drift: (index % 2 === 0 ? 1 : -1) * (10 + (index % 9) * 3),
    duration: 6.6 + (index % 11) * 0.48,
    delay: -((index * 0.29) % 6.6),
    alpha: 0.42 + (index % 6) * 0.075,
  }
})

export default function ParticleField() {
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const current = particles.map(() => ({ x: 0, y: 0 }))
    const target = particles.map(() => ({ x: 0, y: 0 }))
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false }
    let animationFrame = 0

    const setTargets = () => {
      const radius = Math.min(window.innerWidth, 900) * 0.22
      const maxPush = Math.min(window.innerWidth, 900) * 0.11

      for (const particle of particles) {
        const baseX = (particle.x / 100) * window.innerWidth
        const baseY = (particle.y / 100) * window.innerHeight
        const dx = baseX - pointer.x
        const dy = baseY - pointer.y
        const distance = Math.hypot(dx, dy) || 1
        const influence = pointer.active ? Math.max(0, 1 - distance / radius) : 0
        const force = influence * influence * maxPush * (1 + particle.size * 0.12)

        target[particle.id].x = (dx / distance) * force
        target[particle.id].y = (dy / distance) * force
      }
    }

    const animate = () => {
      let moving = false

      for (const particle of particles) {
        const offset = current[particle.id]
        const desired = target[particle.id]

        offset.x += (desired.x - offset.x) * 0.16
        offset.y += (desired.y - offset.y) * 0.16

        if (Math.abs(offset.x - desired.x) > 0.05 || Math.abs(offset.y - desired.y) > 0.05) {
          moving = true
        }

        const node = particleRefs.current[particle.id]
        if (node) {
          node.style.setProperty("--repel-x", `${offset.x.toFixed(2)}px`)
          node.style.setProperty("--repel-y", `${offset.y.toFixed(2)}px`)
        }
      }

      if (pointer.active || moving) {
        animationFrame = window.requestAnimationFrame(animate)
      } else {
        animationFrame = 0
      }
    }

    const startAnimation = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animate)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return
      }

      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      setTargets()
      startAnimation()
    }

    const clearRepel = () => {
      pointer.active = false
      for (const item of target) {
        item.x = 0
        item.y = 0
      }
      startAnimation()
    }

    const handleResize = () => {
      setTargets()
      startAnimation()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", clearRepel)
    window.addEventListener("blur", clearRepel)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", clearRepel)
      window.removeEventListener("blur", clearRepel)
      window.removeEventListener("resize", handleResize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          className="particle"
          key={particle.id}
          ref={(node) => {
            particleRefs.current[particle.id] = node
          }}
          style={
            {
              "--particle-x": `${particle.x}%`,
              "--particle-y": `${particle.y}%`,
              "--particle-size": `${particle.size}px`,
              "--particle-drift": `${particle.drift}px`,
              "--particle-duration": `${particle.duration}s`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-alpha": particle.alpha,
              "--repel-x": "0px",
              "--repel-y": "0px",
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
