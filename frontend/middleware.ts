import { type NextRequest, NextResponse } from 'next/server';

/**
 * HTTP access logger compatible Loki.
 *
 * Chaque requête est loggée en JSON sur stdout. Le champ `msg` respecte le
 * format `METHOD /path` pour que LogQL puisse le parser :
 *   {app="audiomancy-frontend"} | json | line_format "{{.msg}}"
 *
 * Le status HTTP n'est pas disponible dans le middleware Next.js (il tourne
 * avant le route handler). Pour logger le status, utilisez `logHttp()` depuis
 * lib/httpLogger.ts directement dans les routes API.
 *
 * Headers propagés en aval :
 *   x-request-id    — UUID unique par requête (corrélation des logs)
 *   x-request-start — timestamp ms (pour calculer la durée dans le handler)
 */

function writeLog(entry: Record<string, unknown>): void {
  process.stdout.write(JSON.stringify(entry) + '\n');
}

export function middleware(request: NextRequest): NextResponse {
  const start = Date.now();
  const { method } = request;
  const path = request.nextUrl.pathname;

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const userAgent = request.headers.get('user-agent') ?? '';
  const reqId = crypto.randomUUID();

  // Propagation des headers pour corrélation dans les handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', reqId);
  requestHeaders.set('x-request-start', String(start));

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('x-request-id', reqId);

  writeLog({
    level: 'info',
    ts: new Date().toISOString(),
    msg: `${method} ${path}`,
    method,
    path,
    ip,
    user_agent: userAgent,
    req_id: reqId,
    duration_ms: Date.now() - start,
  });

  return response;
}

export const config = {
  // Exclure assets statiques Next.js et favicon pour réduire le bruit
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
