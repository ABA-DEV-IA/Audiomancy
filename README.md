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

### Frontend

```bash
cd frontend
npm install # ou pnpm install
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