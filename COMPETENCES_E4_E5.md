# 🎓 Validation des Compétences E4 & E5 - Audiomancy

**Projet** : Audiomancy - Plateforme de génération de playlists musicales avec IA  
**Date** : Janvier 2026  
**Stack** : FastAPI (Python 3.13) + Next.js 15 + MongoDB + DeepSeek LLM + Jaeger

---

## 📊 Tableau Récapitulatif

| Compétence | État | Score | Actions nécessaires |
|-----------|------|-------|---------------------|
| **C14** - Analyse besoin | ⚠️ Partiel | 60% | Ajouter diagrammes UML/C4, doc accessibilité |
| **C15** - Conception technique | ✅ Validé | 85% | Documenter choix architecturaux |
| **C16** - Coordination Agile/MLOps | ⚠️ Partiel | 70% | Clarifier MLOps (DeepSeek externe) |
| **C17** - Développement | ✅ Validé | 80% | Compléter tests accessibilité WCAG |
| **C18** - Tests automatisés CI | ✅ Validé | 90% | RAS - workflow fonctionnel |
| **C19** - Livraison continue CD | ✅ Validé | 85% | Documenter stratégie de déploiement |
| **C20** - Surveillance/Monitoring | ⚠️ Partiel | 75% | Documenter feedback loop MLOps + RGPD |
| **C21** - Résolution incidents | ⚠️ Partiel | 65% | Créer documentation incidents résolus |

**Score global E4** : 78% ✅ (validable avec compléments)  
**Score global E5** : 70% ⚠️ (nécessite documentation)

---

## 🎯 E4 - Développer une Application d'Intelligence Artificielle

### C14 - Analyser le besoin d'application intégrant un service IA

#### ✅ **Ce qui est en place**

1. **Spécifications fonctionnelles**
   - 📄 [README.md](README.md) : Description projet, fonctionnalités, architecture
   - 📄 [CONFIGURATION.md](CONFIGURATION.md) : Configuration environnements
   - 📄 [MIGRATION_MONGODB.md](MIGRATION_MONGODB.md) : Décisions techniques documentées

2. **Modélisation existante**
   - 📂 Structure modulaire claire (backend/frontend/services)
   - 📂 Modèles Pydantic ([backend/app/models/](backend/app/models/)) pour validation données
   - 🔗 API REST documentée avec FastAPI OpenAPI (Swagger)

3. **Standards d'utilisabilité**
   - 🎨 Interface utilisateur cohérente (Tailwind CSS)
   - 📱 Design responsive (mobile-first)
   - ♿ Composants accessibles (shadcn/ui basés sur Radix)

#### ❌ **Ce qui manque**

1. **Diagrammes de modélisation** (⚠️ CRITIQUE)
   - ❌ Diagramme C4 (Context, Container, Component, Code)
   - ❌ Diagramme de séquence (flux génération playlist)
   - ❌ Diagramme de cas d'usage
   - ❌ Modèle de données (ERD MongoDB)

2. **Documentation accessibilité** (⚠️ IMPORTANT)
   - ❌ Rapport de conformité WCAG 2.1 (AA minimum)
   - ❌ Tests accessibilité (axe-core, WAVE)
   - ❌ Documentation navigation clavier
   - ❌ Tests lecteurs d'écran

3. **Spécifications détaillées** (⚠️ MOYEN)
   - ❌ Cahier des charges formalisé
   - ❌ User stories avec critères d'acceptation
   - ❌ Personas utilisateurs

#### 🔧 **Actions correctives**

```bash
# 1. Créer diagrammes C4 avec PlantUML ou draw.io
docs/architecture/c4-context.puml
docs/architecture/c4-container.puml
docs/architecture/sequence-generation-playlist.puml

# 2. Audit accessibilité
npm install --save-dev @axe-core/react
# Générer rapport WCAG
lighthouse --view --preset=accessibility http://localhost:3000

# 3. Documenter spécifications
docs/specifications/cahier-des-charges.md
docs/specifications/user-stories.md
```

**Priorité** : ⚠️ HAUTE - Critères de validation certification

---

### C15 - Concevoir le cadre technique d'une application IA

#### ✅ **Ce qui est en place**

1. **Architecture technique documentée**
   - 🏗️ Architecture microservices (Backend API + Frontend SPA)
   - 🐳 Docker Compose avec 4 services ([docker-compose.yml](docker-compose.yml))
     * MongoDB 7.0 (base données + cache)
     * Backend FastAPI (Python 3.13)
     * Frontend Next.js 15 (React, TypeScript)
     * Jaeger (monitoring distribué)

2. **Spécifications techniques**
   - 📋 Stack définie : FastAPI, Next.js, MongoDB, DeepSeek, Jamendo API
   - 📋 Choix justifiés dans [MIGRATION_MONGODB.md](MIGRATION_MONGODB.md)
   - 📋 Configuration par environnement (.env)

3. **Outils et méthodes**
   - 🔧 Git (versioning)
   - 🔧 GitHub Actions (CI/CD)
   - 🔧 Docker (conteneurisation)
   - 🔧 pytest + Jest (tests automatisés)
   - 🔧 pylint + ESLint (qualité code)

4. **Faisabilité technique validée**
   - ✅ PoC fonctionnel avec DeepSeek LLM
   - ✅ Cache MongoDB performant (22× plus rapide que Jamendo direct)
   - ✅ APScheduler remplace Azure Functions avec succès

#### ❌ **Ce qui manque**

1. **Document de conception technique formel** (⚠️ MOYEN)
   - ❌ ADR (Architecture Decision Records)
   - ❌ Diagramme d'architecture système complet
   - ❌ Justification choix technologiques formalisée

2. **Analyse de performance** (⚠️ FAIBLE)
   - ❌ Benchmarks de performance (temps réponse, throughput)
   - ❌ Analyse scalabilité (charge maximale supportée)

#### 🔧 **Actions correctives**

```bash
# 1. Créer ADR pour décisions importantes
docs/architecture/adr/001-migration-azure-vers-local.md
docs/architecture/adr/002-choix-deepseek-llm.md
docs/architecture/adr/003-mongodb-cache-strategy.md

# 2. Documenter architecture système
docs/architecture/system-architecture.md  # Diagramme complet
docs/architecture/deployment-architecture.md  # Stratégie déploiement
```

**Priorité** : ⚠️ MOYENNE - Améliore score mais projet fonctionnel

---

### C16 - Coordonner la réalisation technique (Agile/MLOps)

#### ✅ **Ce qui est en place**

1. **Conduite agile de projet**
   - 🔀 Git avec branches feature ([fix_ia_deepseek_change](https://github.com/ABA-DEV-IA/Audiomancy/tree/fix_ia_deepseek_change))
   - 🔀 Pull Requests obligatoires vers `main` (CI/CD configuré)
   - 🔀 Workflow collaboratif GitHub (3 développeurs)

2. **Pratiques DevOps**
   - 🚀 CI/CD automatisé (GitHub Actions)
   - 🐳 Conteneurisation (Docker)
   - 📦 Registry d'images (GitHub Container Registry)
   - 🔄 Livraison continue (push automatique images)

3. **Collaboration**
   - 💬 Issues GitHub pour tracking bugs/features
   - 💬 Documentation technique partagée (README, MIGRATION, CONFIGURATION)

#### ⚠️ **Ce qui est partiel**

1. **Contexte MLOps** (⚠️ CRITIQUE)
   - ⚠️ **Problème** : DeepSeek est une API externe (pas de modèle entraîné localement)
   - ⚠️ Pas de versioning de modèle (pas de modèle à versionner)
   - ⚠️ Pas de monitoring de drift de modèle (modèle distant)
   - ⚠️ Pas de pipeline de réentraînement (pas applicable)

   **Solution de validation** :
   - ✅ Documenter la stratégie MLOps adaptée aux API externes
   - ✅ Monitoring des performances de l'API (latence, qualité réponses)
   - ✅ Fallback strategy si DeepSeek indisponible
   - ✅ Versioning des prompts IA ([system_prompt.txt](backend/app/services/ai/utils/system_prompt.txt))

2. **Méthodologie agile formalisée** (⚠️ MOYEN)
   - ❌ Pas de Kanban board visible (GitHub Projects)
   - ❌ Pas de sprints définis
   - ❌ Pas de retrospectives documentées

#### 🔧 **Actions correctives**

```bash
# 1. Créer documentation MLOps adaptée
docs/mlops/strategy-api-externe.md
docs/mlops/prompt-versioning.md
docs/mlops/monitoring-llm-performance.md

# 2. Implémenter monitoring LLM
backend/app/services/ai/llm_monitoring.py  # Latence, taux erreur, qualité
```

**Priorité** : ⚠️ HAUTE - MLOps doit être documenté pour E4

---

### C17 - Développer les composants techniques et interfaces

#### ✅ **Ce qui est en place**

1. **Composants backend**
   - ✅ API REST complète (FastAPI)
   - ✅ 5 routes principales ([routes/](backend/app/routes/))
     * Jamendo (récupération tracks)
     * AI (génération playlists)
     * User (authentification)
     * Favorite (gestion favoris)
     * Health (monitoring)
   - ✅ Services métier ([services/](backend/app/services/))
   - ✅ Modèles Pydantic validation ([models/](backend/app/models/))

2. **Interfaces frontend**
   - ✅ Application Next.js complète
   - ✅ 6 sections principales
     * Home (accueil)
     * Search (recherche)
     * Generation (création playlist IA)
     * Lecture (player audio)
     * Favorite (favoris)
     * User (profil)
   - ✅ Composants UI réutilisables ([components/ui/](frontend/components/ui/))

3. **Spécifications fonctionnelles respectées**
   - ✅ Génération playlist par IA fonctionnelle
   - ✅ Lecteur audio avec contrôles
   - ✅ Système de favoris persistant
   - ✅ Authentification sécurisée (JWT)

4. **Standards de sécurité**
   - ✅ API Key pour authentification backend
   - ✅ CORS configuré (allowed_origins)
   - ✅ Validation données (Pydantic)
   - ✅ Secrets dans variables d'environnement

5. **Gestion des données**
   - ✅ MongoDB avec indexes optimisés
   - ✅ Cache avec TTL (Time To Live)
   - ✅ Modèles de données structurés

#### ⚠️ **Ce qui est partiel**

1. **Normes d'accessibilité** (⚠️ IMPORTANT)
   - ⚠️ Composants shadcn/ui accessibles MAIS non testés formellement
   - ❌ Pas de tests automatisés accessibilité (axe-core)
   - ❌ Pas de navigation clavier documentée
   - ❌ Pas de support lecteur d'écran vérifié

2. **RGPD / Gestion données personnelles** (⚠️ IMPORTANT)
   - ⚠️ Données utilisateurs stockées (email, favoris)
   - ❌ Pas de politique de confidentialité
   - ❌ Pas de consentement cookies/tracking
   - ❌ Pas de droit à l'oubli implémenté

#### 🔧 **Actions correctives**

```bash
# 1. Tests accessibilité automatisés
npm install --save-dev @axe-core/react jest-axe
# Ajouter tests accessibilité dans frontend/__tests__/

# 2. Documentation RGPD
docs/legal/politique-confidentialite.md
docs/legal/mentions-legales.md
# Implémenter endpoints RGPD
backend/app/routes/user_routes.py  # DELETE /user/{id} (droit à l'oubli)
```

**Priorité** : ⚠️ HAUTE - Accessibilité et RGPD obligatoires

---

### C18 - Automatiser les phases de tests (CI)

#### ✅ **Ce qui est en place**

1. **Tests unitaires automatisés**
   - ✅ Backend : pytest ([backend/app/tests/](backend/app/tests/))
     * Tests routes (API endpoints)
     * Tests services (logique métier)
     * Tests utils (fonctions utilitaires)
     * Tests core (configuration, sécurité)
   - ✅ Frontend : Jest + React Testing Library ([frontend/__tests__/](frontend/__tests__/))

2. **Intégration continue (CI)**
   - ✅ GitHub Actions workflow ([.github/workflows/tests.yml](.github/workflows/tests.yml))
     * Job pylint (qualité code Python)
     * Job pytest (tests unitaires backend)
     * Cache dépendances pip
     * Python 3.13
   - ✅ Workflow appelé sur PR ([.github/workflows/test-all-branches.yml](.github/workflows/test-all-branches.yml))
     * Déclenché sur push (toutes branches sauf main)
     * Déclenché sur pull_request

3. **Qualité code**
   - ✅ pylint configuré (score 10/10 sur nouveaux fichiers)
   - ✅ pytest.ini avec configuration ([backend/pytest.ini](backend/pytest.ini))

#### ❌ **Ce qui manque**

1. **Tests d'intégration** (⚠️ MOYEN)
   - ❌ Pas de tests avec MongoDB réel (mocks uniquement)
   - ❌ Pas de tests end-to-end (Playwright, Cypress)
   - ❌ Pas de tests de performance (locust, k6)

2. **Couverture de tests** (⚠️ MOYEN)
   - ❌ Pas de rapport de couverture (pytest-cov)
   - ❌ Pas de badge de couverture dans README

#### 🔧 **Actions correctives**

```bash
# 1. Ajouter couverture de tests
pip install pytest-cov
pytest --cov=app --cov-report=html --cov-report=term

# 2. Tests d'intégration avec Docker
.github/workflows/integration-tests.yml  # Tests avec docker-compose
```

**Priorité** : ⚠️ MOYENNE - Fonctionnel mais perfectible

---

### C19 - Créer un processus de livraison continue (CD)

#### ✅ **Ce qui est en place**

1. **Chaîne CI/CD complète**
   - ✅ Build automatique sur PR ([backend-deploy.yml](.github/workflows/backend-deploy.yml))
   - ✅ Push images Docker vers GHCR (GitHub Container Registry)
   - ✅ Workflow backend + frontend séparés
   - ✅ Tagging automatique (branch, SHA, latest)

2. **Automatisation déploiement**
   - ✅ Docker metadata action (tags automatiques)
   - ✅ Docker build-push-action avec cache GitHub Actions
   - ✅ Déclenchement sur merge vers main
   - ✅ Déclenchement manuel (workflow_dispatch)

3. **Environnements**
   - ✅ Développement local (docker-compose)
   - ✅ Images de production (GHCR)
   - ⚠️ Environnement de staging manquant

4. **Optimisations**
   - ✅ Cache des layers Docker
   - ✅ Build conditionnel (paths filter)
   - ✅ Build parallèle backend/frontend

#### ⚠️ **Ce qui manque**

1. **Environnements multiples** (⚠️ MOYEN)
   - ❌ Pas d'environnement de staging
   - ❌ Pas de tests de déploiement avant production

2. **Stratégie de déploiement** (⚠️ MOYEN)
   - ❌ Pas de blue-green deployment
   - ❌ Pas de rollback automatique
   - ❌ Pas de canary deployment

3. **Documentation processus** (⚠️ IMPORTANT)
   - ❌ Pas de documentation workflow CD
   - ❌ Pas de runbook déploiement

#### 🔧 **Actions correctives**

```bash
# 1. Créer environnement staging
.github/workflows/deploy-staging.yml  # Deploy vers staging sur PR

# 2. Documenter processus CD
docs/deployment/cd-workflow.md
docs/deployment/rollback-procedure.md
```

**Priorité** : ⚠️ MOYENNE - Fonctionnel, perfectible

---

## 🎯 E5 - Piloter l'Exploitation d'une Application IA

### C20 - Surveiller une application IA (Monitoring/Journalisation)

#### ✅ **Ce qui est en place**

1. **Monitoring applicatif (Jaeger)**
   - ✅ OpenTelemetry configuré ([backend/app/core/telemetry.py](backend/app/core/telemetry.py))
   - ✅ Jaeger all-in-one déployé ([docker-compose.yml](docker-compose.yml))
   - ✅ Traces distribuées avec OTLP (gRPC port 4317)
   - ✅ UI Jaeger accessible (http://localhost:16686)
   - ✅ Service détecté : `audiomancy-backend`

2. **Instrumentation automatique**
   - ✅ FastAPI (requêtes HTTP)
   - ✅ Requests (appels API externes : Jamendo, DeepSeek)
   - ✅ Logging (logs structurés avec trace_id/span_id)

3. **Journalisation structurée**
   - ✅ Logs avec contexte trace (trace_id, span_id)
   - ✅ Niveaux de logs appropriés (INFO, WARNING, ERROR)
   - ✅ Logs scheduler avec émojis pour visibilité

4. **Health checks**
   - ✅ Endpoint `/health/` (santé service)
   - ✅ Endpoint `/health/scheduler` (état APScheduler)
   - ✅ Health checks Docker (MongoDB, Jaeger, Backend)

#### ⚠️ **Ce qui est partiel - CRITIQUE POUR E5**

##### 1. **Feedback Loop MLOps** (⚠️ TRÈS IMPORTANT)

**Problème** : DeepSeek est une API externe → Pas de modèle local à améliorer

**Solution de validation E5** : Documenter une feedback loop adaptée aux API IA externes

```markdown
# Feedback Loop MLOps pour API IA Externe (DeepSeek)

## 1. Collecte des données (Monitoring)
- Latence API DeepSeek (temps réponse)
- Taux d'erreur (500, timeout, rate limit)
- Qualité des réponses (tags générés vs attendus)
- Feedback utilisateur (playlists aimées/ignorées)

## 2. Analyse des performances
- Dashboard Jaeger : traces lentes (> 2s)
- Logs erreurs : patterns d'échec
- Métriques business : % playlists acceptées

## 3. Actions d'amélioration
- Optimisation prompts (system_prompt.txt versionné)
- Ajustement paramètres (température, max_tokens)
- Retry strategy si erreurs
- Fallback sur playlists prédéfinies

## 4. Itération continue
- A/B testing de prompts
- Suivi KPI (satisfaction utilisateur)
- Versioning des prompts avec Git
```

**Fichiers à créer** :
```bash
docs/mlops/feedback-loop-api-externe.md
backend/app/services/ai/llm_metrics.py  # Collecte métriques
backend/app/services/ai/prompt_versions/  # Versioning prompts
```

##### 2. **Normes RGPD** (⚠️ TRÈS IMPORTANT)

**Données personnelles collectées** :
- Email utilisateur (authentification)
- Playlists favorites
- Historique de génération
- Adresse IP (logs)

**Obligations RGPD manquantes** :
- ❌ Politique de confidentialité
- ❌ Consentement explicite collecte données
- ❌ Droit d'accès (export données JSON)
- ❌ Droit à l'oubli (suppression compte)
- ❌ Durée de conservation documentée
- ❌ Sécurisation des données (chiffrement)

**Actions correctives** :
```bash
# 1. Documentation légale
docs/legal/rgpd-compliance.md
docs/legal/politique-confidentialite.md

# 2. Endpoints RGPD
GET /user/data-export  # Export données utilisateur (JSON)
DELETE /user/account   # Droit à l'oubli
POST /user/consent     # Gestion consentements

# 3. Audit RGPD
docs/legal/registre-traitement-donnees.md  # Art. 30 RGPD
```

##### 3. **Détection automatique d'incidents** (⚠️ IMPORTANT)

**En place** :
- ✅ Health checks HTTP (Docker)
- ✅ Logs d'erreurs structurés

**Manquant** :
- ❌ Alertes automatiques (email, Slack)
- ❌ Monitoring métriques système (CPU, RAM, disque)
- ❌ Alerting sur seuils (latence > 2s, erreurs > 5%)

**Actions correctives** :
```bash
# 1. Prometheus + Grafana (optionnel mais recommandé)
docker-compose.yml  # Ajouter services prometheus + grafana

# 2. Alerting simple
backend/app/core/alerting.py  # Envoi email si erreur critique
```

#### 🔧 **Actions correctives C20** (PRIORITÉ MAXIMALE E5)

```bash
# 1. [URGENT] Documenter feedback loop MLOps
docs/mlops/feedback-loop-api-externe.md

# 2. [URGENT] Implémenter conformité RGPD
docs/legal/rgpd-compliance.md
backend/app/routes/user_routes.py  # Endpoints RGPD

# 3. [IMPORTANT] Métriques LLM
backend/app/services/ai/llm_metrics.py
# Collecter : latence, erreurs, qualité réponses

# 4. [MOYEN] Dashboard monitoring
docker-compose.yml  # Ajouter Prometheus + Grafana
```

**Priorité** : 🔴 CRITIQUE - Obligatoire pour valider E5

---

### C21 - Résoudre les incidents techniques

#### ✅ **Ce qui est en place**

1. **Historique de résolution**
   - ✅ Git commits documentent corrections
     * Exemple : "Fix: jamendo_service.py AttributeError 'dict' has no attribute 'model_dump'"
     * Exemple : "Fix: ai_routes.py async/await chain"
   - ✅ Branches feature pour isoler corrections
   - ✅ Pull Requests avec contexte

2. **Code de qualité**
   - ✅ Tests unitaires pour éviter régressions
   - ✅ CI/CD bloque merge si tests échouent
   - ✅ Pylint à 10/10 pour nouveau code

3. **Gestion des erreurs**
   - ✅ Try/except avec logs détaillés
   - ✅ HTTP status codes appropriés
   - ✅ Messages d'erreur explicites

#### ❌ **Ce qui manque - CRITIQUE POUR E5**

1. **Documentation incidents** (⚠️ TRÈS IMPORTANT)
   - ❌ Pas de registre d'incidents formel
   - ❌ Pas de post-mortem documentés
   - ❌ Pas de runbook résolution problèmes courants

2. **Processus de résolution** (⚠️ IMPORTANT)
   - ❌ Pas de workflow incident formalisé
   - ❌ Pas de SLA (temps de résolution)
   - ❌ Pas de classification gravité incidents

#### 🔧 **Actions correctives C21** (PRIORITÉ HAUTE E5)

##### 1. **Créer un registre d'incidents**

```markdown
# docs/incidents/REGISTRE.md

## Incidents Résolus

### INC-001 - AttributeError sur cache MongoDB (27/01/2026)

**Gravité** : 🔴 HAUTE (bloque génération playlists)

**Symptômes** :
- Erreur `AttributeError: 'dict' object has no attribute 'model_dump'`
- Ligne 106 de `jamendo_service.py`

**Cause racine** :
- Cache MongoDB retournait des dicts
- Code appelait `.model_dump()` sur des dicts au lieu de Pydantic models

**Solution** :
1. Retiré appel `.model_dump()` ligne 106
2. Cache retourne maintenant directement des dicts
3. Conversion en `GeneratedTrack` dans `ai_routes.py`

**Fichiers modifiés** :
- `backend/app/services/jamendo/jamendo_service.py`
- `backend/app/routes/ai_routes.py`

**Tests de non-régression** :
- Test cache hit : `test_jamendo_service.py::test_cache_returns_dict`

**Temps de résolution** : 1h30

**Commit** : `b5200cc`

---

### INC-002 - Scheduler past_due detection manquante (27/01/2026)

**Gravité** : 🟡 MOYENNE (fonctionnel mais monitoring incomplet)

**Symptômes** :
- Jobs APScheduler s'exécutent sans détection de retard
- Pas de warning si job en retard comme Azure Functions

**Cause racine** :
- Paramètre `run_date` pas utilisé dans `update_daily_categories()`

**Solution** :
1. Ajout comparaison `run_date` avec `datetime.now()`
2. Warning si délai > 60s
3. Documentation Azure Functions équivalence

**Fichiers modifiés** :
- `backend/app/core/scheduler.py`

**Tests de non-régression** :
- Test manuel : arrêt scheduler 5 min, redémarrage → warning

**Temps de résolution** : 45min

**Commit** : `b5200cc`
```

##### 2. **Créer des runbooks de dépannage**

```markdown
# docs/incidents/RUNBOOK-COMMON-ISSUES.md

## Problèmes Courants et Solutions

### 1. API DeepSeek timeout ou erreur 429

**Symptômes** : Génération playlist échoue avec timeout ou rate limit

**Diagnostic** :
```bash
# Vérifier logs backend
docker logs audiomancy-backend | grep DeepSeek

# Vérifier traces Jaeger
http://localhost:16686 → chercher traces > 30s
```

**Solutions** :
1. Vérifier quota DeepSeek : https://platform.deepseek.com/usage
2. Augmenter timeout dans `deepseek_client.py`
3. Implémenter retry avec backoff exponentiel
4. Fallback sur playlists prédéfinies

---

### 2. MongoDB cache invalide

**Symptômes** : Tracks retournées obsolètes ou vides

**Diagnostic** :
```bash
# Connexion MongoDB
docker exec -it audiomancy-mongodb mongosh

# Vérifier cache
use audiomancy
db.cached_tracks.find().limit(5)

# Vérifier TTL indexes
db.cached_tracks.getIndexes()
```

**Solutions** :
```javascript
// Purger cache expiré
db.cached_tracks.deleteMany({ createdAt: { $lt: new Date(Date.now() - 24*60*60*1000) } })

// Réindexer TTL
db.cached_tracks.dropIndex("createdAt_1")
db.cached_tracks.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 })
```

---

### 3. Jaeger traces manquantes

**Symptômes** : Aucune trace dans Jaeger UI

**Diagnostic** :
```bash
# Vérifier Jaeger status
curl http://localhost:14269

# Vérifier logs backend
docker logs audiomancy-backend | grep OTLP
```

**Solutions** :
1. Vérifier variable d'environnement `JAEGER_ENDPOINT=http://jaeger:4317`
2. Redémarrer backend : `docker-compose restart backend`
3. Vérifier réseau Docker : `docker network inspect audiomancy-network`
```

##### 3. **Processus de gestion incident**

```markdown
# docs/incidents/PROCESSUS-INCIDENT.md

## Workflow de Gestion d'Incidents

### Étape 1 : Détection
- Health checks alertent (erreur HTTP, scheduler down)
- Logs ERROR dans backend
- Utilisateur reporte bug (GitHub Issues)

### Étape 2 : Classification
- 🔴 **CRITIQUE** : Service down, perte données
- 🟠 **HAUTE** : Fonctionnalité majeure cassée
- 🟡 **MOYENNE** : Fonctionnalité mineure cassée
- 🟢 **FAIBLE** : Bug cosmétique

### Étape 3 : Investigation
1. Consulter Jaeger (traces HTTP)
2. Consulter logs Docker (`docker logs`)
3. Reproduire localement
4. Identifier cause racine

### Étape 4 : Résolution
1. Créer branche `fix/INC-XXX-description`
2. Implémenter correction
3. Ajouter test non-régression
4. Pull Request avec référence incident

### Étape 5 : Documentation
1. Compléter registre d'incidents (`docs/incidents/REGISTRE.md`)
2. Mettre à jour runbook si nécessaire
3. Post-mortem si incident critique

### SLA (Service Level Agreement)
- 🔴 CRITIQUE : Résolution < 2h
- 🟠 HAUTE : Résolution < 4h
- 🟡 MOYENNE : Résolution < 24h
- 🟢 FAIBLE : Résolution < 1 semaine
```

#### 🔧 **Actions immédiates C21**

```bash
# 1. [URGENT] Créer structure documentation incidents
mkdir -p docs/incidents
touch docs/incidents/REGISTRE.md
touch docs/incidents/RUNBOOK-COMMON-ISSUES.md
touch docs/incidents/PROCESSUS-INCIDENT.md

# 2. [URGENT] Documenter incidents passés
# Parcourir git log et documenter corrections majeures

# 3. [IMPORTANT] Créer templates
docs/incidents/TEMPLATE-POST-MORTEM.md
docs/incidents/TEMPLATE-RUNBOOK.md
```

**Priorité** : 🔴 CRITIQUE - Obligatoire pour valider E5

---

## 🎯 Plan d'Action Priorisé

### 🔴 URGENT (1-2 jours) - Bloque validation E5

1. **C20 - Feedback Loop MLOps**
   - [ ] Créer `docs/mlops/feedback-loop-api-externe.md`
   - [ ] Implémenter `backend/app/services/ai/llm_metrics.py`
   - [ ] Documenter stratégie MLOps pour API externes

2. **C20 - Conformité RGPD**
   - [ ] Créer `docs/legal/rgpd-compliance.md`
   - [ ] Implémenter endpoints RGPD (export données, droit à l'oubli)
   - [ ] Rédiger politique de confidentialité

3. **C21 - Documentation incidents**
   - [ ] Créer `docs/incidents/REGISTRE.md` avec incidents passés
   - [ ] Créer `docs/incidents/RUNBOOK-COMMON-ISSUES.md`
   - [ ] Créer `docs/incidents/PROCESSUS-INCIDENT.md`

### 🟠 IMPORTANT (3-5 jours) - Améliore score E4

4. **C14 - Diagrammes architecture**
   - [ ] Créer diagramme C4 Context
   - [ ] Créer diagramme C4 Container
   - [ ] Créer diagramme séquence génération playlist

5. **C14 - Accessibilité**
   - [ ] Audit WCAG avec Lighthouse
   - [ ] Implémenter tests axe-core
   - [ ] Documenter navigation clavier

6. **C17 - Tests accessibilité**
   - [ ] Ajouter `@axe-core/react` et tests automatisés
   - [ ] Vérifier support lecteurs d'écran

### 🟡 MOYEN (1-2 semaines) - Perfectionnement

7. **C16 - MLOps documentation**
   - [ ] Créer `docs/mlops/strategy-api-externe.md`
   - [ ] Implémenter versioning prompts
   - [ ] Dashboard métriques LLM

8. **C18 - Couverture tests**
   - [ ] Configurer pytest-cov
   - [ ] Badge couverture README
   - [ ] Tests d'intégration Docker

9. **C19 - Environnement staging**
   - [ ] Workflow deploy-staging.yml
   - [ ] Documentation processus CD

### 🟢 FAIBLE (Nice to have)

10. **C15 - ADR documentation**
    - [ ] ADR migration Azure → Local
    - [ ] ADR choix DeepSeek LLM

11. **C20 - Monitoring avancé**
    - [ ] Prometheus + Grafana
    - [ ] Alerting automatique

---

## 📈 Estimation Temps Total

| Priorité | Tâches | Temps estimé |
|----------|--------|--------------|
| 🔴 URGENT | 3 blocs E5 | 12-16h |
| 🟠 IMPORTANT | 3 blocs E4 | 16-20h |
| 🟡 MOYEN | 3 blocs perfectionnement | 20-24h |
| 🟢 FAIBLE | 2 blocs optionnels | 8-12h |

**Total validation E4+E5** : 28-36h (1 semaine pleine)  
**Validation minimale E5** : 12-16h (2 jours)

---

## 💡 Explication E5 (Réponse à ta question)

### Pourquoi E5 est différent de E4 ?

**E4** = Développer l'application (coder, tester, déployer)  
**E5** = Piloter l'exploitation (surveiller, maintenir, améliorer)

### C20 - Que faire concrètement ?

**Objectif** : Prouver que tu sais **surveiller** une app IA en production

**Ce qui est attendu** :
1. **Monitoring technique** ✅ Tu l'as (Jaeger)
   - Traces HTTP
   - Latence API
   - Logs structurés

2. **Feedback loop MLOps** ⚠️ **C'est ça le challenge !**
   - Problème : DeepSeek = API externe, tu n'entraînes pas de modèle
   - Solution : Documenter comment tu **améliores quand même** les réponses IA
     * Collecter métriques qualité (playlists aimées/ignorées)
     * Ajuster prompts (versioning de `system_prompt.txt`)
     * A/B testing de prompts différents
     * Monitoring latence/erreurs DeepSeek

3. **RGPD** ⚠️ **Obligatoire !**
   - Tu stockes emails + favoris = données personnelles
   - Il faut :
     * Politique de confidentialité (doc)
     * Droit d'export données (endpoint `/user/data-export`)
     * Droit à l'oubli (endpoint `DELETE /user/account`)
     * Documenter durée conservation

4. **Détection incidents automatique**
   - Health checks ✅ (tu l'as)
   - Alerting ⚠️ (manque email/Slack si down)

**Fichiers à créer pour valider C20** :
```
docs/mlops/feedback-loop-api-externe.md    ← Comment améliorer l'IA
docs/legal/rgpd-compliance.md               ← Conformité données perso
backend/app/services/ai/llm_metrics.py      ← Collecte métriques IA
backend/app/routes/user_routes.py           ← Endpoints RGPD
```

### C21 - Que faire concrètement ?

**Objectif** : Prouver que tu sais **résoudre** et **documenter** les bugs

**Ce qui est attendu** :
1. **Registre d'incidents** ⚠️ **Le plus important !**
   - Créer `docs/incidents/REGISTRE.md`
   - Documenter TOUS les bugs corrigés :
     * Date
     * Symptômes
     * Cause racine
     * Solution
     * Temps de résolution
     * Commit Git

2. **Runbook de dépannage**
   - Créer `docs/incidents/RUNBOOK-COMMON-ISSUES.md`
   - Lister problèmes courants avec solutions
   - Exemples :
     * DeepSeek timeout → retry strategy
     * MongoDB cache vide → purger cache
     * Jaeger pas de traces → vérifier JAEGER_ENDPOINT

3. **Processus de résolution**
   - Créer `docs/incidents/PROCESSUS-INCIDENT.md`
   - Workflow : Détection → Classification → Investigation → Résolution → Documentation
   - SLA (temps max de résolution selon gravité)

**Fichiers à créer pour valider C21** :
```
docs/incidents/REGISTRE.md                  ← Historique bugs résolus
docs/incidents/RUNBOOK-COMMON-ISSUES.md     ← Solutions problèmes courants
docs/incidents/PROCESSUS-INCIDENT.md        ← Workflow résolution
```

### En résumé E5

**C20** = "Surveiller" → Tu dois montrer que tu **collectes des métriques** et que tu les **utilises pour améliorer**

**C21** = "Résoudre" → Tu dois montrer que tu **documentes** les bugs et leurs solutions

**Le piège** : Beaucoup de candidats codent bien (E4) mais oublient de **documenter** l'exploitation (E5).

**La solution** : Créer une **documentation formelle** de :
- Comment tu surveilles l'IA (C20)
- Comment tu résous les bugs (C21)

---

## ✅ Checklist Validation Finale

### E4 (C14-C19)
- [ ] C14 : Diagrammes UML/C4 créés ✅
- [ ] C14 : Audit accessibilité WCAG réalisé ✅
- [ ] C15 : ADR décisions techniques documentés ✅
- [ ] C16 : MLOps pour API externe documenté ✅
- [ ] C17 : Tests accessibilité automatisés ✅
- [ ] C17 : Endpoints RGPD implémentés ✅
- [ ] C18 : Couverture tests > 80% ✅
- [ ] C19 : Environnement staging fonctionnel ✅

### E5 (C20-C21) - PRIORITAIRE
- [ ] C20 : Feedback loop MLOps documenté ✅
- [ ] C20 : Conformité RGPD complète ✅
- [ ] C20 : Métriques LLM collectées ✅
- [ ] C21 : Registre incidents créé ✅
- [ ] C21 : Runbook dépannage créé ✅
- [ ] C21 : Processus incident formalisé ✅

---

**Document créé le** : 27 janvier 2026  
**Dernière mise à jour** : 27 janvier 2026  
**Auteur** : GitHub Copilot + Équipe Audiomancy
