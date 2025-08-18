"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LecturePage from "@/components/sections/lecture/lecture-page";

export default function Page() {
  const params = useParams();
  const [tags, setTags] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedTags");
    if (stored) {
      setTags(JSON.parse(stored));
    }
  }, []);

  if (!tags) return <p>Chargement...</p>;

  return <LecturePage params={{ id: params.id as string, tags }} />;
}
