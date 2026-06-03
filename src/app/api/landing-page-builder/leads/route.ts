import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const [newLead] = await db.insert(leads).values(data).returning();
  return NextResponse.json(newLead);
}