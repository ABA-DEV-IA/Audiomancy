# 🎯 Plan d'Action Certification E4/E5 - Audiomancy

**Date de création** : 27 janvier 2026  
**Branche actuelle** : `fix_ia_deepseek_change`  
**Objectif** : Finaliser documentation et fonctionnalités pour validation E4 + E5

---

## ✅ Ce qui a été fait (Session actuelle)

### 🏗️ Infrastructure & Migration
- ✅ Migration complète Azure → Local (MongoDB, DeepSeek, APScheduler, Prometheus/Grafana/Loki)
- ✅ Docker Compose avec 6+ services (MongoDB, Backend, Frontend, Prometheus, Grafana, Loki, AlertManager)
- ✅ Cache MongoDB avec TTL (22× plus rapide que Jamendo direct)
- ✅ APScheduler remplace Azure Functions (daily categories)
- ✅ Prometheus/Grafana/Loki monitoring stack actif (metrics, dashboards, logs)
- ✅ DeepSeek LLM fonctionnel (ReAct agent)

### 🔧 CI/CD
- ✅ GitHub Actions workflows configurés
  - `tests.yml` : pylint + pytest
  - `test-all-branches.yml` : tests sur PR
  - `backend-deploy.yml` : Build + Push GHCR
  - `frontend-deploy.yml` : Build + Push GHCR
- ✅ Pull Request requis avant merge vers main
- ✅ Build conditionnel (paths filter)
- ✅ Cache GitHub Actions pour accélérer builds

### 🎤 Nettoyage Azure
- ✅ Bouton micro (Azure Speech TTS) désactivé
- ✅ Routes speech-token commentées (backend + frontend)
- ✅ Dépendances Azure commentées dans requirements.txt
- ✅ Code Azure restant = legacy inactif (non importé)

### 📝 Code Quality
- ✅ Nouveaux fichiers pylint 10/10
  - `backend/app/core/scheduler.py` (306 lignes, docstrings complètes)
  - `backend/app/routes/health_routes.py` (type hints, exemples)
- ✅ Docstrings anglais avec exemples d'utilisation
- ✅ Type hints complets (Python 3.11+)
- ✅ Gestion d'erreurs spécifique (requests.exceptions)

### 📚 Documentation
- ✅ `COMPETENCES_E4_E5.md` : Analyse complète compétences
- ✅ `MIGRATION_MONGODB.md` : Migration Azure documentée
- ✅ `CONFIGURATION.md` : Guide configuration environnements
- ✅ `README.md` : Architecture et installation

---

## 🚧 Ce qui reste à faire

### 🔴 URGENT - Bloc E5 (2 jours) - PRIORITÉ MAXIMALE

#### Jour 1 : C20 - Surveillance et Monitoring

**1. Feedback Loop MLOps (4-5h)**
```bash
# Créer documentation stratégie MLOps pour API externe
touch docs/mlops/feedback-loop-api-externe.md

# Contenu attendu :
# - Collecte métriques DeepSeek (latence, erreurs, qualité)
# - Versioning prompts (Git)
# - A/B testing prompts
# - Dashboard métriques LLM
# - Itération continue basée sur feedback utilisateur
```

**2. Métriques LLM (3-4h)**
```bash
# Implémenter collecte métriques LLM
touch backend/app/services/ai/llm_metrics.py

# Fonctionnalités :
# - Latence API DeepSeek
# - Taux d'erreur (timeout, 429, 500)
# - Qualité tags générés (validation schema)
# - Logs structurés pour analyse
```

**3. Conformité RGPD (4-5h)**
```bash
# Documentation RGPD
mkdir -p docs/legal
touch docs/legal/rgpd-compliance.md
touch docs/legal/politique-confidentialite.md

# Endpoints RGPD dans user_routes.py
# GET /user/data-export     → Export données utilisateur (JSON)
# DELETE /user/account      → Droit à l'oubli
# POST /user/consent        → Gestion consentements
# GET /user/data-retention  → Durée conservation

# Documentation :
# - Registre traitement données (Art. 30 RGPD)
# - Politique confidentialité
# - CGU avec consentement
```

**Total Jour 1** : 11-14h

---

#### Jour 2 : C21 - Résolution Incidents

**1. Registre d'incidents (3-4h)**
```bash
# Créer structure documentation
mkdir -p docs/incidents
touch docs/incidents/REGISTRE.md

# Documenter incidents passés (git log) :
# - INC-001 : AttributeError cache MongoDB (jamendo_service.py)
# - INC-002 : Async/await chain AI routes
# - INC-003 : Scheduler past_due detection
# - INC-004 : Prometheus metrics export issues
# - INC-005 : CI/CD push direct vers main

# Format par incident :
# - Date, gravité, symptômes
# - Cause racine
# - Solution appliquée
# - Fichiers modifiés, commit
# - Tests non-régression
# - Temps de résolution
```

**2. Runbook dépannage (2-3h)**
```bash
touch docs/incidents/RUNBOOK-COMMON-ISSUES.md

# Problèmes courants avec solutions :
# - DeepSeek timeout → retry strategy
# - MongoDB cache vide → purge commande
# - Prometheus pas de métriques → vérifier exposition /metrics endpoint
# - APScheduler job bloqué → restart scheduler
# - CORS errors → vérifier allowed_origins
# - Tests pytest fail → vérifier .env.test
```

**3. Processus incidents (2h)**
```bash
touch docs/incidents/PROCESSUS-INCIDENT.md
touch docs/incidents/TEMPLATE-POST-MORTEM.md

# Workflow formalisé :
# 1. Détection (health checks, logs, user report)
# 2. Classification (🔴 CRITIQUE, 🟠 HAUTE, 🟡 MOYENNE, 🟢 FAIBLE)
# 3. Investigation (Grafana dashboards, Loki logs, Prometheus metrics, reproduction)
# 4. Résolution (branche fix/, PR, tests)
# 5. Documentation (registre, runbook)

# SLA définis :
# - 🔴 CRITIQUE : < 2h
# - 🟠 HAUTE : < 4h
# - 🟡 MOYENNE : < 24h
# - 🟢 FAIBLE : < 1 semaine
```

**Total Jour 2** : 7-9h

**Total Bloc E5** : 18-23h → **2 jours pleins**

---

### 🟠 IMPORTANT - Bloc E4 Complémentaire (3-4 jours)

#### C14 - Analyse du Besoin (1 jour)

**1. Diagrammes architecture (4-5h)**
```bash
mkdir -p docs/architecture
touch docs/architecture/c4-context.puml
touch docs/architecture/c4-container.puml
touch docs/architecture/c4-component.puml
touch docs/architecture/sequence-generation-playlist.puml
touch docs/architecture/erd-mongodb.puml

# Outils recommandés :
# - PlantUML (c4-plantuml)
# - draw.io / Excalidraw
# - Mermaid (dans Markdown)

# Diagrammes attendus :
# - C4 Context : Audiomancy + acteurs externes (Jamendo, DeepSeek)
# - C4 Container : Backend, Frontend, MongoDB, Prometheus, Grafana, Loki
# - C4 Component : Routes, Services, Models (backend)
# - Séquence : User → Frontend → Backend → DeepSeek → Jamendo
# - ERD : Collections MongoDB (users, favorites, cached_tracks)
```

**2. Audit accessibilité WCAG (3-4h)**
```bash
touch docs/accessibility/wcag-audit-report.md
touch docs/accessibility/keyboard-navigation.md

# Tests automatisés :
npm install --save-dev @axe-core/react lighthouse-ci

# Lighthouse audit
npx lighthouse --view --preset=accessibility http://localhost:3000

# Axe-core tests
# Ajouter tests dans frontend/__tests__/accessibility/

# Vérifications manuelles :
# - Navigation clavier (Tab, Enter, Esc)
# - Lecteur d'écran (NVDA, VoiceOver)
# - Contraste couleurs (WCAG AA)
# - Labels ARIA
# - Focus visible
```

---

#### C17 - Développement (1 jour)

**1. Tests accessibilité automatisés (3-4h)**
```bash
# Frontend
cd frontend
npm install --save-dev @axe-core/react jest-axe

# Créer tests accessibilité
mkdir -p __tests__/accessibility
touch __tests__/accessibility/home.accessibility.test.tsx
touch __tests__/accessibility/generation.accessibility.test.tsx
touch __tests__/accessibility/player.accessibility.test.tsx

# Exemple test :
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

test('Home page should have no accessibility violations', async () => {
  const { container } = render(<HomePage />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**2. Endpoints RGPD implémentés (3-4h)**
```python
# backend/app/routes/user_routes.py

@router.get("/user/data-export")
async def export_user_data(current_user: User = Depends(get_current_user)):
    """
    Export all user data in JSON format (RGPD Art. 20).
    """
    # Récupérer toutes les données utilisateur
    # Favoris, playlists générées, historique
    # Retourner JSON téléchargeable

@router.delete("/user/account")
async def delete_user_account(current_user: User = Depends(get_current_user)):
    """
    Delete user account and all associated data (RGPD Art. 17).
    """
    # Supprimer utilisateur + favoris + cache
    # Logs d'audit
    # Confirmation email

@router.post("/user/consent")
async def update_consent(consent: ConsentModel):
    """
    Update user consent for data processing (RGPD Art. 7).
    """
    # Stocker consentements (analytics, marketing, etc.)
    # Horodatage

@router.get("/user/data-retention")
async def get_data_retention_policy():
    """
    Return data retention policy (RGPD Art. 13).
    """
    return {
        "user_account": "Jusqu'à suppression",
        "favorites": "Jusqu'à suppression",
        "cache_tracks": "24 heures (TTL)",
        "logs": "30 jours"
    }
```

---

#### C18 - Tests Automatisés (1 jour)

**1. Couverture de tests (2-3h)**
```bash
cd backend
pip install pytest-cov

# Générer rapport couverture
pytest --cov=app --cov-report=html --cov-report=term --cov-report=xml

# Objectif : > 80% couverture
# Créer badge couverture pour README

# Ajouter dans .github/workflows/tests.yml
- name: Generate coverage report
  run: pytest --cov=app --cov-report=xml
  
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

**2. Tests d'intégration Docker (3-4h)**
```bash
# Créer workflow tests intégration
touch .github/workflows/integration-tests.yml

# Tests avec docker-compose :
# - Démarrer stack complète
# - Attendre healthchecks
# - Exécuter tests API (requests)
# - Vérifier MongoDB peuplé
# - Vérifier Prometheus collecte métriques
# - Arrêter stack

# Exemple test :
def test_full_stack_integration():
    # Health checks
    assert requests.get("http://localhost:8000/health/").status_code == 200
    
    # Generate playlist
    response = requests.post("http://localhost:8000/ai/generate-playlist", ...)
    assert response.status_code == 200
    
    # Vérifier cache MongoDB
    # Vérifier métriques Prometheus
```

---

#### C19 - Livraison Continue (0.5 jour)

**1. Environnement staging (2-3h)**
```bash
# Créer workflow deploy staging
touch .github/workflows/deploy-staging.yml

# Déploiement automatique sur PR merged vers develop
# URL staging : https://staging.audiomancy.com (exemple)
# Base de données staging séparée

# Documentation processus
touch docs/deployment/cd-workflow.md
touch docs/deployment/rollback-procedure.md
touch docs/deployment/environments.md  # dev, staging, prod
```

---

### 🟡 MOYEN - Améliorations (2-3 jours)

#### C16 - MLOps Avancé (1 jour)

**1. Dashboard métriques LLM (4-5h)**
```bash
# Prometheus + Grafana (optionnel mais valorisant)
# Ajouter services dans docker-compose.yml

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

# Métriques exposées :
# - Latence DeepSeek (histogram)
# - Taux d'erreur (counter)
# - Playlists générées (counter)
# - Cache hit ratio (gauge)
```

**2. Versioning prompts (2-3h)**
```bash
mkdir -p backend/app/services/ai/prompt_versions
touch backend/app/services/ai/prompt_versions/v1_baseline.txt
touch backend/app/services/ai/prompt_versions/v2_optimized.txt

# Git tracking des versions
# A/B testing avec flag feature
# Métriques par version
```

---

#### C15 - Documentation Technique (1 jour)

**1. ADR (Architecture Decision Records) (3-4h)**
```bash
mkdir -p docs/architecture/adr
touch docs/architecture/adr/001-migration-azure-vers-local.md
touch docs/architecture/adr/002-choix-deepseek-llm.md
touch docs/architecture/adr/003-mongodb-cache-strategy.md
touch docs/architecture/adr/004-apscheduler-vs-celery.md
touch docs/architecture/adr/005-prometheus-monitoring-local.md

# Format ADR :
# - Contexte
# - Décision
# - Conséquences
# - Alternatives considérées
# - Statut (accepted, deprecated, superseded)
```

**2. Architecture système complète (2-3h)**
```bash
touch docs/architecture/system-architecture.md
touch docs/architecture/deployment-architecture.md
touch docs/architecture/data-flow-diagram.md

# Schémas attendus :
# - Vue d'ensemble système
# - Flux de données
# - Architecture de déploiement
# - Stratégie scaling
```

---

### 🟢 FAIBLE - Nice to Have (1-2 jours)

#### Monitoring Avancé (0.5 jour)
```bash
# Alerting automatique
touch backend/app/core/alerting.py

# Notifications :
# - Email si service down > 5min
# - Slack webhook pour erreurs critiques
# - SMS pour incidents production (optionnel)

# Configuration alertes Grafana
# Seuils : latence > 2s, erreur rate > 5%, CPU > 80%
```

#### Tests Performance (0.5 jour)
```bash
# Locust ou k6 pour load testing
pip install locust

touch backend/tests/load/locustfile.py

# Scénarios :
# - 100 users simultanés génération playlist
# - 1000 requests/s recherche tracks
# - Vérifier temps réponse < 500ms (p95)
```

#### Documentation Utilisateur (0.5 jour)
```bash
touch docs/user-guide/README.md
touch docs/user-guide/generation-playlist.md
touch docs/user-guide/gestion-favoris.md
touch docs/user-guide/troubleshooting.md

# Guide utilisateur final (non technique)
# Screenshots, tutoriels vidéo
```

---

## 📋 Checklist de Validation Finale

### E4 - Développer une Application IA

**C14 - Analyser le besoin**
- [ ] Diagrammes C4 (Context, Container, Component)
- [ ] Diagramme séquence génération playlist
- [ ] ERD MongoDB
- [ ] Audit WCAG avec rapport
- [ ] Documentation navigation clavier
- [ ] Cahier des charges formalisé (optionnel)

**C15 - Concevoir le cadre technique**
- [ ] ADR décisions architecturales (5 minimum)
- [ ] Document architecture système
- [ ] Justification choix technologiques
- [ ] Analyse de performance (benchmarks)

**C16 - Coordonner (Agile/MLOps)**
- [ ] Documentation stratégie MLOps API externe
- [ ] Versioning prompts (Git)
- [ ] Métriques LLM collectées
- [ ] GitHub Projects ou Kanban visible
- [ ] Sprints/retrospectives documentés (optionnel)

**C17 - Développer**
- [ ] Tests accessibilité automatisés (axe-core)
- [ ] Endpoints RGPD complets
- [ ] Documentation RGPD (politique confidentialité)
- [ ] Registre traitement données (Art. 30)
- [ ] Composants accessibles vérifiés

**C18 - Tests automatisés**
- [ ] Couverture tests > 80%
- [ ] Tests d'intégration Docker
- [ ] Badge couverture dans README
- [ ] Tests e2e (Playwright/Cypress - optionnel)

**C19 - Livraison continue**
- [ ] Environnement staging fonctionnel
- [ ] Documentation workflow CD
- [ ] Procédure rollback
- [ ] Documentation environnements (dev/staging/prod)

---

### E5 - Piloter l'Exploitation d'une Application IA

**C20 - Surveiller**
- [ ] ✅ Prometheus/Grafana/Loki monitoring stack actif (metrics, dashboards, logs)
- [ ] ✅ Health checks (`/health/`, `/health/scheduler`)
- [ ] 🔴 Feedback loop MLOps documenté (API externe)
- [ ] 🔴 Métriques LLM collectées (`llm_metrics.py`)
- [ ] 🔴 Documentation RGPD complète
- [ ] 🔴 Endpoints RGPD fonctionnels
- [ ] 🟡 Prometheus + Grafana (optionnel)
- [ ] 🟡 Alerting automatique (optionnel)

**C21 - Résoudre incidents**
- [ ] 🔴 Registre d'incidents créé (`REGISTRE.md`)
- [ ] 🔴 Runbook dépannage (`RUNBOOK-COMMON-ISSUES.md`)
- [ ] 🔴 Processus incident formalisé (`PROCESSUS-INCIDENT.md`)
- [ ] 🔴 Templates post-mortem
- [ ] 🟠 SLA définis par gravité
- [ ] 🟠 Workflow résolution documenté

---

## ⏱️ Estimation Totale

| Priorité | Bloc | Temps estimé | Jours |
|----------|------|--------------|-------|
| 🔴 URGENT | E5 complet | 18-23h | 2-3 jours |
| 🟠 IMPORTANT | E4 compléments | 24-32h | 3-4 jours |
| 🟡 MOYEN | Perfectionnement | 16-20h | 2-3 jours |
| 🟢 FAIBLE | Nice to have | 8-12h | 1-2 jours |

**Total validation complète** : 66-87h → **8-11 jours**  
**Validation minimale E4+E5** : 42-55h → **5-7 jours**

---

## 🚀 Ordre d'Exécution Recommandé

### Semaine 1 : E5 + E4 Critical (Validation minimale)

**Jours 1-2** : E5 - Surveillance et Incidents
- Feedback loop MLOps
- Métriques LLM
- RGPD (documentation + endpoints)
- Registre incidents
- Runbooks dépannage

**Jours 3-4** : E4 - Diagrammes et Accessibilité
- Diagrammes C4 + séquence
- Audit WCAG
- Tests accessibilité automatisés

**Jour 5** : E4 - Tests et CI
- Couverture tests > 80%
- Tests d'intégration Docker

---

### Semaine 2 : Perfectionnement (Si temps disponible)

**Jours 6-7** : MLOps avancé + ADR
- Dashboard métriques (Prometheus/Grafana)
- Versioning prompts
- ADR décisions architecturales

**Jours 8-9** : Staging et Monitoring
- Environnement staging
- Alerting automatique
- Tests performance

**Jour 10** : Revue finale
- Checklist validation complète
- Documentation manquante
- Tests de recette

---

## 📝 Fichiers à Créer (Liste complète)

### Documentation MLOps
```
docs/mlops/
├── feedback-loop-api-externe.md       🔴 URGENT
├── strategy-api-externe.md            🟡 MOYEN
├── prompt-versioning.md               🟡 MOYEN
└── monitoring-llm-performance.md      🟠 IMPORTANT
```

### Documentation RGPD
```
docs/legal/
├── rgpd-compliance.md                 🔴 URGENT
├── politique-confidentialite.md       🔴 URGENT
├── mentions-legales.md                🟠 IMPORTANT
└── registre-traitement-donnees.md     🔴 URGENT
```

### Documentation Incidents
```
docs/incidents/
├── REGISTRE.md                        🔴 URGENT
├── RUNBOOK-COMMON-ISSUES.md           🔴 URGENT
├── PROCESSUS-INCIDENT.md              🔴 URGENT
├── TEMPLATE-POST-MORTEM.md            🟠 IMPORTANT
└── TEMPLATE-RUNBOOK.md                🟢 FAIBLE
```

### Architecture
```
docs/architecture/
├── c4-context.puml                    🟠 IMPORTANT
├── c4-container.puml                  🟠 IMPORTANT
├── c4-component.puml                  🟠 IMPORTANT
├── sequence-generation-playlist.puml  🟠 IMPORTANT
├── erd-mongodb.puml                   🟠 IMPORTANT
├── system-architecture.md             🟡 MOYEN
├── deployment-architecture.md         🟡 MOYEN
└── adr/
    ├── 001-migration-azure-local.md   🟡 MOYEN
    ├── 002-choix-deepseek-llm.md      🟡 MOYEN
    ├── 003-mongodb-cache-strategy.md  🟡 MOYEN
    ├── 004-apscheduler-vs-celery.md   🟡 MOYEN
    └── 005-prometheus-monitoring.md   🟡 MOYEN
```

### Accessibilité
```
docs/accessibility/
├── wcag-audit-report.md               🟠 IMPORTANT
├── keyboard-navigation.md             🟠 IMPORTANT
└── screen-reader-tests.md             🟡 MOYEN
```

### Déploiement
```
docs/deployment/
├── cd-workflow.md                     🟡 MOYEN
├── rollback-procedure.md              🟡 MOYEN
├── environments.md                    🟡 MOYEN
└── scaling-strategy.md                🟢 FAIBLE
```

### Code Backend
```
backend/app/services/ai/
├── llm_metrics.py                     🔴 URGENT
└── prompt_versions/
    ├── v1_baseline.txt                🟡 MOYEN
    └── v2_optimized.txt               🟡 MOYEN

backend/app/routes/
└── user_routes.py                     🔴 URGENT (ajout endpoints RGPD)

backend/app/core/
└── alerting.py                        🟢 FAIBLE
```

### Tests Frontend
```
frontend/__tests__/accessibility/
├── home.accessibility.test.tsx        🟠 IMPORTANT
├── generation.accessibility.test.tsx  🟠 IMPORTANT
└── player.accessibility.test.tsx      🟠 IMPORTANT
```

### CI/CD
```
.github/workflows/
├── integration-tests.yml              🟠 IMPORTANT
└── deploy-staging.yml                 🟡 MOYEN
```

### Monitoring (Optionnel)
```
monitoring/
├── prometheus.yml                     🟡 MOYEN
├── grafana-dashboards/
│   ├── llm-metrics.json               🟡 MOYEN
│   └── system-metrics.json            🟡 MOYEN
└── alertmanager.yml                   🟢 FAIBLE
```

---

## 💡 Conseils pour la Prochaine Session

### 1. Ordre de Priorité Strict
Toujours commencer par 🔴 URGENT (E5), car c'est le plus critique et le moins évident à faire. E4 est plus facile car tu as déjà le code.

### 2. Templates Réutilisables
Créer des templates pour gagner du temps :
- Template ADR
- Template post-mortem
- Template runbook
- Template test accessibilité

### 3. Outils Recommandés

**Diagrammes** :
- PlantUML avec c4-plantuml : `brew install plantuml`
- Mermaid dans Markdown (support GitHub)
- draw.io / Excalidraw pour wireframes

**Tests Accessibilité** :
```bash
npm install -g @axe-core/cli
axe http://localhost:3000 --save audit-report.json
```

**WCAG Audit** :
```bash
lighthouse --preset=accessibility http://localhost:3000 --output=html
```

**Couverture Tests** :
```bash
pytest --cov=app --cov-report=html --cov-report=term
open htmlcov/index.html
```

### 4. Git Workflow

**Créer branches par bloc** :
```bash
git checkout -b feat/mlops-feedback-loop
git checkout -b feat/rgpd-compliance
git checkout -b feat/incident-documentation
git checkout -b feat/wcag-accessibility
```

**Commits atomiques** :
```bash
git commit -m "docs: Add MLOps feedback loop for external API"
git commit -m "feat: Implement LLM metrics collection"
git commit -m "docs: Create incident registry with past issues"
git commit -m "feat: Add GDPR data export endpoint"
```

### 5. Tests Incrémentaux

Ne pas attendre la fin pour tester. Après chaque bloc :
```bash
# Backend
pytest --cov=app
pylint backend/app/

# Frontend
npm test
npm run lint

# Docker
docker-compose up -d
curl http://localhost:8000/health/
```

---

## 🎯 Critères de Succès

### Validation E5 (Minimale)
- [ ] Document feedback loop MLOps existe et est complet
- [ ] Métriques LLM collectées et visualisables
- [ ] RGPD : politique + 3 endpoints fonctionnels
- [ ] Registre incidents avec 5+ incidents documentés
- [ ] Runbook avec 10+ problèmes courants
- [ ] Processus incident formalisé avec SLA

### Validation E4 (Complète)
- [ ] 5 diagrammes architecture (C4 + séquence + ERD)
- [ ] Audit WCAG avec rapport > 90 score
- [ ] Tests accessibilité automatisés (0 violations)
- [ ] Couverture tests > 80%
- [ ] 5 ADR documentant décisions majeures
- [ ] Environnement staging fonctionnel

### Certification Ready
- [ ] Tous les 🔴 URGENT complétés
- [ ] 80% des 🟠 IMPORTANT complétés
- [ ] Documentation claire et professionnelle
- [ ] Code production-ready (pylint 10/10, tests passent)
- [ ] Démo fonctionnelle sans bugs bloquants

---

## 📞 Questions / Points de Blocage Potentiels

### Q1 : "Je n'ai pas de modèle entraîné localement, comment valider MLOps ?"
**R** : Documenter la stratégie MLOps adaptée aux API externes. Tu montres que tu collectes métriques, optimises prompts, et as un processus itératif. C'est accepté par les jurys si bien documenté.

### Q2 : "RGPD, je dois vraiment implémenter tout ça ?"
**R** : OUI. Dès que tu stockes email + favoris, tu es soumis RGPD. Minimum requis :
- Politique de confidentialité (doc)
- Export données (endpoint)
- Droit à l'oubli (endpoint)
- Registre traitement (doc)

### Q3 : "Je n'ai jamais fait de diagrammes C4, c'est dur ?"
**R** : Non, avec PlantUML c'est simple. Exemples :
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(user, "Utilisateur")
System(audiomancy, "Audiomancy", "Plateforme de playlists IA")
System_Ext(jamendo, "Jamendo API", "Catalogue musique")
System_Ext(deepseek, "DeepSeek API", "LLM génération tags")

Rel(user, audiomancy, "Génère playlist")
Rel(audiomancy, jamendo, "Récupère tracks")
Rel(audiomancy, deepseek, "Génère tags musicaux")
@enduml
```

### Q4 : "Combien de temps réellement pour tout finir ?"
**R** : Validation minimale E4+E5 = 5-7 jours (42-55h). Avec perfectionnement = 8-11 jours (66-87h). Focus sur 🔴 URGENT d'abord.

---

## 🔗 Ressources Utiles

### Documentation Référence
- **WCAG 2.1** : https://www.w3.org/WAI/WCAG21/quickref/
- **RGPD** : https://www.cnil.fr/fr/reglement-europeen-protection-donnees
- **C4 Model** : https://c4model.com/
- **ADR** : https://adr.github.io/

### Outils
- **PlantUML** : https://plantuml.com/
- **Axe DevTools** : https://www.deque.com/axe/devtools/
- **Lighthouse** : https://developer.chrome.com/docs/lighthouse/
- **pytest-cov** : https://pytest-cov.readthedocs.io/

### Exemples
- **ADR Examples** : https://github.com/joelparkerhenderson/architecture-decision-record
- **C4 Examples** : https://github.com/plantuml-stdlib/C4-PlantUML/tree/master/samples
- **RGPD Checklist** : https://www.cnil.fr/fr/principes-cles/reglement-europeen-se-preparer-en-6-etapes

---

**Dernière mise à jour** : 27 janvier 2026 23:45  
**Prochaine session** : Commencer par 🔴 URGENT Bloc E5 (feedback loop + RGPD)  
**Branch actuelle** : `fix_ia_deepseek_change` (à merger après validation)

**Bon courage pour la suite ! 🚀**
