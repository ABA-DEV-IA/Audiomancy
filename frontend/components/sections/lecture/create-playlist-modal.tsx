"use client"

import type React from "react"
import { useState } from "react"
import { X, Save, Sparkles, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Track } from '@/types/track';
import { useAuth } from "@/context/auth_context";
import { createFavorite } from "@/services/favoriteService";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  onFavoriteCreated?: (favoriteId: string) => void;
}

export function CreatePlaylistModal({ isOpen, onClose, tracks, onFavoriteCreated }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playlistName.trim()) return;

    if (!isAuthenticated || !user?.id) {
      setErrorMessage("Tu dois être connecté pour sauvegarder un favori.");
      return;
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const favorite = await createFavorite(user.id, playlistName, tracks)

      setPlaylistName("")
      onClose()

      if (onFavoriteCreated) onFavoriteCreated(favorite.id)
      if (onFavoriteCreated) onFavoriteCreated(favorite.name || playlistName);


    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Une erreur est survenue lors de la création du favori.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPlaylistName("")
    setErrorMessage("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="bg-[#2B2B2B] border-[#A45EE5] shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mr-4">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[#D9B3FF]" />
                    Nouvelle Playlist
                  </h2>
                  <p className="text-[#D9B3FF] text-sm">Crée ta collection mystique</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[#D9B3FF] text-lg font-medium">
                  Nom de la playlist <span className="text-[#FF7BAC]">*</span>
                </label>
                <div className="relative">
                  <Music className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
                  <Input
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    placeholder="Ma playlist mystique..."
                    className="pl-14 pr-4 py-4 text-lg bg-[#301934] border-2 border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300 rounded-lg"
                    required
                    disabled={isLoading}
                    maxLength={50}
                  />
                </div>

                {/* 🔹 affichage du message d'erreur */}
                {errorMessage && (
                  <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
                )}

                <p className="text-[#D9B3FF]/80 text-sm text-right">{playlistName.length}/50 caractères</p>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 py-3 bg-transparent border-2 border-[#A45EE5] text-[#A45EE5] hover:bg-[#A45EE5] hover:text-white transition-all duration-300 rounded-lg"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !playlistName.trim()}
                  className="flex-1 py-3 bg-[#4CE0B3] hover:bg-[#4CE0B3]/80 text-[#2B2B2B] font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#4CE0B3]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-[#2B2B2B]/30 border-t-[#2B2B2B] rounded-full animate-spin mr-2" />
                      Création...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder
                    </div>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-[#6A0DAD]/20 rounded-lg border border-[#6A0DAD]/30">
              <p className="text-[#D9B3FF] text-sm text-center">
                ✨ Ta playlist sera créée et ajoutée à ta collection personnelle
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}