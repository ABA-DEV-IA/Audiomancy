"""
Utility functions for randomizing tags and tracks.

Provides helper functions to randomly select tags from a string
and to sample tracks from a larger dataset.
"""

import random
from typing import List, Dict, Any


def choose_random_tags(tags: str, max_tags: int = 3) -> str:
    """
    Randomly selects up to `max_tags` from a space-separated tag string.

    Args:
        tags (str): Input string of tags separated by spaces.
        max_tags (int): Maximum number of tags to select.

    Returns:
        str: Space-separated string of selected tags.
    """
    tag_list = tags.split() if tags else []
    if not tag_list:
        return ""
    chosen_tags = random.sample(tag_list, min(max_tags, len(tag_list)))
    return " ".join(chosen_tags)


def sample_tracks(tracks: List[Dict[str, Any]], limit: int) -> List[Dict[str, Any]]:
    """
    Randomly samples up to `limit` tracks from a larger list.

    Args:
        tracks (List[Dict[str, Any]]): Full list of available tracks.
        limit (int): Number of tracks to select.

    Returns:
        List[Dict[str, Any]]: Randomly selected subset of tracks.
    """
    if not tracks:
        return []
    if len(tracks) > limit:
        return random.sample(tracks, limit)
    return tracks
