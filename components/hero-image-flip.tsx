"use client"

import { Column } from "@once-ui-system/core/components/Column"
import { FlipFx } from "@once-ui-system/core/components/FlipFx"
import { Text } from "@once-ui-system/core/components/Text"

export default function HeroImageFlip() {
  return (
    <FlipFx
      className="hero-image-flip"
      flipDirection="horizontal"
      timing={900}
      front={
        <div className="portrait-flip-face portrait-flip-front">
          <img src="/hero-road-meaning.png" alt="Černobílá cesta k horám s osobním mottem" />
          <span>Klikni pro popisek</span>
        </div>
      }
      back={
        <Column className="portrait-flip-face portrait-flip-back" fill center gap="16">
          <Text as="p" variant="label-default-s">
            Popisek obrázku
          </Text>
          <Text as="strong" variant="heading-strong-xl">
            Druhou šanci si zaslouží každý.
          </Text>
          <Text as="p" variant="body-default-m" onBackground="neutral-weak">
            Vize, kreativita a realita nejsou zkratka. Jsou směr, kterým se dá znovu začít.
          </Text>
        </Column>
      }
    />
  )
}
