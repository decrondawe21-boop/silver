"use client"

import { Avatar } from "@once-ui-system/core/components/Avatar"
import { Button } from "@once-ui-system/core/components/Button"
import { Card } from "@once-ui-system/core/components/Card"
import { Column } from "@once-ui-system/core/components/Column"
import { Heading } from "@once-ui-system/core/components/Heading"
import { Media } from "@once-ui-system/core/components/Media"
import { Row } from "@once-ui-system/core/components/Row"
import { Text } from "@once-ui-system/core/components/Text"
import { TiltFx } from "@once-ui-system/core/components/TiltFx"

export default function ProfileTiltCard() {
  return (
    <TiltFx className="profile-tilt" intensity={0.65}>
      <Card
        className="profile-tilt-card"
        fillWidth
        direction="column"
        padding="4"
        radius="l"
        border="neutral-alpha-weak"
        background="transparent"
      >
        <Row fillWidth vertical="center" paddingX="20" paddingY="12" gap="12">
          <Avatar size="xs" src="/hero-portrait.png" />
          <Text variant="label-default-s">David Kozák</Text>
        </Row>
        <Media
          border="neutral-alpha-weak"
          sizes="400px"
          fillWidth
          aspectRatio="16 / 9"
          radius="l"
          src="/hero-portrait.png"
          alt="David Kozák"
          objectFit="cover"
        />
        <Column fillWidth paddingX="24" paddingTop="32" paddingBottom="20" gap="12">
          <Heading as="h3" variant="body-default-xl">
            Tvořit věci, které dávají smysl.
          </Heading>
          <Text onBackground="neutral-weak" wrap="balance">
            Osobní prostor pro weby, AI a digitální směr bez zbytečné mlhy.
          </Text>
          <Row gap="8" paddingTop="8">
            <Button variant="tertiary" weight="default" size="s" prefixIcon="sparkle">
              Web
            </Button>
            <Button variant="tertiary" weight="default" size="s" prefixIcon="world">
              AI
            </Button>
          </Row>
        </Column>
      </Card>
    </TiltFx>
  )
}
