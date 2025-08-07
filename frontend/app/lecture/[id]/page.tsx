"use client"

import { useParams } from "next/navigation"
import LecturePage from "@/components/sections/lecture/lecture-page"

export default function Page() {
  const params = useParams()
  const playlistId = params?.id as string

  return <LecturePage params={{ id: playlistId }} />
}
