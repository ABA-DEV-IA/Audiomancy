# 🔧 Guide de Configuration - Audiomancy

## 📁 Structure des fichiers de configuration

```
Audiomancy/
├── .env.example                    # Variables Docker Compose
├── backend/
│   ├── .env.example               # Template backend (toutes options)
│   └── .env.local.example         # Template backend (développement local)
└── frontend/
    ├── .env.example               # Template frontend
    └── .env.local.example         # Template frontend (développement local)
```

---

## 🚀 Configuration Rapide (Développement Local)

### 1️⃣ **Backend**

```bash
cd backend
cp .env.local.example .env
nano .env
```

**Variables essentielles à configurer :**

```env
# DeepSeek LLM (OBLIGATOIRE)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxx

# Jamendo API (OBLIGATOIRE)
JAMENDO_CLIENT_ID=xxxxxxxxxx

# API Security (OBLIGATOIRE)
API_KEY=votre_cle_securisee_ici

# MongoDB (utilise les valeurs par défaut pour local)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=audiomancy
```

### 2️⃣ **Frontend**

```bash
cd frontend
cp .env.local.example .env.local
nano .env.local
```

**Configuration :**

```env
# URL du backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# API Key (doit correspondre au backend)
FASTAPI_API_KEY=votre_cle_securisee_ici
```

### 3️⃣ **Démarrage**

```bash
# Terminal 1: MongoDB
mongod --dbpath ./data/db

# Terminal 2: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 3: Frontend
cd frontend
npm run dev
```

**URLs :**
- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- API Docs : http://localhost:8000/docs (si SWAGGER_ON=true)

---

## 🐳 Configuration Docker

### 1️⃣ **Fichier .env à la racine**

```bash
cp .env.example .env
nano .env
```

**Variables essentielles :**

```env
# MongoDB
MONGO_USERNAME=audiomancy
MONGO_PASSWORD=changeme_secure_password_here
MONGO_DB_NAME=audiomancy

# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxx

# Jamendo
JAMENDO_CLIENT_ID=xxxxxxxxxx

# Security
API_KEY=votre_cle_securisee_ici

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 2️⃣ **Lancement Docker**

```bash
# Build et démarrage
docker-compose up -d

# Vérifier les logs
docker-compose logs -f backend

# Arrêt
docker-compose down

# Nettoyage complet (supprime les volumes)
docker-compose down -v
```

**URLs avec Docker :**
- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- MongoDB : localhost:27017

---

## 🔑 Obtenir les clés API

### **DeepSeek API**
1. Créer un compte sur https://platform.deepseek.com
2. Aller dans "API Keys"
3. Créer une nouvelle clé
4. Format : `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **Jamendo API**
1. Créer un compte sur https://devportal.jamendo.com
2. Créer une nouvelle application
3. Copier le "Client ID"

### **API_KEY (Backend)**
- Générer une clé sécurisée :
  ```bash
  openssl rand -hex 32
  ```

---

## 🔍 Vérification de la configuration

### **Backend**

```bash
cd backend
python -c "from app.core.config import settings; print('✅ DeepSeek:', bool(settings.deepseek_api_key)); print('✅ Jamendo:', bool(settings.jamendo_client_id))"
```

### **Test de connexion MongoDB**

```python
# backend/test_db.py
import asyncio
from app.core.db import check_connection

async def test():
    result = await check_connection()
    print(f"MongoDB: {'✅ Connected' if result else '❌ Failed'}")

asyncio.run(test())
```

### **Test DeepSeek**

```python
# backend/test_deepseek.py
from app.services.ai.utils.deepseek_client import DeepSeekClient

client = DeepSeekClient()
response = client.generate("Dis bonjour en une phrase courte")
print(f"✅ DeepSeek: {response}")
```

---

## ⚙️ Variables par environnement

### **Développement (local)**
```env
MONGO_HOST=localhost
SWAGGER_ON=true
ALLOWED_ORIGINS=http://localhost:3000
```

### **Docker**
```env
MONGO_HOST=mongodb  # Nom du service Docker
SWAGGER_ON=false
ALLOWED_ORIGINS=http://localhost:3000
```

### **Production**
```env
MONGO_HOST=your_mongo_host
MONGO_USERNAME=prod_user
MONGO_PASSWORD=strong_password
SWAGGER_ON=false
ALLOWED_ORIGINS=https://yourdomain.com
# AZURE_KEY_VAULT_URL=https://your-vault.vault.azure.net/  # ⚠️ DEPRECATED - azure_only_no_longer_usable_in_localhost
```

---

## 🚨 Dépannage

### **"DEEPSEEK_API_KEY is not set"**
```bash
# Vérifier que la variable existe
echo $DEEPSEEK_API_KEY

# Backend : vérifier le fichier .env
cat backend/.env | grep DEEPSEEK
```

### **"Failed to connect to MongoDB"**
```bash
# Vérifier que MongoDB est démarré
mongosh --eval "db.adminCommand('ping')"

# Docker : vérifier le service
docker-compose ps mongodb
docker-compose logs mongodb
```

### **Frontend ne se connecte pas au backend**
```bash
# Vérifier la variable NEXT_PUBLIC_API_URL
cat frontend/.env.local | grep NEXT_PUBLIC

# Tester l'URL du backend
curl http://localhost:8000/
```

### **"Missing Azure Speech config"**
⚠️ DEPRECATED - azure_only_no_longer_usable_in_localhost

✅ **Normal** : La fonctionnalité TTS Azure a été désactivée (remplacée par solutions locales). Cette erreur n'empêche pas l'application de fonctionner.

---

## 📋 Checklist de configuration

### Backend ✅
- [ ] `DEEPSEEK_API_KEY` configurée
- [ ] `JAMENDO_CLIENT_ID` configurée
- [ ] `API_KEY` générée
- [ ] MongoDB accessible
- [ ] Port 8000 libre

### Frontend ✅
- [ ] `NEXT_PUBLIC_API_URL` pointe vers le backend
- [ ] `FASTAPI_API_KEY` correspond au backend
- [ ] Port 3000 libre
- [ ] Node.js installé (v18+)

### Docker ✅
- [ ] `.env` à la racine configuré
- [ ] Docker et Docker Compose installés
- [ ] Ports 3000, 8000, 27017 libres
- [ ] 2GB RAM minimum disponible

---

## 🔐 Sécurité

### ⚠️ **Ne JAMAIS commiter :**
- `.env`
- `.env.local`
- Fichiers contenant des clés API

### ✅ **À commiter :**
- `.env.example`
- `.env.local.example`
- Documentation de configuration

### 🔒 **Bonnes pratiques :**
1. Utiliser des clés API différentes par environnement
2. Régénérer `API_KEY` régulièrement
3. Ne jamais exposer les clés dans les logs
4. Utiliser HashiCorp Vault en production pour la gestion des secrets

---

## 📞 Support

**Erreurs courantes résolues dans :** [MIGRATION_MONGODB.md](MIGRATION_MONGODB.md)

**Fichiers de référence :**
- Backend config : `backend/app/core/config.py`
- Frontend config : `frontend/lib/config.ts`
- Docker : `docker-compose.yml`
