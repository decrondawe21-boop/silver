"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { RevealFx } from "@once-ui-system/core/components/RevealFx"

export default function DynamicReveal({
  children,
  className,
  delay = 0,
  translateY = 1,
  speed = "fast",
}: {
  children: ReactNode
  className?: string
  delay?: number
  translateY?: number
  speed?: "slow" | "medium" | "fast" | number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div ref={ref} className={className}>
      <RevealFx speed={speed} delay={delay} translateY={translateY} trigger={isVisible}>
        {children}
      </RevealFx>
    </div>
  )
}
