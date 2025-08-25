"use client";

import { useEffect, useState, ReactNode } from "react";
import { initRuntimeConfig } from "@/config/settings";

export function Providers({ children }: { children: ReactNode }) {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  initRuntimeConfig()
    .then(() => setConfigLoaded(true))
    .catch((err) => {
      console.error("Erreur lors de l'initialisation de l'API :", err);
      setError("Impossible de charger la configuration.");
    });
    }, []);

    if (error) {
      return <div>{error}</div>;
    }

  if (!configLoaded) {
    return <div>Chargement de la configuration...</div>;
  }

  return <>{children}</>;
}
