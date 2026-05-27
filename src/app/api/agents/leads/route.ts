import { db } from "@/lib/db";
import { agentLeads } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Map the incoming websiteId to agentId for the database
    const payload = {
      agentId: data.websiteId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    };

    const [newLead] = await db.insert(agentLeads).values(payload).returning();
    return NextResponse.json(newLead);
  } catch (error: any) {
    console.error("Agent Lead Error:", error);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}