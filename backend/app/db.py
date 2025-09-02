from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "audiomancy")

# Crée le client et la DB
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
favorite_collection = db["favorite"]

async def check_connection():
    try:
        # La commande ping teste la connexion
        await client.admin.command("ping")
        print("✅ Connexion à la base de données réussie !")
    except Exception as e:
        print("❌ Impossible de se connecter à la base de données :", e)
        raise e  # optionnel, pour arrêter l'application si la DB n'est pas dispo

# Tester la connexion si ce fichier est exécuté directement
if __name__ == "__main__":
    asyncio.run(check_connection())
