// lecture/generation/page.tsx
"use client"

import { GenerationProvider } from "@/context/generation_context"
import LecturePageGenerate from "@/components/sections/lecture/lectureGenerateSection"

export default function Page() {
  return (
      <LecturePageGenerate />
  )
}
