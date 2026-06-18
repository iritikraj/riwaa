/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/skeleton/Navbar";
import { Footer } from "@/components/skeleton/Footer";
import { ComponentRegistry } from "@/app/real-estate/web-studio";

export default async function PublishedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [site] = await db.select().from(websites).where(eq(websites.id, parseInt(id)));
  
  if (!site) notFound();

  const content = site.content as any;
  
  // --- NEW: Extract the saved global theme (Default to VersionOne) ---
  const savedTheme = content.theme || "VersionOne";

  return (
    <div className="bg-[#F8F8F3] min-h-screen">
      <Navbar />
      <main>
        {content.sections.map((section: any, i: number) => {
          const SectionFamily = ComponentRegistry[section.type];
          if (!SectionFamily) return null;

          // --- NEW: Render using the global savedTheme instead of section.version ---
          const Component = SectionFamily[savedTheme] || SectionFamily["VersionOne"];
          
          if (!Component) return null;

          return (
            <Component
              key={i}
              {...section}
              
              // --- CRITICAL: Lock down the UI for the public link ---
              isEditable={false} 
              
              floorPlans={content.globalAssets?.floorPlans}
              mapsLink={content.globalAssets?.mapsLink}
              videoUrl={content.globalAssets?.videoUrl}
            />
          );
        })}
      </main>
      <Footer />
    </div>
  );
}