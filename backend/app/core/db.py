"""
Database module for MongoDB connection and collections using Motor.
"""

from urllib.parse import quote_plus
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from app.core.config import settings

MONGO_HOST = settings.mongo_host
MONGO_PORT = settings.mongo_port
MONGO_USERNAME = settings.mongo_username
MONGO_PASSWORD = settings.mongo_password
MONGO_DBNAME = settings.mongo_db_name

if MONGO_USERNAME and MONGO_PASSWORD:
    # URL-encode username and password to handle special characters
    username_encoded = quote_plus(MONGO_USERNAME)
    password_encoded = quote_plus(MONGO_PASSWORD)

    # Détection automatique : Cosmos DB si le host contient "cosmos.azure.com"
    if "cosmos.azure.com" in MONGO_HOST:
        # Mode production (Azure Cosmos DB avec SSL)
        MONGO_URL = (
            f"mongodb://{username_encoded}:{password_encoded}"
            f"@{MONGO_HOST}:{MONGO_PORT}/"
            "?ssl=true&replicaSet=globaldb&retrywrites=false"
        )
    else:
        # MongoDB standard avec auth (sans SSL)
        MONGO_URL = f"mongodb://{username_encoded}:{password_encoded}@{MONGO_HOST}:{MONGO_PORT}"
else:
    # Mode local (MongoDB standard sans auth, sans SSL)
    MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

# Initialize client and database
client = AsyncIOMotorClient(MONGO_URL)
db = client[MONGO_DBNAME]

# Collections
users_collection = db["user"]
favorite_collection = db["favorite"]
cache_collection = db["cache"]  # Cache MongoDB (remplace Azure Blob Storage)

async def check_connection() -> bool:
    """
    Check if the MongoDB connection is alive.

    Returns:
        bool: True if connection is successful, False otherwise.
    """
    try:
        await client.admin.command("ping")
        return True
    except PyMongoError:
        return False
