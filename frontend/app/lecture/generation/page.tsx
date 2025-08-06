// lecture/generation/page.tsx
"use client"

import { GenerationProvider } from "@/context/generation_context"
import LecturePageGenerate from "../lecture-page-generate"

export default function Page() {
  return (
      <LecturePageGenerate />
  )
}
