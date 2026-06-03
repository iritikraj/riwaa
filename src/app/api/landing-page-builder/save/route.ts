import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { id, content } = await req.json();

    // 1. Validate payload
    if (!id || !content) {
      return NextResponse.json(
        { error: "Missing site ID or content payload." },
        { status: 400 }
      );
    }

    // 2. Update the existing row with the new content (and theme)
    const [updatedSite] = await db
      .update(websites)
      .set({
        content: content,
        theme: content.theme || "VersionOne",
      })
      .where(eq(websites.id, id))
      .returning();

    if (!updatedSite) {
      return NextResponse.json(
        { error: "Website not found or update failed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Edits saved successfully.",
      site: updatedSite
    });

  } catch (error: any) {
    console.error("Save API Error Details:", error);
    return NextResponse.json({
      error: "Failed to save changes.",
      details: error.message
    }, { status: 500 });
  }
}