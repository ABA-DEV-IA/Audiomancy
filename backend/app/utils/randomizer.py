"""Random selection helpers for tags and tracks."""

import random
from typing import List, Dict, Any


def choose_random_tags(tags: str, max_tags: int = 3) -> str:
    """Pick up to `max_tags` random tags from a space-separated string."""
    tag_list = tags.split() if tags else []
    if not tag_list:
        return ""
    chosen_tags = random.sample(tag_list, min(max_tags, len(tag_list)))
    return " ".join(chosen_tags)


def sample_tracks(tracks: List[Dict[str, Any]], limit: int) -> List[Dict[str, Any]]:
    """Return a random subset of up to `limit` tracks."""
    if not tracks:
        return []
    if len(tracks) > limit:
        return random.sample(tracks, limit)
    return tracks
