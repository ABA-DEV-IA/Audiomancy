# 📊 Monitoring Stack - Audiomancy

> **Stack de monitoring complète intégrant Prometheus, Grafana, Loki, AlertManager et Chaos Engineering**

## 🎯 Objectif

Fournir une solution de monitoring production-ready pour l'application Audiomancy, conforme aux compétences de certification **C20** (Surveillance d'application IA) et **C21** (Résolution d'incidents techniques).

---

## ⚡ Quick Start (30 secondes)

```bash
# 1. Configurer l'environnement
cp .env.monitoring .env

# 2. Démarrer tout
./start-monitoring.sh

# 3. Accéder à Grafana
# http://localhost:19091 (admin/admin)
```

**C'est tout ! 🎉**

---

## 📚 Documentation

| Document | Description | Quand l'utiliser |
|----------|-------------|------------------|
| **[QUICKSTART.md](QUICKSTART.md)** | Démarrage en 3 étapes | Premier démarrage |
| **[MONITORING_SETUP.md](MONITORING_SETUP.md)** | Guide complet détaillé | Configuration avancée |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Schémas avant/après | Comprendre l'architecture |
| **[CHANGEMENTS_MONITORING.md](CHANGEMENTS_MONITORING.md)** | Résumé des modifications | Voir ce qui a changé |

---

## 🏗️ Architecture

### Services Applicatifs
- **MongoDB** - Base de données
- **Backend** - API FastAPI (port 8000)
- **Frontend** - Interface Next.js (port 3000)

### Services de Monitoring
- **Prometheus** - Collecte de métriques (port 19090)
- **Grafana** - Dashboards de visualisation (port 19091)
- **Loki** - Agrégation de logs (port 19100)
- **Promtail** - Collecte de logs Docker
- **AlertManager** - Gestion des alertes (port 19093)
- **Pushgateway** - Métriques batch (port 19092)
- **Chaosd + UI** - Tests de chaos engineering (ports 19095-19096)
- **AlertManager-Discord** - Notifications Discord (port 19094)

### Réseau
Tous les services communiquent via `audiomancy_audiomancy-network`

---

## 📊 Dashboards Disponibles

### 1. Audiomancy Backend
- Taux de requêtes HTTP par endpoint
- Latence P50/P95/P99
- Taux d'erreurs 5xx
- Métriques DeepSeek (tokens, latence API)
- CPU/Mémoire

### 2. Audiomancy Frontend
- Requêtes HTTP client
- Distribution codes HTTP
- Latence API backend
- Heap memory Node.js

### 3. Monitoring d'Incidents
- Santé globale du système
- État des services (UP/DOWN)
- Logs agrégés
- Alertes actives

---

## 🚨 Alertes Configurées

### Critiques 🔴
- **ServiceDown** - Service indisponible > 2 min
- **HighErrorRate** - Taux d'erreur > 5% pendant 3 min
- **ModelAccuracyDrop** - Précision ML < 85% pendant 10 min

### Warnings 🟡
- **HighLatency** - P95 > 2s pendant 5 min
- **HighCPUUsage** - CPU > 80% pendant 5 min
- **HighMemoryUsage** - Mémoire > 2GB pendant 5 min

---

## 🐒 Chaos Engineering

Tests de résilience disponibles :
- **Container Chaos** : Stop, restart, kill
- **Network Chaos** : Latence, perte de paquets
- **Stress Chaos** : CPU, mémoire, I/O

**Interface :** http://localhost:19096

---

## 🔧 Commandes Utiles

### Démarrage
```bash
# Tout ensemble
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Application seule
docker compose up -d

# Monitoring seul
docker compose -f docker-compose.monitoring.yml up -d
```

### Gestion
```bash
# Voir le statut
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml ps

# Voir les logs
docker compose -f docker-compose.monitoring.yml logs -f

# Redémarrer un service
docker compose -f docker-compose.monitoring.yml restart prometheus

# Arrêter tout
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml down
```

### Inspection
```bash
# Vérifier les targets Prometheus
curl http://localhost:19090/api/v1/targets | jq

# Vérifier les alertes actives
curl http://localhost:19090/api/v1/alerts | jq

# Tester Loki
curl -G -s "http://localhost:19100/loki/api/v1/query_range" \
  --data-urlencode 'query={container="audiomancy-backend"}' | jq
```

---

## 📝 Logs (Loki)

### Exemples de Requêtes LogQL

```logql
# Tous les logs du backend
{container="audiomancy-backend"}

# Logs d'erreur uniquement
{container="audiomancy-backend"} |= "ERROR"

# Logs avec niveau ERROR extrait
{container="audiomancy-backend"} | json | level="ERROR"

# Compter les erreurs sur 1h
sum(count_over_time({container="audiomancy-backend"} |= "ERROR" [1h]))
```

**Accès :** Grafana > Explore > Loki

---

## 🔐 Conformité RGPD

✅ **Anonymisation automatique** dans Promtail :
- Emails → `***EMAIL_REDACTED***`
- Passwords/Tokens → `***REDACTED***`

✅ **Rétention limitée** :
- Logs : 31 jours
- Métriques : 15 jours

---

## 🎓 Compétences Démontrées

### C20 : Surveillance d'application IA
- ✅ Monitoring complet (Prometheus, Grafana)
- ✅ Journalisation centralisée (Loki, Promtail)
- ✅ Détection automatique d'incidents (10+ alertes)
- ✅ Conformité RGPD (anonymisation, rétention)
- ✅ Feedback loop MLOps (métriques DeepSeek)

### C21 : Résolution d'incidents
- ✅ Chaos engineering (Chaosd)
- ✅ Documentation complète (runbook, RCA)
- ✅ Tests de résilience
- ✅ Monitoring post-incident

---

## 🆘 Support

**Problème ?** Consultez la section Troubleshooting dans [MONITORING_SETUP.md](MONITORING_SETUP.md#troubleshooting)

**Questions ?** Voir la documentation complète dans [monitoring/](monitoring/)

---

## ✅ Checklist Post-Installation

- [ ] Tous les services démarrés
- [ ] Grafana accessible (http://localhost:19091)
- [ ] Prometheus targets UP
- [ ] Dashboards Audiomancy visibles
- [ ] Logs visibles dans Loki
- [ ] Test de chaos réussi

---

## 📦 Fichiers du Projet

```
Audiomancy/
├── docker-compose.yml              # Application
├── docker-compose.monitoring.yml   # Monitoring
├── .env.monitoring                 # Configuration
├── start-monitoring.sh             # Script de démarrage
├── monitoring/                     # Dossier config
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── ...
└── docs/
    ├── QUICKSTART.md
    ├── MONITORING_SETUP.md
    ├── ARCHITECTURE.md
    └── CHANGEMENTS_MONITORING.md
```

---

**Version :** 1.0  
**Dernière mise à jour :** 2025-02-08  
**Statut :** ✅ Production-ready  
**Conforme :** C20, C21
