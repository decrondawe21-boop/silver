import { ImageResponse } from "next/og"
import { siteDescription, siteName } from "@/lib/site"

export const socialImageSize = {
  width: 1200,
  height: 630,
}

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#070809",
          color: "#f7f7f7",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -160,
            top: 30,
            width: 620,
            height: 620,
            borderRadius: 620,
            background:
              "radial-gradient(circle, rgba(169, 241, 214, 0.52), rgba(169, 241, 214, 0.08) 45%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -110,
            bottom: -140,
            width: 520,
            height: 520,
            borderRadius: 520,
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0.08) 42%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 44,
            border: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 88,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 78,
            height: 78,
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.32)",
            background: "rgba(255, 255, 255, 0.08)",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          DK
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            padding: "136px 96px 96px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginBottom: 28,
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid rgba(169, 241, 214, 0.38)",
              background: "rgba(255, 255, 255, 0.08)",
              color: "rgba(255, 255, 255, 0.82)",
              fontSize: 24,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            David Kozák
          </div>
          <div
            style={{
              maxWidth: 900,
              fontSize: 82,
              lineHeight: 0.95,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              maxWidth: 760,
              marginTop: 28,
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 30,
              lineHeight: 1.35,
            }}
          >
            {siteDescription}
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  )
}
