"use client"

import { Edit, Trash2, Music, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Track } from "@/types/track"

interface Playlist {
  id: string
  name: string
  createdAt: string
  tracks: Track[]
}

interface FavoritesPageProps {
  favorites: Playlist[]
  onEdit: (playlist: Playlist) => void
  onDelete: (playlist: Playlist) => void
  onPlay: (title: string, tracks: Track[]) => void
}

export function FavoritesPage({ favorites, onEdit, onDelete, onPlay }: FavoritesPageProps) {
  return (
    <div className="h-full flex flex-col text-base sm:text-sm">
      <div className="bg-[#6A0DAD] text-white p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 mr-3 text-white" />
          <h1 className="text-4xl font-bold tracking-wider">MES FAVORIS</h1>
          <Heart className="h-8 w-8 ml-3 text-white" />
        </div>
        <p className="text-[#D9B3FF] italic">~ Tes playlists mystiques préférées ~</p>
      </div>

      <div className="flex-1 bg-[#2B2B2B] p-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-[#301934] rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-[#A45EE5]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Aucun favori pour le moment</h2>
            <p className="text-[#D9B3FF] text-lg mb-8 max-w-md">
              Ajoute tes playlists préférées en favoris pour les retrouver facilement ici !
            </p>
            <div className="flex items-center text-[#FF934F] text-sm">
              <span className="mr-2">💡</span>
              <span>Astuce : Utilise le bouton dédié sur une playlist pour l'ajouter à tes favoris</span>
            </div>
          </div>
        ) : (

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-2 md:space-y-0">
              <div className="flex items-center">
                <Music className="h-6 w-6 text-[#A45EE5] mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  {favorites.length} playlist{favorites.length > 1 ? "s" : ""} favorite{favorites.length > 1 ? "s" : ""}
                </h2>
              </div>
              <div className="text-[#D9B3FF] text-sm">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="relative bg-[#301934] border-[#A45EE5] hover:bg-[#A45EE5]/10 transition-all duration-300 group cursor-pointer"
                  onClick={() => onPlay(playlist.name, playlist.tracks)}
                >
                  <CardContent className="p-6 pb-16">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1 flex items-center">
                          <h3
                            className="text-white font-bold text-lg line-clamp-2"
                            title={playlist.name}
                          >
                            {playlist.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center text-[#D9B3FF] text-sm mb-2">
                        <span className="mr-2">📅</span>
                        <span>Ajouté le {playlist.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>

                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(playlist)
                      }}
                      className="w-10 h-10 bg-[#A45EE5] hover:bg-[#6A0DAD] text-white rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(playlist)
                      }}
                      className="w-10 h-10 border border-[#FF934F] text-[#FF934F] hover:bg-[#FF934F] hover:text-white rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
