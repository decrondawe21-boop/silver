"use client"

import { Background } from "@once-ui-system/core/components/Background"
import { Column } from "@once-ui-system/core/components/Column"
import { Heading } from "@once-ui-system/core/components/Heading"
import { MatrixFx } from "@once-ui-system/core/components/MatrixFx"
import { Row } from "@once-ui-system/core/components/Row"
import { Text } from "@once-ui-system/core/components/Text"
import { WeatherFx } from "@once-ui-system/core/components/WeatherFx"

export default function HeroMatrix() {
  return (
    <Column className="hero-fx-stack" gap="16" fillWidth>
      <WeatherFx
        className="hero-weather-title"
        height={20}
        type="leaves"
        colors={["rgba(255, 255, 255, 0.98)", "rgba(232, 240, 255, 0.92)", "rgba(213, 255, 243, 0.88)"]}
        intensity={40}
        speed={0.7}
        trigger="mount"
      >
        <Column className="hero-weather-content" gap="16" fill center pointerEvents="none">
          <Heading as="h1" variant="display-strong-xl">
            Osobní web pro nápady, které mají smysl.
          </Heading>
          <Text as="p" variant="body-default-l">
            Digitální prostor pro věci, které mají smysl.
          </Text>
        </Column>
      </WeatherFx>

      <Row className="hero-matrix" fill center padding="24" border="neutral-alpha-weak" radius="l" overflow="hidden">
        <MatrixFx
          className="hero-matrix-effect"
          position="absolute"
          top="0"
          left="0"
          trigger="hover"
          size={2}
          spacing={2}
          speed={1.05}
          flicker
          revealFrom="bottom"
          colors={["neutral-solid-strong", "neutral-solid-medium"]}
        />
        <Background
          fill
          position="absolute"
          left="0"
          top="0"
          x="0"
          y="0"
          gradient={{
            display: true,
            colorStart: "neutral-background-weak",
          }}
          pointerEvents="none"
        />
        <Column className="hero-matrix-reveal" gap="12" fill center pointerEvents="none">
          <Text as="p" className="hero-matrix-kicker" variant="label-default-s">
            Přejeď a odhal
          </Text>
          <Heading as="p" variant="display-strong-xl">
            Nápady v pohybu
          </Heading>
          <Text as="p" variant="body-default-l">
            Energie, nápady a weby v jednom proudu.
          </Text>
        </Column>
      </Row>
    </Column>
  )
}
