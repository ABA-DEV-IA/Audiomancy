/**
 * Utilitaire de logging HTTP compatible Loki.
 *
 * À utiliser dans les route handlers pour logger le status HTTP complet,
 * ce que le middleware seul ne peut pas faire (Edge Runtime).
 *
 * Format de sortie JSON (stdout → Loki agent) :
 *   {"level":"info","ts":"...","msg":"POST /api/user/proxyLogin 200","method":"POST","path":"/api/user/proxyLogin","status":200,"duration_ms":142,"req_id":"..."}
 *
 * Exemple d'utilisation dans une route API :
 *   const start = Date.now();
 *   // ... traitement ...
 *   logHttp(request, '/api/user/proxyLogin', response.status, start);
 */

type Level = 'info' | 'warn' | 'error';

function levelFromStatus(status: number): Level {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'info';
}

/**
 * Écriture d'une entrée de log HTTP au format JSON sur stdout.
 *
 * @param request  - Objet Request natif (disponible dans les App Router handlers)
 * @param path     - Chemin de la route loggée (ex: '/api/user/proxyLogin')
 * @param status   - Code HTTP retourné (ex: 200, 401, 500)
 * @param startMs  - Timestamp ms du début du traitement (Date.now())
 * @param extra    - Champs additionnels optionnels à inclure dans le log
 */
export function logHttp(
  request: Request,
  path: string,
  status: number,
  startMs: number,
  extra?: Record<string, unknown>,
): void {
  const durationMs = Date.now() - startMs;
  const method = request.method;
  const reqId = (request as Request & { headers: Headers }).headers.get('x-request-id') ?? undefined;

  const entry: Record<string, unknown> = {
    level: levelFromStatus(status),
    ts: new Date().toISOString(),
    msg: `${method} ${path} ${status}`,
    method,
    path,
    status,
    duration_ms: durationMs,
    ...(reqId ? { req_id: reqId } : {}),
    ...extra,
  };

  process.stdout.write(JSON.stringify(entry) + '\n');
}
