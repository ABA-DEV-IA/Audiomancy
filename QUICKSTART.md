# 🚀 Quick Start - Monitoring Audiomancy

## ⚡ Démarrage Ultra-Rapide (3 étapes)

### 1️⃣ Copier le fichier d'environnement
```bash
cp .env.monitoring .env
```

### 2️⃣ Démarrer la stack complète
```bash
./start-monitoring.sh
```

### 3️⃣ Accéder à Grafana
```
http://localhost:19091
Login: admin / admin
```

---

## 📊 Services Disponibles

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Grafana** | http://localhost:19091 | Dashboards (admin/admin) |
| 📈 **Prometheus** | http://localhost:19090 | Métriques |
| 🚨 **AlertManager** | http://localhost:19093 | Alertes |
| 📋 **Loki** | http://localhost:19100 | Logs |
| 🐒 **Chaosd UI** | http://localhost:19096 | Tests de chaos |
| 🎵 **Backend** | http://localhost:8000 | API Audiomancy |
| 🎨 **Frontend** | http://localhost:3000 | Interface web |

---

## 🎯 Premiers Tests

### ✅ Vérifier que tout fonctionne
```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml ps
```

### 📊 Voir les dashboards
1. Ouvrir http://localhost:19091
2. Aller dans Dashboards > Audiomancy

### 🔍 Consulter les logs
1. Dans Grafana, cliquer sur Explore (icône boussole)
2. Sélectionner **Loki**
3. Essayer: `{container="audiomancy-backend"}`

### 🐒 Test de chaos
1. Ouvrir http://localhost:19096
2. Container Chaos > Stop > audiomancy-backend > 30s
3. Observer dans Grafana le service qui s'arrête et redémarre

---

## 📚 Documentation Complète

- 📖 [Guide complet](MONITORING_SETUP.md)
- 📝 [Changements effectués](CHANGEMENTS_MONITORING.md)
- 🔧 [Documentation monitoring](monitoring/README.md)

---

## 🛑 Arrêter les Services

```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml down
```

---

**Prêt à l'emploi ! 🎉**
