"""
Database module for MongoDB connection and collections using Motor.
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from app.core.config import settings

# MongoDB configuration
MONGO_URI = settings.mongo_url
DB_NAME = settings.db_name

# Initialize client and database
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["user"]
playlists_collection = db["playlist"]


async def check_connection() -> bool:
    """
    Check if the MongoDB connection is alive.

    Returns:
        bool: True if connection is successful, False otherwise.
    """
    try:
        # The "ping" command checks if the connection is working
        await client.admin.command("ping")
        return True
    except PyMongoError:
        return False
