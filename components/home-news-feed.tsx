"use client"

import { useEffect, useState } from "react"
import { mergePublishedNews, readStoredNews } from "@/lib/admin-news-storage"
import type { HomeNewsItem } from "@/resources/admin-content"

export default function HomeNewsFeed({ defaultItems }: { defaultItems: HomeNewsItem[] }) {
  const [items, setItems] = useState(() => mergePublishedNews(defaultItems, []))

  useEffect(() => {
    setItems(mergePublishedNews(defaultItems, readStoredNews()))
  }, [defaultItems])

  return (
    <div className="news-grid" aria-label="Aktuality na homepage">
      {items.slice(0, 3).map((item) => (
        <article className="news-card" key={item.id}>
          <div className="news-card-image">
            {item.imageDataUrl ? <img src={item.imageDataUrl} alt={item.imageAlt || ""} /> : <span>{item.category}</span>}
          </div>
          <div className="news-card-copy">
            <span>
              {item.category} · {item.date}
            </span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            {item.codeSnippet ? <pre>{item.codeSnippet}</pre> : null}
          </div>
        </article>
      ))}
    </div>
  )
}
