/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/logs/withLogger.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { logger } from './logger';
import { Logger } from 'pino';

// Define the shape of our wrapped handler
type ApiHandler = (
  req: NextRequest,
  routeLogger: Logger,
  context: any
) => Promise<NextResponse>;

export function withLogger(routeName: string, handler: ApiHandler) {
  return async (req: NextRequest, context: any) => {
    const startTime = Date.now();
    const requestId = randomUUID();

    // Create the contextual logger once
    const routeLogger = logger.child({ requestId, route: routeName });

    routeLogger.info({ event: 'request_started', method: req.method, url: req.url });

    try {
      // Execute the actual business logic, passing the injected logger
      const response = await handler(req, routeLogger, context);

      routeLogger.info({
        event: 'request_completed',
        status: response.status,
        durationMs: Date.now() - startTime
      });

      // Inject the requestId into the response headers automatically
      response.headers.set('x-request-id', requestId);
      return response;

    } catch (error: any) {
      // Centralized error handling
      routeLogger.error({
        err: error,
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        durationMs: Date.now() - startTime
      }, 'Unhandled route error');

      return NextResponse.json(
        { error: 'Internal Server Error', requestId },
        { status: 500 }
      );
    }
  };
}