from fastapi import APIRouter, Query
from app.services.jamendo.jamendo_service import get_tracks_for_reader

router = APIRouter(prefix="/jamendo", tags=["Jamendo"])

@router.get("/tracks")
def get_jamendo_tracks(
    tags: str = Query(..., example="magic+fantasy+cinematic"),
    duration_min: int = Query(180, ge=0),
    duration_max: int = Query(480, ge=0)
):
    """
    Recherche de morceaux musicaux sur Jamendo.
    - tags : fuzzytags séparés par +
    - duration_min : durée minimum (en secondes)
    - duration_max : durée maximum (en secondes)
    """
    results = get_tracks_for_reader(tags, duration_min, duration_max)
    return {"count": len(results), "tracks": results}
