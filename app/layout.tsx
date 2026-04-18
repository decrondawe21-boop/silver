import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { ThemeInit } from "@once-ui-system/core"
import OnceUiProviders from "@/app/once-ui-providers"
import { getSiteUrl, siteDescription, siteName } from "@/lib/site"
import { fonts, onceUiTheme } from "@/resources/once-ui.config"
import "@once-ui-system/core/css/styles.css"
import "@once-ui-system/core/css/tokens.css"
import "./globals.css"

const siteUrl = getSiteUrl()

const browserExtensionHydrationGuard = `
(() => {
  const attribute = "fdprocessedid";
  const cleanup = (root) => {
    if (!root) return;
    if (root.nodeType === 1 && root.hasAttribute && root.hasAttribute(attribute)) {
      root.removeAttribute(attribute);
    }
    if (root.querySelectorAll) {
      root.querySelectorAll("[" + attribute + "]").forEach((node) => node.removeAttribute(attribute));
    }
  };

  cleanup(document);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => cleanup(document), { once: true });
  }

  if (typeof MutationObserver === "undefined") return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        cleanup(mutation.target);
      }
      mutation.addedNodes.forEach((node) => cleanup(node));
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [attribute],
  });

  window.setTimeout(() => observer.disconnect(), 8000);
})();
`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "David Kozák", url: siteUrl }],
  creator: "David Kozák",
  publisher: "David Kozák",
  keywords: [
    "David Kozák",
    "osobní web",
    "digitální projekty",
    "webdesign",
    "AI automatizace",
    "Silver",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "David Kozák Silver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
      className={`${fonts.primary.variable} ${fonts.secondary.variable} ${fonts.tertiary.variable} ${fonts.code.variable}`}
    >
      <head>
        <ThemeInit config={onceUiTheme} />
        <Script
          id="browser-extension-hydration-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: browserExtensionHydrationGuard }}
        />
      </head>
      <body>
        <OnceUiProviders>{children}</OnceUiProviders>
        <Analytics />
      </body>
    </html>
  )
}
