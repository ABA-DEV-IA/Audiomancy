"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth_context";
import { listFavorites, deleteFavorite, renameFavorite } from "@/services/favoriteService";
import { FavoritesPage } from "./favorites-page";
import { DeleteFavoriteModal } from "@/components/sections/favorite/delete-favorite-modal";
import { EditPlaylistModal } from "@/components/sections/favorite/edit-playlist-modal";
import { usePlaylist } from "@/context/favorite_context"
import { useRouter } from "next/navigation";
import { Track } from "@/types/track";

interface Playlist {
  id: string;
  name: string;
  createdAt: string;
  tracks: Track[];
}

export function FavoritesContainer() {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setFavorite } = usePlaylist();
  const router = useRouter();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<Playlist | null>(null);

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
        const mapped = (favs ?? []).map(f => ({
            id: f.id,
            name: f.name,
            createdAt: new Date(f.saved_at ?? Date.now()).toLocaleDateString("fr-FR"),
            tracks: f.track_list
        }));
        setFavorites(mapped);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les favoris");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFavs();
  }, [isAuthenticated, user]);

  const handleEdit = (playlist: Playlist) => {
    setSelected(playlist);
    setEditModalOpen(true);
  };

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

  const handleDelete = (playlist: Playlist) => {
    setSelected(playlist);
    setDeleteModalOpen(true);
  };

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

  const goToFavorite = (title:string, playlist:Track[]) => {
    setFavorite({
      title: title,
      playlist: playlist,
    });

    router.push("/lecture/favorite");
  };

  if (loading) return <div className="p-8 text-white">Chargement des favoris...</div>;
  if (error) return <div className="p-8 text-red-400">Erreur : {error}</div>;

  return (
    <>
      <FavoritesPage
        favorites={favorites}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPlay={goToFavorite}
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
