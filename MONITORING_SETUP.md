# 📊 Guide de Configuration du Monitoring Audiomancy

## 🎯 Objectif

Ce guide explique comment démarrer et utiliser la stack de monitoring complète d'Audiomancy, incluant :
- **Prometheus** - Collecte de métriques
- **Grafana** - Dashboards de visualisation
- **Loki** - Agrégation de logs
- **AlertManager** - Gestion des alertes
- **Chaosd** - Tests de chaos engineering

---

## 📁 Structure du Projet

```
Audiomancy/
├── docker-compose.yml              # Services applicatifs (MongoDB, Backend, Frontend)
├── docker-compose.monitoring.yml   # Services de monitoring
├── .env.monitoring                 # Variables d'environnement monitoring
├── monitoring/                     # Configuration monitoring
│   ├── prometheus/
│   │   ├── prometheus.local.yml         # Config Prometheus (dev)
│   │   └── alert.rules.local.yml        # Règles d'alertes
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── datasources/local/       # Datasources (Prometheus, Loki)
│   │   │   └── dashboards/              # Config dashboards
│   │   └── dashboards/                  # Fichiers JSON dashboards
│   ├── loki/
│   │   └── loki-config.yml              # Config Loki
│   ├── promtail/
│   │   └── promtail-config.yml          # Config collecte logs
│   ├── alertmanager/
│   │   └── alertmanager.yml             # Config alertes
│   ├── alertmanager-discord/            # Webhook Discord
│   ├── chaosd-daemon/                   # Daemon chaos engineering
│   └── chaosd-ui/                       # Interface web chaos
└── incidents/                      # Documentation incidents (C21)
```

---

## 🚀 Démarrage Rapide

### 1. Configuration Initiale

```bash
# 1. Copier le fichier d'environnement
cp .env.monitoring .env

# 2. (Optionnel) Éditer .env pour personnaliser les ports ou ajouter le webhook Discord
nano .env
```

### 2. Démarrer l'Application + Monitoring

**Option A : Tout démarrer ensemble (recommandé)**
```bash
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

**Option B : Démarrer séparément**
```bash
# D'abord l'application
docker-compose up -d

# Puis le monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### 3. Vérifier le Statut

```bash
# Voir tous les services
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml ps

# Voir les logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

---

## 🌐 Accès aux Services

| Service | URL | Identifiants | Description |
|---------|-----|--------------|-------------|
| **Grafana** | http://localhost:19091 | admin / admin | Dashboards et visualisation |
| **Prometheus** | http://localhost:19090 | - | Métriques et requêtes PromQL |
| **AlertManager** | http://localhost:19093 | - | Gestion des alertes |
| **Pushgateway** | http://localhost:19092 | - | Métriques batch/cronjobs |
| **Loki** | http://localhost:19100 | - | API de logs |
| **Chaosd UI** | http://localhost:19096 | - | Interface tests de chaos |

---

## 📊 Dashboards Grafana Disponibles

### 1. **Audiomancy Backend**
- Taux de requêtes HTTP par endpoint
- Latence (P50, P95, P99)
- Taux d'erreurs 5xx
- Métriques DeepSeek (tokens, latence API)
- Utilisation CPU/Mémoire

**Accès :** Grafana > Dashboards > Audiomancy > Backend

### 2. **Audiomancy Frontend**
- Requêtes HTTP client
- Distribution des codes HTTP (2xx, 4xx, 5xx)
- Latence API backend
- Heap memory usage Node.js

**Accès :** Grafana > Dashboards > Audiomancy > Frontend

### 3. **Monitoring d'Incidents**
- Vue d'ensemble de la santé système
- État des services (UP/DOWN)
- Logs agrégés de tous les services
- Alertes actives

**Accès :** Grafana > Dashboards > Monitoring > Incidents

---

## 🚨 Alertes Configurées

### Alertes Critiques 🔴
- **ServiceDown** - Service indisponible > 2 minutes
- **HighErrorRate** - Taux d'erreur > 5% pendant 3 minutes
- **ModelAccuracyDrop** - Précision modèle ML < 85% pendant 10 minutes

### Alertes Warning 🟡
- **HighLatency** - Latence P95 > 2s pendant 5 minutes
- **HighCPUUsage** - CPU > 80% pendant 5 minutes
- **HighMemoryUsage** - Mémoire > 2GB pendant 5 minutes

**Vérifier les alertes :** http://localhost:19090/alerts

---

## 🔍 Consultation des Logs (Loki)

### Via Grafana Explore

1. Ouvrir Grafana : http://localhost:19091
2. Menu gauche > **Explore** (icône boussole)
3. Sélectionner **Loki** dans le dropdown

### Exemples de Requêtes LogQL

```logql
# Tous les logs du backend
{container="audiomancy-backend"}

# Logs d'erreur uniquement
{container="audiomancy-backend"} |= "ERROR"

# Logs avec niveau ERROR extrait
{container="audiomancy-backend"} | json | level="ERROR"

# Logs du frontend
{container="audiomancy-frontend"}

# Logs MongoDB
{container="audiomancy-mongodb"}

# Tous les logs du projet Audiomancy
{project="audiomancy"}

# Compter les erreurs sur 1h
sum(count_over_time({container="audiomancy-backend"} |= "ERROR" [1h]))
```

---

## 🐒 Tests de Chaos Engineering

### Via l'Interface Web (Chaosd UI)

1. Accéder à http://localhost:19096
2. Sélectionner le type d'attaque :
   - **Container Chaos** : Stop, restart, kill containers
   - **Network Chaos** : Latence, perte de paquets
   - **Stress Chaos** : CPU, mémoire, I/O
3. Choisir la cible (ex: `audiomancy-backend`)
4. Configurer durée et intensité
5. Lancer et observer dans Grafana

### Exemple : Test de Résilience Complet

```bash
# 1. Ouvrir Grafana et le dashboard Backend
# http://localhost:19091

# 2. Arrêter le backend pendant 3 minutes (via Chaosd UI)
# Container Chaos > Stop > audiomancy-backend > Duration: 3m

# 3. Observer :
# ✅ Alerte "ServiceDown" se déclenche après 2 minutes
# ✅ Logs d'erreur dans Loki
# ✅ Service redémarre automatiquement (restart: unless-stopped)
# ✅ Métriques reviennent à la normale

# 4. Documenter dans un rapport d'incident (voir incidents/)
```

---

## 🛠️ Commandes Utiles

### Gestion des Services

```bash
# Démarrer tout
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Arrêter tout
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml down

# Arrêter uniquement le monitoring
docker-compose -f docker-compose.monitoring.yml down

# Redémarrer un service spécifique
docker-compose -f docker-compose.monitoring.yml restart prometheus

# Voir les logs d'un service
docker-compose -f docker-compose.monitoring.yml logs -f grafana

# Rebuild après modifications
docker-compose -f docker-compose.monitoring.yml up -d --build
```

### Inspection

```bash
# Statut des services
docker-compose -f docker-compose.monitoring.yml ps

# Vérifier les targets Prometheus
curl http://localhost:19090/api/v1/targets | jq

# Vérifier les alertes actives
curl http://localhost:19090/api/v1/alerts | jq

# Tester Loki
curl -G -s "http://localhost:19100/loki/api/v1/query_range" \
  --data-urlencode 'query={container="audiomancy-backend"}' | jq
```

### Nettoyage

```bash
# Arrêter et supprimer les volumes (⚠️ perte de données)
docker-compose -f docker-compose.monitoring.yml down -v

# Supprimer uniquement les données Prometheus
docker volume rm audiomancy-monitoring-prometheus-data

# Supprimer uniquement les données Grafana
docker volume rm audiomancy-monitoring-grafana-data
```

---

## 🔧 Troubleshooting

### Grafana : "Datasource not found"

**Cause :** Les datasources ne sont pas chargées

**Solution :**
```bash
# Vérifier les volumes montés
docker inspect audiomancy-monitoring-grafana | grep -A 10 Mounts

# Redémarrer Grafana
docker-compose -f docker-compose.monitoring.yml restart grafana
```

### Prometheus : Targets "DOWN"

**Cause :** Services applicatifs pas démarrés ou réseau incorrect

**Solution :**
```bash
# Vérifier que l'application tourne
docker-compose ps

# Vérifier le réseau
docker network inspect audiomancy_audiomancy-network

# Vérifier les endpoints métriques
curl http://localhost:8000/metrics    # Backend
curl http://localhost:3000/api/metrics # Frontend
```

### Promtail : "Entry too far behind"

**Cause :** Loki rejette les logs trop anciens (> 1h)

**Solution :** Attendre quelques minutes, Promtail enverra les nouveaux logs. C'est normal au démarrage.

### Loki : Pas de logs visibles

**Cause :** Promtail ne collecte pas les logs

**Solution :**
```bash
# Vérifier les logs de Promtail
docker-compose -f docker-compose.monitoring.yml logs promtail

# Vérifier l'accès au Docker socket
docker exec audiomancy-monitoring-promtail ls -la /var/run/docker.sock
```

### Chaosd : "Permission denied"

**Cause :** Chaosd nécessite l'accès privilégié au Docker socket

**Solution :** Le service est déjà configuré avec `privileged: true`. Si ça ne fonctionne pas :
```bash
# Vérifier les permissions
ls -la /var/run/docker.sock

# Rebuild le service
docker-compose -f docker-compose.monitoring.yml up -d --build chaosd
```

---

## 📚 Documentation Complémentaire

- **README Monitoring** : [monitoring/README.md](monitoring/README.md)
- **Guide de Monitoring** : [monitoring/MONITORING_GUIDE.md](monitoring/MONITORING_GUIDE.md)
- **Processus d'Incidents** : [docs/incidents/PROCESSUS-INCIDENT.md](docs/incidents/PROCESSUS-INCIDENT.md)
- **Runbook Problèmes Courants** : [docs/incidents/RUNBOOK-COMMON-ISSUES.md](docs/incidents/RUNBOOK-COMMON-ISSUES.md)

---

## 🎓 Compétences Démontrées (Certification)

### C20 : Surveillance d'application IA
✅ Techniques de monitorage (Prometheus, Grafana)
✅ Journalisation centralisée (Loki, Promtail)
✅ Détection automatique d'incidents (AlertManager + 10+ règles)
✅ Conformité RGPD (anonymisation, rétention 31j)
✅ Feedback loop MLOps (métriques DeepSeek, drift detection)

### C21 : Résolution d'incidents techniques
✅ Modifications au code documentées (Git commits)
✅ Documentation complète (RCA, actions préventives)
✅ Tests de validation (chaos engineering, Chaosd)
✅ Fonctionnement opérationnel vérifié (monitoring post-correction)

---

## 🔐 Sécurité & RGPD

### Anonymisation Automatique (Promtail)
- Emails : `***EMAIL_REDACTED***`
- Passwords/Tokens : `***REDACTED***`
- Pattern matching sur données sensibles

### Rétention des Données
- **Logs** : 31 jours (configurable dans loki-config.yml)
- **Métriques** : 15 jours par défaut (configurable dans prometheus.yml)

### Accès Sécurisé
- Grafana : Authentification obligatoire (admin/admin par défaut, à changer)
- AlertManager : Pas d'authentification (accessible uniquement en local)
- Chaosd : Privilégié, limiter l'accès en production

---

## 📝 Notes

- **Première connexion Grafana** : Utilisez admin/admin, vous serez invité à changer le mot de passe
- **Discord Webhook** : Optionnel, configurer dans .env si vous voulez des notifications Discord
- **Production** : Utilisez docker-compose.monitoring.prod.yml avec WireGuard VPN (voir monitoring/README.md)
- **Volumes persistants** : Les données sont conservées dans des volumes Docker nommés

---

## ✅ Checklist Post-Installation

- [ ] Tous les services démarrés (`docker-compose ps`)
- [ ] Grafana accessible (http://localhost:19091)
- [ ] Prometheus targets UP (http://localhost:19090/targets)
- [ ] Dashboards Audiomancy visibles dans Grafana
- [ ] Logs visibles dans Grafana Explore (Loki)
- [ ] AlertManager accessible (http://localhost:19093)
- [ ] Chaosd UI accessible (http://localhost:19096)
- [ ] Test de chaos réussi (arrêter un service et vérifier l'alerte)

---

**Version :** 1.0
**Dernière mise à jour :** 2025-02-08
**Conforme aux compétences :** C20, C21
