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

export const onceUiBreakpoints = {
  xs: 480,
  s: 620,
  m: 920,
  l: 1180,
  xl: Number.POSITIVE_INFINITY,
} as const

export const onceUiDataTheme = {
  variant: onceUiTheme["viz-style"],
  mode: "categorical",
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
} as const
