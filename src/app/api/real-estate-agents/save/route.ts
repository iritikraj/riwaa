import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm"; // Assuming you are using Drizzle ORM

export async function POST(req: Request) {
  try {
    const { id, content, name, imageUrl } = await req.json();

    if (id) {
      // UPDATE: The profile already exists (Inline Edit)
      const [updatedAgent] = await db.update(agents)
        .set({
          content,
          name: name || content.hero?.name,
          imageUrl: imageUrl || content.hero?.imageUrl
        })
        .where(eq(agents.id, id))
        .returning();

      return NextResponse.json({ success: true, id: updatedAgent.id });
    } else {
      // CREATE: First time clicking "Finalize Profile"
      const [savedAgent] = await db.insert(agents).values({
        prompt: "Generated via Stream",
        name: name || content?.hero?.name || "Unknown Agent",
        imageUrl: imageUrl || content?.hero?.imageUrl || null,
        content: content,
      }).returning();

      return NextResponse.json({ success: true, id: savedAgent.id });
    }
  } catch (error: any) {
    console.error("Database Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}