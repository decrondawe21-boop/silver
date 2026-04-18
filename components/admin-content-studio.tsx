"use client"

import type { ChangeEvent } from "react"
import { startTransition, useDeferredValue, useEffect, useState } from "react"
import {
  AccordionGroup,
  Background,
  Badge,
  Banner,
  Button,
  Column,
  Grid,
  Heading,
  Icon,
  Input,
  MatrixFx,
  RevealFx,
  Row,
  Select,
  Text,
  Textarea,
} from "@once-ui-system/core"
import { readStoredNews, writeStoredNews } from "@/lib/admin-news-storage"
import {
  defaultEditablePages,
  defaultHomeNews,
  editorSnippets,
  homepageSectionPlan,
  mysqlContentSchema,
  type EditablePage,
  type EditableSectionObject,
  type HomeNewsItem,
  type NewsStatus,
} from "@/resources/admin-content"
import {
  defaultOwnerProfile,
  readStoredOwnerProfile,
  sanitizeOwnerProfile,
  writeStoredOwnerProfile,
  type OwnerProfile,
} from "@/lib/admin-owner-storage"
import {
  readStoredEditablePages,
  sanitizeEditablePages,
  writeStoredEditablePages,
} from "@/lib/admin-site-storage"
import AdminSidebar6 from "@/components/admin-sidebar6"

type NoticeTone = "success" | "warning" | "danger"

type NoticeState = {
  tone: NoticeTone
  text: string
}

type AdminExportPackage = {
  exportedAt: string
  ownerProfile: OwnerProfile
  news: HomeNewsItem[]
  pages: EditablePage[]
}

type SiteContentResponse = {
  pages?: EditablePage[]
  error?: string
}

const noticeVariants = {
  success: { solid: "success-medium", onSolid: "success-strong", icon: "check" },
  warning: { solid: "warning-medium", onSolid: "warning-strong", icon: "warning" },
  danger: { solid: "danger-medium", onSolid: "danger-strong", icon: "danger" },
} as const

const tableBackgroundDirections = {
  top: { x: 50, y: 0, radius: 54, angle: 90, colorStart: "neutral-background-strong", line: "neutral-alpha-medium" },
  right: { x: 100, y: 44, radius: 56, angle: 0, colorStart: "accent-background-strong", line: "accent-alpha-medium" },
  bottom: { x: 50, y: 100, radius: 58, angle: 90, colorStart: "neutral-background-strong", line: "neutral-alpha-medium" },
  left: { x: 0, y: 46, radius: 56, angle: 0, colorStart: "accent-background-strong", line: "accent-alpha-medium" },
  center: { x: 50, y: 50, radius: 70, angle: 45, colorStart: "neutral-background-strong", line: "neutral-alpha-medium" },
} as const

type TableBackgroundDirection = keyof typeof tableBackgroundDirections
const draftPlaceholderId = "news-draft"

function AdminTableBackground({ direction }: { direction: TableBackgroundDirection }) {
  const background = tableBackgroundDirections[direction]

  return (
    <Background
      className={`admin-table-background admin-table-background-${direction}`}
      position="absolute"
      fill
      height={16}
      gradient={{
        display: true,
        opacity: 70,
        x: background.x,
        y: background.y,
        width: 72,
        height: 58,
        colorStart: background.colorStart,
        colorEnd: "static-transparent",
      }}
      lines={{
        display: true,
        opacity: 30,
        size: "16",
        thickness: 1,
        angle: background.angle,
        color: background.line,
      }}
      mask={{
        x: background.x,
        y: background.y,
        radius: background.radius,
      }}
    />
  )
}

const emptyDraft = (): HomeNewsItem => ({
  id: draftPlaceholderId,
  title: "",
  excerpt: "",
  category: "Aktualita",
  date: "",
  status: "draft",
  imageAlt: "",
  content: "",
  codeSnippet: "",
})

function createNewsId() {
  return `news-${Date.now()}`
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function destinationLabel(destination: "homepage" | "subpage" | "footer") {
  if (destination === "homepage") return "Homepage"
  if (destination === "footer") return "Footer"
  return "Samostatná stránka"
}

function countPublished(items: HomeNewsItem[]) {
  return items.filter((item) => item.status === "published").length
}

function asRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function sanitizeNewsCollection(value: unknown) {
  if (!Array.isArray(value)) {
    return null
  }

  const sanitized: HomeNewsItem[] = []

  for (const candidate of value) {
    if (!asRecord(candidate)) continue

    const title = typeof candidate.title === "string" ? candidate.title.trim() : ""
    const excerpt = typeof candidate.excerpt === "string" ? candidate.excerpt.trim() : ""
    if (!title || !excerpt) continue

    sanitized.push({
      id:
        typeof candidate.id === "string" && candidate.id.trim()
          ? candidate.id.trim()
          : `news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      excerpt,
      category:
        typeof candidate.category === "string" && candidate.category.trim() ? candidate.category.trim() : "Aktualita",
      date: typeof candidate.date === "string" && candidate.date.trim() ? candidate.date.trim() : todayIsoDate(),
      status: candidate.status === "published" ? "published" : "draft",
      imageDataUrl: typeof candidate.imageDataUrl === "string" ? candidate.imageDataUrl : undefined,
      imageAlt: typeof candidate.imageAlt === "string" ? candidate.imageAlt : undefined,
      content: typeof candidate.content === "string" && candidate.content.trim() ? candidate.content.trim() : excerpt,
      codeSnippet: typeof candidate.codeSnippet === "string" ? candidate.codeSnippet : undefined,
    })
  }

  return sanitized
}

function createDataDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function AdminContentStudio() {
  const [items, setItems] = useState<HomeNewsItem[]>(defaultHomeNews)
  const [pages, setPages] = useState<EditablePage[]>(defaultEditablePages)
  const [selectedPageId, setSelectedPageId] = useState(defaultEditablePages[0]?.id ?? "")
  const [selectedSectionId, setSelectedSectionId] = useState(defaultEditablePages[0]?.sections[0]?.id ?? "")
  const [isSavingPages, setIsSavingPages] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(defaultOwnerProfile)
  const [draft, setDraft] = useState<HomeNewsItem>(() => emptyDraft())
  const [selectedId, setSelectedId] = useState<string>("new")
  const [notice, setNotice] = useState<NoticeState>({
    tone: "success",
    text: "Lokální editor je připravený. Pro MySQL chybí produkční připojení.",
  })
  const deferredContent = useDeferredValue(draft.content)
  const activeNotice = noticeVariants[notice.tone]

  useEffect(() => {
    const stored = readStoredNews()
    if (stored.length > 0) {
      setItems(stored)
      setNotice({ tone: "success", text: "Načteny lokálně uložené aktuality z tohoto prohlížeče." })
    }

    setOwnerProfile(readStoredOwnerProfile())
    const localPages = readStoredEditablePages()
    setPages(localPages)
    setSelectedPageId(localPages[0]?.id ?? "")
    setSelectedSectionId(localPages[0]?.sections[0]?.id ?? "")

    const loadPagesFromDb = async () => {
      try {
        const response = await fetch("/api/admin/site-content", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        })
        const payload = (await response.json()) as SiteContentResponse

        if (!response.ok || !payload.pages) {
          setNotice({
            tone: "warning",
            text: payload.error || "MySQL obsah webu se nepodařilo načíst. Používám lokální kopii.",
          })
          return
        }

        const dbPages = sanitizeEditablePages(payload.pages)
        setPages(dbPages)
        writeStoredEditablePages(dbPages)
        setSelectedPageId(dbPages[0]?.id ?? "")
        setSelectedSectionId(dbPages[0]?.sections[0]?.id ?? "")
        setNotice({ tone: "success", text: "Mapa webu je načtená z MySQL." })
      } catch {
        setNotice({ tone: "warning", text: "MySQL obsah webu se nepodařilo načíst. Používám lokální kopii." })
      }
    }

    void loadPagesFromDb()
  }, [])

  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? pages[0] ?? defaultEditablePages[0]
  const selectedSection =
    selectedPage?.sections.find((section) => section.id === selectedSectionId) ??
    selectedPage?.sections[0] ??
    defaultEditablePages[0]?.sections[0]

  const persistPages = async (nextPages: EditablePage[], message: string, tone: NoticeTone = "success") => {
    const sanitized = sanitizeEditablePages(nextPages)
    setPages(sanitized)
    writeStoredEditablePages(sanitized)
    setIsSavingPages(true)

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pages: sanitized }),
      })
      const payload = (await response.json()) as SiteContentResponse

      if (!response.ok || !payload.pages) {
        setNotice({
          tone: "danger",
          text: payload.error || "Mapa stránek se nepodařila uložit do MySQL.",
        })
        return false
      }

      const dbPages = sanitizeEditablePages(payload.pages)
      setPages(dbPages)
      writeStoredEditablePages(dbPages)
      setNotice({ tone, text: message })
      return true
    } catch {
      setNotice({ tone: "danger", text: "Mapa stránek se nepodařila uložit do MySQL." })
      return false
    } finally {
      setIsSavingPages(false)
    }
  }

  const selectPage = (pageId: string) => {
    const page = pages.find((candidate) => candidate.id === pageId)
    if (!page) return

    setSelectedPageId(page.id)
    setSelectedSectionId(page.sections[0]?.id ?? "")
    setNotice({ tone: "success", text: `Upravuji stránku: ${page.navLabel}` })
  }

  const selectSection = (sectionId: string) => {
    const section = selectedPage?.sections.find((candidate) => candidate.id === sectionId)
    if (!section) return

    setSelectedSectionId(section.id)
    setNotice({ tone: "success", text: `Upravuji sekci: ${section.label}` })
  }

  const updateSelectedPage = (field: keyof Omit<EditablePage, "sections">, value: string) => {
    setPages((current) =>
      current.map((page) => (page.id === selectedPage?.id ? { ...page, [field]: value } : page)),
    )
  }

  const updateSelectedSection = (
    field: keyof Omit<EditablePage["sections"][number], "objects">,
    value: string,
  ) => {
    setPages((current) =>
      current.map((page) =>
        page.id === selectedPage?.id
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === selectedSection?.id ? { ...section, [field]: value } : section,
              ),
            }
          : page,
      ),
    )
  }

  const updateSelectedObject = (objectId: string, field: keyof EditableSectionObject, value: string) => {
    setPages((current) =>
      current.map((page) =>
        page.id === selectedPage?.id
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === selectedSection?.id
                  ? {
                      ...section,
                      objects: section.objects.map((object) =>
                        object.id === objectId ? { ...object, [field]: value } : object,
                      ),
                    }
                  : section,
              ),
            }
          : page,
      ),
    )
  }

  const saveEditablePages = async () => {
    const normalized = sanitizeEditablePages(pages)
    await persistPages(normalized, "Mapa stránek, sekcí a objektů je uložená v MySQL.")
  }

  const resetEditablePages = async () => {
    await persistPages(defaultEditablePages, "Mapa stránek je vrácená na výchozí obsah v MySQL.", "warning")
    setSelectedPageId(defaultEditablePages[0]?.id ?? "")
    setSelectedSectionId(defaultEditablePages[0]?.sections[0]?.id ?? "")
  }

  const addSectionObject = () => {
    if (!selectedPage || !selectedSection) return

    const nextObject: EditableSectionObject = {
      id: `object-${Date.now()}`,
      label: "Nový objekt",
      title: "",
      text: "",
      url: "",
    }

    const nextPages = pages.map((page) =>
      page.id === selectedPage.id
        ? {
            ...page,
            sections: page.sections.map((section) =>
              section.id === selectedSection.id ? { ...section, objects: [...section.objects, nextObject] } : section,
            ),
          }
        : page,
    )

    setPages(nextPages)
    setNotice({ tone: "success", text: "Nový objekt je přidaný do sekce." })
  }

  const removeSectionObject = (objectId: string) => {
    if (!selectedPage || !selectedSection) return

    setPages((current) =>
      current.map((page) =>
        page.id === selectedPage.id
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === selectedSection.id
                  ? { ...section, objects: section.objects.filter((object) => object.id !== objectId) }
                  : section,
              ),
            }
          : page,
      ),
    )
    setNotice({ tone: "warning", text: "Objekt je odebraný ze sekce." })
  }

  const handleSectionImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setNotice({ tone: "danger", text: "Obrázek sekce musí být soubor typu image." })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      updateSelectedSection("imageUrl", result)
      if (!selectedSection?.imageAlt) {
        updateSelectedSection("imageAlt", file.name.replace(/\.[^.]+$/, ""))
      }
      setNotice({ tone: "success", text: "Obrázek sekce je načtený do editoru." })
    }
    reader.readAsDataURL(file)
  }

  const mutateOwnerProfile = (
    updater: (current: OwnerProfile) => OwnerProfile,
    message?: string,
    tone: NoticeTone = "success",
  ) => {
    setOwnerProfile((current) => {
      const next = updater(current)
      writeStoredOwnerProfile(next)
      return next
    })

    if (message) {
      setNotice({ tone, text: message })
    }
  }

  const updateDraft = (field: keyof HomeNewsItem, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const updateLongText = (field: "content" | "codeSnippet", value: string) => {
    startTransition(() => {
      setDraft((current) => ({ ...current, [field]: value }))
    })
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setNotice({ tone: "danger", text: "Vybraný soubor není obrázek." })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setDraft((current) => ({
        ...current,
        imageDataUrl: result,
        imageAlt: current.imageAlt || file.name.replace(/\.[^.]+$/, ""),
      }))
      setNotice({ tone: "success", text: "Obrázek je načtený jako preview. Pro produkci ho později přesměrujeme na objektové úložiště." })
    }
    reader.readAsDataURL(file)
  }

  const insertSnippet = (value: string) => {
    updateLongText("content", `${draft.content}${value}`)
  }

  const selectItem = (id: string) => {
    if (id === "new") {
      setSelectedId("new")
      setDraft(emptyDraft())
      setNotice({ tone: "success", text: "Připravený nový příspěvek." })
      return
    }

    const item = items.find((candidate) => candidate.id === id)
    if (!item) return

    setSelectedId(id)
    setDraft(item)
    setNotice({ tone: "success", text: `Upravuji: ${item.title}` })
  }

  const persistItems = (nextItems: HomeNewsItem[], message: string, tone: NoticeTone = "success") => {
    const result = writeStoredNews(nextItems)

    if (result.status === "failed") {
      setNotice({
        tone: "danger",
        text: "Obsah se nevešel do lokálního úložiště prohlížeče. Zmenši obrázky nebo exportuj balíček a vyčisti lokální obsah.",
      })
      return { saved: false, items: nextItems }
    }

    setItems(result.items)

    if (result.status === "saved-without-images") {
      setNotice({
        tone: "warning",
        text: "Text je uložený, ale vložené obrázky byly kvůli limitu prohlížeče vynechané. Pro produkci použij URL nebo objektové úložiště.",
      })
      return { saved: true, items: result.items }
    }

    setNotice({ tone, text: message })
    return { saved: true, items: result.items }
  }

  const saveDraft = (status: NewsStatus) => {
    const title = draft.title.trim()
    const excerpt = draft.excerpt.trim()

    if (!title || !excerpt) {
      setNotice({ tone: "warning", text: "Doplň název a krátký popis. Bez nich příspěvek nepůjde publikovat." })
      return
    }

    const normalized: HomeNewsItem = {
      ...draft,
      id: selectedId === "new" || draft.id === draftPlaceholderId ? createNewsId() : draft.id,
      title,
      excerpt,
      category: draft.category.trim() || "Aktualita",
      date: draft.date || todayIsoDate(),
      status,
      content: draft.content.trim() || excerpt,
      codeSnippet: draft.codeSnippet?.trim(),
    }

    const exists = items.some((item) => item.id === normalized.id)
    const nextItems = exists
      ? items.map((item) => (item.id === normalized.id ? normalized : item))
      : [normalized, ...items]

    const result = persistItems(
      nextItems,
      status === "published" ? "Aktualita je publikovaná na homepage v tomto prohlížeči." : "Koncept je uložený.",
    )
    if (!result.saved) return

    const persistedDraft = result.items.find((item) => item.id === normalized.id) ?? normalized
    setSelectedId(normalized.id)
    setDraft(persistedDraft)
  }

  const deleteDraft = () => {
    if (selectedId === "new") {
      setDraft(emptyDraft())
      setNotice({ tone: "warning", text: "Nový rozpracovaný příspěvek je vyčištěný." })
      return
    }

    const nextItems = items.filter((item) => item.id !== selectedId)
    persistItems(nextItems, "Příspěvek je odstraněný z lokální administrace.", "warning")
    selectItem("new")
  }

  const resetLocalContent = () => {
    persistItems(defaultHomeNews, "Lokální obsah je vrácený na výchozí sadu.", "warning")
    setSelectedId("new")
    setDraft(emptyDraft())
  }

  const updateOwnerField = (field: keyof OwnerProfile, value: string) => {
    setOwnerProfile((current) => ({ ...current, [field]: value }))
  }

  const saveOwnerProfile = () => {
    mutateOwnerProfile(
      (current) => ({
        ...current,
        fullName: current.fullName.trim() || defaultOwnerProfile.fullName,
        role: current.role.trim() || defaultOwnerProfile.role,
        shortBio: current.shortBio.trim() || defaultOwnerProfile.shortBio,
        longBio: current.longBio.trim() || defaultOwnerProfile.longBio,
        email: current.email.trim() || defaultOwnerProfile.email,
        phone: current.phone.trim(),
        location: current.location.trim(),
        website: current.website.trim(),
        updatedAt: new Date().toISOString(),
      }),
      "Profil majitele je uložený.",
    )
  }

  const handleOwnerAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setNotice({ tone: "danger", text: "Profilová fotka musí být obrázek." })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      mutateOwnerProfile(
        (current) => ({
          ...current,
          avatarDataUrl: result,
          updatedAt: new Date().toISOString(),
        }),
        "Profilová fotka je nahraná.",
      )
    }
    reader.readAsDataURL(file)
  }

  const handleResumeUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      mutateOwnerProfile(
        (current) => ({
          ...current,
          resumeDataUrl: result,
          resumeFileName: file.name,
          updatedAt: new Date().toISOString(),
        }),
        "Soubor profilu je nahraný a připravený ke stažení.",
      )
    }
    reader.readAsDataURL(file)
  }

  const downloadResume = () => {
    if (!ownerProfile.resumeDataUrl) {
      setNotice({ tone: "warning", text: "Nejdřív nahraj soubor profilu, pak ho můžeš stáhnout." })
      return
    }

    const link = document.createElement("a")
    link.href = ownerProfile.resumeDataUrl
    link.download = ownerProfile.resumeFileName || "profil-priloha"
    document.body.appendChild(link)
    link.click()
    link.remove()

    setNotice({ tone: "success", text: "Soubor profilu byl stažený." })
  }

  const exportAdminData = () => {
    const payload: AdminExportPackage = {
      exportedAt: new Date().toISOString(),
      ownerProfile: {
        ...ownerProfile,
        updatedAt: ownerProfile.updatedAt || new Date().toISOString(),
      },
      news: items,
      pages,
    }

    createDataDownload(
      JSON.stringify(payload, null, 2),
      `silver-admin-export-${todayIsoDate()}.json`,
      "application/json",
    )

    setNotice({ tone: "success", text: "Balíček administrace byl exportovaný." })
  }

  const importAdminData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = typeof reader.result === "string" ? reader.result : ""
        const parsed = JSON.parse(raw) as unknown

        if (!asRecord(parsed)) {
          throw new Error("Invalid payload")
        }

        const parsedOwner = sanitizeOwnerProfile(parsed.ownerProfile)
        const parsedNews = sanitizeNewsCollection(parsed.news)
        const parsedPages = sanitizeEditablePages(parsed.pages)

        setOwnerProfile(parsedOwner)
        writeStoredOwnerProfile(parsedOwner)
        setPages(parsedPages)
        writeStoredEditablePages(parsedPages)
        void persistPages(parsedPages, "Importovaná mapa stránek je uložená v MySQL.")
        setSelectedPageId(parsedPages[0]?.id ?? "")
        setSelectedSectionId(parsedPages[0]?.sections[0]?.id ?? "")

        if (parsedNews && parsedNews.length > 0) {
          setItems(parsedNews)
          writeStoredNews(parsedNews)
          setSelectedId("new")
          setDraft(emptyDraft())
          setNotice({ tone: "success", text: "Import proběhl: profil, stránky i aktuality jsou načtené." })
        } else {
          setNotice({ tone: "success", text: "Import proběhl: profil a mapa stránek jsou načtené." })
        }
      } catch {
        setNotice({ tone: "danger", text: "Soubor se nepodařilo importovat. Ověř JSON formát exportu." })
      } finally {
        event.target.value = ""
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="admin-shell">
      <AdminSidebar6 activeDraftTitle={draft.title} publishedItems={countPublished(items)} totalItems={items.length} />
      <section className="admin-studio" aria-labelledby="admin-title">
      <Column id="admin-overview" className="admin-hero" gap="24" fillWidth>
        <Background
          className="admin-hero-background"
          position="absolute"
          fill
          gradient={{ display: true, colorStart: "accent-alpha-weak" }}
          dots={{ display: true, color: "neutral-alpha-weak", size: "4" }}
        />
        <MatrixFx
          className="admin-hero-matrix"
          position="absolute"
          top="0"
          left="0"
          size={2}
          spacing={3}
          speed={0.72}
          trigger="mount"
          colors={["neutral-solid-strong", "accent-solid-medium"]}
        />
        <Row className="admin-hero-topline" fillWidth horizontal="between" vertical="center" gap="16">
          <Badge title="Content OS" icon="document" arrow={false} effect={false} />
          <Text as="p" variant="label-default-s">
            {countPublished(items)} publikované / {items.length} celkem
          </Text>
        </Row>
        <RevealFx speed="fast" delay={0.08} translateY={1}>
          <Column gap="16" maxWidth={54}>
            <Heading id="admin-title" as="h1" variant="display-strong-xl">
              Admin panel pro obsah, aktuality a homepage.
            </Heading>
            <Text as="p" variant="body-default-l" onBackground="neutral-medium">
              Obrázky, texty, kódové bloky a struktura homepage jsou na jednom místě. MySQL je připravené jako schéma a naváže se po dodání připojení.
            </Text>
          </Column>
        </RevealFx>
      </Column>

      <Grid className="admin-stat-grid" columns={4} gap="12" fillWidth>
        <div>
          <AdminTableBackground direction="top" />
          <span>Obsah</span>
          <strong>{items.length}</strong>
          <p>aktuality v editoru</p>
        </div>
        <div>
          <AdminTableBackground direction="right" />
          <span>Publikováno</span>
          <strong>{countPublished(items)}</strong>
          <p>viditelné na homepage</p>
        </div>
        <div>
          <AdminTableBackground direction="left" />
          <span>Upload</span>
          <strong>IMG</strong>
          <p>preview z lokálního souboru</p>
        </div>
        <div>
          <AdminTableBackground direction="bottom" />
          <span>DB</span>
          <strong>SQL</strong>
          <p>připravené MySQL schéma</p>
        </div>
      </Grid>

      <Banner className="admin-notice-banner" role="status" solid={activeNotice.solid} onSolid={activeNotice.onSolid}>
        <Icon name={activeNotice.icon} size="s" />
        {notice.text}
      </Banner>

      <Grid id="admin-pages" className="admin-layout-grid" gap="16" fillWidth style={{ gridTemplateColumns: "minmax(280px, 0.64fr) minmax(0, 1.36fr)" }}>
        <aside className="admin-panel admin-list-panel" aria-label="Seznam stránek a sekcí">
          <AdminTableBackground direction="left" />
          <div className="admin-panel-heading">
            <span>Stránky</span>
            <h2>Page builder</h2>
          </div>
          {pages.map((page) => (
            <div key={page.id} className="admin-page-nav-group">
              <button
                className={selectedPage?.id === page.id ? "admin-list-item is-active" : "admin-list-item"}
                type="button"
                onClick={() => selectPage(page.id)}
              >
                <strong>{page.navLabel}</strong>
                <span>{page.path} · {page.sections.length} sekcí</span>
              </button>
              {selectedPage?.id === page.id ? (
                <div className="admin-section-nav-list" aria-label={`Sekce stránky ${page.navLabel}`}>
                  {page.sections.map((section) => (
                    <button
                      key={section.id}
                      className={selectedSection?.id === section.id ? "admin-section-nav-item is-active" : "admin-section-nav-item"}
                      type="button"
                      onClick={() => selectSection(section.id)}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Row gap="8" wrap>
            <Button variant="primary" size="s" onClick={saveEditablePages} disabled={isSavingPages}>
              {isSavingPages ? "Ukládám..." : "Uložit mapu webu"}
            </Button>
            <Button variant="secondary" size="s" onClick={resetEditablePages} disabled={isSavingPages}>
              Vrátit výchozí
            </Button>
          </Row>
        </aside>

        <section className="admin-panel admin-page-editor-panel" aria-labelledby="page-editor-title">
          <AdminTableBackground direction="right" />
          <div className="admin-panel-heading admin-editor-heading">
            <div>
              <span>Pokročilé úpravy</span>
              <h2 id="page-editor-title">{selectedPage?.navLabel ?? "Stránka"} · {selectedSection?.label ?? "Sekce"}</h2>
            </div>
            <Badge title={selectedPage?.path ?? "/"} icon="document" arrow={false} effect={false} />
          </div>

          <div className="admin-subpanel">
            <div className="admin-panel-heading">
              <span>Page metadata</span>
              <h3>Navigace a SEO</h3>
            </div>
            <Grid className="admin-page-meta-grid" gap={14} fillWidth>
              <Input
                id="page-nav-label"
                label="Název v navigaci"
                value={selectedPage?.navLabel ?? ""}
                onChange={(event) => updateSelectedPage("navLabel", event.target.value)}
              />
              <Input
                id="page-path"
                label="URL cesta"
                value={selectedPage?.path ?? ""}
                onChange={(event) => updateSelectedPage("path", event.target.value)}
              />
              <Input
                id="page-meta-title"
                label="Meta title"
                value={selectedPage?.metaTitle ?? ""}
                onChange={(event) => updateSelectedPage("metaTitle", event.target.value)}
              />
              <Input
                id="page-meta-description"
                label="Meta description"
                value={selectedPage?.metaDescription ?? ""}
                onChange={(event) => updateSelectedPage("metaDescription", event.target.value)}
              />
            </Grid>
          </div>

          <div className="admin-subpanel">
            <div className="admin-panel-heading">
              <span>Obsah sekce</span>
              <h3>Texty, citát, CTA a obrázek</h3>
            </div>
            <Grid className="admin-page-meta-grid" gap={14} fillWidth>
              <Input
                id="section-label"
                label="Interní název sekce"
                value={selectedSection?.label ?? ""}
                onChange={(event) => updateSelectedSection("label", event.target.value)}
              />
              <Input
                id="section-eyebrow"
                label="Eyebrow"
                value={selectedSection?.eyebrow ?? ""}
                onChange={(event) => updateSelectedSection("eyebrow", event.target.value)}
              />
              <Input
                id="section-title"
                label="Titulek"
                value={selectedSection?.title ?? ""}
                onChange={(event) => updateSelectedSection("title", event.target.value)}
              />
              <Input
                id="section-quote"
                label="Citát / motto"
                value={selectedSection?.quote ?? ""}
                onChange={(event) => updateSelectedSection("quote", event.target.value)}
              />
            </Grid>

            <Textarea
              id="section-text"
              label="Hlavní text"
              value={selectedSection?.text ?? ""}
              onChange={(event) => updateSelectedSection("text", event.target.value)}
              lines={5}
              resize="vertical"
            />

            <Grid className="admin-page-meta-grid" gap={14} fillWidth>
              <Input
                id="section-primary-cta-label"
                label="Primární CTA text"
                value={selectedSection?.primaryCtaLabel ?? ""}
                onChange={(event) => updateSelectedSection("primaryCtaLabel", event.target.value)}
              />
              <Input
                id="section-primary-cta-href"
                label="Primární CTA odkaz"
                value={selectedSection?.primaryCtaHref ?? ""}
                onChange={(event) => updateSelectedSection("primaryCtaHref", event.target.value)}
              />
              <Input
                id="section-secondary-cta-label"
                label="Sekundární CTA text"
                value={selectedSection?.secondaryCtaLabel ?? ""}
                onChange={(event) => updateSelectedSection("secondaryCtaLabel", event.target.value)}
              />
              <Input
                id="section-secondary-cta-href"
                label="Sekundární CTA odkaz"
                value={selectedSection?.secondaryCtaHref ?? ""}
                onChange={(event) => updateSelectedSection("secondaryCtaHref", event.target.value)}
              />
            </Grid>

            <Grid className="admin-media-grid" fillWidth style={{ gridTemplateColumns: "minmax(0, 0.9fr) minmax(240px, 0.6fr)" }}>
              <div className="admin-upload-zone">
                <input id="section-image-file" type="file" accept="image/*" onChange={handleSectionImageUpload} />
                <label htmlFor="section-image-file">
                  <strong>Nahrát obrázek sekce</strong>
                  <span>Pro preview a export. V produkci se později přepojí na Blob storage.</span>
                </label>
                <Input
                  id="section-image-url"
                  label="URL / cesta obrázku"
                  value={selectedSection?.imageUrl ?? ""}
                  onChange={(event) => updateSelectedSection("imageUrl", event.target.value)}
                  placeholder="/image.png nebo data URL"
                />
                <Input
                  id="section-image-alt"
                  label="Alt text"
                  value={selectedSection?.imageAlt ?? ""}
                  onChange={(event) => updateSelectedSection("imageAlt", event.target.value)}
                />
              </div>
              <div className="admin-image-preview">
                {selectedSection?.imageUrl ? (
                  <img src={selectedSection.imageUrl} alt={selectedSection.imageAlt || "Náhled obrázku sekce"} />
                ) : (
                  <span>Obrázek sekce</span>
                )}
              </div>
            </Grid>

            <Textarea
              id="section-notes"
              label="Interní poznámky"
              value={selectedSection?.notes ?? ""}
              onChange={(event) => updateSelectedSection("notes", event.target.value)}
              lines={3}
              resize="vertical"
            />
          </div>

          <div className="admin-subpanel">
            <div className="admin-panel-heading admin-editor-heading">
              <div>
                <span>Objekty v sekci</span>
                <h3>Karty, body, odkazy a položky</h3>
              </div>
              <Button variant="secondary" size="s" onClick={addSectionObject}>
                Přidat objekt
              </Button>
            </div>
            <div className="admin-object-editor-list">
              {(selectedSection?.objects ?? []).map((object) => (
                <div key={object.id} className="admin-object-editor-card">
                  <Grid className="admin-page-meta-grid" gap={12} fillWidth>
                    <Input
                      id={`${object.id}-label`}
                      label="Label"
                      value={object.label}
                      onChange={(event) => updateSelectedObject(object.id, "label", event.target.value)}
                    />
                    <Input
                      id={`${object.id}-title`}
                      label="Název"
                      value={object.title}
                      onChange={(event) => updateSelectedObject(object.id, "title", event.target.value)}
                    />
                    <Input
                      id={`${object.id}-url`}
                      label="URL"
                      value={object.url ?? ""}
                      onChange={(event) => updateSelectedObject(object.id, "url", event.target.value)}
                    />
                  </Grid>
                  <Textarea
                    id={`${object.id}-text`}
                    label="Popis"
                    value={object.text}
                    onChange={(event) => updateSelectedObject(object.id, "text", event.target.value)}
                    lines={3}
                    resize="vertical"
                  />
                  <Row horizontal="end">
                    <Button variant="danger" size="s" onClick={() => removeSectionObject(object.id)}>
                      Odebrat objekt
                    </Button>
                  </Row>
                </div>
              ))}
              {(selectedSection?.objects.length ?? 0) === 0 ? (
                <p className="admin-muted">Tahle sekce zatím nemá žádné opakovatelné objekty.</p>
              ) : null}
            </div>
          </div>
        </section>
      </Grid>

      <Grid className="admin-layout-grid" gap="16" fillWidth style={{ gridTemplateColumns: "minmax(280px, 0.68fr) minmax(0, 1.32fr)" }}>
        <aside id="admin-news-list" className="admin-panel admin-list-panel" aria-label="Seznam aktualit">
          <AdminTableBackground direction="left" />
          <div className="admin-panel-heading">
            <span>Aktuality</span>
            <h2>Fronta příspěvků</h2>
          </div>
          <button className={selectedId === "new" ? "admin-list-item is-active" : "admin-list-item"} type="button" onClick={() => selectItem("new")}>
            <strong>Nový příspěvek</strong>
            <span>Obrázek, text, kód</span>
          </button>
          {items.map((item) => (
            <button
              className={selectedId === item.id ? "admin-list-item is-active" : "admin-list-item"}
              key={item.id}
              type="button"
              onClick={() => selectItem(item.id)}
            >
              <strong>{item.title}</strong>
              <span>{item.category} · {item.status === "published" ? "publikováno" : "koncept"}</span>
            </button>
          ))}
          <Button variant="secondary" size="s" onClick={resetLocalContent}>
            Vrátit demo obsah
          </Button>
        </aside>

        <div id="admin-editor" className="admin-panel admin-editor-panel">
          <AdminTableBackground direction="right" />
          <div className="admin-panel-heading admin-editor-heading">
            <div>
              <span>Editor</span>
              <h2>Vložit aktualitu na homepage</h2>
            </div>
            <Row gap="8" wrap>
              <Button variant="secondary" size="s" onClick={() => saveDraft("draft")}>
                Uložit koncept
              </Button>
              <Button variant="primary" size="s" onClick={() => saveDraft("published")}>
                Publikovat
              </Button>
            </Row>
          </div>

          <div className="admin-form-grid">
            <Input
              id="news-title"
              label="Název"
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="Krátký název aktuality"
            />
            <Input
              id="news-category"
              label="Kategorie"
              value={draft.category}
              onChange={(event) => updateDraft("category", event.target.value)}
              placeholder="Web, Projekty, Osobní..."
            />
            <Input id="news-date" label="Datum" type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
            <Select
              id="news-status"
              label="Stav"
              value={draft.status}
              onSelect={(value: NewsStatus) => updateDraft("status", value)}
              options={[
                { label: "Koncept", value: "draft" },
                { label: "Publikováno", value: "published" },
              ]}
            />
          </div>

          <Input
            id="news-excerpt"
            label="Krátký popis pro homepage"
            value={draft.excerpt}
            onChange={(event) => updateDraft("excerpt", event.target.value)}
            placeholder="Jedna věta, kterou návštěvník pochopí za pár sekund"
          />

          <Grid id="admin-upload" className="admin-media-grid" fillWidth style={{ gridTemplateColumns: "minmax(0, 0.9fr) minmax(240px, 0.6fr)" }}>
            <div className="admin-upload-zone">
              <input id="news-image" type="file" accept="image/*" onChange={handleImageChange} />
              <label htmlFor="news-image">
                <strong>Nahrát obrázek</strong>
                <span>PNG, JPG nebo WebP. Teď se uloží jako preview do prohlížeče.</span>
              </label>
              <Input
                id="news-image-alt"
                label="Alt text obrázku"
                value={draft.imageAlt || ""}
                onChange={(event) => updateDraft("imageAlt", event.target.value)}
                placeholder="Popis obrázku pro přístupnost"
              />
            </div>
            <div className="admin-image-preview">
              {draft.imageDataUrl ? (
                <img src={draft.imageDataUrl} alt={draft.imageAlt || "Náhled nahraného obrázku"} />
              ) : (
                <span>Preview obrázku</span>
              )}
            </div>
          </Grid>

          <div className="admin-snippet-row" aria-label="Rychlé vložení bloků">
            {editorSnippets.map((snippet) => (
              <button key={snippet.label} type="button" onClick={() => insertSnippet(snippet.value)}>
                {snippet.label}
              </button>
            ))}
          </div>

          <Textarea
            id="news-content"
            label="Pokročilý text"
            value={draft.content}
            onChange={(event) => updateLongText("content", event.target.value)}
            lines={9}
            resize="vertical"
            placeholder="Piš text, poznámky, seznamy nebo markdown bloky."
          />

          <Textarea
            id="news-code-snippet"
            label="Kousek kódu"
            value={draft.codeSnippet || ""}
            onChange={(event) => updateLongText("codeSnippet", event.target.value)}
            lines={5}
            resize="vertical"
            placeholder="Sem vlož krátkou ukázku kódu, config nebo poznámku pro vývoj."
          />

          <Row className="admin-danger-row" fillWidth horizontal="between" vertical="center" gap="12" wrap>
            <Text as="p" variant="body-default-s" onBackground="neutral-weak">
              Uložené změny se teď drží v lokálním prohlížeči. Po MySQL napojení půjdou přes API.
            </Text>
            <Button variant="danger" size="s" onClick={deleteDraft}>
              Smazat
            </Button>
          </Row>
        </div>
      </Grid>

      <Grid className="admin-layout-grid" gap="16" fillWidth style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.82fr)" }}>
        <section id="admin-owner" className="admin-panel" aria-labelledby="owner-title">
          <AdminTableBackground direction="left" />
          <div className="admin-panel-heading">
            <span>Profil</span>
            <h2 id="owner-title">Info o majiteli</h2>
          </div>

          <Grid className="admin-form-grid" gap={14} fillWidth style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Input
              id="owner-full-name"
              label="Jméno"
              value={ownerProfile.fullName}
              onChange={(event) => updateOwnerField("fullName", event.target.value)}
              placeholder="Celé jméno"
            />
            <Input
              id="owner-role"
              label="Role"
              value={ownerProfile.role}
              onChange={(event) => updateOwnerField("role", event.target.value)}
              placeholder="Správce webu"
            />
            <Input
              id="owner-email"
              type="email"
              label="E-mail"
              value={ownerProfile.email}
              onChange={(event) => updateOwnerField("email", event.target.value)}
              placeholder="kontakt@..."
            />
            <Input
              id="owner-phone"
              label="Telefon"
              value={ownerProfile.phone}
              onChange={(event) => updateOwnerField("phone", event.target.value)}
              placeholder="+420 ..."
            />
            <Input
              id="owner-location"
              label="Lokalita"
              value={ownerProfile.location}
              onChange={(event) => updateOwnerField("location", event.target.value)}
              placeholder="Město / stát"
            />
            <Input
              id="owner-website"
              label="Web"
              value={ownerProfile.website}
              onChange={(event) => updateOwnerField("website", event.target.value)}
              placeholder="https://..."
            />
          </Grid>

          <Textarea
            id="owner-short-bio"
            label="Krátké bio"
            value={ownerProfile.shortBio}
            onChange={(event) => updateOwnerField("shortBio", event.target.value)}
            lines={3}
            resize="vertical"
            placeholder="Jedna až dvě věty pro rychlé představení."
          />

          <Textarea
            id="owner-long-bio"
            label="Detailní bio"
            value={ownerProfile.longBio}
            onChange={(event) => updateOwnerField("longBio", event.target.value)}
            lines={6}
            resize="vertical"
            placeholder="Delší popis majitele a jeho směru."
          />

          <Row gap={10} wrap>
            <Button variant="primary" size="s" onClick={saveOwnerProfile}>
              Uložit profil
            </Button>
            <Text as="p" variant="body-default-s" onBackground="neutral-weak">
              Poslední uložení: {ownerProfile.updatedAt ? new Date(ownerProfile.updatedAt).toLocaleString("cs-CZ") : "zatím neuloženo"}
            </Text>
          </Row>
        </section>

        <section id="admin-data" className="admin-panel" aria-labelledby="admin-data-title">
          <AdminTableBackground direction="right" />
          <div className="admin-panel-heading">
            <span>Data</span>
            <h2 id="admin-data-title">Upload a stahování</h2>
          </div>

          <div className="admin-upload-zone">
            <input id="owner-avatar-upload" type="file" accept="image/*" onChange={handleOwnerAvatarUpload} />
            <label htmlFor="owner-avatar-upload">
              <strong>Nahrát profilovou fotku</strong>
              <span>JPG, PNG nebo WebP. Uloží se do lokální administrace.</span>
            </label>
          </div>

          <div className="admin-owner-avatar-preview" aria-label="Náhled profilové fotky">
            {ownerProfile.avatarDataUrl ? (
              <img src={ownerProfile.avatarDataUrl} alt="Náhled profilové fotografie" />
            ) : (
              <span>Profilová fotka zatím není nahraná</span>
            )}
          </div>

          <div className="admin-upload-zone">
            <input id="owner-resume-upload" type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={handleResumeUpload} />
            <label htmlFor="owner-resume-upload">
              <strong>Nahrát CV nebo profilový dokument</strong>
              <span>Uložení pro rychlé stažení z administrace.</span>
            </label>
          </div>

          <Text as="p" variant="body-default-s" onBackground="neutral-weak">
            Soubor: {ownerProfile.resumeFileName || "zatím nenahráno"}
          </Text>

          <Row gap="8" wrap>
            <Button variant="secondary" size="s" onClick={downloadResume}>
              Stáhnout nahraný soubor
            </Button>
            <Button variant="secondary" size="s" onClick={exportAdminData}>
              Stáhnout export administrace
            </Button>
          </Row>

          <div className="admin-upload-zone">
            <input id="admin-import-file" type="file" accept="application/json,.json" onChange={importAdminData} />
            <label htmlFor="admin-import-file">
              <strong>Importovat balíček administrace</strong>
              <span>Načte profil majitele a uložené aktuality z exportovaného JSON.</span>
            </label>
          </div>
        </section>
      </Grid>

      <Grid className="admin-layout-grid" gap="16" fillWidth style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.82fr)" }}>
        <section id="admin-preview" className="admin-panel admin-preview-panel" aria-labelledby="preview-title">
          <AdminTableBackground direction="top" />
          <div className="admin-panel-heading">
            <span>Preview</span>
            <h2 id="preview-title">Jak bude aktualita působit</h2>
          </div>
          <article className="news-card admin-preview-card">
            <div className="news-card-image">
              {draft.imageDataUrl ? <img src={draft.imageDataUrl} alt={draft.imageAlt || ""} /> : <span>{draft.category || "Aktualita"}</span>}
            </div>
            <div className="news-card-copy">
              <span>{draft.category || "Aktualita"} · {draft.date}</span>
              <h3>{draft.title || "Název připravované aktuality"}</h3>
              <p>{draft.excerpt || "Krátký popis se zobrazí na homepage."}</p>
              {deferredContent ? <p>{deferredContent}</p> : null}
              {draft.codeSnippet ? <pre>{draft.codeSnippet}</pre> : null}
            </div>
          </article>
        </section>

        <section id="admin-mysql" className="admin-panel" aria-labelledby="mysql-title">
          <AdminTableBackground direction="bottom" />
          <div className="admin-panel-heading">
            <span>Databáze</span>
            <h2 id="mysql-title">MySQL návrh</h2>
          </div>
          <p className="admin-muted">
            Produkční ukládání vyžaduje `MYSQL_URL`, upload storage a chráněné API. Schéma je připravené pro aktuality na homepage.
          </p>
          <AccordionGroup
            className="admin-accordion-group"
            autoCollapse={false}
            size="m"
            items={[
              {
                title: "SQL tabulka pro aktuality",
                content: <pre className="admin-code-block">{mysqlContentSchema}</pre>,
              },
              {
                title: "Další backend krok",
                content: (
                  <Text as="p" variant="body-default-s" onBackground="neutral-weak">
                    Přidat chráněné API routy pro upload obrázků, ukládání příspěvků a načítání publikovaných aktualit z MySQL místo localStorage.
                  </Text>
                ),
              },
            ]}
          />
        </section>
      </Grid>

      <section id="admin-sections" className="admin-panel admin-section-map" aria-labelledby="sections-title">
        <AdminTableBackground direction="center" />
        <div className="admin-panel-heading">
          <span>Struktura</span>
          <h2 id="sections-title">Kam patří sekce z homepage</h2>
        </div>
        <AccordionGroup
          className="admin-accordion-group"
          size="m"
          items={homepageSectionPlan.map((section) => ({
            title: `${section.label} · ${section.title}`,
            content: (
              <div className="admin-section-accordion-content">
                <Badge title={destinationLabel(section.destination)} icon="document" arrow={false} effect={false} />
                <Text as="p" variant="body-default-s" onBackground="neutral-weak">
                  {section.note}
                </Text>
              </div>
            ),
          }))}
        />
      </section>
      </section>
    </div>
  )
}
