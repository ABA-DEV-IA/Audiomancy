/**
 * Prometheus metrics endpoint
 *
 * Exposes metrics in Prometheus format at /api/metrics
 * This endpoint can be scraped by Prometheus for monitoring
 */

import { NextResponse } from 'next/server';
import { register } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const metrics = await register.metrics();

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new NextResponse('Error generating metrics', { status: 500 });
  }
}
