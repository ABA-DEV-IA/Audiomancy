// app/providers.tsx
"use client";

import { useEffect } from "react";
import { initApiUrls } from "@/config/api";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initApiUrls();
  }, []);

  return <>{children}</>;
}
