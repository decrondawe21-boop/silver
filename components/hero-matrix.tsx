"use client"

import { Background } from "@once-ui-system/core/components/Background"
import { BlockQuote } from "@once-ui-system/core/components/BlockQuote"
import { Column } from "@once-ui-system/core/components/Column"
import { Heading } from "@once-ui-system/core/components/Heading"
import { MatrixFx } from "@once-ui-system/core/components/MatrixFx"
import { Row } from "@once-ui-system/core/components/Row"
import { Text } from "@once-ui-system/core/components/Text"

export default function HeroMatrix() {
  return (
    <Column className="hero-fx-stack" gap="16" fillWidth>
      <Column className="hero-title-block" gap="16" fillWidth>
        <Heading as="h1" variant="display-strong-xl">
          Vize, kreativita a realita.
        </Heading>
        <BlockQuote
          className="hero-blockquote"
          align="left"
          marginY="16"
          separator="none"
          preline="Těžké je milovat někoho, koho si nevážíme."
          author={{
            name: "David Kozák",
            avatar: "/quote-avatar.png",
          }}
        >
          “Neméně těžké je milovat toho, koho si vážíme o mnoho víc než sebe.”
        </BlockQuote>
        <a className="quote-source-link" href="https://citaty.net/temata/tezkost/" target="_blank" rel="noreferrer">
          Zdroj: Erich Maria Remarque, citaty.net/temata/tezkost/
        </a>
      </Column>

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
          gradient={{
            display: true,
            colorStart: "neutral-background-weak",
          }}
          pointerEvents="none"
        />
        <Column className="hero-matrix-reveal" gap="12" fill center pointerEvents="none">
          <Text as="p" className="hero-matrix-kicker" variant="label-default-s">
            Osobní webová prezentace
          </Text>
          <Heading as="p" variant="display-strong-xl">
            David Kozák
          </Heading>
          <Text as="p" variant="body-default-l">
            OSVČ 05064571 · majitel spol. David Kozák International, s.r.o. 23143614
            <br />
            kozak@d-international.eu · +420 705 224 435
            <br />
            Rád měním vize ve smysluplnou realitu!
          </Text>
        </Column>
      </Row>
    </Column>
  )
}
