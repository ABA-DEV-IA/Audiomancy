/**
 * Prometheus metrics configuration for Next.js frontend
 *
 * This module sets up Prometheus metrics to monitor:
 * - HTTP requests to API routes
 * - Response times
 * - Error rates
 * - Request counts by status code
 */

import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

// Create a Registry which registers the metrics
export const register = new Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'audiomancy-frontend',
});

// Enable the collection of default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// Custom metrics for HTTP requests
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Backend API call metrics
export const backendApiCallCounter = new Counter({
  name: 'backend_api_calls_total',
  help: 'Total number of calls to backend API',
  labelNames: ['endpoint', 'method', 'status_code'],
  registers: [register],
});

export const backendApiCallDuration = new Histogram({
  name: 'backend_api_call_duration_seconds',
  help: 'Duration of backend API calls in seconds',
  labelNames: ['endpoint', 'method', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});
