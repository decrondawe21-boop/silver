import type React from "react"
import ElectricFilter from "@/components/electric-filter"
import ParticleField from "@/components/particle-field"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="site-shell">
      <ElectricFilter />
      <ParticleField />
      <div className="background-shadow" aria-hidden="true" />
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  )
}
