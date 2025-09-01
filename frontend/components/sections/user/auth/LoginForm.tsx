"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User as UserType } from "@/types/user"
import { useAuth } from "@/context/auth_context"
import { login as loginService } from "@/services/userService"

interface LoginFormProps {
  onLoginSuccess: () => void
  onSwitchToRegister: () => void
  onLoadingChange?: (loading: boolean) => void
  onError?: (err: string | null) => void
}

export function LoginForm({ onLoginSuccess, onSwitchToRegister, onLoadingChange, onError }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    onLoadingChange?.(true)

    try {
  const user: UserType = await loginService(email, password)
  login(user)
  onLoginSuccess()
} catch (err: any) {
  let message = "Erreur lors de la connexion"

  if (err.response?.data?.detail) {
    const detail = err.response.data.detail

    if (Array.isArray(detail) && detail.length > 0) {
      // Exemple : [{"loc":["body","email"],"msg":"value is not a valid email","input":"qsdsq@d"}]
      const firstError = detail[0]
      if (firstError.loc?.includes("email")) {
        message = "L'adresse email n'est pas valide."
      } else if (firstError.loc?.includes("password")) {
        message = "Le mot de passe est invalide."
      } else {
        message = firstError.msg || message
      }
    }
  } else if (err.message) {
    // Sinon on prend le message générique
    message = err.message
  }

  setError(message)
  onError?.(message)
} finally {
  setIsLoading(false)
  onLoadingChange?.(false)
}
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <label className="text-[#D9B3FF] text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </div>

      {/* Erreur */}
      {error && <p className="text-red-400 text-center text-sm">{error}</p>}

      {/* Bouton de connexion */}
      <Button
        type="submit"
        disabled={isLoading || !email || !password}
        className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] text-white font-bold py-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#6A0DAD]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Connexion en cours...
          </div>
        ) : (
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Se connecter
          </div>
        )}
      </Button>

      {/* Lien inscription */}
      <div className="mt-6 text-center text-[#D9B3FF] text-sm">
        Pas encore de compte ?{" "}
        <Button
          variant="link"
          className="text-[#FF7BAC] hover:text-[#A45EE5] font-medium p-0 h-auto"
          onClick={onSwitchToRegister}
        >
          Créer un compte
        </Button>
      </div>
    </form>
  )
}
