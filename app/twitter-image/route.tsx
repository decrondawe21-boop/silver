import { createSocialImage } from "@/lib/social-image"

export const runtime = "edge"

export function GET() {
  return createSocialImage()
}
