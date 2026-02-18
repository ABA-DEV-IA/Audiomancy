"use client"

import { X, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DeleteAccountModalProps {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAccountModal({ isOpen, isLoading, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="bg-ombre-occulte border-amethyste-magique shadow-2xl">
          <CardContent className="p-5 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-center min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-feu-anciens to-amethyste-magique rounded-full flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Supprimer votre compte</h2>
                  <p className="text-eclat-ether text-xs sm:text-sm">Cette action est irréversible</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={isLoading}
                className="text-white hover:bg-white/20 rounded-full shrink-0 ml-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Message de confirmation */}
            <div className="mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-brume-cosmique rounded-lg border border-amethyste-magique mb-3 sm:mb-4">
                <p className="text-white text-center text-sm sm:text-base">
                  Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
                </p>
              </div>
              <p className="text-eclat-ether text-xs sm:text-sm text-center">
                Toutes vos données personnelles et vos favoris seront supprimés de manière permanente.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 bg-transparent border-2 border-amethyste-magique text-amethyste-magique hover:bg-amethyste-magique hover:text-white transition-all duration-300 rounded-lg"
              >
                Annuler
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 py-3 bg-feu-anciens hover:bg-feu-anciens/80 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-feu-anciens/50 rounded-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Suppression...
                  </div>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
