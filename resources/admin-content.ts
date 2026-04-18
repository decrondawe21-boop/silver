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

export type EditableSectionObject = {
  id: string
  label: string
  title: string
  text: string
  url?: string
}

export type EditablePageSection = {
  id: string
  label: string
  eyebrow: string
  title: string
  text: string
  quote: string
  imageUrl: string
  imageAlt: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  objects: EditableSectionObject[]
  notes: string
}

export type EditablePage = {
  id: string
  path: string
  navLabel: string
  metaTitle: string
  metaDescription: string
  sections: EditablePageSection[]
}

export const adminStorageKey = "silver-admin-news-v1"
export const adminSiteStorageKey = "silver-admin-site-v1"

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

export const defaultEditablePages: EditablePage[] = [
  {
    id: "home",
    path: "/",
    navLabel: "Domů",
    metaTitle: "David Kozák Silver",
    metaDescription: "Osobní web Silver: profil, služby, aktuality, projekty a kontakt.",
    sections: [
      {
        id: "home-hero",
        label: "Hero",
        eyebrow: "David Kozák",
        title: "Druhou šanci si zaslouží každý.",
        text: "Vize, kreativita a realita tady dostávají konkrétní tvar.",
        quote: "Druhou šanci si zaslouží každý.",
        imageUrl: "/hero-road-meaning.png",
        imageAlt: "Černobílá cesta k horám s osobním mottem",
        primaryCtaLabel: "Domluvit spolupráci",
        primaryCtaHref: "/kontakt",
        secondaryCtaLabel: "Prohlédnout práci",
        secondaryCtaHref: "/projekty",
        objects: [
          { id: "home-signal-web", label: "Signal", title: "Web", text: "Veřejná prezentace a jasný první dojem." },
          { id: "home-signal-brand", label: "Signal", title: "Brand", text: "Osobní tón, vizuál a sdělení." },
          { id: "home-signal-ai", label: "Signal", title: "AI", text: "Nástroje pro rychlejší práci s obsahem." },
        ],
        notes: "Hlavní vstupní obrazovka, motto, CTA a obrazová atmosféra.",
      },
      {
        id: "home-news",
        label: "Aktuality",
        eyebrow: "Aktuality",
        title: "Nové zápisy, změny a pracovní směry.",
        text: "Krátké novinky patří hned za hero, aby šly rychle doplňovat přes administraci.",
        quote: "",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "",
        primaryCtaHref: "",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [],
        notes: "Napojeno na editor aktualit v horní části adminu.",
      },
      {
        id: "home-profile",
        label: "Profil",
        eyebrow: "Profil",
        title: "Klidný vzhled, ostrá myšlenka a jasný výsledek.",
        text: "Pomáhám převést osobní značku, službu nebo nápad do podoby, která působí profesionálně a dá se hned použít.",
        quote: "",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "Otevřít profil",
        primaryCtaHref: "/profil",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [
          { id: "home-profile-web", label: "Signal", title: "Web", text: "Prezentace a jasná struktura." },
          { id: "home-profile-brand", label: "Signal", title: "Brand", text: "Osobní značka a tón." },
          { id: "home-profile-ai", label: "Signal", title: "AI", text: "Nástroje a workflow." },
        ],
        notes: "Profilový teaser na homepage.",
      },
      {
        id: "home-services",
        label: "Služby",
        eyebrow: "Služby",
        title: "Od prvního dojmu po funkční systém.",
        text: "Homepage ukazuje tři hlavní směry služeb.",
        quote: "",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "Detail služeb",
        primaryCtaHref: "/sluzby",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [
          { id: "home-service-web", label: "01", title: "Weby a identita", text: "Rychlý osobní web, jasná nabídka a vizuál, který zůstane v hlavě." },
          { id: "home-service-automation", label: "02", title: "Automatizace", text: "Jednodušší procesy, méně ruční práce a víc prostoru pro rozhodnutí." },
          { id: "home-service-strategy", label: "03", title: "Digitální strategie", text: "Nápady převedené do konkrétních kroků, textů, stránek a nástrojů." },
        ],
        notes: "Rozcestník služeb na homepage.",
      },
      {
        id: "home-contact",
        label: "Kontakt",
        eyebrow: "Kontakt",
        title: "Pojďme společně tvořit budoucnost.",
        text: "Propojíme vizi s realitou a sny se stanou skutečností.",
        quote: "Propojíme vizi s realitou.",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "kontakt@david-kozak.com",
        primaryCtaHref: "mailto:kontakt@david-kozak.com",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [],
        notes: "Závěrečný CTA blok homepage.",
      },
    ],
  },
  {
    id: "profile",
    path: "/profil",
    navLabel: "Profil",
    metaTitle: "Profil | David Kozák Silver",
    metaDescription: "Osobní profil Davida Kozáka, digitální styl práce a směr webu Silver.",
    sections: [
      {
        id: "profile-hero",
        label: "Hero",
        eyebrow: "Profil",
        title: "Klidný vzhled, ostrá myšlenka a jasný výsledek.",
        text: "Osobní značka, web a digitální systém mají působit přirozeně.",
        quote: "Méně šumu, víc směru.",
        imageUrl: "/quote-avatar.png",
        imageAlt: "Profilový vizuál pro citát",
        primaryCtaLabel: "Kontakt",
        primaryCtaHref: "/kontakt",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [
          { id: "profile-web", label: "Zaměření", title: "Web", text: "Struktura, obsah a technické řešení." },
          { id: "profile-brand", label: "Zaměření", title: "Brand", text: "Osobní výraz a jasná linka." },
          { id: "profile-ai", label: "Zaměření", title: "AI", text: "Praktické nástroje pro každodenní práci." },
        ],
        notes: "Profilová stránka, základní claim a princip práce.",
      },
    ],
  },
  {
    id: "services",
    path: "/sluzby",
    navLabel: "Služby",
    metaTitle: "Služby | David Kozák Silver",
    metaDescription: "Weby, identita, automatizace a digitální strategie pro osobní i veřejné projekty.",
    sections: [
      {
        id: "services-hero",
        label: "Hero",
        eyebrow: "Služby",
        title: "Od prvního dojmu po funkční systém.",
        text: "Stránka, obsah i nástroje mají držet pohromadě.",
        quote: "Rychlý výsledek, který se dá rozvíjet.",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "Domluvit spolupráci",
        primaryCtaHref: "/kontakt",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [
          { id: "services-presentation", label: "01", title: "Rychlá prezentace", text: "Jasná struktura, texty a vizuální výraz pro první dojem." },
          { id: "services-cleanup", label: "02", title: "Digitální úklid", text: "Zpřehlednění procesu, obsahu nebo malého interního workflow." },
          { id: "services-next", label: "03", title: "Směr další verze", text: "Konkrétní plán, co ponechat, co zjednodušit a co posunout." },
        ],
        notes: "Sekce s detailními službami a rozšířenými kartami.",
      },
    ],
  },
  {
    id: "projects",
    path: "/projekty",
    navLabel: "Projekty",
    metaTitle: "Projekty | David Kozák Silver",
    metaDescription: "Veřejné projekty Davida Kozáka s automatickými miniaturami, odkazy a krátkým popisem.",
    sections: [
      {
        id: "projects-catalog",
        label: "Katalog",
        eyebrow: "Projekty",
        title: "Veřejné projekty propojené jednou digitální stopou.",
        text: "Dominantní weby, experimenty a pracovní plochy na jednom místě.",
        quote: "Celý katalog žije tady.",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "Otevřít kontakt",
        primaryCtaHref: "/kontakt",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [
          { id: "project-international", label: "Dominantní", title: "International", text: "Mezinárodní prezentace s čistým rozhraním.", url: "https://international.david-kozak.com" },
          { id: "project-repas", label: "Dominantní", title: "REPAS|MOBILE", text: "Servisní web pro mobilní zařízení.", url: "https://www.repasmobile.david-kozak.com" },
        ],
        notes: "Správa výběru projektů a krátkých popisů.",
      },
    ],
  },
  {
    id: "contact",
    path: "/kontakt",
    navLabel: "Kontakt",
    metaTitle: "Kontakt | David Kozák Silver",
    metaDescription: "Kontakt pro spolupráci na webu, osobní prezentaci, automatizaci a digitální strategii.",
    sections: [
      {
        id: "contact-main",
        label: "Kontakt",
        eyebrow: "Kontakt",
        title: "Pojďme společně tvořit budoucnost.",
        text: "Propojíme vizi s realitou a sny se stanou skutečností.",
        quote: "Stačí krátce napsat, co chceš posunout.",
        imageUrl: "",
        imageAlt: "",
        primaryCtaLabel: "kontakt@david-kozak.com",
        primaryCtaHref: "mailto:kontakt@david-kozak.com",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        objects: [
          { id: "contact-web", label: "01", title: "Web nebo identita", text: "Nová prezentace, úprava směru nebo jasnější texty." },
          { id: "contact-automation", label: "02", title: "Automatizace", text: "Jednodušší procesy a méně ruční práce." },
          { id: "contact-strategy", label: "03", title: "Digitální strategie", text: "Plán pro další verzi, veřejný projekt nebo pracovní plochu." },
        ],
        notes: "Kontaktní obsah, poznámky a důvody ke kontaktu.",
      },
    ],
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
  ON home_news (status, published_at);

CREATE TABLE site_content_documents (
  document_key VARCHAR(80) PRIMARY KEY,
  document_json LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
