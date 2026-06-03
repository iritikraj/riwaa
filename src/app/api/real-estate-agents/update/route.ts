/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, content } = await req.json();

    if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    await db
      .update(agents)
      .set({ content: content })
      .where(eq(agents.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}