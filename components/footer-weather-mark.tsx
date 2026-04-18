"use client"

import { Column } from "@once-ui-system/core/components/Column"
import { Heading } from "@once-ui-system/core/components/Heading"
import { Text } from "@once-ui-system/core/components/Text"
import { WeatherFx } from "@once-ui-system/core/components/WeatherFx"

export default function FooterWeatherMark() {
  return (
    <WeatherFx
      className="footer-weather-title"
      height={18}
      type="leaves"
      colors={["rgba(255, 255, 255, 0.98)", "rgba(232, 240, 255, 0.92)", "rgba(213, 255, 243, 0.88)"]}
      intensity={38}
      speed={0.62}
      trigger="mount"
      reducedMotion="auto"
    >
      <Column className="footer-weather-content" gap="12" fill center pointerEvents="none">
        <Text as="p" className="footer-weather-kicker" variant="label-default-s">
          Závěr stránky
        </Text>
        <Heading as="p" variant="heading-strong-xl">
          Vize, kreativita a realita.
        </Heading>
        <Text as="p" variant="body-default-m">
          Druhou šanci si zaslouží každý.
        </Text>
      </Column>
    </WeatherFx>
  )
}
