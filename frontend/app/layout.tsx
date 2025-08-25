// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers";
import { GenerationProvider } from "@/context/generation_context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audiomancy",
  description: "Application de génération de playlist via intelligence artificielle",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <GenerationProvider>
        <Providers>{children}</Providers>
        </GenerationProvider>
      </body>
    </html>
  );
}
