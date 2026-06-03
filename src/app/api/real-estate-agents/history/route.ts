import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const history = await db.select().from(agents).orderBy(desc(agents.id));
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch agent history:", error);
    return NextResponse.json([], { status: 500 });
  }
}