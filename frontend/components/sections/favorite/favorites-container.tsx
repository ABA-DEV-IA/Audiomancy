"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth_context";
import { listFavorites, deleteFavorite, renameFavorite } from "@/services/favoriteService";
import { FavoritesPage } from "./favorites-page";
import { DeleteFavoriteModal } from "@/components/sections/favorite/delete-favorite-modal";
import { EditPlaylistModal } from "@/components/sections/favorite/edit-playlist-modal";

interface Playlist {
  id: string;
  name: string;
  createdAt: string;
}

export function FavoritesContainer() {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<Playlist | null>(null);

  // Charger les favoris
  useEffect(() => {
    async function fetchFavs() {
      if (!isAuthenticated || !user?.id) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const favs = await listFavorites(user.id);
        // ⚡️ Toujours renvoyer un tableau, même si vide
        const mapped = (favs ?? []).map(f => ({
            id: f.id,
            name: f.name,
            createdAt: new Date(f.saved_at ?? Date.now()).toLocaleDateString("fr-FR")
        }));
        setFavorites(mapped);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les favoris");
        setFavorites([]); // fallback : tableau vide
      } finally {
        setLoading(false);
      }
    }

    fetchFavs();
  }, [isAuthenticated, user]);

  // Open edit modal
  const handleEdit = (playlist: Playlist) => {
    setSelected(playlist);
    setEditModalOpen(true);
  };

  // Save rename
  const handleRenameSave = async (playlistId: string, newName: string) => {
    if (!user?.id) return;
    try {
      await renameFavorite(playlistId, user.id, newName);
      setFavorites((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p))
      );
    } catch (err: any) {
      alert(err.message || "Impossible de renommer la playlist");
      throw err;
    }
  };

  // Open delete modal
  const handleDelete = (playlist: Playlist) => {
    console.log("Sélection playlist pour suppression : ", playlist)
    setSelected(playlist);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async (playlistId: string) => {
    if (!user?.id) return;
    try {
      await deleteFavorite(playlistId, user.id);
      setFavorites((prev) => prev.filter((p) => p.id !== playlistId));
    } catch (err: any) {
      alert(err.message || "Impossible de supprimer la playlist");
      throw err;
    }
  };

  // Render
  if (loading) return <div className="p-8 text-white">Chargement des favoris...</div>;
  if (error) return <div className="p-8 text-red-400">Erreur : {error}</div>;

  return (
    <>
      <FavoritesPage
        favorites={favorites} // ⚡️ même tableau vide = affiche "Aucun favori pour le moment"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditPlaylistModal
        isOpen={editModalOpen}
        playlist={selected}
        onClose={() => {
          setEditModalOpen(false);
          setSelected(null);
        }}
        onSave={async (playlistId, newName) => {
          await handleRenameSave(playlistId, newName);
          setEditModalOpen(false);
          setSelected(null);
        }}
      />

      <DeleteFavoriteModal
        isOpen={deleteModalOpen}
        playlist={selected}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelected(null);
        }}
        onConfirm={async (playlistId) => {
          await handleDeleteConfirm(playlistId);
          setDeleteModalOpen(false);
          setSelected(null);
        }}
      />
    </>
  );
}
