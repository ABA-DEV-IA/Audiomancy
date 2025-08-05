"use client"

import { useState } from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface GenerationPageProps {
  onBack: () => void
  onComplete: () => void
}

export function GenerationPage({ onBack, onComplete }: GenerationPageProps) {
  const [step, setStep] = useState(1)
  const [wish, setWish] = useState("")
  const [playlistSize, setPlaylistSize] = useState(25)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  // Générer des particules magiques
  const generateParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }

  // Effet de transition magique
  const magicalTransition = (nextStep: number) => {
    setIsTransitioning(true)
    generateParticles()

    setTimeout(() => {
      setStep(nextStep)
      setIsTransitioning(false)
    }, 1000)
  }

  const handleStart = () => {
    magicalTransition(2)
  }

  const handleWishSubmit = () => {
    magicalTransition(3)
  }

  const handleSizeSelect = (size: number) => {
    setPlaylistSize(size)
    magicalTransition(4)

    // Simulate progress après la transition
    setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              onComplete()
            }, 1500)
            return 100
          }
          return prev + 8
        })
      }, 300)
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header avec bouton retour */}

      <div className="bg-[#6A0DAD] text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-wider">GÉNÉRATION</h1>
        <p className="text-[#D9B3FF] italic">~ Générer vos envies ~</p>
      </div>


      {/* Particules magiques en arrière-plan */}
      {isTransitioning && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 bg-[#D9B3FF] rounded-full animate-ping opacity-70"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: "2s",
              }}
            />
          ))}

          {/* Étoiles scintillantes */}
          <div className="absolute top-20 left-16 text-[#FF7BAC] animate-bounce text-2xl">✨</div>
          <div
            className="absolute top-32 right-20 text-[#4CE0B3] animate-bounce text-2xl"
            style={{ animationDelay: "0.3s" }}
          >
            ⭐
          </div>
          <div
            className="absolute bottom-32 left-20 text-[#A3D5FF] animate-bounce text-2xl"
            style={{ animationDelay: "0.6s" }}
          >
            💫
          </div>
          <div
            className="absolute bottom-20 right-16 text-[#FF934F] animate-bounce text-2xl"
            style={{ animationDelay: "0.9s" }}
          >
            🌟
          </div>
        </div>
      )}

      {/* Overlay de transition */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/20 via-[#A45EE5]/15 to-[#301934]/20 animate-pulse z-5" />
      )}

      {/* Contenu principal */}
      <div className="flex-1 bg-[#2B2B2B] flex items-center justify-center p-8 relative">
        <div
          className={`max-w-2xl w-full transition-all duration-1000 ${
            isTransitioning ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
          }`}
        >
          {/* Icône centrale magique */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-2xl">
              <span className="text-4xl">🔮</span>
              {isTransitioning && (
                <div className="absolute inset-0 rounded-full border-4 border-[#D9B3FF] animate-spin opacity-60" />
              )}
              {step === 4 && <div className="absolute inset-0 rounded-full border-4 border-[#4CE0B3] animate-pulse" />}
            </div>
          </div>

          {/* Étape 1: Accueil */}
          {step === 1 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 mr-3 text-[#D9B3FF]" />
                  Bienvenue dans l'Atelier Magique
                  <Sparkles className="h-7 w-7 ml-3 text-[#D9B3FF]" />
                </h2>
                <p className="text-[#D9B3FF] text-lg mb-8 max-w-lg mx-auto">
                  Laisse la magie du hasard et de l'intelligence artificielle créer une playlist parfaitement adaptée à
                  ton âme.
                </p>
              </div>
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
              >
                🌟 Commencer l'Incantation 🌟
              </Button>
            </div>
          )}

          {/* Étape 2: Souhait */}
          {step === 2 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <span className="mr-3 text-2xl">💭</span>
                  Exprime ton Désir Musical
                  <span className="ml-3 text-2xl">💭</span>
                </h2>
                <p className="text-[#D9B3FF] text-lg mb-8">
                  Décris ton humeur, tes envies, ou laisse libre cours à ton imagination...
                </p>
              </div>
              <div className="max-w-lg mx-auto">
                <Textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Je souhaite une playlist qui me donne de l'énergie pour commencer ma journée..."
                  className="mb-8 bg-[#301934] border-2 border-[#A45EE5] text-white placeholder:text-[#D9B3FF] text-lg p-6 min-h-32 transition-all duration-300 focus:border-[#6A0DAD] focus:shadow-2xl focus:shadow-[#A45EE5]/30 focus:scale-105"
                  rows={6}
                />
                <Button
                  onClick={handleWishSubmit}
                  className="bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
                  disabled={!wish.trim()}
                >
                  ✨ Valider mon Souhait ✨
                </Button>
              </div>
            </div>
          )}

          {/* Étape 3: Taille */}
          {step === 3 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <span className="mr-3 text-2xl">🎵</span>
                  Choisis la Puissance de ton Sort
                  <span className="ml-3 text-2xl">🎵</span>
                </h2>
                <p className="text-[#D9B3FF] text-lg mb-8">Combien de pistes magiques veux-tu dans ta playlist ?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {[
                  { size: 10, label: "Sort Mineur", desc: "Pour une écoute rapide", icon: "🌙" },
                  { size: 25, label: "Sort Équilibré", desc: "Le choix parfait", icon: "⭐" },
                  { size: 50, label: "Sort Majeur", desc: "Pour une immersion totale", icon: "🌟" },
                ].map((option) => (
                  <Button
                    key={option.size}
                    onClick={() => handleSizeSelect(option.size)}
                    className="h-auto p-6 bg-gradient-to-br from-[#301934] to-[#6A0DAD] hover:from-[#6A0DAD] hover:to-[#A45EE5] border-2 border-[#A45EE5] text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <div className="text-2xl font-bold mb-2">{option.size}</div>
                      <div className="text-lg font-semibold mb-1">{option.label}</div>
                      <div className="text-sm text-[#D9B3FF]">{option.desc}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 4: Génération */}
          {step === 4 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <span className="mr-3 animate-spin text-2xl">🌟</span>
                  Les Astres Consultent l'Oracle Musical
                  <span className="ml-3 animate-spin text-2xl" style={{ animationDirection: "reverse" }}>
                    🌟
                  </span>
                </h2>
                <p className="text-[#D9B3FF] text-lg mb-8">
                  L'intelligence artificielle tisse les fils de ta playlist magique...
                </p>
              </div>
              <div className="max-w-lg mx-auto space-y-6">
                <div className="relative">
                  <Progress value={progress} className="h-4 mb-4" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D9B3FF]/30 to-transparent animate-pulse rounded-full" />
                </div>
                <div className="text-[#D9B3FF] text-lg">
                  {progress < 30 && "🔮 Analyse de ton souhait..."}
                  {progress >= 30 && progress < 60 && "✨ Consultation des archives musicales..."}
                  {progress >= 60 && progress < 90 && "🎵 Tissage des harmonies parfaites..."}
                  {progress >= 90 && progress < 100 && "🌟 Finalisation de ta playlist magique..."}
                  {progress === 100 && (
                    <div className="animate-bounce text-[#4CE0B3] text-xl font-bold">
                      ✨ Playlist créée avec succès ! ✨
                      <br />
                      <span className="text-lg">Redirection vers la lecture...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
