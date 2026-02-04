/**
 * Utility to instrument API routes with Prometheus metrics
 *
 * Usage:
 * export const GET = instrumentRoute(async (request: NextRequest) => {
 *   // Your route handler code
 *   return NextResponse.json({ data: 'example' });
 * }, '/api/yourroute');
 */

import { NextRequest, NextResponse } from 'next/server';
import { httpRequestCounter, httpRequestDuration } from './metrics';

type RouteHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<Response> | Response;

/**
 * Wraps an API route handler to record Prometheus metrics
 *
 * @param handler - The Next.js route handler function
 * @param routeName - The route path (e.g., '/api/user')
 * @returns Instrumented route handler
 */
export function instrumentRoute(
  handler: RouteHandler,
  routeName: string
): RouteHandler {
  return async (request: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const startTime = Date.now();
    let response: Response;
    let statusCode = 500;

    try {
      response = await handler(request, context);
      statusCode = response.status;
      return response;
    } catch (error) {
      console.error(`Error in route ${routeName}:`, error);
      statusCode = 500;
      response = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      return response;
    } finally {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds

      const labels = {
        method: request.method,
        route: routeName,
        status_code: statusCode.toString(),
      };

      // Record metrics
      httpRequestCounter.inc(labels);
      httpRequestDuration.observe(labels, duration);
    }
  };
}
