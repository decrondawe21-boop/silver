import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminContentStudio from "@/components/admin-content-studio"
import SiteFrame from "@/components/site-frame"
import { readAuthenticatedAdminFromCookies } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Admin panel | David Kozák Silver",
  description: "Administrace obsahu, aktualit, obrázků a struktury homepage.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const admin = await readAuthenticatedAdminFromCookies()
  if (!admin) {
    redirect("/login")
  }

  return (
    <SiteFrame>
      <AdminContentStudio />
    </SiteFrame>
  )
}
