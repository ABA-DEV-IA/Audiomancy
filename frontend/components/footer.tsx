"use client"

import { Github, Twitter, Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/aruide/Audiomancy", color: "#4CE0B3" },
    { name: "Twitter", icon: Twitter, href: "#", color: "#A3D5FF" },
    { name: "Instagram", icon: Instagram, href: "#", color: "#FF7BAC" },
    { name: "Email", icon: Mail, href: "mailto:contact@audiomancy.com", color: "#FF934F" },
  ]

  return (
    <footer className="bg-[#301934] border-t border-[#A45EE5] py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          {/* Description */}
          <div className="text-center md:text-left">
            <p className="text-[#D9B3FF] text-sm max-w-md">
              Une incantation subtile pour faire naître le son. Créez des playlists magiques avec l'intelligence
              artificielle.
            </p>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex items-center space-x-2">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#6A0DAD] transition-colors h-8 w-8"
                  onClick={() => window.open(social.href, "_blank")}
                >
                  <Icon className="h-4 w-4" style={{ color: social.color }} />
                </Button>
              )
            })}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-[#D9B3FF] text-sm">© 2025 AUDIOMANCY. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
