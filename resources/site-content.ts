export type PublicProject = {
  name: string
  url: string
  description: string
  tier: "dominant" | "other"
}

export type Service = {
  label: string
  title: string
  text: string
}

export const navigationPages = [
  {
    label: "Profil",
    href: "/profil",
    description: "Identita, směr a osobní styl práce.",
  },
  {
    label: "Služby",
    href: "/sluzby",
    description: "Weby, automatizace a digitální strategie.",
  },
  {
    label: "Projekty",
    href: "/projekty",
    description: "Veřejné weby a živé pracovní plochy.",
  },
  {
    label: "Kontakt",
    href: "/kontakt",
    description: "Rychlá cesta k domluvě a spolupráci.",
  },
]

export const services: Service[] = [
  {
    label: "01",
    title: "Weby a identita",
    text: "Rychlý osobní web, jasná nabídka a vizuál, který zůstane v hlavě.",
  },
  {
    label: "02",
    title: "Automatizace",
    text: "Jednodušší procesy, méně ruční práce a víc prostoru pro rozhodnutí.",
  },
  {
    label: "03",
    title: "Digitální strategie",
    text: "Nápady převedené do konkrétních kroků, textů, stránek a nástrojů.",
  },
]

export const publicProjects: PublicProject[] = [
  {
    name: "International",
    url: "https://international.david-kozak.com",
    description: "Mezinárodní prezentace s čistým rozhraním a výraznou digitální identitou.",
    tier: "dominant",
  },
  {
    name: "REPAS|MOBILE",
    url: "https://www.repasmobile.david-kozak.com",
    description: "Servisní web pro mobilní zařízení s důrazem na rychlou orientaci a kontakt.",
    tier: "dominant",
  },
  {
    name: "REST||ART Integrace",
    url: "https://www.restartintegrace.david-kozak.com",
    description: "Projekt zaměřený na integraci, obnovu a přehlednou komunikaci služeb.",
    tier: "dominant",
  },
  {
    name: "Studio",
    url: "https://studio.david-kozak.com",
    description: "Kreativní prostor pro práci s vizuálem, obsahem a novými webovými směry.",
    tier: "dominant",
  },
  {
    name: "Imaginator",
    url: "https://imaginator.david-kozak.com",
    description: "Experimentální prostor pro obrazotvornost, nápady a vizuální tvorbu.",
    tier: "other",
  },
  {
    name: "New Project",
    url: "https://new.david-kozak.com/",
    description: "Nová větev projektů připravená pro další iterace a testování nápadů.",
    tier: "other",
  },
  {
    name: "Silver",
    url: "https://silver.david-kozak.com",
    description: "Aktuální osobní web ve stříbrném elektrickém stylu.",
    tier: "other",
  },
  {
    name: "Osobní",
    url: "https://osobni.david-kozak.com/",
    description: "Osobní prezentace se zaměřením na identitu, profil a přímý kontakt.",
    tier: "other",
  },
  {
    name: "Životopis",
    url: "https://zivotopis.david-kozak.com/",
    description: "Stručný profesní přehled, zkušenosti a kontaktní cesta v jedné stránce.",
    tier: "other",
  },
  {
    name: "Appka",
    url: "https://appka.david-kozak.com/",
    description: "Aplikační rozhraní pro rychlé ověření digitálních funkcí a workflow.",
    tier: "other",
  },
  {
    name: "Dev / DK",
    url: "https://dk.david-kozak.com",
    description: "Vývojová zóna pro technické prototypy, nástroje a interní směry.",
    tier: "other",
  },
  {
    name: "AI chat bot",
    url: "https://www.david-kozak.com",
    description: "Konverzační AI vstup pro komunikaci, asistenci a první orientaci.",
    tier: "other",
  },
]

export const dominantProjects = publicProjects.filter((project) => project.tier === "dominant")
export const otherProjects = publicProjects.filter((project) => project.tier === "other")

export function getProjectHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function getProjectPreviewUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`
}
