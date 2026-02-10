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
    <div className="min-h-screen bg-gradient-to-br from-ombre-occulte via-brume-cosmique to-encre-astrale flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundParticles particles={particles} isLoading={isLoading} />

      <Card className="w-full max-w-md bg-ombre-occulte/90 border-amethyste-magique backdrop-blur-sm relative z-20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-encre-astrale to-amethyste-magique rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-3xl">🔮</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2 text-eclat-ether" />
              AUDIOMANCY
              <Sparkles className="h-6 w-6 ml-2 text-eclat-ether" />
            </h1>
            <p className="text-eclat-ether italic">Connecte-toi à la magie</p>
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
