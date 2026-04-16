export type NewsStatus = "draft" | "published"

export type HomeNewsItem = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  status: NewsStatus
  imageDataUrl?: string
  imageAlt?: string
  content: string
  codeSnippet?: string
}

export type HomeSectionPlan = {
  id: string
  label: string
  title: string
  destination: "homepage" | "subpage" | "footer"
  note: string
}

export type EditorSnippet = {
  label: string
  value: string
}

export const adminStorageKey = "silver-admin-news-v1"

export const defaultHomeNews: HomeNewsItem[] = [
  {
    id: "news-silver-editor",
    title: "Silver dostává vlastní obsahový editor",
    excerpt: "Admin panel se připravuje na aktuality, obrázky, textové bloky a další kroky kolem databáze.",
    category: "Web",
    date: "2026-04-16",
    status: "published",
    imageAlt: "Stříbrný editor obsahu s jemnou elektrickou září",
    content:
      "Nová správa obsahu sjednocuje aktuality, textové poznámky a obrázky pro úvodní stránku. Cílem je rychlá editace bez zásahu do layoutu.",
    codeSnippet: "type ContentStatus = \"draft\" | \"published\"",
  },
  {
    id: "news-home-structure",
    title: "Homepage je seřazená podle skutečné navigace",
    excerpt: "Úvod drží stručný příběh, aktuality, profilový teaser, vybrané projekty a jasný kontakt.",
    category: "Struktura",
    date: "2026-04-15",
    status: "published",
    imageAlt: "Mapa sekcí osobního webu Silver",
    content:
      "Detailní služby a úplný katalog projektů patří na samostatné stránky. Homepage má zůstat rychlým vstupem a ne archivem všeho.",
  },
]

export const homepageSectionPlan: HomeSectionPlan[] = [
  {
    id: "hero",
    label: "01",
    title: "Hero a směr webu",
    destination: "homepage",
    note: "První obrazovka vysvětluje, kdo web vlastní a kam návštěvníka vede.",
  },
  {
    id: "news",
    label: "02",
    title: "Aktuality a příspěvky",
    destination: "homepage",
    note: "Krátké novinky patří hned za hero, aby šly rychle doplňovat přes administraci.",
  },
  {
    id: "profile",
    label: "03",
    title: "Profilový teaser",
    destination: "homepage",
    note: "Stručný osobní kontext zůstává na homepage, detail je na stránce Profil.",
  },
  {
    id: "services",
    label: "04",
    title: "Služby jako rozcestník",
    destination: "subpage",
    note: "Homepage ukazuje jen tři směry. Detailní vysvětlení patří na /sluzby.",
  },
  {
    id: "projects",
    label: "05",
    title: "Vybrané projekty",
    destination: "subpage",
    note: "Úvod má pouze výběr. Kompletní katalog a carousel zůstává na /projekty.",
  },
  {
    id: "contact",
    label: "06",
    title: "Kontakt a rychlé odkazy",
    destination: "footer",
    note: "Kontaktní CTA je na konci stránky a opakuje se ve footeru.",
  },
]

export const editorSnippets: EditorSnippet[] = [
  {
    label: "Poznámka",
    value: "\n\n> Poznámka: doplň krátký kontext, který vysvětluje proč je změna důležitá.\n",
  },
  {
    label: "Seznam",
    value: "\n\n- první konkrétní bod\n- druhý konkrétní bod\n- další krok\n",
  },
  {
    label: "CTA",
    value: "\n\n[Domluvit spolupráci](mailto:kontakt@david-kozak.com)\n",
  },
  {
    label: "Kód",
    value: '\n\n```ts\nconst status = "published"\n```\n',
  },
]

export const mysqlContentSchema = `CREATE TABLE home_news (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  excerpt VARCHAR(320) NOT NULL,
  category VARCHAR(80) NOT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  image_url TEXT NULL,
  image_alt VARCHAR(220) NULL,
  content MEDIUMTEXT NOT NULL,
  code_snippet MEDIUMTEXT NULL,
  published_at DATETIME NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX home_news_status_date_idx
  ON home_news (status, published_at);`
