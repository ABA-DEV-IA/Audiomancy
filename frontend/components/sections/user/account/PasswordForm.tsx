import { Lock, Eye, EyeOff, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { isPasswordValid, doPasswordsMatch } from "@/utils/user/acount"

interface PasswordFormProps {
  newPassword: string
  confirmPassword: string
  showNewPassword: boolean
  showConfirmPassword: boolean
  onChange: (field: string, value: string) => void
  onToggleNew: () => void
  onToggleConfirm: () => void
}

export function PasswordForm({
  newPassword,
  confirmPassword,
  showNewPassword,
  showConfirmPassword,
  onChange,
  onToggleNew,
  onToggleConfirm,
}: PasswordFormProps) {
  return (
    <Card className="bg-[#2B2B2B]/90 border-[#A45EE5] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lock className="h-5 w-5 mr-2 text-[#D9B3FF]" />
          Sécurité & Mot de passe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-[#D9B3FF] text-sm">
          Laisse les champs vides si tu ne veux pas changer ton mot de passe.
        </p>

        {/* Nouveau mot de passe */}
        <div className="space-y-2">
          <label className="text-[#D9B3FF] text-sm font-medium">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => onChange("newPassword", e.target.value)}
              placeholder="••••••••"
              className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#A45EE5] hover:text-[#6A0DAD] h-8 w-8"
              onClick={onToggleNew}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-xs text-[#D9B3FF]/80">
            {newPassword &&
              (isPasswordValid(newPassword) ? (
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
              value={confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#A45EE5] hover:text-[#6A0DAD] h-8 w-8"
              onClick={onToggleConfirm}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-xs text-[#D9B3FF]/80">
            {confirmPassword &&
              newPassword &&
              (doPasswordsMatch(newPassword, confirmPassword) ? (
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
  )
}
