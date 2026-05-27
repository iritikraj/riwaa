/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AgentHero } from "../_hero";
import { AgentMetrics } from "../_metrices";
import { AgentTimeline } from "../_timeline";
import { AgentContact } from "../_contact";
import { AgentExpertise } from "../_expertise";
import { AgentPartnerships } from "../_partnership";
import { AgentMedia } from "../_media";
import { AgentTestimonials } from "../_testimonials";

export default async function PublishedAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [agentRecord] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, parseInt(id)));

  if (!agentRecord) notFound();

  const extractedData = agentRecord.content as any;

  return (
    <div className="min-h-screen bg-[#f9f6f1] overflow-x-hidden font-jost flex flex-col">

      {/* THIS FIXES ISSUE 1: The Missing Public Logo Header */}
      <header className="w-full bg-[#f9f6f1] py-2 flex items-center justify-center border-b border-[#e0d8cc]/60 relative z-50 shrink-0">
        {extractedData.companyLogo ? (
          <img src={extractedData.companyLogo} alt="Brokerage Logo" className="h-14 md:h-20 object-contain mix-blend-multiply opacity-90" />
        ) : (
          <h2 className="font-serif text-xl tracking-[0.35em] uppercase text-[#b8924a] font-light">Exclusive Partner</h2>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Render the rest of the profile natively (not editable) */}
        {extractedData.hero && (
          <AgentHero data={extractedData.hero} />
        )}
        {extractedData.metrics && <AgentMetrics data={extractedData.metrics} />}
        {extractedData.timeline && <AgentTimeline timeline={extractedData.timeline} />}
        {extractedData.expertise && <AgentExpertise data={extractedData.expertise} />}

        <AgentPartnerships data={extractedData.partnerships} />
        <AgentMedia data={extractedData.mediaPresence} />
        <AgentTestimonials data={extractedData.testimonials} />

        {extractedData.contact && (
          <AgentContact
            agentId={agentRecord.id}
            agentName={extractedData.hero?.name || "Agent"}
            whatsapp={extractedData.contact?.whatsapp}
          />
        )}
      </main>

      {/* BRANDING FOOTER */}
      <footer className="w-full bg-[#111111] py-8 flex items-center justify-center border-t border-white/5 shrink-0">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium flex items-center gap-3">
            &copy; Riwaa
            <span className="text-neutral-300 font-light lowercase tracking-widest text-xs">By</span>
            <span className="text-[#b8924a]">Solvetude</span>
          </p>
        </div>
      </footer>

    </div>
  );
}