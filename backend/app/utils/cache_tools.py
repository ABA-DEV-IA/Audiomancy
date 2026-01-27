"""
cache_tools.py

Utilities for caching track data in MongoDB.
Replaces Azure Blob Storage with MongoDB collections for better integration.

Key functions:
- generate_cache_key: Create safe cache keys for categories or moods.
- save_cache: Save data to MongoDB cache with optional TTL.
- get_cache: Retrieve cached data from MongoDB.
- delete_cache: Delete a cache entry.
- list_caches: List all cache keys.

All cache entries support automatic expiration using MongoDB TTL indexes.
"""

import logging
from typing import Optional, List, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError

from app.core.db import db

logger = logging.getLogger(__name__)

# Cache collection
cache_collection = db["cache"]

# --- Internal prefix for cache keys ---
CACHE_PREFIX = "cache/"


async def ensure_cache_indexes() -> None:
    """
    Ensure TTL index exists on the cache collection.
    This allows automatic expiration of old cache entries.
    
    The TTL index is set on the 'expires_at' field.
    MongoDB will automatically delete documents when expires_at is reached.
    """
    try:
        # Create TTL index (expireAfterSeconds=0 means expire at the specified date)
        await cache_collection.create_index("expires_at", expireAfterSeconds=0)
        logger.info("Cache TTL index ensured.")
    except PyMongoError as e:
        logger.warning(f"Failed to create cache TTL index: {e}")


def generate_cache_key(category: str) -> str:
    """
    Generate a safe cache key for a given category or mood.

    Args:
        category (str): Music category or mood name.

    Returns:
        str: Safe cache key with "cache/" prefix, e.g., "cache/rock_roll"

    Notes:
        - Converts all characters to lowercase.
        - Non-alphanumeric characters are replaced with underscores.
    """
    safe_name = "".join(c if c.isalnum() else "_" for c in category.strip().lower())
    return f"{CACHE_PREFIX}{safe_name}"


async def save_cache(
    cache_key: str,
    data: Any,
    ttl_days: int = 1
) -> bool:
    """
    Save data to MongoDB cache with automatic expiration.

    Args:
        cache_key (str): Unique cache identifier (should include CACHE_PREFIX).
        data (Any): Data to cache (will be stored as-is, typically a dict or list).
        ttl_days (int): Time-to-live in days before auto-deletion. Defaults to 7 days.

    Returns:
        bool: True if save was successful, False otherwise.

    Notes:
        - Overwrites existing cache entries with the same key.
        - MongoDB TTL index automatically deletes expired entries.
    """
    try:
        expires_at = datetime.utcnow() + timedelta(days=ttl_days)
        
        cache_entry = {
            "cache_key": cache_key,
            "data": data,
            "created_at": datetime.utcnow(),
            "expires_at": expires_at
        }
        
        # Upsert: insert or replace if exists
        await cache_collection.update_one(
            {"cache_key": cache_key},
            {"$set": cache_entry},
            upsert=True
        )
        
        logger.info(f"Cache '{cache_key}' saved successfully (expires in {ttl_days} days).")
        return True
        
    except PyMongoError as e:
        logger.error(f"Failed to save cache '{cache_key}': {e}")
        return False


async def get_cache(cache_key: str) -> Optional[Any]:
    """
    Retrieve cached data from MongoDB.

    Args:
        cache_key (str): Unique cache identifier (should include CACHE_PREFIX).

    Returns:
        Optional[Any]: Cached data if found and not expired, None otherwise.

    Notes:
        - Returns None if cache entry doesn't exist.
        - Expired entries are automatically removed by MongoDB TTL index.
    """
    try:
        cache_entry = await cache_collection.find_one({"cache_key": cache_key})
        
        if not cache_entry:
            logger.info(f"Cache '{cache_key}' not found.")
            return None
        
        # Check if expired (defense in depth, TTL index should handle this)
        if cache_entry.get("expires_at") and cache_entry["expires_at"] < datetime.utcnow():
            logger.info(f"Cache '{cache_key}' is expired.")
            return None
        
        logger.info(f"Cache '{cache_key}' retrieved successfully.")
        return cache_entry.get("data")
        
    except PyMongoError as e:
        logger.error(f"Failed to retrieve cache '{cache_key}': {e}")
        return None


async def delete_cache(cache_key: str) -> bool:
    """
    Delete a cache entry from MongoDB.

    Args:
        cache_key (str): Unique cache identifier (should include CACHE_PREFIX).

    Returns:
        bool: True if deletion was successful, False otherwise.

    Notes:
        - No error is raised if the cache entry doesn't exist.
    """
    try:
        result = await cache_collection.delete_one({"cache_key": cache_key})
        
        if result.deleted_count > 0:
            logger.info(f"Cache '{cache_key}' deleted.")
            return True
        else:
            logger.info(f"Cache '{cache_key}' not found for deletion.")
            return False
            
    except PyMongoError as e:
        logger.error(f"Failed to delete cache '{cache_key}': {e}")
        return False


async def list_caches(prefix: Optional[str] = None) -> List[str]:
    """
    List all cache keys in MongoDB.

    Args:
        prefix (Optional[str]): Optional prefix filter for cache keys.

    Returns:
        List[str]: List of cache keys.

    Notes:
        - Returns empty list if no caches found or on error.
    """
    try:
        query = {}
        if prefix:
            query["cache_key"] = {"$regex": f"^{prefix}"}
        
        cursor = cache_collection.find(query, {"cache_key": 1, "_id": 0})
        cache_keys = [doc["cache_key"] async for doc in cursor]
        
        logger.info(f"Found {len(cache_keys)} cache entries.")
        return cache_keys
        
    except PyMongoError as e:
        logger.error(f"Failed to list caches: {e}")
        return []


async def clear_expired_caches() -> int:
    """
    Manually clear all expired cache entries.
    
    This is a utility function; MongoDB TTL index handles this automatically,
    but this can be useful for immediate cleanup or testing.
    
    Returns:
        int: Number of deleted entries.
    """
    try:
        result = await cache_collection.delete_many({
            "expires_at": {"$lt": datetime.utcnow()}
        })
        
        logger.info(f"Cleared {result.deleted_count} expired cache entries.")
        return result.deleted_count
        
    except PyMongoError as e:
        logger.error(f"Failed to clear expired caches: {e}")
        return 0
