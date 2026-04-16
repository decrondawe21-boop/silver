"use client"

import type { ChangeEvent } from "react"
import { startTransition, useDeferredValue, useEffect, useState } from "react"
import { Background, Badge, Button, Column, Grid, Heading, MatrixFx, Row, Text } from "@once-ui-system/core"
import { readStoredNews, writeStoredNews } from "@/lib/admin-news-storage"
import {
  defaultHomeNews,
  editorSnippets,
  homepageSectionPlan,
  mysqlContentSchema,
  type HomeNewsItem,
  type NewsStatus,
} from "@/resources/admin-content"

const emptyDraft = (): HomeNewsItem => ({
  id: `news-${Date.now()}`,
  title: "",
  excerpt: "",
  category: "Aktualita",
  date: new Date().toISOString().slice(0, 10),
  status: "draft",
  imageAlt: "",
  content: "",
  codeSnippet: "",
})

function destinationLabel(destination: "homepage" | "subpage" | "footer") {
  if (destination === "homepage") return "Homepage"
  if (destination === "footer") return "Footer"
  return "Samostatná stránka"
}

function countPublished(items: HomeNewsItem[]) {
  return items.filter((item) => item.status === "published").length
}

export default function AdminContentStudio() {
  const [items, setItems] = useState<HomeNewsItem[]>(defaultHomeNews)
  const [draft, setDraft] = useState<HomeNewsItem>(() => emptyDraft())
  const [selectedId, setSelectedId] = useState<string>("new")
  const [notice, setNotice] = useState("Lokální editor je připravený. Pro MySQL chybí produkční připojení.")
  const deferredContent = useDeferredValue(draft.content)

  useEffect(() => {
    const stored = readStoredNews()
    if (stored.length > 0) {
      setItems(stored)
      setNotice("Načteny lokálně uložené aktuality z tohoto prohlížeče.")
    }
  }, [])

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
      setNotice("Vybraný soubor není obrázek.")
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
      setNotice("Obrázek je načtený jako preview. Pro produkci ho později přesměrujeme na objektové úložiště.")
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
      setNotice("Připravený nový příspěvek.")
      return
    }

    const item = items.find((candidate) => candidate.id === id)
    if (!item) return

    setSelectedId(id)
    setDraft(item)
    setNotice(`Upravuji: ${item.title}`)
  }

  const persistItems = (nextItems: HomeNewsItem[], message: string) => {
    setItems(nextItems)
    writeStoredNews(nextItems)
    setNotice(message)
  }

  const saveDraft = (status: NewsStatus) => {
    const title = draft.title.trim()
    const excerpt = draft.excerpt.trim()

    if (!title || !excerpt) {
      setNotice("Doplň název a krátký popis. Bez nich příspěvek nepůjde publikovat.")
      return
    }

    const normalized: HomeNewsItem = {
      ...draft,
      title,
      excerpt,
      category: draft.category.trim() || "Aktualita",
      date: draft.date || new Date().toISOString().slice(0, 10),
      status,
      content: draft.content.trim() || excerpt,
      codeSnippet: draft.codeSnippet?.trim(),
    }

    const exists = items.some((item) => item.id === normalized.id)
    const nextItems = exists
      ? items.map((item) => (item.id === normalized.id ? normalized : item))
      : [normalized, ...items]

    persistItems(nextItems, status === "published" ? "Aktualita je publikovaná na homepage v tomto prohlížeči." : "Koncept je uložený.")
    setSelectedId(normalized.id)
    setDraft(normalized)
  }

  const deleteDraft = () => {
    if (selectedId === "new") {
      setDraft(emptyDraft())
      setNotice("Nový rozpracovaný příspěvek je vyčištěný.")
      return
    }

    const nextItems = items.filter((item) => item.id !== selectedId)
    persistItems(nextItems, "Příspěvek je odstraněný z lokální administrace.")
    selectItem("new")
  }

  const resetLocalContent = () => {
    persistItems(defaultHomeNews, "Lokální obsah je vrácený na výchozí sadu.")
    setSelectedId("new")
    setDraft(emptyDraft())
  }

  return (
    <section className="admin-studio" aria-labelledby="admin-title">
      <Column className="admin-hero" gap="24" fillWidth>
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
        <Row className="admin-hero-topline" fillWidth horizontal="space-between" vertical="center" gap="16">
          <Badge title="Content OS" icon="document" arrow={false} effect={false} />
          <Text as="p" variant="label-default-s">
            {countPublished(items)} publikované / {items.length} celkem
          </Text>
        </Row>
        <Column gap="16" maxWidth={54}>
          <Heading id="admin-title" as="h1" variant="display-strong-xl">
            Admin panel pro obsah, aktuality a homepage.
          </Heading>
          <Text as="p" variant="body-default-l" onBackground="neutral-medium">
            Obrázky, texty, kódové bloky a struktura homepage jsou na jednom místě. MySQL je připravené jako schéma a naváže se po dodání připojení.
          </Text>
        </Column>
      </Column>

      <Grid className="admin-stat-grid" columns="repeat(4, minmax(0, 1fr))" gap="12" fillWidth>
        <div>
          <span>Obsah</span>
          <strong>{items.length}</strong>
          <p>aktuality v editoru</p>
        </div>
        <div>
          <span>Publikováno</span>
          <strong>{countPublished(items)}</strong>
          <p>viditelné na homepage</p>
        </div>
        <div>
          <span>Upload</span>
          <strong>IMG</strong>
          <p>preview z lokálního souboru</p>
        </div>
        <div>
          <span>DB</span>
          <strong>SQL</strong>
          <p>připravené MySQL schéma</p>
        </div>
      </Grid>

      <div className="admin-notice" role="status">
        {notice}
      </div>

      <Grid className="admin-layout-grid" columns="minmax(280px, 0.68fr) minmax(0, 1.32fr)" gap="16" fillWidth>
        <aside className="admin-panel admin-list-panel" aria-label="Seznam aktualit">
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

        <div className="admin-panel admin-editor-panel">
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
            <label className="admin-field">
              <span>Název</span>
              <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Krátký název aktuality" />
            </label>
            <label className="admin-field">
              <span>Kategorie</span>
              <input value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} placeholder="Web, Projekty, Osobní..." />
            </label>
            <label className="admin-field">
              <span>Datum</span>
              <input type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>Stav</span>
              <select value={draft.status} onChange={(event) => updateDraft("status", event.target.value as NewsStatus)}>
                <option value="draft">Koncept</option>
                <option value="published">Publikováno</option>
              </select>
            </label>
          </div>

          <label className="admin-field">
            <span>Krátký popis pro homepage</span>
            <input value={draft.excerpt} onChange={(event) => updateDraft("excerpt", event.target.value)} placeholder="Jedna věta, kterou návštěvník pochopí za pár sekund" />
          </label>

          <Grid className="admin-media-grid" columns="minmax(0, 0.9fr) minmax(240px, 0.6fr)" gap="14" fillWidth>
            <div className="admin-upload-zone">
              <input id="news-image" type="file" accept="image/*" onChange={handleImageChange} />
              <label htmlFor="news-image">
                <strong>Nahrát obrázek</strong>
                <span>PNG, JPG nebo WebP. Teď se uloží jako preview do prohlížeče.</span>
              </label>
              <label className="admin-field">
                <span>Alt text obrázku</span>
                <input value={draft.imageAlt || ""} onChange={(event) => updateDraft("imageAlt", event.target.value)} placeholder="Popis obrázku pro přístupnost" />
              </label>
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

          <label className="admin-field">
            <span>Pokročilý text</span>
            <textarea value={draft.content} onChange={(event) => updateLongText("content", event.target.value)} rows={9} placeholder="Piš text, poznámky, seznamy nebo markdown bloky." />
          </label>

          <label className="admin-field">
            <span>Kousek kódu</span>
            <textarea value={draft.codeSnippet || ""} onChange={(event) => updateLongText("codeSnippet", event.target.value)} rows={5} placeholder="Sem vlož krátkou ukázku kódu, config nebo poznámku pro vývoj." />
          </label>

          <Row className="admin-danger-row" fillWidth horizontal="space-between" vertical="center" gap="12" wrap>
            <Text as="p" variant="body-default-s" onBackground="neutral-weak">
              Uložené změny se teď drží v lokálním prohlížeči. Po MySQL napojení půjdou přes API.
            </Text>
            <Button variant="danger" size="s" onClick={deleteDraft}>
              Smazat
            </Button>
          </Row>
        </div>
      </Grid>

      <Grid className="admin-layout-grid" columns="minmax(0, 1fr) minmax(320px, 0.82fr)" gap="16" fillWidth>
        <section className="admin-panel admin-preview-panel" aria-labelledby="preview-title">
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

        <section className="admin-panel" aria-labelledby="mysql-title">
          <div className="admin-panel-heading">
            <span>Databáze</span>
            <h2 id="mysql-title">MySQL návrh</h2>
          </div>
          <p className="admin-muted">
            Produkční ukládání vyžaduje `MYSQL_URL`, upload storage a chráněné API. Schéma níže je připravené pro aktuality na homepage.
          </p>
          <pre className="admin-code-block">{mysqlContentSchema}</pre>
        </section>
      </Grid>

      <section className="admin-panel admin-section-map" aria-labelledby="sections-title">
        <div className="admin-panel-heading">
          <span>Struktura</span>
          <h2 id="sections-title">Kam patří sekce z homepage</h2>
        </div>
        <div className="section-map-grid">
          {homepageSectionPlan.map((section) => (
            <div key={section.id}>
              <span>{section.label} · {destinationLabel(section.destination)}</span>
              <strong>{section.title}</strong>
              <p>{section.note}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
