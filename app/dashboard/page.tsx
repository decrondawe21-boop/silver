import type { Metadata } from "next"
import AdminContentStudio from "@/components/admin-content-studio"
import SiteFrame from "@/components/site-frame"

export const metadata: Metadata = {
  title: "Admin panel | David Kozák Silver",
  description: "Administrace obsahu, aktualit, obrázků a struktury homepage.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardPage() {
  return (
    <SiteFrame>
      <AdminContentStudio />
    </SiteFrame>
  )
}
