/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { withLogger } from "@/lib/logs/withLogger";

// Wrap the GET route with your logger
export const GET = withLogger('/api/real-estate-agents/history', async (req: NextRequest, routeLogger) => {
  try {
    routeLogger.info({ event: 'fetch_agent_history_started' });

    // Execute the database query
    const history = await db.select().from(agents).orderBy(desc(agents.id));

    // Log the successful fetch and how many records were returned
    routeLogger.info({
      event: 'fetch_agent_history_success',
      recordCount: history.length
    });

    return NextResponse.json(history);

  } catch (error: any) {
    // Catch and log any database connection or query errors
    routeLogger.error(
      { err: error, event: 'fetch_agent_history_failed' },
      "Failed to fetch agent history"
    );

    return NextResponse.json([], { status: 500 });
  }
});