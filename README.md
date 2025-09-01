# Audiomancy

![Python](https://img.shields.io/badge/python-3.13+-blue?logo=python) ![Node.js](https://img.shields.io/badge/node.js-22+-green?logo=node.js)![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-brightgreen)![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)![Build](https://img.shields.io/github/actions/workflow/status/USERNAME/audiomancy/ci.yml?branch=main)![Coverage](https://img.shields.io/codecov/c/github/USERNAME/audiomancy/main?logo=codecov)![License](https://img.shields.io/badge/license-MIT-blue)![Release](https://img.shields.io/github/v/release/USERNAME/audiomancy)

![background_readme.png](background_readme.png)

**Audiomancy** est une plateforme web basée sur l’IA pour la génération, la gestion et la lecture de playlists musicales. Elle combine :

- un **backend Python FastAPI** pour la logique métier et les intégrations IA,
- un **frontend Next.js/React/TypeScript** pour l’expérience utilisateur,
- des **fonctions serverless Azure** pour la gestion des tokens et services cloud.

Audiomancy permet de créer automatiquement des playlists adaptées à un thème ou une ambiance, de rechercher des morceaux libres de droits via Jamendo, et d’offrir une expérience de lecture fluide et moderne.

* * *

## Sommaire

- [Fonctionnalités](#fonctionnalit%C3%A9s)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Équipe](#%C3%A9quipe)
- [Licence](#licence)

* * *

## Fonctionnalités

- Génération de playlists musicales via IA
- Recherche et lecture de morceaux libres de droits (API Jamendo)
- Gestion des favoris utilisateurs
- Authentification et sessions sécurisées
- Intégration avec **Azure Speech** pour synthèse et reconnaissance vocale
- Interface moderne et responsive (mobile & desktop)

* * *

## Architecture

### Backend (`backend/`)

- **Python 3.13+ / FastAPI**
- Endpoints API, logique métier, intégration IA
- Modules principaux :
    - `core/` : configuration, logging, sécurité
    - `models/` : modèles Pydantic pour validation & documentation
    - `routes/` : endpoints API
    - `services/` : IA, Jamendo, Azure
    - `utils/` : utilitaires, formatage, licences
    - `tests/` : tests unitaires et d’intégration

### Frontend (`frontend/`)

- **Next.js 15 / React / TypeScript / Tailwind**
- Gestion des états, appels API, composants réutilisables
- Organisation : `components/`, `pages/`, `contexts/`, `services/`, `tests/`

### Azure Functions (`azure_functions/`)

- Fonctions serverless pour services cloud et tokens
- Exemple : génération de token pour Azure Speech, synchronisation playlists
- Dépendances gérées via `requirements.txt`

* * *

## Installation

### Prérequis

- Python 3.13+
- Node.js 22+
- Docker (optionnel)
- Azure CLI (optionnel)
- .env frontend comme backend (en tout cas pour le développement local )

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows : venv\Scripts\activate
pip install -r requirements.txt
```

> Fichier .env à initialiser avec ces valeurs:

```bash
# === Jamendo API ===
JAMENDO_CLIENT_ID=""  # Jamendo API client ID
JAMENDO_URL="https://api.jamendo.com/v3.0/tracks"  # Base URL for Jamendo API

# === OpenAI / Azure LLM ===
ENDPOINT_URL=""        # Azure OpenAI endpoint (e.g., https://YOUR_RESOURCE.openai.azure.com/)
DEPLOYMENT_NAME=""     # Name of deployed model (e.g., gpt-4, llama, deepseek, etc.)
AZURE_OPENAI_API_KEY="" # Azure OpenAI API Key
AZURE_KEY_VAULT_URL="" # (Optional) Azure Key Vault URL for secrets

# === API Configuration ===
API_KEY=""             # FastAPI custom API key (define your own)
ALLOWED_ORIGINS=""     # Allowed CORS origins (e.g., http://localhost:3000, https://yourdomain.com)
SWAGGER_ON=False       # Enable/disable Swagger UI (True/False)

# === Azure Speech Service ===
SPEECH_KEY=""          # Azure Speech API key
SPEECH_REGION=""       # Azure region (e.g., eastus, westeurope)

# === Azure Storage ===
AZURE_STORAGE_CONNECTION_STRING=""  # Azure Storage account connection string
CACHE_BLOB_NAME=""                  # Blob container name for caching

# === MongoDB (Optional) ===
MONGO_HOST="localhost"
MONGO_PORT=27017
MONGO_DB_NAME="audiomancy"
```

### Frontend

```bash
cd frontend
npm install # ou pnpm install
```

>  Fichier .env à initialiser avec ces valeurs:

```bash
# === Frontend (Next.js) ===
FASTAPI_URL=""  # URL du backend FastAPI 

# Variables côté serveur Next.js uniquement (pas exposées au client)
FASTAPI_API_KEY=""      # API Key pour sécuriser les appels depuis Next.js vers FastAPI
SPEECH_REGION=""        # Région Azure Speech (ex: westeurope)
SPEECH_KEY=""           # Clé Azure Speech

```

### Azure Functions

```bash
cd azure_functions
pip install -r requirements.txt
npm install -g azurite
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

* * *

## Utilisation

### Lancer le backend

```bash
cd backend
uvicorn app.main:app --reload
```

API disponible : `http://localhost:8000`

### Lancer le frontend

```bash
cd frontend
npm run dev
```

Application disponible : `http://localhost:3000`

### Lancer les fonctions Azure

```bash
cd azure_functions
func start
```

* * *

## Tests

### Backend

```bash
cd backend
pytest
```

* * *

## Équipe

| Nom | Rôle | GitHub |
| --- | --- | --- |
| Benjamin | Backend , Architecture, Configuration | https://github.com/benjsant |
| Aurelien R | Frontend, UI, MongoDB/Utilisateur | https://github.com/aruide |
| Aurelien L | Azure, IA, MongoDb/Favoris | https://github.com/Aurelien-L |

* * *

## Licence

Ce projet est sous licence **MIT**.

* * *