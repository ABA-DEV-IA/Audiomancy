"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth_context"
import { modify as modifyService, deleteAccount } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { AccountHeader } from "./account/AccountHeader"
import { SuccessMessage } from "./account/SuccessMessage"
import { ErrorMessage } from "./account/ErrorMessage"
import { PersonalInfoForm } from "./account/PersonalInfoForm"
import { PasswordForm } from "./account/PasswordForm"
import { SaveButton } from "./account/SaveButton"
import { DeleteAccountModal } from "./account/DeleteAccountModal"
import { generateParticles, doPasswordsMatch } from "@/utils/user/account"

interface ProfilePageProps {
  onSave?: () => void
  onDeleteSuccess?: () => void
}

export function AccountPage({ onSave, onDeleteSuccess }: ProfilePageProps) {
  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string>("")
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user?.username) {
      setFormData((prev) => ({ ...prev, username: user.username }))
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (isSaved) setIsSaved(false)
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSaved(false)
    setError("")
    setParticles(generateParticles())

    try {
      if (formData.newPassword && formData.confirmPassword && doPasswordsMatch(formData.newPassword, formData.confirmPassword)) {
        await modifyService(user?.id, formData.username, formData.newPassword)
      } else {
        await modifyService(user?.id, formData.username)
      }

      setIsLoading(false)
      setIsSaved(true)
      if (onSave) onSave()

      setFormData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }))
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde du profil :", err)


      const apiMessage =
        err?.response?.data?.message || err?.message || "Impossible de sauvegarder les modifications."

      setIsLoading(false)
      setError(apiMessage)
      setTimeout(() => setError(""), 4000)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.email) return
    setIsDeleting(true)
    try {
      await deleteAccount(user.email)
      logout()
      if (onDeleteSuccess) onDeleteSuccess()
    } catch (err: any) {
      setIsDeleting(false)
      setShowDeleteModal(false)
      const apiMessage = err?.message || "Impossible de supprimer le compte."
      setError(apiMessage)
      setTimeout(() => setError(""), 4000)
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-ombre-occulte via-brume-cosmique to-encre-astrale p-6 overflow-y-auto relative">
      {/* Particules magiques */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-eclat-ether rounded-full animate-ping opacity-20"
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
              className="absolute w-3 h-3 bg-vert-dragon rounded-full animate-ping opacity-70"
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
        <AccountHeader />
        {isSaved && <SuccessMessage />}
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoForm username={formData.username} onChange={(val) => handleInputChange("username", val)} />
          <PasswordForm
            newPassword={formData.newPassword}
            confirmPassword={formData.confirmPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            onChange={handleInputChange}
            onToggleNew={() => setShowNewPassword(!showNewPassword)}
            onToggleConfirm={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <SaveButton
            isLoading={isLoading}
            disabled={isLoading || !formData.username || (formData.newPassword !== "" && !doPasswordsMatch(formData.newPassword, formData.confirmPassword))}
          />
        </form>

        {/* Bouton suppression de compte */}
        <div className="flex justify-center mt-8">
          <Button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-feu-anciens hover:bg-feu-anciens/80 text-white font-bold w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-feu-anciens/50"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Supprimer le compte
          </Button>
        </div>

        <DeleteAccountModal
          isOpen={showDeleteModal}
          isLoading={isDeleting}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  )
}
