"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth_context"
import { register as registerService } from "@/services/userService"
import { User as UserType } from "@/types/user"

interface RegisterPageProps {
  onRegisterSuccess: () => void,
  onSwitchToLogin: () => void,
}

export function RegisterPage({ onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const generateParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setParticles(newParticles)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Validation des mots de passe et formulaire
  const isPasswordValid = formData.password.length >= 6
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.trim() !== ""
  const isFormValid =
    formData.username.trim() !== "" &&
    formData.email.trim() !== "" &&
    isPasswordValid &&
    doPasswordsMatch &&
    acceptTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setError(null)
    setIsLoading(true)
    generateParticles()

    try {
      const user: UserType = await registerService(formData.email, formData.username, formData.password)
      login(user) // Connexion automatique après inscription
      onRegisterSuccess()
    } catch (err: any) {
      setError(err.message || "Échec de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B2B2B] via-[#301934] to-[#6A0DAD] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particules décoratives */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#D9B3FF] rounded-full animate-ping opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      {/* Particules d'inscription */}
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
                animationDuration: "2.5s",
              }}
            />
          ))}
        </div>
      )}

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
            <p className="text-[#D9B3FF] italic">Rejoins la communauté magique</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom d'utilisateur */}
            <div className="space-y-2">
              <label className="text-[#D9B3FF] text-sm font-medium">Nom d'utilisateur</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Ton nom mystique"
                  className="pl-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[#D9B3FF] text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="ton-email@exemple.com"
                  className="pl-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="text-[#D9B3FF] text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#A45EE5] hover:text-[#6A0DAD] h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-xs text-[#D9B3FF]/80">
                {isPasswordValid ? (
                  <span className="text-[#4CE0B3] flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Mot de passe valide
                  </span>
                ) : (
                  "Minimum 6 caractères"
                )}
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div className="space-y-2">
              <label className="text-[#D9B3FF] text-sm font-medium">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
                  required
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
                  (doPasswordsMatch ? (
                    <span className="text-[#4CE0B3] flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Les mots de passe correspondent
                    </span>
                  ) : (
                    <span className="text-[#FF7BAC]">Les mots de passe ne correspondent pas</span>
                  ))}
              </div>
            </div>

            {/* Conditions d'utilisation */}
            <div className="flex items-start space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-5 w-5 rounded border-2 transition-all duration-300 ${
                  acceptTerms ? "bg-[#4CE0B3] border-[#4CE0B3] text-white" : "border-[#A45EE5] hover:border-[#6A0DAD]"
                }`}
                onClick={() => setAcceptTerms(!acceptTerms)}
              >
                {acceptTerms && <Check className="h-3 w-3" />}
              </Button>
              <div className="text-sm text-[#D9B3FF]">
                J'accepte les{" "}
                <Button variant="link" className="text-[#A3D5FF] hover:text-[#6A0DAD] p-0 h-auto text-sm">
                  conditions d'utilisation
                </Button>{" "}
                et la{" "}
                <Button variant="link" className="text-[#A3D5FF] hover:text-[#6A0DAD] p-0 h-auto text-sm">
                  politique de confidentialité
                </Button>
              </div>
            </div>

            {/* Affichage erreur */}
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            {/* Bouton création */}
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] text-white font-bold py-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#6A0DAD]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Création du compte...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Créer mon compte
                </div>
              )}
            </Button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center text-[#D9B3FF] text-sm">
            Déjà un compte ?{" "}
            <Button
              variant="link"
              className="text-[#FF7BAC] hover:text-[#A45EE5] font-medium p-0 h-auto"
              onClick={onSwitchToLogin}
            >
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
