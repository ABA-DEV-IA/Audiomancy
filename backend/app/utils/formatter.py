def format_jamendo_track(track: dict) -> dict:
    """Formate un morceau Jamendo brut en structure JSON propre pour le lecteur."""
    return {
        "id": track.get("id"),
        "title": track.get("name"),
        "artist": track.get("artist_name"),
        "audio_url": track.get("audio"),
        "duration": track.get("duration"),
        "license": track.get("license_ccurl"),
        "tags": track.get("musicinfo", {}).get("tags", {}).get("vartags", []),
        "image": track.get("album_image")
    }


def format_jamendo_tracks(tracks: list) -> list:
    """Formate une liste de morceaux."""
    return [format_jamendo_track(track) for track in tracks]
