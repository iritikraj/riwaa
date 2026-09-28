// riwaa/src/app/api/auth/logout/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';

export const POST = withLogger('/api/auth/logout', async (req: NextRequest, routeLogger) => {
  try {
    routeLogger.info({ event: 'logout_attempt' }, 'Processing user logout request');

    const res = NextResponse.json({ success: true });
    res.cookies.delete('riwaa_session');

    routeLogger.info({ event: 'logout_success' }, 'Session cookie deleted successfully');
    return res;
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'logout_error' }, 'Failed to process logout');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});