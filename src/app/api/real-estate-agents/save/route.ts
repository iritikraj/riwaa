/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { withLogger } from "@/lib/logs/withLogger";

// Wrap the POST route with your logger
export const POST = withLogger('/api/real-estate-agents/save', async (req: NextRequest, routeLogger) => {
  try {
    const { id, content, name, imageUrl } = await req.json();

    if (id) {
      // UPDATE: The profile already exists
      routeLogger.info({ event: 'agent_update_started', agentId: id });

      const [updatedAgent] = await db.update(agents)
        .set({
          content,
          name: name || content.hero?.name,
          imageUrl: imageUrl || content.hero?.imageUrl
        })
        .where(eq(agents.id, id))
        .returning();

      routeLogger.info({ event: 'agent_update_success', agentId: updatedAgent.id });
      return NextResponse.json({ success: true, id: updatedAgent.id });

    } else {
      // CREATE: First time clicking "Finalize Profile"
      routeLogger.info({ event: 'agent_create_started', name });

      const [savedAgent] = await db.insert(agents).values({
        prompt: "Generated via Stream",
        name: name || content?.hero?.name || "Unknown Agent",
        imageUrl: imageUrl || content?.hero?.imageUrl || null,
        content: content,
      }).returning();

      routeLogger.info({ event: 'agent_create_success', agentId: savedAgent.id });
      return NextResponse.json({ success: true, id: savedAgent.id });
    }
  } catch (error: any) {
    routeLogger.error(
      { err: error, event: 'agent_save_failed' },
      "Database Save Error"
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});