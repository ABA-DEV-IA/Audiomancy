"use client";

import { useEffect, useState, ReactNode } from "react";
import { initApiUrls } from "@/config/api";

export function Providers({ children }: { children: ReactNode }) {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    initApiUrls()
      .then(() => setConfigLoaded(true))
      .catch((err) => {
        console.error("Erreur lors de l'initialisation de l'API :", err);
      });
  }, []);

  if (!configLoaded) {
    return <div>Chargement de la configuration...</div>; // ou un loader
  }

  return <>{children}</>;
}
