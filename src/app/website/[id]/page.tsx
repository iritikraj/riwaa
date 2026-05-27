/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/skeleton/Navbar";
import { Footer } from "@/app/components/skeleton/Footer";
import { ComponentRegistry } from "@/app/(home)";

export default async function PublishedPage({ params }: { params: { id: string } }) {
  const [site] = await db.select().from(websites).where(eq(websites.id, parseInt(params.id)));
  if (!site) notFound();

  const content = site.content as any;

  return (
    <div className="bg-[#F8F8F3] min-h-screen">
      <Navbar />
      <main>
        {content.sections.map((section: any, i: number) => {
          const SectionFamily = ComponentRegistry[section.type];
          const Component = SectionFamily[section.version] || SectionFamily["VersionOne"];

          return (
            <Component
              key={i}
              {...section}
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