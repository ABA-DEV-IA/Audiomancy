# 🏗️ Architecture Audiomancy - Avant/Après

## 📊 AVANT - Configuration Fragmentée

```
Audiomancy/
├── docker-compose.yml (APPLICATION + MONITORING mélangés)
│   ├── mongodb
│   ├── backend
│   ├── frontend
│   ├── prometheus          ❌ Référence ./monitoring/ (inexistant)
│   ├── grafana             ❌ Référence ./monitoring/ (inexistant)
│   ├── loki                ❌ Référence ./monitoring/ (inexistant)
│   ├── promtail            ❌ Référence ./monitoring/ (inexistant)
│   ├── alertmanager        ❌ Référence ./monitoring/ (inexistant)
│   └── pushgateway         ❌ Référence ./monitoring/ (inexistant)
│
└── OrionTrader_monitoring-main/  ❌ Nom incohérent
    ├── docker-compose.yaml       ⚠️  Nom containers: orion_*
    ├── prometheus/               ✅ Config existe
    ├── grafana/                  ✅ Config existe
    ├── loki/                     ✅ Config existe
    └── ...

❌ PROBLÈMES:
- Fichiers de config monitoring inexistants (./monitoring/)
- Deux docker-compose qui font la même chose
- Nommage incohérent (audiomancy-* vs orion_*)
- Impossible de démarrer séparément app et monitoring
```

---

## ✅ APRÈS - Architecture Modulaire

```
Audiomancy/
│
├── 📦 APPLICATION (docker-compose.yml)
│   ├── mongodb              ✅ Base de données
│   ├── backend              ✅ API FastAPI
│   └── frontend             ✅ Interface Next.js
│
├── 📊 MONITORING (docker-compose.monitoring.yml)
│   ├── prometheus           ✅ Collecte métriques
│   ├── grafana              ✅ Visualisation
│   ├── loki                 ✅ Agrégation logs
│   ├── promtail             ✅ Collecte logs Docker
│   ├── alertmanager         ✅ Gestion alertes
│   ├── alertmanager-discord ✅ Notifications Discord
│   ├── pushgateway          ✅ Métriques batch
│   ├── chaosd               ✅ Chaos engineering
│   └── chaosd-ui            ✅ Interface web chaos
│
├── 🔧 CONFIGURATION
│   ├── .env.monitoring      ✅ Variables monitoring
│   ├── monitoring/          ✅ Dossier config (renommé)
│   │   ├── prometheus/
│   │   ├── grafana/
│   │   ├── loki/
│   │   ├── promtail/
│   │   ├── alertmanager/
│   │   ├── alertmanager-discord/
│   │   ├── chaosd-daemon/
│   │   └── chaosd-ui/
│   │
│   └── 📚 DOCUMENTATION
│       ├── QUICKSTART.md          ✅ Démarrage rapide
│       ├── MONITORING_SETUP.md    ✅ Guide complet
│       ├── CHANGEMENTS_MONITORING.md ✅ Résumé modifications
│       ├── ARCHITECTURE.md        ✅ Ce fichier
│       └── start-monitoring.sh    ✅ Script de démarrage

✅ AVANTAGES:
- Séparation claire app/monitoring
- Nommage cohérent (audiomancy-* / audiomancy-monitoring-*)
- Fichiers de config présents et fonctionnels
- Démarrage modulaire (app seule, monitoring seul, ou ensemble)
- Documentation complète
```

---

## 🔗 Architecture Réseau

```
┌─────────────────────────────────────────────────────────────────┐
│              audiomancy_audiomancy-network (Docker)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐        ┌──────────────────────────────┐   │
│  │  APPLICATION    │        │      MONITORING STACK        │   │
│  ├─────────────────┤        ├──────────────────────────────┤   │
│  │                 │        │                              │   │
│  │  MongoDB        │◄───────┤  Promtail (collecte logs)    │   │
│  │  :27017         │        │                              │   │
│  │                 │        │  ┌────────────────────────┐  │   │
│  │  Backend        │◄───────┼──┤ Prometheus (scrape)    │  │   │
│  │  :8000          │  GET   │  │ /metrics               │  │   │
│  │  /metrics       ├────────┼─►│ :9090                  │  │   │
│  │                 │        │  └────────────────────────┘  │   │
│  │  Frontend       │◄───────┤                              │   │
│  │  :3000          │  GET   │  ┌────────────────────────┐  │   │
│  │  /api/metrics   ├────────┼─►│ Grafana                │  │   │
│  │                 │        │  │ :9091                  │  │   │
│  └─────────────────┘        │  │ Dashboards + Explore   │  │   │
│                              │  └────────────────────────┘  │   │
│                              │                              │   │
│                              │  Loki :3100                  │   │
│                              │  AlertManager :9093          │   │
│                              │  Pushgateway :9092           │   │
│                              │  Chaosd :31767               │   │
│                              │  Chaosd UI :8080             │   │
│                              └──────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          │                                     │
          │ localhost:3000                      │ localhost:19091
          │ localhost:8000                      │ localhost:19090
          ▼                                     ▼
    ┌─────────────┐                      ┌──────────────┐
    │  Utilisateur │                      │  DevOps      │
    │  Web App     │                      │  Monitoring  │
    └─────────────┘                      └──────────────┘
```

---

## 📦 Flux de Données

### 1. Métriques (Prometheus)
```
Backend/Frontend
    │
    │ Expose /metrics (Prometheus format)
    │
    ▼
Prometheus
    │ Scrape toutes les 15s
    │ Évalue les règles d'alerte
    │ Stocke dans TSDB
    │
    ▼
Grafana
    │ Query PromQL
    │ Affiche dans dashboards
    │
    ▼
Utilisateur
```

### 2. Logs (Loki)
```
Tous les containers Docker
    │
    │ stdout/stderr
    │
    ▼
Promtail (Docker socket)
    │ Collecte les logs
    │ Anonymise (RGPD)
    │ Label par container/service
    │
    ▼
Loki
    │ Stocke avec index
    │ Rétention 31 jours
    │
    ▼
Grafana Explore
    │ Query LogQL
    │ Filtres et recherche
    │
    ▼
Utilisateur
```

### 3. Alertes (AlertManager)
```
Prometheus
    │ Évalue les règles (alert.rules.yml)
    │ ServiceDown, HighErrorRate, etc.
    │
    ▼
AlertManager
    │ Route les alertes
    │ Gère les silences
    │ Agrège et déduplique
    │
    ├──► AlertManager-Discord
    │       │ Forward vers Discord webhook
    │       ▼
    │    Canal Discord
    │
    └──► Grafana Alerting
            │ Affiche dans l'UI
            ▼
         Utilisateur
```

### 4. Chaos Engineering (Chaosd)
```
Utilisateur
    │
    ▼
Chaosd UI :8080
    │ Interface web
    │ Sélection attaque (stop, latency, stress)
    │
    ▼
Chaosd Daemon :31767
    │ API REST
    │ Accès Docker socket (privileged)
    │
    ▼
Containers Docker
    │ Arrêt, redémarrage, injection latence, etc.
    │
    ▼
Prometheus + Grafana
    │ Observation des métriques
    │ Déclenchement alertes
    │
    ▼
Validation résilience
```

---

## 🚀 Modes de Démarrage

### Mode 1 : Tout ensemble (recommandé)
```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```
**Usage :** Développement avec monitoring complet

### Mode 2 : Application seule
```bash
docker compose up -d
```
**Usage :** Tests backend/frontend sans overhead monitoring

### Mode 3 : Monitoring seul
```bash
docker compose -f docker-compose.monitoring.yml up -d
```
**Usage :** Tests de la stack monitoring, maintenance

### Mode 4 : Via script
```bash
./start-monitoring.sh         # Tout
./start-monitoring.sh app     # App seule
./start-monitoring.sh monitoring # Monitoring seul
```
**Usage :** Démarrage simplifié avec validation

---

## 📊 Ports Utilisés

### Application
| Port | Service | Protocole |
|------|---------|-----------|
| 3000 | Frontend | HTTP |
| 8000 | Backend | HTTP |
| 27017 | MongoDB | TCP |

### Monitoring
| Port | Service | Protocole |
|------|---------|-----------|
| 19090 | Prometheus | HTTP |
| 19091 | Grafana | HTTP |
| 19092 | Pushgateway | HTTP |
| 19093 | AlertManager | HTTP |
| 19094 | AlertManager-Discord | HTTP |
| 19095 | Chaosd API | HTTP |
| 19096 | Chaosd UI | HTTP |
| 19100 | Loki | HTTP |

**Note :** Ports monitoring préfixés `190xx` pour éviter conflits

---

## 🔐 Sécurité

### Réseau Docker Interne
- Tous les services sur `audiomancy_audiomancy-network`
- Communication inter-services via noms DNS
- Pas d'exposition externe (sauf ports mappés)

### Authentification
- **Grafana** : admin/admin (à changer)
- **Prometheus** : Pas d'auth (accès localhost uniquement)
- **AlertManager** : Pas d'auth (accès localhost uniquement)
- **Loki** : Pas d'auth (accès via Grafana)

### RGPD
- Anonymisation automatique dans Promtail
- Rétention limitée (31 jours logs)
- Aucune donnée personnelle en clair

---

## 📚 Documentation Associée

1. **[QUICKSTART.md](QUICKSTART.md)** - Démarrage en 3 étapes
2. **[MONITORING_SETUP.md](MONITORING_SETUP.md)** - Guide complet
3. **[CHANGEMENTS_MONITORING.md](CHANGEMENTS_MONITORING.md)** - Résumé modifications
4. **[monitoring/README.md](monitoring/README.md)** - Documentation stack
5. **[monitoring/MONITORING_GUIDE.md](monitoring/MONITORING_GUIDE.md)** - Guide C20/C21

---

**Version :** 1.0  
**Architecture :** Modulaire, Docker Compose multi-fichiers  
**Prêt pour :** Développement, Tests, Production (avec docker-compose.prod.yml)
