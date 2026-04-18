"use client"

import { Background } from "@once-ui-system/core/components/Background"
import { Column } from "@once-ui-system/core/components/Column"
import { Row } from "@once-ui-system/core/components/Row"
import { Text } from "@once-ui-system/core/components/Text"
import { WeatherFx } from "@once-ui-system/core/components/WeatherFx"

export default function WeatherLeafLayout() {
  return (
    <section className="weather-layout-section" aria-labelledby="weather-layout-title">
      <div className="weather-layout-panel">
        <Background
          className="weather-layout-background"
          fill
          gradient={{ display: true, opacity: 50, x: 16, y: 18, colorStart: "neutral-alpha-medium" }}
          lines={{ display: true, opacity: 20, size: "24", thickness: 1, angle: 105, color: "neutral-alpha-weak" }}
        />
        <WeatherFx
          className="weather-layout-fx"
          fill
          type="leaves"
          colors={["neutral-solid-strong", "neutral-solid-weak", "accent-solid-medium"]}
          intensity={34}
          speed={0.58}
          trigger="mount"
          reducedMotion="auto"
        />
        <Row className="weather-layout-content" fillWidth horizontal="between" vertical="end" gap="24" wrap>
          <Column gap="12" maxWidth={44}>
            <p className="eyebrow">Druhá šance</p>
            <h2 id="weather-layout-title">Druhou šanci si zaslouží každý.</h2>
          </Column>
          <Text as="p" variant="body-default-m" onBackground="neutral-weak">
            Vize, kreativita a realita se potkávají ve chvíli, kdy dostane nápad prostor znovu vyrůst.
          </Text>
        </Row>
      </div>
    </section>
  )
}
