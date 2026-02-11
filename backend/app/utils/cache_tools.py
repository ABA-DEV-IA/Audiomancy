"""MongoDB caching utilities with TTL-based automatic expiration."""

import logging
from typing import Optional, List, Any
from datetime import datetime, timedelta, timezone
from pymongo.errors import PyMongoError

from app.core.db import cache_collection

logger = logging.getLogger(__name__)

# Prefix for all cache keys
CACHE_PREFIX = "cache/"


async def ensure_cache_indexes() -> None:
    """Create the TTL index on the cache collection (idempotent)."""
    try:
        # Create TTL index (expireAfterSeconds=0 means expire at the specified date)
        await cache_collection.create_index("expires_at", expireAfterSeconds=0)
        logger.info("Cache TTL index ensured.")
    except PyMongoError as e:
        logger.warning("Failed to create cache TTL index: %s", e)


def generate_cache_key(category: str) -> str:
    """Generate a safe, lowercase cache key with 'cache/' prefix."""
    safe_name = "".join(c if c.isalnum() else "_" for c in category.strip().lower())
    return f"{CACHE_PREFIX}{safe_name}"


async def save_cache(
    cache_key: str,
    data: Any,
    ttl_days: int = 1
) -> bool:
    """Save data to MongoDB cache with automatic expiration (default: 1 day)."""
    try:
        expires_at = datetime.now(timezone.utc) + timedelta(days=ttl_days)
        
        cache_entry = {
            "cache_key": cache_key,
            "data": data,
            "created_at": datetime.now(timezone.utc),
            "expires_at": expires_at
        }
        
        # Upsert: insert or replace if exists
        await cache_collection.update_one(
            {"cache_key": cache_key},
            {"$set": cache_entry},
            upsert=True
        )
        
        logger.info("Cache '%s' saved successfully (expires in %d days).", cache_key, ttl_days)
        return True
        
    except PyMongoError as e:
        logger.error("Failed to save cache '%s': %s", cache_key, e)
        return False


async def get_cache(cache_key: str) -> Optional[Any]:
    """Retrieve cached data if it exists and hasn't expired."""
    try:
        cache_entry = await cache_collection.find_one({"cache_key": cache_key})
        
        if not cache_entry:
            logger.info("Cache '%s' not found.", cache_key)
            return None
        
        # Check if expired (defense in depth, TTL index should handle this)
        if cache_entry.get("expires_at") and cache_entry["expires_at"].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            logger.info("Cache '%s' is expired.", cache_key)
            return None
        
        logger.info("Cache '%s' retrieved successfully.", cache_key)
        return cache_entry.get("data")
        
    except PyMongoError as e:
        logger.error("Failed to retrieve cache '%s': %s", cache_key, e)
        return None


async def delete_cache(cache_key: str) -> bool:
    """Delete a single cache entry by key."""
    try:
        result = await cache_collection.delete_one({"cache_key": cache_key})
        
        if result.deleted_count > 0:
            logger.info("Cache '%s' deleted.", cache_key)
            return True
        else:
            logger.info("Cache '%s' not found for deletion.", cache_key)
            return False
            
    except PyMongoError as e:
        logger.error("Failed to delete cache '%s': %s", cache_key, e)
        return False


async def list_caches(prefix: Optional[str] = None) -> List[str]:
    """List all cache keys, optionally filtered by prefix."""
    try:
        query = {}
        if prefix:
            query["cache_key"] = {"$regex": f"^{prefix}"}
        
        cursor = cache_collection.find(query, {"cache_key": 1, "_id": 0})
        cache_keys = [doc["cache_key"] async for doc in cursor]
        
        logger.info("Found %d cache entries.", len(cache_keys))
        return cache_keys
        
    except PyMongoError as e:
        logger.error("Failed to list caches: %s", e)
        return []


async def clear_expired_caches() -> int:
    """Manually purge expired cache entries (TTL index handles this too)."""
    try:
        result = await cache_collection.delete_many({
            "expires_at": {"$lt": datetime.now(timezone.utc)}
        })
        
        logger.info("Cleared %d expired cache entries.", result.deleted_count)
        return result.deleted_count
        
    except PyMongoError as e:
        logger.error("Failed to clear expired caches: %s", e)
        return 0
