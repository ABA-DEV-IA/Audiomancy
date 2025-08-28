"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, Lock, Save, Eye, EyeOff, Sparkles, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth_context"
import { modify as modifyService } from "@/services/userService"
import { User as UserType } from "@/types/user"

interface ProfilePageProps {
  onSave?: () => void
}

export function AcountPage({ onSave }: ProfilePageProps) {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user?.username) {
      setFormData((prev) => ({ ...prev, username: user.username }))
    }
  }, [user])

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const generateParticles = () => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (isSaved) setIsSaved(false)
  }

  const isNewPasswordValid = !formData.newPassword || formData.newPassword.length >= 6
  const doPasswordsMatch =
    !formData.newPassword || (formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSaved(false)
    generateParticles()

    try {
      // Préparer payload
      const payload: any = { id: user?.id, username: formData.username }

      if (formData.newPassword && formData.confirmPassword && doPasswordsMatch) {
        const updatedUser: UserType = await modifyService(user?.id, formData.username, formData.newPassword);
      } else {
        const updatedUser: UserType = await modifyService(user?.id, formData.username);
      }

      // Appel API
      console.warn(payload);
      

      setIsLoading(false)
      setIsSaved(true)
      if (onSave) onSave()

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }))

      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil :", error)
      setIsLoading(false)
      setIsSaved(false)
      alert("Impossible de sauvegarder les modifications. Merci de réessayer.")
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#2B2B2B] via-[#301934] to-[#6A0DAD] p-6 overflow-y-auto relative">
      {/* Particules magiques */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#D9B3FF] rounded-full animate-ping opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      {/* Particules sauvegarde */}
      {isLoading && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 bg-[#4CE0B3] rounded-full animate-ping opacity-70"
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

      <div className="max-w-2xl mx-auto space-y-6 relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Sparkles className="h-8 w-8 mr-3 text-[#D9B3FF]" />
            Mon Profil Mystique
            <Sparkles className="h-8 w-8 ml-3 text-[#D9B3FF]" />
          </h1>
          <p className="text-[#D9B3FF] italic">Personnalise ton identité magique</p>
        </div>

        {/* Message succès */}
        {isSaved && (
          <Card className="bg-[#4CE0B3]/20 border-[#4CE0B3] animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-center text-[#4CE0B3]">
                <Check className="h-5 w-5 mr-2" />
                <span className="font-medium">Profil sauvegardé avec succès ! ✨</span>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Infos */}
          <Card className="bg-[#2B2B2B]/90 border-[#A45EE5] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-[#D9B3FF]" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-[#D9B3FF] text-sm font-medium">Nom d'utilisateur</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section sécurité */}
          <Card className="bg-[#2B2B2B]/90 border-[#A45EE5] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-[#D9B3FF]" />
                Sécurité & Mot de passe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-[#D9B3FF] text-sm">Laisse les champs vides si tu ne veux pas changer ton mot de passe.</p>

              {/* Nouveau mot de passe */}
              <div className="space-y-2">
                <label className="text-[#D9B3FF] text-sm font-medium">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#A45EE5] hover:text-[#6A0DAD] h-8 w-8"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-[#D9B3FF]/80">
                  {formData.newPassword &&
                    (isNewPasswordValid ? (
                      <span className="text-[#4CE0B3] flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Mot de passe valide
                      </span>
                    ) : (
                      <span className="text-[#FF7BAC] flex items-center">
                        <X className="h-3 w-3 mr-1" /> Minimum 6 caractères
                      </span>
                    ))}
                </div>
              </div>

              {/* Confirmation */}
              <div className="space-y-2">
                <label className="text-[#D9B3FF] text-sm font-medium">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#A45EE5] hover:text-[#6A0DAD] h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-[#D9B3FF]/80">
                  {formData.confirmPassword &&
                    formData.newPassword &&
                    (doPasswordsMatch ? (
                      <span className="text-[#4CE0B3] flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Les mots de passe correspondent
                      </span>
                    ) : (
                      <span className="text-[#FF7BAC] flex items-center">
                        <X className="h-3 w-3 mr-1" /> Les mots de passe ne correspondent pas
                      </span>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton submit */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !formData.username || (formData.newPassword !== "" && !doPasswordsMatch)}
              className="bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] text-white font-bold px-12 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#6A0DAD]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Sauvegarde en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-6 w-6 mr-3" /> Sauvegarder les modifications <Sparkles className="h-6 w-6 ml-3" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
