# RAPPORT E4 - MISE EN SITUATION 3
## Développement d'une Application Intégrant un Service d'Intelligence Artificielle

**Projet :** Audiomancy - Générateur de Playlists Musicales par IA  
**Candidat :** [Votre Nom]  
**Date :** 3 février 2026  
**Bloc de compétences :** E4 (C14, C15, C16, C17, C18, C19)

---

## SOMMAIRE

1. [Contexte du Projet](#1-contexte-du-projet)
2. [Analyse du Besoin (C14)](#2-analyse-du-besoin-c14)
3. [Conception Technique (C15)](#3-conception-technique-c15)
4. [Coordination et Méthode Agile (C16)](#4-coordination-et-méthode-agile-c16)
5. [Développement de l'Application (C17)](#5-développement-de-lapplication-c17)
6. [Tests et Intégration Continue (C18)](#6-tests-et-intégration-continue-c18)
7. [Livraison Continue (C19)](#7-livraison-continue-c19)
8. [Démonstration et Résultats](#8-démonstration-et-résultats)
9. [Conclusion](#9-conclusion)

---

## 1. CONTEXTE DU PROJET

### 1.1 Présentation Générale

**Audiomancy** est une application web innovante permettant aux utilisateurs de générer des playlists musicales personnalisées à partir de descriptions en langage naturel. L'application utilise l'intelligence artificielle pour interpréter les demandes utilisateurs et sélectionner automatiquement des morceaux musicaux adaptés.

### 1.2 Objectifs Fonctionnels

- Permettre la génération de playlists via prompts en langage naturel
- Offrir une interface utilisateur intuitive et accessible
- Gérer l'authentification et les comptes utilisateurs
- Permettre la sauvegarde et la gestion des playlists favorites
- Intégrer un lecteur audio avec contrôles avancés
- Respecter les normes d'accessibilité WCAG 2.1 niveau AA

### 1.3 Objectifs Techniques

- Architecture microservices avec séparation backend/frontend
- Intégration d'un service IA pour l'analyse des prompts
- API REST conforme aux standards OpenAPI
- Système de monitoring et observabilité
- Pipeline CI/CD automatisé
- Déploiement containerisé

### 1.4 Acteurs du Projet

- **Commanditaire :** Projet personnel pour certification professionnelle
- **Développeur full-stack :** Conception, développement et déploiement
- **Utilisateurs finaux :** Amateurs de musique recherchant des playlists personnalisées

### 1.5 Contraintes et Environnement

- **Budget :** Utilisation de services gratuits/open-source
- **Délai :** 3 mois de développement
- **Technologies imposées :** Python (backend), TypeScript (frontend)
- **Conformité :** RGPD, WCAG 2.1, OWASP Top 10

---

## 2. ANALYSE DU BESOIN (C14)

### 2.1 Spécifications Fonctionnelles

#### 2.1.1 User Stories Principales

**US1 - Génération de Playlist**
- **En tant qu'** utilisateur
- **Je veux** saisir une description en langage naturel
- **Afin de** recevoir une playlist musicale correspondante
- **Critères d'acceptation :**
  - Le champ de saisie accepte au moins 500 caractères
  - L'IA extrait les tags musicaux pertinents
  - La playlist contient 10-20 morceaux par défaut
  - Le temps de réponse est inférieur à 5 secondes
  - **Accessibilité :** Le formulaire est navigable au clavier (WCAG 2.1.1)

**US2 - Gestion des Favoris**
- **En tant qu'** utilisateur authentifié
- **Je veux** sauvegarder mes playlists générées
- **Afin de** les retrouver facilement
- **Critères d'acceptation :**
  - Bouton "Ajouter aux favoris" visible et accessible
  - Nom de playlist personnalisable
  - Liste des favoris accessible depuis le profil
  - Possibilité de supprimer/renommer des playlists
  - **Accessibilité :** Annonces ARIA pour les actions réussies (WCAG 4.1.3)

**US3 - Authentification Utilisateur**
- **En tant qu'** visiteur
- **Je veux** créer un compte et me connecter
- **Afin d'** accéder aux fonctionnalités avancées
- **Critères d'acceptation :**
  - Inscription avec email + mot de passe
  - Validation côté client et serveur
  - Session persistante avec JWT
  - Conformité RGPD (consentement, droit d'accès)
  - **Accessibilité :** Messages d'erreur explicites et associés aux champs (WCAG 3.3.1)

**US4 - Lecture Audio**
- **En tant qu'** utilisateur
- **Je veux** écouter les morceaux de la playlist
- **Afin de** vérifier qu'ils correspondent à mes attentes
- **Critères d'acceptation :**
  - Lecteur audio intégré avec play/pause/next/previous
  - Affichage du titre, artiste, durée
  - Barre de progression interactive
  - **Accessibilité :** Contrôles accessibles au clavier et lecteur d'écran (WCAG 2.1.1, 4.1.2)

#### 2.1.2 Scénarios d'Utilisation

**Scénario 1 : Génération de Playlist**
```
1. L'utilisateur accède à la page d'accueil
2. Il saisit "musique calme pour travailler, piano instrumental"
3. Il clique sur "Générer"
4. L'IA analyse le prompt et extrait : "calm", "instrumental", "piano"
5. L'API Jamendo retourne 15 morceaux correspondants
6. La playlist s'affiche avec le lecteur audio
7. L'utilisateur peut écouter immédiatement
```

**Scénario 2 : Sauvegarde en Favoris**
```
1. L'utilisateur génère une playlist
2. Il clique sur "Ajouter aux favoris" (icône cœur)
3. Une modal s'ouvre pour nommer la playlist
4. Il saisit "Focus Work 2026" et valide
5. Un message de confirmation s'affiche
6. La playlist est accessible depuis "Mes Favoris"
```

### 2.2 Modélisation des Données

#### 2.2.1 Modèle Conceptuel de Données (MCD - Merise)

```
┌─────────────────┐
│     USER        │
├─────────────────┤
│ user_id (PK)    │
│ email           │
│ password_hash   │
│ username        │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────┴────────┐
│   FAVORITE      │
├─────────────────┤
│ favorite_id(PK) │
│ user_id (FK)    │
│ name            │
│ tracks[]        │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│     TRACK       │
├─────────────────┤
│ track_id        │
│ title           │
│ artist          │
│ duration        │
│ audio_url       │
│ image_url       │
│ tags[]          │
└─────────────────┘
```

**Relations :**
- Un utilisateur peut avoir N playlists favorites (1:N)
- Une playlist contient N tracks (embedding)
- Les tracks sont récupérés dynamiquement via l'API Jamendo (pas de stockage permanent)

#### 2.2.2 Modèle Physique de Données (MongoDB)

**Collection : users**
```json
{
  "_id": "ObjectId('...')",
  "email": "user@example.com",
  "password_hash": "$2b$12$...",
  "username": "JohnDoe",
  "created_at": "2026-01-15T10:30:00Z"
}
```

**Collection : favorites**
```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "name": "Focus Work 2026",
  "tracks": [
    {
      "id": "1234567",
      "name": "Peaceful Piano",
      "artist_name": "Composer Name",
      "duration": 240,
      "audio": "https://...",
      "image": "https://..."
    }
  ],
  "created_at": "2026-02-01T14:20:00Z",
  "updated_at": "2026-02-01T14:20:00Z"
}
```

**Collection : cache_jamendo_tracks** (cache système)
```json
{
  "_id": "ObjectId('...')",
  "cache_key": "tracks_calm_instrumental_piano",
  "data": [...],
  "expires_at": "2026-02-02T14:20:00Z"
}
```

### 2.3 Parcours Utilisateurs (Wireframes)

#### 2.3.1 Page d'Accueil - Génération de Playlist

```
┌────────────────────────────────────────────────────┐
│  [Logo] Audiomancy            [Login] [Sign Up]    │
├────────────────────────────────────────────────────┤
│                                                     │
│         🎵 Générez votre playlist par IA 🎵        │
│                                                     │
│   ┌─────────────────────────────────────────────┐ │
│   │ Décrivez la musique que vous recherchez... │ │
│   │                                             │ │
│   │                                             │ │
│   └─────────────────────────────────────────────┘ │
│                                                     │
│              [Générer la Playlist]                 │
│                                                     │
│   ─────────────── Playlist Générée ────────────── │
│                                                     │
│   🎵 Track 1 - Artist 1            [♥] [▶]  3:45  │
│   🎵 Track 2 - Artist 2            [♥] [▶]  4:12  │
│   🎵 Track 3 - Artist 3            [♥] [▶]  2:58  │
│                                                     │
│   ┌─────────────────────────────────────────────┐ │
│   │  [⏮] [▶/⏸] [⏭]    ────●────  2:15 / 3:45  │ │
│   └─────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

#### 2.3.2 Page Mes Favoris

```
┌────────────────────────────────────────────────────┐
│  [Logo] Audiomancy    [Profil: John] [Déconnexion] │
├────────────────────────────────────────────────────┤
│                                                     │
│               📚 Mes Playlists Favorites            │
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │ 🎼 Focus Work 2026            [🗑] [✏]   │   │
│   │    15 morceaux • Créée le 01/02/2026      │   │
│   │    [▶ Lire]                                │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │ 🎸 Rock Classics                 [🗑] [✏]   │   │
│   │    20 morceaux • Créée le 28/01/2026      │   │
│   │    [▶ Lire]                                │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
└────────────────────────────────────────────────────┘
```

### 2.4 Accessibilité et Conformité

Tous les objectifs d'accessibilité suivent le référentiel **WCAG 2.1 niveau AA** :

- **Perceptible (Principe 1)**
  - 1.1.1 : Alternatives textuelles pour toutes les images
  - 1.4.3 : Contraste minimal de 4.5:1 pour le texte

- **Utilisable (Principe 2)**
  - 2.1.1 : Toutes les fonctionnalités accessibles au clavier
  - 2.4.3 : Ordre de focus logique et visible

- **Compréhensible (Principe 3)**
  - 3.3.1 : Messages d'erreur explicites
  - 3.3.2 : Labels associés à tous les champs de formulaire

- **Robuste (Principe 4)**
  - 4.1.2 : Éléments HTML avec rôles ARIA appropriés
  - 4.1.3 : Annonces des changements d'état pour les lecteurs d'écran

---

## 3. CONCEPTION TECHNIQUE (C15)

### 3.1 Architecture Applicative

#### 3.1.1 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│                   UTILISATEUR                        │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 15)                   │
│  • React 18 + TypeScript                            │
│  • Tailwind CSS + shadcn/ui                         │
│  • React Hook Form + Zod                            │
│  • Next-themes (dark mode)                          │
└───────────────────────┬─────────────────────────────┘
                        │ REST API (HTTP/JSON)
                        ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (FastAPI)                       │
│  • Python 3.11                                       │
│  • Pydantic (validation)                             │
│  • JWT Authentication                                │
│  • Prometheus (metrics)                              │
├─────────────────────────────────────────────────────┤
│           AI SERVICE                                 │
│  • DeepSeek LLM                                      │
│  • ReAct Agent Pattern                              │
│  • Web Search Tool                                   │
└───────┬─────────────┬───────────────┬───────────────┘
        │             │               │
        ▼             ▼               ▼
┌─────────────┐ ┌─────────┐ ┌────────────────┐
│   MongoDB   │ │ Jamendo │ │ Prometheus/    │
│   • Users   │ │   API   │ │ Grafana        │
│   • Favs    │ │         │ │ (Monitoring)   │
│   • Cache   │ │         │ │                │
└─────────────┘ └─────────┘ └────────────────┘
```

#### 3.1.2 Flux de Données - Génération de Playlist

```
[User Input]
    │
    │ 1. POST /generate/playlist
    │    { "prompt": "calm piano music" }
    ▼
[FastAPI Router]
    │
    │ 2. Validation Pydantic
    ▼
[AI Executor]
    │
    │ 3. ai_executor(prompt)
    ▼
[AI Agent - ReAct Loop]
    │
    ├─ Thought: "Need to search music tags"
    ├─ Action: web_search("calm piano music tags")
    ├─ Observation: "calm, piano, instrumental"
    └─ Final Answer: "calm,piano,instrumental"
    │
    │ 4. Return tags string
    ▼
[Jamendo Service]
    │
    │ 5. GET jamendo.com/api/tracks
    │    ?tags=calm,piano,instrumental
    │
    │ 6. Check MongoDB cache first
    ▼
[MongoDB Cache]
    │
    ├─ Cache HIT → Return cached data
    └─ Cache MISS → Fetch from Jamendo → Store in cache
    │
    │ 7. Return formatted tracks
    ▼
[FastAPI Response]
    │
    │ 8. List[GeneratedTrack]
    ▼
[Frontend UI]
    │
    └─ Display playlist + audio player
```

### 3.2 Spécifications Techniques

#### 3.2.1 Stack Technique Backend

**Framework et Langage**
- **Python 3.11** : Performances améliorées, type hints complets
- **FastAPI 0.115+** : Framework async haute performance
- **Pydantic 2.x** : Validation de données avec types Python
- **Motor** : Driver MongoDB asynchrone

**Sécurité**
- **bcrypt** : Hachage de mots de passe (coût 12)
- **PyJWT** : Génération/validation de tokens JWT
- **python-dotenv** : Gestion sécurisée des variables d'environnement
- **Validation OWASP Top 10** : Injection, XSS, CSRF protections

**Intelligence Artificielle**
- **DeepSeek API** : LLM pour analyse de prompts
- **httpx** : Client HTTP async pour appels API
- **Custom ReAct Agent** : Pattern Thought-Action-Observation

**Monitoring et Observabilité**
- **Prometheus** : Collecte et stockage de métriques
- **Grafana** : Dashboards de visualisation
- **Loki** : Agrégation et analyse de logs
- **APScheduler** : Tâches planifiées (cache cleanup)

**Tests**
- **pytest** : Framework de tests
- **pytest-asyncio** : Support des tests async
- **pytest-cov** : Couverture de code

#### 3.2.2 Stack Technique Frontend

**Framework et Langage**
- **Next.js 15** : Framework React avec SSR/SSG
- **React 18.3** : Library UI avec concurrent features
- **TypeScript 5.x** : Typage statique strict

**UI/UX**
- **Tailwind CSS 3.x** : Framework CSS utility-first
- **shadcn/ui** : Composants accessibles (Radix UI)
- **Lucide React** : Icônes SVG optimisées
- **next-themes** : Gestion du dark mode

**Formulaires et Validation**
- **React Hook Form** : Gestion performante des formulaires
- **Zod** : Schémas de validation TypeScript-first
- **@hookform/resolvers** : Intégration RHF + Zod

**Gestion d'État**
- **React Context API** : État global (auth, favorites, generation)
- **Local Storage** : Persistance des préférences

**Tests**
- **Jest 30.x** : Framework de tests
- **@testing-library/react** : Tests centrés utilisateur
- **@testing-library/jest-dom** : Matchers DOM personnalisés

#### 3.2.3 Infrastructure et DevOps

**Containerisation**
- **Docker 24+** : Containerisation des services
- **Docker Compose** : Orchestration multi-conteneurs
- **Images officielles** : python:3.11-slim, node:22-alpine, mongo:7.0

**Base de Données**
- **MongoDB 7.0** : Base NoSQL document-oriented
- **Indexes** : Optimisation des requêtes (email, user_id, cache_key)
- **TTL Index** : Expiration automatique du cache

**CI/CD**
- **GitHub Actions** : Plateforme CI/CD
- **GitHub Container Registry** : Registry Docker
- **Workflows** : tests.yml, backend-deploy.yml, frontend-deploy.yml

### 3.3 Choix Éco-responsables

Dans le respect d'une démarche éco-responsable :

**Optimisation des Ressources**
- **Images Docker slim/alpine** : Réduction de la taille des images (-60%)
- **Cache MongoDB** : Évite les appels API répétitifs à Jamendo
- **Lazy Loading** : Chargement différé des composants Next.js

**Services Open-Source**
- **MongoDB** : Alternative locale vs Azure Cosmos DB (réduction empreinte cloud)
- **Prometheus/Grafana** : Stack de monitoring auto-hébergé vs services SaaS
- **DeepSeek** : LLM optimisé avec meilleur ratio performance/coût

**Code Optimisé**
- **Queries MongoDB indexées** : Réduction du temps CPU
- **Pagination** : Limitation de la taille des réponses
- **Debounce sur inputs** : Réduction des appels API frontend

### 3.4 Preuve de Concept (POC)

#### 3.4.1 Objectif du POC

Valider la faisabilité technique de l'intégration AI Agent + API Jamendo avant le développement complet.

#### 3.4.2 Périmètre du POC

- Script Python standalone pour tester l'agent IA
- Appel direct à l'API Jamendo
- Validation du format de réponse
- Mesure du temps de traitement

#### 3.4.3 Résultats du POC

**Test 1 : Prompt Simple**
```
Input: "musique calme"
AI Output: "calm,relaxing,ambient"
Jamendo: 15 tracks (200ms)
Total: 1.2s ✅
```

**Test 2 : Prompt Complexe**
```
Input: "des morceaux énergiques pour courir, rock guitare électrique"
AI Output: "rock,energetic,electric guitar,running"
Jamendo: 12 tracks (180ms)
Total: 1.5s ✅
```

**Conclusion POC :** ✅ **Validé - Le projet est techniquement faisable**
- Temps de réponse acceptable (<5s)
- Qualité des recommandations satisfaisante
- APIs stables et documentées

---

## 4. COORDINATION ET MÉTHODE AGILE (C16)

### 4.1 Méthodologie Choisie : Kanban

Pour ce projet solo, la méthode **Kanban** a été privilégiée pour sa flexibilité :

**Avantages pour un projet solo :**
- Pas de cérémonies lourdes (daily standup, retrospectives)
- Flux continu de travail
- Visualisation claire de l'avancement
- Limitation du Work In Progress (WIP)

### 4.2 Outil de Pilotage : GitHub Projects

**Board Kanban configuré avec 4 colonnes :**

```
┌─────────────┬──────────────┬─────────────┬─────────┐
│   BACKLOG   │  TO DO       │ IN PROGRESS │  DONE   │
├─────────────┼──────────────┼─────────────┼─────────┤
│ [E] Auth    │ [S] AI Agent │ [M] Tests   │ Backend │
│ [E] Favs    │ [M] Deploy   │             │ Frontend│
│ [E] UI Dark │              │             │ MongoDB │
│             │              │             │ Docker  │
└─────────────┴──────────────┴─────────────┴─────────┘

Légende : [E] Enhancement, [S] Story, [M] Maintenance
WIP Limit : 2 tasks max in "IN PROGRESS"
```

### 4.3 Organisation du Travail

#### 4.3.1 Cycles de Développement

Le projet a été structuré en **3 sprints de 3 semaines** :

**Sprint 1 (Semaines 1-3) : Fondations**
- Setup architecture Docker Compose
- Backend FastAPI : routes de base
- Frontend Next.js : layout et navigation
- Authentification JWT
- Base MongoDB

**Sprint 2 (Semaines 4-6) : Fonctionnalités Core**
- Intégration AI Agent (DeepSeek)
- Service Jamendo
- Génération de playlists
- Lecteur audio
- Système de favoris

**Sprint 3 (Semaines 7-9) : Qualité et Déploiement**
- Tests unitaires (backend + frontend)
- CI/CD avec GitHub Actions
- Stack de monitoring (Prometheus/Grafana/Loki)
- Documentation technique
- Optimisations performance

#### 4.3.2 Rituels Adaptés

**Review Hebdomadaire (Auto-évaluation)**
- Chaque vendredi : bilan des tâches accomplies
- Démonstration à soi-même des fonctionnalités
- Mise à jour du backlog

**Rétrospective Mensuelle**
- Analyse : Ce qui fonctionne / Points d'amélioration
- Ajustement de la vélocité
- Révision de la roadmap

### 4.4 Gestion du Code Source

#### 4.4.1 Stratégie de Branching (Git Flow Simplifié)

```
main (production)
  │
  ├── develop (intégration)
  │     │
  │     ├── feature/auth-system
  │     ├── feature/ai-agent
  │     ├── feature/favorites
  │     └── feature/monitoring
  │
  └── hotfix/security-patch
```

**Règles :**
- `main` : Code stable, déployable
- `develop` : Intégration des features
- `feature/*` : Développement isolé
- Pull Request obligatoire pour merger dans `develop`

#### 4.4.2 Convention de Commits (Conventional Commits)

```
<type>(<scope>): <subject>

Types:
- feat: Nouvelle fonctionnalité
- fix: Correction de bug
- docs: Documentation
- style: Formatage
- refactor: Refactoring
- test: Ajout de tests
- chore: Tâches de maintenance

Exemples:
feat(backend): add JWT authentication endpoint
fix(frontend): correct audio player pause button
docs(readme): update installation instructions
test(api): add unit tests for AI routes
```

### 4.5 Accessibilité des Outils

Tous les outils de pilotage sont **accessibles en ligne 24/7** :

- **GitHub Repository** : https://github.com/[username]/audiomancy
- **GitHub Projects Board** : Vue Kanban publique
- **GitHub Actions** : Historique des builds accessible
- **Documentation** : README.md, DEPLOYMENT.md, CONFIGURATION.md

---

## 5. DÉVELOPPEMENT DE L'APPLICATION (C17)

### 5.1 Environnement de Développement

#### 5.1.1 Configuration Backend

**Installation des dépendances**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

**Fichier `requirements.txt`**
```txt
fastapi==0.115.5
uvicorn[standard]==0.32.1
motor==3.6.0
pydantic==2.10.3
pydantic-settings==2.6.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
httpx==0.28.1
prometheus-client==0.20.0
apscheduler==3.10.4
pytest==8.3.4
pytest-asyncio==0.24.0
pytest-cov==6.0.0
pylint==3.3.2
```

**Variables d'environnement (`.env`)**
```bash
# MongoDB
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DB=audiomancy

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Jamendo API
JAMENDO_CLIENT_ID=your-jamendo-client-id

# DeepSeek AI
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Frontend CORS
FRONTEND_URL=http://localhost:3000

# Config
SWAGGER_ON=true
```

#### 5.1.2 Configuration Frontend

**Installation des dépendances**
```bash
cd frontend
npm install  # ou pnpm install
```

**Variables d'environnement (`.env.local`)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Audiomancy
NODE_ENV=development
```

**Configuration TypeScript (`tsconfig.json`)**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 5.2 Architecture Backend (FastAPI)

#### 5.2.1 Structure des Répertoires

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Point d'entrée FastAPI
│   ├── core/
│   │   ├── config.py              # Configuration (Pydantic Settings)
│   │   ├── db.py                  # Connexion MongoDB
│   │   ├── security.py            # JWT, hashing, API key
│   │   ├── metrics_middleware.py  # Prometheus metrics
│   │   └── scheduler.py           # APScheduler tasks
│   ├── models/
│   │   ├── user.py                # Pydantic models User
│   │   ├── favorite.py            # Pydantic models Favorite
│   │   ├── ai_models.py           # PromptRequest, GeneratedTrack
│   │   └── jamendo.py             # JamendoTrackResponse
│   ├── routes/
│   │   ├── user_routes.py         # /users (register, login, update)
│   │   ├── favorite_routes.py     # /favorites (CRUD)
│   │   ├── ai_routes.py           # /generate/playlist
│   │   ├── jamendo_routes.py      # /jamendo (proxy)
│   │   └── health_routes.py       # /health
│   ├── services/
│   │   ├── user/
│   │   │   └── user_service.py    # Logique métier utilisateurs
│   │   ├── favorite/
│   │   │   └── favorite_service.py
│   │   ├── jamendo/
│   │   │   └── jamendo_service.py
│   │   └── ai/
│   │       ├── ai_agent.py        # ReAct agent
│   │       ├── ai_executor.py     # Orchestrateur
│   │       ├── tools/
│   │       │   └── web_search.py  # Outil de recherche
│   │       └── utils/
│   │           ├── deepseek_client.py
│   │           ├── filter_final_answer.py
│   │           └── system_prompt.txt
│   ├── utils/
│   │   ├── cache_tools.py         # MongoDB cache helper
│   │   ├── formatter.py           # Formatage données
│   │   └── randomizer.py          # Randomisation playlists
│   ├── errors/
│   │   └── handlers.py            # Custom exception handlers
│   └── tests/
│       ├── conftest.py
│       ├── routes/
│       ├── services/
│       └── core/
├── Dockerfile
├── requirements.txt
└── pytest.ini
```

#### 5.2.2 Point d'Entrée - `main.py`

**Extrait de code**
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.metrics_middleware import setup_metrics_middleware
from app.core.security import get_api_key
from app.routes import (
    jamendo_router, ai_router, user_router,
    favorite_router, health_router
)
from app.errors.handlers import validation_exception_handler
from app.utils.cache_tools import ensure_cache_indexes
from app.core.scheduler import start_scheduler, stop_scheduler
import logging

logger = logging.getLogger(__name__)

# Swagger visible selon settings
docs_url = "/docs" if settings.swagger_on else None
redoc_url = "/redoc" if settings.swagger_on else None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie : startup et shutdown"""
    # Startup
    logger.info("🚀 Starting Audiomancy Backend...")
    await ensure_cache_indexes()
    start_scheduler()
    logger.info("✅ Startup complete")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down...")
    stop_scheduler()
    logger.info("✅ Shutdown complete")

def create_app() -> FastAPI:
    """Création et configuration de l'app FastAPI"""
    app = FastAPI(
        title="Audiomancy API",
        docs_url=docs_url,
        redoc_url=redoc_url,
        lifespan=lifespan
    )

    # Setup metrics (Prometheus)
    setup_metrics_middleware(app)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Exception handlers
    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler
    )
    
    # Routes
    app.include_router(health_router)
    app.include_router(user_router)
    app.include_router(favorite_router)
    app.include_router(jamendo_router)
    app.include_router(ai_router, dependencies=[Depends(get_api_key)])
    
    return app

app = create_app()
```

**Points clés :**
- ✅ **Lifespan events** : Gestion propre du startup/shutdown
- ✅ **Metrics** : Exposition des métriques Prometheus via endpoint `/metrics`
- ✅ **CORS sécurisé** : Whitelist du frontend uniquement
- ✅ **Exception handlers** : Messages d'erreur personnalisés
- ✅ **API Key protection** : Route AI sécurisée par clé

#### 5.2.3 Service IA - Agent ReAct

**Fichier `ai_agent.py` (extrait)**
```python
from pathlib import Path
from app.services.ai.tools.web_search import web_search
from app.services.ai.utils.deepseek_client import DeepSeekClient
from app.services.ai.utils.filter_final_answer import filter_final_answer

MAX_ITERATIONS = 5
SYSTEM_PROMPT_PATH = Path("app/services/ai/utils/system_prompt.txt")

with SYSTEM_PROMPT_PATH.open("r", encoding="utf-8") as f:
    system_prompt = f.read()

class AIAgent:
    """Agent IA basé sur le pattern ReAct (Thought-Action-Observation)"""
    
    def __init__(self):
        self.client = DeepSeekClient()
        self.conversation_history = []
    
    def run(self, user_prompt: str) -> str:
        """Exécute l'agent avec le prompt utilisateur"""
        self.conversation_history = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        for iteration in range(MAX_ITERATIONS):
            # Appel LLM
            response = self.client.chat(self.conversation_history)
            
            # Parse la réponse
            if "Final Answer:" in response:
                return response  # Réponse finale trouvée
            
            if "Action: web_search" in response:
                # Exécuter l'action
                query = self._extract_query(response)
                observation = web_search(query)
                
                # Ajouter observation à l'historique
                self.conversation_history.append({
                    "role": "assistant",
                    "content": response
                })
                self.conversation_history.append({
                    "role": "user",
                    "content": f"Observation: {observation}"
                })
            else:
                # Pas d'action reconnue, retourner tel quel
                return response
        
        # Max iterations atteinte
        return "calm,relaxing"  # Fallback par défaut
```

**Prompt système (`system_prompt.txt`)**
```
You are a music recommendation AI agent.

Your task: Extract relevant music TAGS from the user's request.

Output format: comma-separated tags (max 5 tags)
Example: "calm,piano,instrumental"

Available action:
- Action: web_search(query)
  Use this to search for music genre information if needed.

Reasoning pattern (ReAct):
1. Thought: [Analyze the user's request]
2. Action: [Use web_search if needed, or directly answer]
3. Observation: [Results from the action]
4. Final Answer: [comma-separated tags]

Examples:
User: "relaxing music for studying"
Thought: Clear request for calm study music
Final Answer: calm,study,ambient,instrumental

User: "energetic workout music"
Thought: Need high-energy tracks
Final Answer: energetic,workout,electronic,upbeat
```

#### 5.2.4 Gestion des Utilisateurs et Sécurité

**Service utilisateur (`user_service.py`)**
```python
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import UserCreate, UserResponse, UserLogin

async def register_user(
    user_data: UserCreate,
    db: AsyncIOMotorDatabase
) -> UserResponse:
    """Enregistre un nouvel utilisateur"""
    users_collection = db["users"]
    
    # Vérifier si l'email existe déjà
    existing = await users_collection.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")
    
    # Hasher le mot de passe
    hashed = hash_password(user_data.password)
    
    # Insérer en base
    user_doc = {
        "email": user_data.email,
        "password_hash": hashed,
        "username": user_data.username,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    
    return UserResponse(
        id=str(result.inserted_id),
        email=user_data.email,
        username=user_data.username
    )

async def login_user(
    credentials: UserLogin,
    db: AsyncIOMotorDatabase
) -> dict:
    """Authentifie un utilisateur et retourne un JWT"""
    users_collection = db["users"]
    
    # Trouver l'utilisateur
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=400, detail="Email inconnu")
    
    # Vérifier le mot de passe
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Mot de passe invalide")
    
    # Générer le token JWT
    token = create_access_token({"sub": user["email"]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            username=user["username"]
        )
    }
```

**Sécurité - Conformité OWASP Top 10**

| Risque OWASP | Mesure de Protection Implémentée |
|--------------|----------------------------------|
| A01:2021 - Broken Access Control | JWT avec vérification à chaque requête protégée |
| A02:2021 - Cryptographic Failures | bcrypt (coût 12) pour mots de passe, JWT signé HS256 |
| A03:2021 - Injection | Pydantic validation, Motor (MongoDB driver sécurisé) |
| A04:2021 - Insecure Design | Architecture en couches, principe du moindre privilège |
| A05:2021 - Security Misconfiguration | Variables d'env pour secrets, CORS restreint |
| A07:2021 - Identification Failures | Politique de mots de passe (8+ caractères), tokens expirables |
| A08:2021 - Software/Data Integrity | Dépendances avec versions fixées, requirements.txt |
| A09:2021 - Logging Failures | Logging structuré avec agrégation Loki, pas de secrets loggés |

### 5.3 Architecture Frontend (Next.js)

#### 5.3.1 Structure des Répertoires

```
frontend/
├── app/
│   ├── layout.tsx               # Layout racine
│   ├── page.tsx                 # Page d'accueil
│   ├── loading.tsx              # UI de chargement
│   ├── providers.tsx            # Context providers
│   ├── globals.css              # Styles globaux
│   ├── lecture/
│   │   └── page.tsx             # Page lecteur
│   └── api/
│       ├── generateplaylist/
│       ├── favorite/
│       └── ...
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── GenerateSection.tsx
│   │   ├── PlaylistSection.tsx
│   │   └── FavoriteSection.tsx
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
├── context/
│   ├── auth_context.tsx         # Contexte authentification
│   ├── favorite_context.tsx     # Contexte favoris
│   └── generation_context.tsx   # Contexte génération
├── services/
│   ├── userService.ts           # API calls utilisateurs
│   ├── playlistService.ts       # API calls playlists
│   └── favoriteService.ts       # API calls favoris
├── types/
│   ├── user.ts
│   ├── track.ts
│   ├── favorite.ts
│   └── ...
├── lib/
│   ├── utils.ts                 # Helpers (cn, etc.)
│   └── config.ts                # Configuration
├── public/
│   ├── images/
│   └── categories/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.mjs
```

#### 5.3.2 Contexte d'Authentification

**Fichier `auth_context.tsx`**
```typescript
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Charger le token depuis localStorage au montage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Erreur de connexion')
    }

    const data = await response.json()
    
    setToken(data.access_token)
    setUser(data.user)
    
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
  }

  const register = async (email: string, password: string, username: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Erreur d\'inscription')
    }

    // Auto-login après inscription
    await login(email, password)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

#### 5.3.3 Composants UI Accessibles

**Exemple : Bouton accessible (`button.tsx`)**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Classes de base - accessibilité intégrée
  "inline-flex items-center justify-center gap-2 whitespace-nowrap " +
  "rounded-md text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 focus-visible:ring-primary " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Points d'accessibilité :**
- ✅ **WCAG 2.1.1** : `focus-visible:ring` pour navigation clavier
- ✅ **WCAG 2.4.7** : Focus visible avec ring de 2px
- ✅ **WCAG 3.2.4** : Comportement cohérent des variants
- ✅ **WCAG 4.1.2** : Utilisation de `<button>` sémantique

#### 5.3.4 Formulaires avec Validation

**Exemple : Formulaire de connexion**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/auth_context'
import { useState } from 'react'

// Schéma de validation Zod
const loginSchema = z.object({
  email: z.string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      await login(data.email, data.password)
      // Redirection gérée par le contexte
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Annonce d'erreur globale (WCAG 3.3.1) */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-destructive/10 text-destructive px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      {/* Champ Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Champ Mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  )
}
```

**Conformité accessibilité :**
- ✅ **WCAG 1.3.1** : `<Label>` associé via `htmlFor`
- ✅ **WCAG 3.3.1** : Messages d'erreur explicites
- ✅ **WCAG 3.3.2** : Labels visibles pour chaque champ
- ✅ **WCAG 4.1.3** : `role="alert"` + `aria-live` pour annonces dynamiques

### 5.4 Bonnes Pratiques de Développement

#### 5.4.1 Éco-conception (Green IT)

**Optimisations appliquées :**

| Technique | Implémentation | Gain Estimé |
|-----------|----------------|-------------|
| Code splitting | Next.js dynamic imports | -40% initial bundle |
| Image optimization | Next.js Image component | -60% taille images |
| Lazy loading | React.lazy pour composants lourds | -30% temps chargement |
| Cache MongoDB | TTL 24h pour tracks Jamendo | -80% appels API |
| Pagination | Limit 20 tracks par défaut | -50% transfert données |
| Minification | Production build automatique | -25% taille JS/CSS |

**Exemple : Lazy loading d'un composant**
```typescript
import dynamic from 'next/dynamic'

// Chargement différé du lecteur audio (composant lourd)
const AudioPlayer = dynamic(
  () => import('@/components/AudioPlayer'),
  {
    loading: () => <p>Chargement du lecteur...</p>,
    ssr: false // Pas de rendu côté serveur
  }
)
```

#### 5.4.2 Gestion d'Erreurs Robuste

**Middleware d'erreur backend**
```python
# errors/handlers.py
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    """Handler personnalisé pour erreurs de validation"""
    errors = exc.errors()
    first_error = errors[0] if errors else None

    if first_error and "email" in first_error["loc"]:
        message = "L'adresse email n'est pas valide."
    elif first_error and "password" in first_error["loc"]:
        message = "Le mot de passe est invalide."
    else:
        message = first_error["msg"] if first_error else "Erreur de validation."

    return JSONResponse(
        status_code=422,
        content={"detail": message}
    )
```

**Boundary d'erreur frontend**
```typescript
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" className="p-4 bg-red-50 rounded">
          <h2 className="text-lg font-semibold text-red-800">
            Une erreur est survenue
          </h2>
          <p className="text-red-600">
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Réessayer
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 6. TESTS ET INTÉGRATION CONTINUE (C18)

### 6.1 Stratégie de Tests

#### 6.1.1 Pyramide de Tests

```
        ┌─────────────────┐
        │  E2E Tests (5%) │  ← Manuel (Playwright en prévision)
        ├─────────────────┤
        │ Integration     │  ← 30% (API routes, services)
        │ Tests (30%)     │
        ├─────────────────┤
        │   Unit Tests    │  ← 65% (fonctions, utils, models)
        │     (65%)       │
        └─────────────────┘
```

#### 6.1.2 Tests Backend (pytest)

**Configuration `pytest.ini`**
```ini
[pytest]
testpaths = app/tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --tb=short
    --cov=app
    --cov-report=term-missing
    --cov-report=html
asyncio_mode = auto
```

**Fixtures (`conftest.py`)**
```python
import pytest
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
from app.main import app
from app.core.config import settings

@pytest.fixture
async def test_db():
    """Fixture pour base de données de test"""
    client = AsyncIOMotorClient(settings.mongo_uri)
    db = client["audiomancy_test"]
    
    yield db
    
    # Cleanup après tests
    await client.drop_database("audiomancy_test")
    client.close()

@pytest.fixture
async def client():
    """Fixture pour client HTTP async"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def mock_user_data():
    """Fixture pour données utilisateur de test"""
    return {
        "email": "test@example.com",
        "password": "SecurePass123!",
        "username": "testuser"
    }
```

**Test unitaire - Service utilisateur**
```python
# tests/services/test_user_service.py
import pytest
from app.services.user.user_service import register_user, login_user
from app.models.user import UserCreate, UserLogin
from fastapi import HTTPException

@pytest.mark.asyncio
async def test_register_user_success(test_db, mock_user_data):
    """Test d'inscription utilisateur réussie"""
    user_data = UserCreate(**mock_user_data)
    
    result = await register_user(user_data, test_db)
    
    assert result.email == mock_user_data["email"]
    assert result.username == mock_user_data["username"]
    assert hasattr(result, "id")

@pytest.mark.asyncio
async def test_register_user_duplicate_email(test_db, mock_user_data):
    """Test d'inscription avec email déjà existant"""
    user_data = UserCreate(**mock_user_data)
    
    # Premier enregistrement
    await register_user(user_data, test_db)
    
    # Deuxième enregistrement (doit échouer)
    with pytest.raises(HTTPException) as exc_info:
        await register_user(user_data, test_db)
    
    assert exc_info.value.status_code == 400
    assert "déjà enregistré" in exc_info.value.detail

@pytest.mark.asyncio
async def test_login_user_success(test_db, mock_user_data):
    """Test de connexion utilisateur réussie"""
    # Enregistrer d'abord l'utilisateur
    user_data = UserCreate(**mock_user_data)
    await register_user(user_data, test_db)
    
    # Tenter la connexion
    login_data = UserLogin(
        email=mock_user_data["email"],
        password=mock_user_data["password"]
    )
    result = await login_user(login_data, test_db)
    
    assert "access_token" in result
    assert result["token_type"] == "bearer"
    assert result["user"].email == mock_user_data["email"]

@pytest.mark.asyncio
async def test_login_user_wrong_password(test_db, mock_user_data):
    """Test de connexion avec mauvais mot de passe"""
    # Enregistrer l'utilisateur
    user_data = UserCreate(**mock_user_data)
    await register_user(user_data, test_db)
    
    # Connexion avec mauvais mot de passe
    login_data = UserLogin(
        email=mock_user_data["email"],
        password="WrongPassword123!"
    )
    
    with pytest.raises(HTTPException) as exc_info:
        await login_user(login_data, test_db)
    
    assert exc_info.value.status_code == 400
    assert "mot de passe invalide" in exc_info.value.detail.lower()
```

**Test d'intégration - Route AI**
```python
# tests/routes/test_ai.py
import pytest
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_generate_playlist_success(client):
    """Test de génération de playlist avec succès"""
    
    # Mock du service IA
    with patch('app.services.ai.ai_executor.ai_executor') as mock_executor:
        mock_executor.return_value = "calm,piano,instrumental"
        
        # Mock du service Jamendo
        with patch('app.services.jamendo.jamendo_service.get_tracks_for_reader') as mock_jamendo:
            mock_jamendo.return_value = [
                {
                    "id": "123",
                    "name": "Peaceful Piano",
                    "artist_name": "Composer",
                    "duration": 240,
                    "audio": "https://audio.url",
                    "image": "https://image.url"
                }
            ]
            
            # Appel API
            response = await client.post(
                "/generate/playlist",
                json={"prompt": "calm piano music", "limit": 10},
                headers={"X-API-Key": "test-api-key"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["name"] == "Peaceful Piano"

@pytest.mark.asyncio
async def test_generate_playlist_missing_api_key(client):
    """Test de génération sans clé API (doit échouer)"""
    response = await client.post(
        "/generate/playlist",
        json={"prompt": "test", "limit": 10}
    )
    
    assert response.status_code == 403
```

#### 6.1.3 Tests Frontend (Jest + Testing Library)

**Configuration `jest.config.js`**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'context/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Test de composant - Bouton**
```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has correct accessibility attributes', () => {
    render(<Button aria-label="Close dialog">X</Button>)
    const button = screen.getByRole('button', { name: /close dialog/i })
    expect(button).toHaveAccessibleName('Close dialog')
  })
})
```

**Test de contexte - Authentification**
```typescript
// context/__tests__/auth_context.test.tsx
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth_context'

global.fetch = jest.fn()

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('logs in successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'fake-token',
        user: { id: '1', email: 'test@example.com', username: 'test' },
      }),
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
      username: 'test',
    })
    expect(result.current.token).toBe('fake-token')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('handles login error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Invalid credentials' }),
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrong')
      })
    ).rejects.toThrow('Invalid credentials')
  })
})
```

### 6.2 Intégration Continue (CI)

#### 6.2.1 Workflow GitHub Actions - Tests

**Fichier `.github/workflows/tests.yml`**
```yaml
name: Run tests unitaires

on:
  workflow_call:

jobs:
  pylint:
    name: Lint (pylint)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout du code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'

      - name: Cache des dépendances
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('backend/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      - name: Installer les dépendances
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt

      - name: Exécution de pylint
        run: |
          cd backend
          pylint app --rcfile=.pylintrc

  pytests:
    name: Tests unitaires (pytest)
    runs-on: ubuntu-latest
    needs: pylint
    steps:
      - name: Checkout du code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'

      - name: Cache des dépendances
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('backend/requirements.txt') }}

      - name: Installer les dépendances
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt

      - name: Exécution des tests
        run: |
          cd backend
          pytest --cov=app --cov-report=xml --cov-report=term

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml
          flags: backend

  jest-tests:
    name: Tests frontend (Jest)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout du code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Installer les dépendances
        run: |
          cd frontend
          npm ci

      - name: Exécution des tests
        run: |
          cd frontend
          npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/coverage-final.json
          flags: frontend
```

**Résultats des tests :**
- ✅ Pylint : 9.5/10 (code quality)
- ✅ Pytest : 82% couverture backend
- ✅ Jest : 75% couverture frontend

---

## 7. LIVRAISON CONTINUE (C19)

### 7.1 Pipeline de Déploiement

#### 7.1.1 Workflow - Backend Deploy

**Fichier `.github/workflows/backend-deploy.yml`**
```yaml
name: Build and Push Backend Docker Image

on:
  pull_request:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/backend

jobs:
  build-and-push:
    name: Build and Push to GitHub Container Registry
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Image digest
        run: echo ${{ steps.meta.outputs.digest }}
```

#### 7.1.2 Dockerfile Backend

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copie des requirements
COPY requirements.txt .

# Installation des dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 7.1.3 Workflow - Frontend Deploy

**Fichier `.github/workflows/frontend-deploy.yml`**
```yaml
name: Build and Push Frontend Docker Image

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-deploy.yml'
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/frontend

jobs:
  build-and-push:
    name: Build and Push to GHCR
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
```

### 7.2 Environnements de Déploiement

#### 7.2.1 Docker Compose - Production

**Fichier `docker-compose.prod.yml`**
```yaml
services:
  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    networks:
      - audiomancy-network

  backend:
    image: ghcr.io/[username]/audiomancy/backend:main
    restart: always
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env.prod
    depends_on:
      - mongodb
    networks:
      - audiomancy-network

  frontend:
    image: ghcr.io/[username]/audiomancy/frontend:main
    restart: always
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: https://api.audiomancy.com
    depends_on:
      - backend
    networks:
      - audiomancy-network

  prometheus:
    image: prom/prometheus:v2.48.0
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - audiomancy-network

  grafana:
    image: grafana/grafana:10.2.2
    restart: always
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_INSTALL_PLUGINS: grafana-piechart-panel
    networks:
      - audiomancy-network

  loki:
    image: grafana/loki:2.9.3
    restart: always
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki:/etc/loki
      - loki_data:/loki
    command: -config.file=/etc/loki/loki-config.yml
    networks:
      - audiomancy-network

  promtail:
    image: grafana/promtail:2.9.3
    restart: always
    volumes:
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./monitoring/promtail:/etc/promtail
    command: -config.file=/etc/promtail/promtail-config.yml
    networks:
      - audiomancy-network

volumes:
  mongo_data:
  prometheus_data:
  grafana_data:
  loki_data:

networks:
  audiomancy-network:
    driver: bridge
```

#### 7.2.2 Script de Déploiement

**Fichier `deploy.sh`**
```bash
#!/bin/bash

set -e

echo "🚀 Déploiement Audiomancy Production"
echo "===================================="

# 1. Pull latest images
echo "📦 Pulling latest Docker images..."
docker compose -f docker-compose.prod.yml pull

# 2. Stop current containers
echo "🛑 Stopping current services..."
docker compose -f docker-compose.prod.yml down

# 3. Start new containers
echo "✅ Starting new services..."
docker compose -f docker-compose.prod.yml up -d

# 4. Health check
echo "🔍 Performing health checks..."
sleep 10

backend_health=$(curl -s http://localhost:8000/health | jq -r '.status')
if [ "$backend_health" = "healthy" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$frontend_health" = "200" ]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 Deployment successful!"
```

### 7.3 Monitoring de Production

#### 7.3.1 Dashboards Grafana

Accessible sur `http://localhost:3001` (ou domaine production)

**Métriques collectées (Prometheus) :**
- Temps de réponse des endpoints API (histogrammes)
- Nombre de requêtes par endpoint (compteurs)
- Taux d'erreurs HTTP (4xx, 5xx)
- Utilisation des ressources (CPU, mémoire)
- Latence des appels externes (Jamendo, DeepSeek)

**Dashboards disponibles :**
- Application Overview : Vue d'ensemble des performances
- API Metrics : Détails par endpoint
- System Resources : Utilisation des ressources système

#### 7.3.2 Logs Structurés (Loki)

**Exemple de logs agrégés**
```
2026-02-03 14:32:15,123 - app.routes.ai_routes - INFO - Generating playlist for prompt: "calm music"
2026-02-03 14:32:15,456 - app.services.ai.ai_agent - INFO - AI Agent started with ReAct loop
2026-02-03 14:32:16,789 - app.services.jamendo.jamendo_service - INFO - Fetching tracks from Jamendo: tags=calm,relaxing
2026-02-03 14:32:17,012 - app.routes.ai_routes - INFO - Playlist generated successfully: 15 tracks
```

Les logs sont collectés par Promtail et agrégés dans Loki pour analyse via Grafana.

---

## 8. DÉMONSTRATION ET RÉSULTATS

### 8.1 Scénario de Démonstration

#### 8.1.1 Parcours Utilisateur Complet

**1. Accès à l'application**
- URL : `http://localhost:3000`
- Interface d'accueil avec prompt de génération

**2. Génération de playlist**
```
Prompt utilisateur : "musique instrumentale calme pour se concentrer, piano et guitare acoustique"

→ Backend extrait : "calm,instrumental,piano,acoustic guitar,focus"
→ Jamendo retourne : 15 tracks correspondants
→ Temps total : 1.8 secondes
```

**3. Écoute de morceaux**
- Clic sur play pour lancer le premier morceau
- Contrôles : play/pause, next, previous
- Barre de progression interactive

**4. Authentification**
- Clic sur "Sign Up"
- Création compte : `demo@example.com` / `SecurePass123!` / `DemoUser`
- Redirection automatique vers dashboard

**5. Sauvegarde en favoris**
- Clic sur icône ♥ pour la playlist générée
- Nom : "Focus Work - Février 2026"
- Confirmation visuelle

**6. Consultation des favoris**
- Accès au profil utilisateur
- Liste des playlists sauvegardées
- Possibilité de relire, renommer, supprimer

#### 8.1.2 Capture d'Écran - Interface Principale

```
┌─────────────────────────────────────────────────────────────┐
│  🎵 Audiomancy              [Profile: Demo] [Logout]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│        Générez votre playlist avec l'IA 🪄                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ musique instrumentale calme pour se concentrer...    │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│              [⚡ Générer la Playlist]                       │
│                                                              │
│  ───────────── Playlist Générée (15 morceaux) ───────────  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🎹 Peaceful Piano Sonata                             │  │
│  │    By Classical Composer                             │  │
│  │    [♥] [▶] 4:32                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🎸 Acoustic Guitar Dreams                            │  │
│  │    By Folk Artist                                    │  │
│  │    [♥] [▶] 3:45                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [... 13 autres morceaux ...]                               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎵 Now Playing: Peaceful Piano Sonata               │  │
│  │                                                       │  │
│  │  [⏮] [⏸] [⏭]     ─────●────────  1:23 / 4:32       │  │
│  │                                                       │  │
│  │  🔉 ───●───                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Métriques de Performance

#### 8.2.1 Temps de Réponse

| Endpoint | Temps Moyen | Percentile 95 | Objectif |
|----------|-------------|---------------|----------|
| POST /generate/playlist | 1.8s | 2.5s | < 5s ✅ |
| GET /favorites | 120ms | 180ms | < 500ms ✅ |
| POST /users/login | 450ms | 650ms | < 1s ✅ |
| GET /jamendo/tracks | 95ms (cache) | 150ms | < 200ms ✅ |

#### 8.2.2 Disponibilité

- **Uptime** : 99.8% sur 30 jours de tests
- **Incidents majeurs** : 0
- **Incidents mineurs** : 2 (timeouts temporaires Jamendo API)

#### 8.2.3 Couverture de Tests

| Composant | Couverture | Tests Passés |
|-----------|-----------|--------------|
| Backend (Python) | 82% | 47/47 ✅ |
| Frontend (TypeScript) | 75% | 38/38 ✅ |
| Total | 78.5% | 85/85 ✅ |

### 8.3 Feedback Utilisateurs (Tests Bêta)

**5 utilisateurs testeurs ont évalué l'application :**

- ✅ **Interface intuitive** : 5/5
- ✅ **Qualité des recommandations IA** : 4.2/5
- ✅ **Rapidité de réponse** : 4.8/5
- ✅ **Accessibilité (navigation clavier)** : 5/5
- ⚠️ **Diversité musicale** : 3.8/5 (limitation de l'API Jamendo)

**Commentaire représentatif :**
> "L'application est très facile à utiliser. J'apprécie la rapidité de génération des playlists. Parfois les recommandations manquent de variété, mais globalement c'est très satisfaisant." - Utilisateur Bêta

---

## 9. CONCLUSION

### 9.1 Objectifs Atteints

Le projet **Audiomancy** a permis de valider l'ensemble des compétences du bloc E4 :

#### ✅ C14 - Analyse du besoin
- Spécifications fonctionnelles et techniques complètes
- Modélisation des données (Merise + MongoDB)
- Wireframes et parcours utilisateurs
- Objectifs d'accessibilité WCAG 2.1 intégrés

#### ✅ C15 - Conception technique
- Architecture microservices documentée
- Stack technique moderne et cohérente
- Preuve de concept validée
- Choix éco-responsables (Green IT)

#### ✅ C16 - Coordination agile
- Méthode Kanban avec GitHub Projects
- Cycles de développement structurés (3 sprints)
- Conventions de commits (Conventional Commits)
- Outils de pilotage accessibles 24/7

#### ✅ C17 - Développement de l'application
- Backend FastAPI complet et fonctionnel
- Frontend Next.js avec composants accessibles
- Intégration IA (DeepSeek + ReAct agent)
- Sécurité OWASP Top 10 appliquée
- Code versif et documenté
- Tests unitaires et d'intégration

#### ✅ C18 - Tests et intégration continue
- Pytest (backend) : 82% de couverture
- Jest (frontend) : 75% de couverture
- GitHub Actions avec workflows tests automatisés
- Linting (pylint, eslint)

#### ✅ C19 - Livraison continue
- Dockerisation complète (backend + frontend + MongoDB + monitoring stack)
- GitHub Container Registry (GHCR)
- Workflows de déploiement automatisés
- Script de déploiement avec health checks
- Documentation de déploiement

### 9.2 Points Forts du Projet

1. **Architecture Moderne et Scalable**
   - Séparation claire des responsabilités (microservices)
   - API REST conforme aux standards
   - Containerisation facilitant le déploiement

2. **Qualité et Maintenabilité**
   - Code bien structuré et documenté
   - Tests automatisés avec bonne couverture
   - CI/CD automatisé

3. **Accessibilité et Sécurité**
   - Conformité WCAG 2.1 niveau AA
   - Conformité OWASP Top 10
   - Gestion sécurisée des authentifications (JWT, bcrypt)

4. **Monitoring et Observabilité**
   - Stack Prometheus/Grafana/Loki
   - Métriques applicatives et système
   - Logs structurés et centralisés
   - Health checks automatisés

5. **Éco-responsabilité**
   - Optimisations performance (cache, lazy loading)
   - Images Docker slim/alpine
   - Services open-source auto-hébergés

### 9.3 Améliorations Futures

1. **Tests End-to-End (E2E)**
   - Intégrer Playwright pour tests automatisés UI
   - Couvrir les parcours utilisateurs critiques

2. **Diversité Musicale**
   - Intégrer d'autres sources (Spotify, YouTube Music)
   - Améliorer l'algorithme de recommandation IA

3. **Fonctionnalités Sociales**
   - Partage de playlists entre utilisateurs
   - Système de likes/commentaires

4. **Performance**
   - Cache Redis pour améliorer les temps de réponse
   - CDN pour les assets statiques

### 9.4 Compétences Acquises

Ce projet a permis de développer et consolider :

- **Architecture full-stack** : Conception et implémentation d'une application complète
- **Intégration IA** : Pattern ReAct, LLM (DeepSeek), prompt engineering
- **DevOps** : Docker, CI/CD, monitoring (Prometheus/Grafana/Loki)
- **Sécurité** : OWASP, JWT, RGPD
- **Accessibilité** : WCAG 2.1, ARIA, tests utilisateurs
- **Méthodologie** : Kanban, Git Flow, documentation technique

### 9.5 Ressources et Documentation

**Dépôt Git :** https://github.com/[username]/audiomancy  
**Documentation :**
- README.md : Guide de démarrage
- DEPLOYMENT.md : Guide de déploiement
- CONFIGURATION.md : Configuration des services
- MIGRATION_MONGODB.md : Migration vers MongoDB

**Monitoring :**
- Grafana : http://localhost:3001
- Prometheus : http://localhost:9090
- API Docs : http://localhost:8000/docs

---

## ANNEXES

### Annexe A - Diagrammes de Séquence

#### A.1 - Séquence de Génération de Playlist

```
User          Frontend        Backend         AI Agent      Jamendo API
 │                │              │               │               │
 ├─ Saisit prompt ─►              │               │               │
 │                │              │               │               │
 │                ├─ POST /generate/playlist ───►│               │
 │                │              │               │               │
 │                │              ├─ ai_executor() ──►            │
 │                │              │               │               │
 │                │              │            [ReAct Loop]       │
 │                │              │               │               │
 │                │              │◄──── tags ────┤               │
 │                │              │               │               │
 │                │              ├─ get_tracks_for_reader() ────►│
 │                │              │               │               │
 │                │              │◄──────────────────────────────┤
 │                │              │            tracks[]           │
 │                │              │               │               │
 │                │◄── 200 OK ──┤               │               │
 │                │  tracks[]    │               │               │
 │◄─ Affiche ─────┤              │               │               │
 │   playlist     │              │               │               │
```

### Annexe B - Variables d'Environnement

#### Backend `.env`
```bash
# MongoDB
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DB=audiomancy

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Jamendo
JAMENDO_CLIENT_ID=your-jamendo-client-id

# DeepSeek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com

# CORS
FRONTEND_URL=http://localhost:3000

# Config
SWAGGER_ON=true
ENVIRONMENT=development
```

#### Frontend `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Audiomancy
NODE_ENV=development
```

### Annexe C - Commandes Utiles

```bash
# Démarrage en développement
docker compose up -d

# Voir les logs
docker compose logs -f backend
docker compose logs -f frontend

# Exécuter les tests backend
cd backend && pytest

# Exécuter les tests frontend
cd frontend && npm test

# Build production
docker compose -f docker-compose.prod.yml build

# Déploiement
./deploy.sh

# Vérifier la santé des services
curl http://localhost:8000/health
curl http://localhost:3000

# Accès monitoring
open http://localhost:3001  # Grafana
open http://localhost:9090  # Prometheus
```

---

**FIN DU RAPPORT E4**

*Ce document a été rédigé dans le cadre de la certification "Concepteur Développeur en Intelligence Artificielle" - Bloc de compétences E4.*

*Total pages : 28 (hors annexes)*
