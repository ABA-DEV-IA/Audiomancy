"use client"

import { X, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DeleteFavoriteModalProps {
  isOpen: boolean
  playlist: { id: string; name: string } | null
  onClose: () => void
  onConfirm: (playlistId: string) => void
}

export function DeleteFavoriteModal({ isOpen, playlist, onClose, onConfirm }: DeleteFavoriteModalProps) {
  const handleConfirm = async () => {
    if (playlist) {
      try {
        await onConfirm(playlist.id); // Appel deleteFavorite ici
      } catch (err: any) {
        alert(err.message || "Impossible de supprimer la playlist");
      } finally {
        onClose();
      }
    }
  };

  if (!isOpen || !playlist) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="bg-[#2B2B2B] border-[#A45EE5] shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF934F] to-[#A45EE5] rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Supprimer des favoris</h2>
                  <p className="text-[#D9B3FF] text-sm">Cette action est irréversible</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Message de confirmation */}
            <div className="mb-8">
              <div className="p-4 bg-[#301934] rounded-lg border border-[#A45EE5] mb-4">
                <p className="text-white text-center">
                  Êtes-vous sûr de vouloir supprimer <span className="font-bold text-[#D9B3FF]">"{playlist.name}"</span>{" "}
                  de vos favoris ?
                </p>
              </div>
              <p className="text-[#D9B3FF] text-sm text-center">
                Cette playlist sera retirée de votre liste de favoris.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex space-x-4">
              <Button
                onClick={onClose}
                className="flex-1 py-3 bg-transparent border-2 border-[#A45EE5] text-[#A45EE5] hover:bg-[#A45EE5] hover:text-white transition-all duration-300 rounded-lg"
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-[#FF934F] hover:bg-[#FF934F]/80 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF934F]/50 rounded-lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
