import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const history = await db.select().from(websites).orderBy(desc(websites.createdAt));
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json(
      { error: "Failed to fetch database records" },
      { status: 500 }
    );
  }
}