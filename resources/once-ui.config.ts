import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const fonts = {
  primary: GeistSans,
  secondary: GeistSans,
  tertiary: GeistSans,
  code: GeistMono,
}

export const onceUiTheme = {
  theme: "dark",
  brand: "cyan",
  accent: "aqua",
  neutral: "gray",
  solid: "contrast",
  "solid-style": "flat",
  border: "playful",
  surface: "filled",
  transition: "all",
  scaling: "100",
  "viz-style": "gradient",
} as const
