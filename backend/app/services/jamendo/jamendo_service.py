from app.services.jamendo.jamendo_client import fetch_tracks

def get_tracks_for_reader(tags: str, duration_min: int, duration_max: int) -> list[dict]:
    """Récupère et nettoie une liste de morceaux pour le lecteur."""
    params = {
        "limit": 20,
        "fuzzytags": tags,
        "speed": "low+medium",
        "vocalinstrumental": "instrumental",
        "durationbetween": f"{duration_min}_{duration_max}",
        "include": "musicinfo+licenses",
        "groupby": "artist_id"
    }

    data = fetch_tracks(params)
    if "results" not in data:
        return []

    results_clean = []
    for track in data["results"]:
        results_clean.append({
            "id": track["id"],
            "title": track["name"],
            "artist": track["artist_name"],
            "audio_url": track["audio"],
            "duration": track["duration"],
            "license": track.get("license_ccurl"),
            "tags": track.get("musicinfo", {}).get("tags", {}).get("vartags", []),
            "image": track.get("album_image")
        })

    return results_clean
