# 🎵 Audiomancy - Migration MongoDB & Désactivation Azure

## ✅ **Changements effectués**

### 1️⃣ **Cache MongoDB** (remplace Azure Blob Storage)

**Nouveau module créé :** [backend/app/utils/cache_tools.py](backend/app/utils/cache_tools.py)

**Fonctionnalités :**
- ✅ `save_cache()` : Enregistrement dans MongoDB avec TTL automatique
- ✅ `get_cache()` : Récupération du cache
- ✅ `delete_cache()` : Suppression manuelle
- ✅ `list_caches()` : Liste tous les caches
- ✅ Index TTL MongoDB pour expiration automatique (7 jours par défaut)

**Fichiers modifiés :**
- [backend/app/services/jamendo/jamendo_service.py](backend/app/services/jamendo/jamendo_service.py) : Utilise cache MongoDB
- [backend/app/routes/jamendo_routes.py](backend/app/routes/jamendo_routes.py) : Fonction `async`
- [backend/app/core/db.py](backend/app/core/db.py) : Collection `cache` ajoutée
- [backend/app/main.py](backend/app/main.py) : Initialisation des index au startup

---

### 2️⃣ **Services Azure désactivés**

#### **Azure Speech TTS** ❌ MASQUÉ
- [backend/app/routes/speech_token_routes.py](backend/app/routes/speech_token_routes.py) : Code commenté
- [backend/app/main.py](backend/app/main.py) : Route désactivée
- [backend/app/core/config.py](backend/app/core/config.py) : Variables `speech_key` et `speech_region` commentées

#### **Azure OpenAI** ❌ OBSOLÈTE
- [backend/app/services/ai/utils/azure_openai.py](backend/app/services/ai/utils/azure_openai.py) : Marqué obsolète (remplacé par DeepSeek)

#### **Azure Blob Storage** ❌ REMPLACÉ
- [backend/app/core/config.py](backend/app/core/config.py) : Variables `azure_storage_connection_string` et `cache_blob_name` commentées
- [backend/app/utils/blob_tools.py](backend/app/utils/blob_tools.py) : Non modifié (peut être supprimé plus tard)

---

### 3️⃣ **Dependencies nettoyées**

**Fichier :** [backend/requirements.txt](backend/requirements.txt)

**Désactivé (commenté) :**
```txt
# azure-cognitiveservices-speech  # TTS
# azure-storage-blob             # Blob cache
# langchain-openai               # Azure OpenAI
# azure-core, azure-identity     # Optionnels (Key Vault uniquement)
# msal, msal-extensions          # Dépendances Azure Identity
```

**Conservé :**
```txt
openai==1.104.2  # DeepSeek (API compatible OpenAI)
motor==3.7.1     # MongoDB async
prometheus-client  # Monitoring (compétence C20) - exposition métriques /metrics
```

---

### 4️⃣ **Docker Compose créé**

**Fichier :** [docker-compose.yml](docker-compose.yml)

**Services configurés :**
- ✅ **MongoDB 7.0** : Base de données + cache
- ✅ **Backend FastAPI** : Avec hot reload
- ✅ **Frontend Next.js** : Avec hot reload
- ✅ **Prometheus** : Collecte de métriques
- ✅ **Grafana** : Dashboards de visualisation
- ✅ **Loki** : Agrégation de logs
- 🔧 **HashiCorp Vault** (commenté) : Gestion secrets locale

**Fichier d'exemple :** [.env.example](.env.example)

---

## 🚀 **Utilisation**

### **1. Configuration locale**

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos clés
nano .env
```

**Variables essentielles à configurer :**
```env
DEEPSEEK_API_KEY=sk-...
JAMENDO_CLIENT_ID=...
API_KEY=your_secure_key
MONGO_PASSWORD=changeme_secure_password
```

### **2. Lancement Docker**

```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter
docker-compose down
```

### **3. Lancement en local (sans Docker)**

```bash
# MongoDB local
mongod --dbpath ./data/db

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📋 **TODO : Prochaines étapes**

### **Phase suivante suggérée :**

1. **APScheduler pour les tâches cron** (remplace Azure Functions)
   - Créer `backend/app/scheduler.py`
   - Appeler `/api/dailycategories` à minuit
   - Intégrer dans `main.py` avec `@app.on_event("startup")`

2. **Tests et validation**
   - Tester le cache MongoDB
   - Vérifier les routes Jamendo
   - Valider la connexion DeepSeek

3. **Monitoring local** (optionnel mais recommandé pour C20)
   - Stack Prometheus/Grafana/Loki déjà configurée dans `docker-compose.monitoring.yml`
   - Démarrer avec : `python start_monitoring.py monitoring`
   - Accès Grafana : http://localhost:19091

4. **Nettoyage final**
   - Supprimer `azure_functions/` (dossier complet)
   - Supprimer `blob_tools.py` si plus utilisé
   - Nettoyer les tests obsolètes

---

## 🔍 **Compétences validées**

**C20 : Surveillance d'application IA**
- ✅ Stack Prometheus/Grafana/Loki complète
- ✅ Metrics endpoint `/metrics` exposé via prometheus_client
- ✅ Dashboards Grafana pour visualisation
- ✅ Logs centralisés via Loki + Promtail
- ✅ Alertes Discord via AlertManager

**C21 : Résolution d'incidents**
- ✅ Documentation des changements
- ✅ Code commenté et explicite
- ✅ Gestion d'erreurs robuste (cache, DB)

---

## ⚠️ **Notes importantes**

1. **Blob Tools** : Le fichier `blob_tools.py` est toujours présent mais non utilisé. Peut être supprimé après validation.

2. **Monitoring** : Stack Prometheus/Grafana/Loki configurée dans `docker-compose.monitoring.yml`. Environnement 100% local sans dépendances cloud.

3. **Key Vault** : La configuration supporte encore Azure Key Vault (optionnel). En local, utiliser `.env` uniquement.

4. **Tests** : Certains tests font référence à Azure (`test_speech_token.py`, `test_blob_tools.py`). À adapter ou désactiver.

5. **MongoDB vs Cosmos DB** : La connexion supporte les deux :
   - **Local** : `mongodb://localhost:27017`
   - **Cosmos DB** : Avec auth et `replicaSet=globaldb`

---

## 📞 **Support**

Pour toute question sur la migration :
- Consulter les commentaires dans le code (marqués `# [DÉSACTIVÉ]` ou `# TODO`)
- Vérifier les logs au démarrage de l'application
- Utiliser `docker-compose logs` pour le débogage
