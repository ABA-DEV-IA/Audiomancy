"use client"

import { Particle } from "@/utils/user/auth"

interface BackgroundParticlesProps {
  particles?: Particle[]
  isLoading?: boolean
}

export function BackgroundParticles({ particles = [], isLoading = false }: BackgroundParticlesProps) {
  return (
    <>
      {/* Particules fixes en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#D9B3FF] rounded-full animate-ping opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Particules dynamiques au chargement */}
      {isLoading && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 bg-[#4CE0B3] rounded-full animate-ping opacity-80"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
