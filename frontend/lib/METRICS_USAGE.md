# Guide d'utilisation des métriques Prometheus

## Vue d'ensemble

Le système de métriques Prometheus pour le frontend Next.js permet de surveiller :
- Le nombre de requêtes par route API
- Les temps de réponse
- Les codes de statut HTTP
- Les appels vers le backend

## Configuration

Les métriques sont automatiquement exposées à `/api/metrics` pour le scraping Prometheus.

## Instrumenter une route API

### Méthode recommandée : Wrapper automatique

Utilisez la fonction `instrumentRoute` pour envelopper vos handlers de route :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { instrumentRoute } from '@/lib/instrumentRoute';

// Définir votre handler
async function handler(request: NextRequest) {
  // Votre logique de route ici
  const data = await fetchSomeData();

  return NextResponse.json({ data });
}

// Exporter le handler instrumenté
export const GET = instrumentRoute(handler, '/api/yourroute');
export const POST = instrumentRoute(handler, '/api/yourroute');
```

### Exemple complet

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { instrumentRoute } from '@/lib/instrumentRoute';

async function getHandler(request: NextRequest) {
  try {
    const data = { message: 'Hello World' };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function postHandler(request: NextRequest) {
  try {
    const body = await request.json();
    // Process the request...
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    );
  }
}

// Exporter les handlers instrumentés
export const GET = instrumentRoute(getHandler, '/api/example');
export const POST = instrumentRoute(postHandler, '/api/example');
```

### Métriques pour appels backend (optionnel)

Pour tracker les appels vers le backend FastAPI, utilisez les métriques dédiées :

```typescript
import { backendApiCallCounter, backendApiCallDuration } from '@/lib/metrics';

async function callBackendAPI(endpoint: string) {
  const startTime = Date.now();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
    const duration = (Date.now() - startTime) / 1000;

    backendApiCallCounter.inc({
      endpoint,
      method: 'GET',
      status_code: response.status.toString(),
    });

    backendApiCallDuration.observe(
      {
        endpoint,
        method: 'GET',
        status_code: response.status.toString(),
      },
      duration
    );

    return response;
  } catch (error) {
    backendApiCallCounter.inc({
      endpoint,
      method: 'GET',
      status_code: '500',
    });
    throw error;
  }
}
```

## Métriques disponibles

### Métriques par défaut
- `process_cpu_user_seconds_total` - Temps CPU utilisateur
- `process_cpu_system_seconds_total` - Temps CPU système
- `process_resident_memory_bytes` - Mémoire résidente
- `nodejs_heap_size_total_bytes` - Taille totale du heap
- Et autres métriques Node.js standard

### Métriques personnalisées
- `http_requests_total` - Nombre total de requêtes HTTP
  - Labels: `method`, `route`, `status_code`
- `http_request_duration_seconds` - Durée des requêtes HTTP
  - Labels: `method`, `route`, `status_code`
- `backend_api_calls_total` - Nombre d'appels au backend
  - Labels: `endpoint`, `method`, `status_code`
- `backend_api_call_duration_seconds` - Durée des appels backend
  - Labels: `endpoint`, `method`, `status_code`

## Configuration Prometheus

Exemple de configuration `prometheus.yml` :

```yaml
scrape_configs:
  - job_name: 'audiomancy-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 15s
```

## Dashboards Grafana recommandés

### Requêtes par seconde
```promql
rate(http_requests_total[5m])
```

### Temps de réponse moyen (p95)
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Taux d'erreurs
```promql
sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
```

### Latence backend
```promql
histogram_quantile(0.95, rate(backend_api_call_duration_seconds_bucket[5m]))
```
