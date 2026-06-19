/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { withLogger } from "@/lib/logs/withLogger";

// Wrap the POST route with your logger
export const POST = withLogger('/api/real-estate-agents/update', async (req: NextRequest, routeLogger) => {
  try {
    const { id, content } = await req.json();

    if (!id) {
      routeLogger.warn({ event: 'agent_update_aborted', reason: 'Missing ID' });
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    routeLogger.info({ event: 'agent_update_started', agentId: id });

    // Perform the update
    await db
      .update(agents)
      .set({ content: content })
      .where(eq(agents.id, id));

    routeLogger.info({ event: 'agent_update_success', agentId: id });
    return NextResponse.json({ success: true });

  } catch (error: any) {
    routeLogger.error(
      { err: error, event: 'agent_update_failed' },
      "Update Error"
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});