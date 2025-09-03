"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { LoginForm } from "@/components/sections/user/auth/LoginForm"
import { BackgroundParticles } from "@/components/sections/user/auth/BackgroundParticles"
import { generateParticles, Particle } from "@/utils/user/auth"

interface LoginPageProps {
  onLoginSuccess: () => void
  onSwitchToRegister: () => void
}

export function AuthPage({ onLoginSuccess, onSwitchToRegister }: LoginPageProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B2B2B] via-[#301934] to-[#6A0DAD] flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundParticles particles={particles} isLoading={isLoading} />

      <Card className="w-full max-w-md bg-[#2B2B2B]/90 border-[#A45EE5] backdrop-blur-sm relative z-20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-3xl">🔮</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2 text-[#D9B3FF]" />
              AUDIOMANCY
              <Sparkles className="h-6 w-6 ml-2 text-[#D9B3FF]" />
            </h1>
            <p className="text-[#D9B3FF] italic">Connecte-toi à la magie</p>
          </div>

          {/* Formulaire */}
          <LoginForm
            onLoginSuccess={onLoginSuccess}
            onSwitchToRegister={onSwitchToRegister}
            onLoadingChange={(loading) => {
              setIsLoading(loading)
              if (loading) setParticles(generateParticles())
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
