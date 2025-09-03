"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/auth_context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
