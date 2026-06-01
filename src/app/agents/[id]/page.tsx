/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

// --- Theme 1 (Classic Light) ---
import { AgentHero } from "../_hero";
import { AgentMetrics } from "../_metrices";
import { AgentTimeline } from "../_timeline";
import { AgentContact } from "../_contact";
import { AgentExpertise } from "../_expertise";
import { AgentPartnerships } from "../_partnership";
import { AgentMedia } from "../_media";
import { AgentTestimonials } from "../_testimonials";

import { AgentHeroVersionTwo } from "../_hero/index.v2";
import { AgentMetricsVersionTwo } from "../_metrices/index.v2";
import { AgentTimelineVersionTwo } from "../_timeline/index.v2";
import { AgentExpertiseVersionTwo } from "../_expertise/index.v2";
import { AgentPartnershipsVersionTwo } from "../_partnership/index.v2";
import { AgentMediaVersionTwo } from "../_media/index.v2";
import { AgentTestimonialsVersionTwo } from "../_testimonials/index.v2";
import { AgentContactVersionTwo } from "../_contact/index.v2";

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

  // Determine the active theme from the database content
  const isThemeTwo = extractedData?.theme === "theme2";
  return (
    <div
      className={`min-h-screen overflow-x-hidden flex flex-col transition-colors duration-500 ${isThemeTwo
        ? "bg-[#070b14] text-white font-sans"
        : "bg-[#f9f6f1] text-[#1a1a1a] font-jost"
        }`}
    >
      {/* HEADER: Dynamically adjusts border, background, and logo blending */}
      <header
        className={`w-full py-2 flex items-center justify-center border-b relative z-50 shrink-0 ${isThemeTwo
          ? "bg-[#070b14]/80 border-white/10 backdrop-blur-md"
          : "bg-[#f9f6f1] border-[#e0d8cc]/60"
          }`}
      >
        {extractedData.companyLogo ? (
          <img
            src={extractedData.companyLogo}
            alt="Brokerage Logo"
            className={`h-18 md:h-28 object-contain opacity-90 ${isThemeTwo ? "" : "mix-blend-multiply"
              }`}
          />
        ) : (
          <h2 className={`font-serif text-xl tracking-[0.35em] uppercase font-light ${isThemeTwo ? "text-cyan-200" : "text-[#b8924a]"
            }`}>
            Exclusive Partner
          </h2>
        )}
      </header>

      {/* MAIN CONTENT AREA: Conditionally renders the correct component version */}
      <main className="grow">
        {extractedData.hero && (
          isThemeTwo
            ? <AgentHeroVersionTwo data={extractedData.hero} />
            : <AgentHero data={extractedData.hero} />
        )}

        {extractedData.metrics && (
          isThemeTwo
            ? <AgentMetricsVersionTwo data={extractedData.metrics} />
            : <AgentMetrics data={extractedData.metrics} />
        )}

        {extractedData.timeline && (
          isThemeTwo
            ? <AgentTimelineVersionTwo timeline={extractedData.timeline} />
            : <AgentTimeline timeline={extractedData.timeline} />
        )}

        {extractedData.expertise && (
          isThemeTwo
            ? <AgentExpertiseVersionTwo data={extractedData.expertise} />
            : <AgentExpertise data={extractedData.expertise} />
        )}

        {isThemeTwo ? (
          <>
            <AgentPartnershipsVersionTwo data={extractedData.partnerships} />
            <AgentMediaVersionTwo data={extractedData.mediaPresence} />
            <AgentTestimonialsVersionTwo data={extractedData.testimonials} />
          </>
        ) : (
          <>
            <AgentPartnerships data={extractedData.partnerships} />
            <AgentMedia data={extractedData.mediaPresence} />
            <AgentTestimonials data={extractedData.testimonials} />
          </>
        )}

        {extractedData.contact && (
          isThemeTwo ? (
            <AgentContactVersionTwo
              agentId={agentRecord.id}
              agentName={extractedData.hero?.name || "Agent"}
              whatsapp={extractedData.contact?.whatsapp}
            />
          ) : (
            <AgentContact
              agentId={agentRecord.id}
              agentName={extractedData.hero?.name || "Agent"}
              whatsapp={extractedData.contact?.whatsapp}
            />
          )
        )}
      </main>

      {/* BRANDING FOOTER: Adjusted for global dark mode coherence */}
      <footer className={`w-full py-8 flex items-center justify-center border-t shrink-0 ${isThemeTwo
        ? "bg-[#04060a] border-white/5"
        : "bg-[#111111] border-white/5"
        }`}>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium flex items-center gap-3">
            &copy; Riwaa
            <span className="text-neutral-300 font-light lowercase tracking-widest text-xs">By</span>
            <span className={isThemeTwo ? "text-cyan-400" : "text-[#b8924a]"}>
              Solvetude
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}