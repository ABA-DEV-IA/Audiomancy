"use client"

import { Edit, Trash2, Music, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Playlist {
  id: string
  name: string
  createdAt: string
}

interface FavoritesPageProps {
  favorites: Playlist[]
  onEdit: (playlist: Playlist) => void
  onDelete: (playlist: Playlist) => void
}

export function FavoritesPage({ favorites, onEdit, onDelete }: FavoritesPageProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#6A0DAD] text-white p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 mr-3 text-white" />
          <h1 className="text-4xl font-bold tracking-wider">MES FAVORIS</h1>
          <Heart className="h-8 w-8 ml-3 text-white" />
        </div>
        <p className="text-[#D9B3FF] italic">~ Tes playlists mystiques préférées ~</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#2B2B2B] p-8">
        {favorites.length === 0 ? (
          /* État vide */
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
              <span>Astuce : Utilise le bouton étoile sur tes playlists pour les ajouter aux favoris</span>
            </div>
          </div>
        ) : (
          /* Liste des favoris */
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
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
                  className="bg-[#301934] border-[#A45EE5] hover:bg-[#A45EE5]/10 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    {/* Header de la card */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-white font-bold text-lg truncate" title={playlist.name}>
                            {playlist.name}
                          </h3>
                        </div>
                      </div>
                      <Heart className="h-5 w-5 text-[#D9B3FF] flex-shrink-0 ml-2" />
                    </div>

                    {/* Informations */}
                    <div className="mb-6">
                      <div className="flex items-center text-[#D9B3FF] text-sm mb-2">
                        <span className="mr-2">📅</span>
                        <span>Ajouté le {playlist.createdAt}</span>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => onEdit(playlist)}
                        className="flex-1 bg-[#A45EE5] hover:bg-[#6A0DAD] text-white transition-all duration-300 hover:scale-105"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        onClick={() => onDelete(playlist)}
                        variant="outline"
                        className="flex-1 border-[#FF934F] text-[#FF934F] hover:bg-[#FF934F] hover:text-white transition-all duration-300 hover:scale-105"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
