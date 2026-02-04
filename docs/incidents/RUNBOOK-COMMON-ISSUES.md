# Runbook - Problèmes Courants Audiomancy

Guide de dépannage rapide pour les incidents techniques récurrents.

---

## 🚨 Problème 1 : DeepSeek API Timeout

### Symptômes
- Erreur 500 sur `/generate/playlist`
- Logs: `DeepSeek API call failed: Timeout`
- Métrique Prometheus: `deepseek_errors_total{error_type="TimeoutError"}` augmente

### Diagnostic
```bash
# Vérifier les logs récents
docker logs audiomancy-backend --tail=50 | grep "DeepSeek"

# Vérifier la latence DeepSeek dans Prometheus
curl http://localhost:19090/api/v1/query?query=deepseek_latency_seconds
```

### Solution
1. Vérifier la clé API DeepSeek est valide:
   ```bash
   cat backend/.env | grep DEEPSEEK_API_KEY
   ```
2. Augmenter le timeout dans `backend/app/services/ai/utils/deepseek_client.py`:
   ```python
   self.client = OpenAI(
       api_key=settings.deepseek_api_key,
       base_url=base_url,
       timeout=60.0  # Augmenter à 60s
   )
   ```
3. Redémarrer le backend:
   ```bash
   docker-compose restart backend
   ```

### Prévention
- Implémenter un retry avec backoff exponentiel
- Ajouter un circuit breaker (fail-fast après 3 erreurs)

---

## 🚨 Problème 2 : MongoDB Cache Vide

### Symptômes
- Requêtes Jamendo lentes (> 2s)
- Métrique: `cache_hit_ratio` proche de 0
- Logs: `Cache miss for key: jamendo_tracks_...`

### Diagnostic
```bash
# Vérifier MongoDB est accessible
docker exec audiomancy-mongodb mongosh --eval "db.adminCommand('ping')"

# Vérifier les documents dans le cache
docker exec audiomancy-mongodb mongosh audiomancy --eval "db.cache.countDocuments()"
```

### Solution
1. Vérifier la connexion MongoDB dans `.env`:
   ```bash
   # backend/.env
   MONGO_HOST=mongodb
   MONGO_PORT=27017
   ```
2. Purger et recréer les index:
   ```bash
   # Depuis le backend container
   docker exec -it audiomancy-backend python -c "
   from app.utils.cache_tools import ensure_cache_indexes
   import asyncio
   asyncio.run(ensure_cache_indexes())
   "
   ```
3. Redémarrer MongoDB si corrompu:
   ```bash
   docker-compose restart mongodb
   ```

### Prévention
- Configurer un TTL plus long (actuellement 1h)
- Monitorer `cache_operations_total{result="miss"}`

---

## 🚨 Problème 3 : APScheduler Jobs Bloqués

### Symptômes
- Endpoint `/health/scheduler` retourne jobs avec `next_run: null`
- Logs: `Execution of job "cleanup_expired_cache" skipped: maximum number of running instances reached (1)`

### Diagnostic
```bash
# Vérifier le statut du scheduler
curl http://localhost:8000/health/scheduler

# Vérifier les logs du scheduler
docker logs audiomancy-backend | grep "APScheduler"
```

### Solution
1. Redémarrer le scheduler:
   ```bash
   # Redémarrer le backend (relance le scheduler)
   docker-compose restart backend
   ```
2. Si le problème persiste, augmenter `max_instances` dans `backend/app/core/scheduler.py`:
   ```python
   scheduler.add_job(
       cleanup_expired_cache,
       trigger="interval",
       minutes=30,
       id="cleanup_expired_cache",
       max_instances=2,  # Augmenter à 2
       replace_existing=True
   )
   ```

### Prévention
- Ajouter timeout sur les jobs (`misfire_grace_time=300`)
- Monitorer la durée d'exécution des jobs

---

## 🚨 Problème 4 : Prometheus Ne Scrape Pas Les Métriques

### Symptômes
- Dashboard Grafana vide
- Prometheus targets status: DOWN
- URL: http://localhost:19090/targets

### Diagnostic
```bash
# Vérifier Prometheus peut atteindre le backend
docker exec audiomancy-prometheus wget -O- http://audiomancy-backend:8000/metrics

# Vérifier les logs Prometheus
docker logs audiomancy-prometheus --tail=50
```

### Solution
1. Vérifier l'endpoint /metrics est accessible:
   ```bash
   curl http://localhost:8000/metrics
   # Doit retourner des métriques au format Prometheus
   ```
2. Vérifier la configuration Prometheus:
   ```bash
   cat monitoring/prometheus/prometheus.local.yml
   # Vérifier le job "audiomancy-backend" pointe vers "audiomancy-backend:8000"
   ```
3. Redémarrer Prometheus:
   ```bash
   docker-compose restart prometheus
   ```

### Prévention
- Ajouter healthcheck sur Prometheus dans docker-compose
- Configurer alerte `PrometheusTargetDown`

---

## 🚨 Problème 5 : CORS Errors Frontend → Backend

### Symptômes
- Erreur browser console: `CORS policy: No 'Access-Control-Allow-Origin' header`
- Requêtes API bloquées côté frontend

### Diagnostic
```bash
# Vérifier les CORS origins configurés
docker exec audiomancy-backend python -c "from app.core.config import settings; print(settings.cors_origins)"
```

### Solution
1. Ajouter l'URL frontend dans `.env`:
   ```bash
   # backend/.env
   FRONTEND_CORS_ORIGINS=http://localhost:3000,http://frontend:3000
   ```
2. Redémarrer le backend:
   ```bash
   docker-compose restart backend
   ```

### Prévention
- Utiliser `*` en développement (ATTENTION: jamais en production!)
- Documenter les CORS origins nécessaires

---

## 🚨 Problème 6 : Tests Pytest Fail en CI/CD

### Symptômes
- `pytest` retourne des erreurs
- Tests passent en local mais échouent dans Docker

### Diagnostic
```bash
# Lancer les tests en verbose
docker exec -it audiomancy-backend pytest -v

# Vérifier les variables d'environnement
docker exec audiomancy-backend env | grep -E "MONGO|DEEPSEEK|JAMENDO"
```

### Solution
1. Créer `.env.test` avec les bonnes valeurs:
   ```bash
   # backend/.env.test
   MONGO_HOST=localhost
   DEEPSEEK_API_KEY=sk-test-xxx
   JAMENDO_CLIENT_ID=test-client-id
   ```
2. Utiliser pytest avec le bon env file:
   ```bash
   docker exec audiomancy-backend pytest --envfile=.env.test
   ```

### Prévention
- Mocker les appels API externes (DeepSeek, Jamendo)
- Utiliser une DB de test séparée

---

## 📞 Escalade

Si le problème persiste après ces étapes:

1. **Vérifier Grafana Dashboards**: http://localhost:19091
   - Dashboard "Audiomancy Backend" pour métriques système
   - Dashboard "Incidents Reporting" pour corrélations

2. **Consulter Loki Logs**: http://localhost:19091/explore
   - Query: `{container_name="audiomancy-backend"} |= "error"`
   - Vérifier les 15 dernières minutes

3. **Créer un incident formel**:
   ```bash
   cd monitoring/incidents
   ./create_incident.sh
   ```

4. **Contacter l'équipe**:
   - Benjamin (Backend/Architecture)
   - Aurélien R (Frontend/UI)
   - Aurélien L (Azure/IA)

---

## 🔧 Commandes Utiles

```bash
# Redémarrer tous les services
docker-compose down && docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f backend

# Vérifier l'état des services
docker-compose ps

# Nettoyer les volumes (ATTENTION: perte de données!)
docker-compose down -v

# Exécuter une commande dans le backend
docker exec -it audiomancy-backend bash

# Accéder à MongoDB
docker exec -it audiomancy-mongodb mongosh audiomancy
```

---

**Dernière mise à jour**: 2025-02-04
**Version**: 1.0
**Mainteneur**: Équipe Audiomancy
