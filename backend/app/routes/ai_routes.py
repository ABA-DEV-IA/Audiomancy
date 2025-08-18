from app.models.ai_models import PromptRequest, GeneratedTrack
from fastapi import APIRouter
from app.services.ai.ai_executor import ai_executor
from app.services.jamendo.jamendo_service import get_tracks_for_reader
from typing import List

router = APIRouter(prefix="/generate", tags=["Generate"])

@router.post("/playlist", response_model=List[GeneratedTrack])
def generate_playlist(prompt: PromptRequest):

    tags = ai_executor(prompt.prompt)

    print(tags)
    return get_tracks_for_reader(tags=tags, limit=prompt.limit)


