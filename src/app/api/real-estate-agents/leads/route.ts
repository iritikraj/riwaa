/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agentLeads } from "@/lib/db/schema";
import { withLogger } from "@/lib/logs/withLogger";

// Wrap the POST route with your logger
export const POST = withLogger('/api/real-estate-agents/leads', async (req: NextRequest, routeLogger) => {
  try {
    const data = await req.json();

    routeLogger.info({
      event: 'agent_lead_capture_started',
      websiteId: data.websiteId
    });

    // Map the incoming websiteId to agentId for the database
    const payload = {
      agentId: data.websiteId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    };

    // Execute the database insert
    const [newLead] = await db.insert(agentLeads).values(payload).returning();

    routeLogger.info({
      event: 'agent_lead_capture_success',
      leadId: newLead.id
    });

    return NextResponse.json(newLead);

  } catch (error: any) {
    // Log the error with the event name for easy filtering in your logs
    routeLogger.error(
      { err: error, event: 'agent_lead_capture_failed' },
      "Failed to capture lead"
    );

    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
});