"use client"

import type React from "react"
import {
  Column,
  DataThemeProvider,
  IconProvider,
  LayoutProvider,
  ThemeProvider,
  ToastProvider,
} from "@once-ui-system/core"
import { onceUiTheme } from "@/resources/once-ui.config"

export default function OnceUiProviders({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <ThemeProvider
        theme={onceUiTheme.theme}
        brand={onceUiTheme.brand}
        accent={onceUiTheme.accent}
        neutral={onceUiTheme.neutral}
        solid={onceUiTheme.solid}
        solidStyle={onceUiTheme["solid-style"]}
        border={onceUiTheme.border}
        surface={onceUiTheme.surface}
        transition={onceUiTheme.transition}
        scaling={onceUiTheme.scaling}
      >
        <DataThemeProvider>
          <ToastProvider>
            <IconProvider>
              <Column background="page" fillWidth margin="0" minHeight="100vh" padding="0">
                {children}
              </Column>
            </IconProvider>
          </ToastProvider>
        </DataThemeProvider>
      </ThemeProvider>
    </LayoutProvider>
  )
}
