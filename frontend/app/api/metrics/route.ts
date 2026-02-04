/**
 * Prometheus metrics endpoint for Next.js frontend monitoring.
 *
 * Exposes Node.js and application metrics in Prometheus format.
 * Scraped by Prometheus every 15 seconds.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a Registry to register the metrics
const register = new Registry();

// Collect default Node.js metrics (event loop lag, heap size, etc.)
collectDefaultMetrics({ register, prefix: 'nodejs_' });

// ============================================================================
// HTTP Client Metrics
// ============================================================================

const httpClientRequestsTotal = new Counter({
  name: 'http_client_requests_total',
  help: 'Total number of HTTP client requests',
  labelNames: ['method', 'endpoint', 'status_code'],
  registers: [register],
});

const httpClientRequestDurationSeconds = new Histogram({
  name: 'http_client_request_duration_seconds',
  help: 'HTTP client request duration in seconds',
  labelNames: ['method', 'endpoint'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// ============================================================================
// Backend API Call Metrics
// ============================================================================

const backendApiCallsTotal = new Counter({
  name: 'backend_api_calls_total',
  help: 'Total calls to backend API',
  labelNames: ['endpoint', 'status'],
  registers: [register],
});

const backendApiLatencySeconds = new Histogram({
  name: 'backend_api_latency_seconds',
  help: 'Backend API call latency in seconds',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

// ============================================================================
// Application Info
// ============================================================================

const appInfo = new Gauge({
  name: 'audiomancy_frontend_info',
  help: 'Frontend application information',
  labelNames: ['version', 'service'],
  registers: [register],
});

// Set application info
appInfo.labels({ version: '1.0.0', service: 'audiomancy-frontend' }).set(1);

// ============================================================================
// Export metrics objects for use in other modules
// ============================================================================

export const metrics = {
  httpClientRequestsTotal,
  httpClientRequestDurationSeconds,
  backendApiCallsTotal,
  backendApiLatencySeconds,
};

// ============================================================================
// Metrics Endpoint Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Generate metrics in Prometheus format
    const metricsOutput = await register.metrics();

    return new NextResponse(metricsOutput, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}
