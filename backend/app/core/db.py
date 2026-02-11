"""
Database module for MongoDB connection and collections using Motor.
"""

from urllib.parse import quote_plus
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from app.core.config import settings

MONGO_HOST = settings.mongo_host or "localhost"
MONGO_PORT = settings.mongo_port or "27017"
MONGO_USERNAME = settings.mongo_username
MONGO_PASSWORD = settings.mongo_password
MONGO_DBNAME = settings.mongo_db_name or "audiomancy"

if MONGO_USERNAME and MONGO_PASSWORD:
    username_encoded = quote_plus(MONGO_USERNAME)
    password_encoded = quote_plus(MONGO_PASSWORD)

    # Standard MongoDB with auth
    MONGO_URL = f"mongodb://{username_encoded}:{password_encoded}@{MONGO_HOST}:{MONGO_PORT}"
else:
    # Local dev without auth
    MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

# Initialize client and database
client = AsyncIOMotorClient(MONGO_URL)
db = client[MONGO_DBNAME]

# Collections
users_collection = db["user"]
favorite_collection = db["favorite"]
cache_collection = db["cache"]

async def check_connection() -> bool:
    """Ping MongoDB to verify the connection is alive."""
    try:
        await client.admin.command("ping")
        return True
    except PyMongoError:
        return False
