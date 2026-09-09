import { notFound } from "next/navigation";
import { getDeveloperAgentBySlug } from "@/lib/real-estate-agents/strapi";
import { DeveloperHero } from "../_hero";
import { ProjectsGrid } from "../_projects-grid";
import { ProjectsMap } from "../_projects-map";
import { LeadCaptureForm } from "../_lead-form";
import { DetailedAgentProfile } from "../_agent-profile";

// 1. Await params in Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getDeveloperAgentBySlug(resolvedParams.id);

  if (!data) return { title: "Page Not Found" };

  return {
    title: `${data.agent_data?.name} | ${data.developer_name} Specialist`,
    description: data.developer_profile?.substring(0, 160),
    openGraph: {
      title: `${data.agent_data?.name} - ${data.developer_name} Specialist`,
      description: `Explore exclusive off-plan inventory and prime real estate from ${data.developer_name}.`,
      images: [data.agent_data?.profileImage || "/riwa-logo-transparent.png"],
    },
  };
}

// 2. Await params in the Server Component
export default async function DeveloperAdvisorPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getDeveloperAgentBySlug(resolvedParams.id);

  if (!data || data.report_status !== 'published') {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fcfcfb] w-full overflow-x-hidden selection:bg-[#b8924a]/20">

      <DeveloperHero
        developerName={data.developer_name}
        developerProfile={data.developer_profile}
        agentData={data.agent_data}
        agentBio={data.agent_bio}
      />

      <ProjectsGrid
        developerName={data.developer_name}
        projects={data.projects_list}
      />

      <ProjectsMap
        developerName={data.developer_name}
        projects={data.projects_list}
      />

      <DetailedAgentProfile
        developerName={data.developer_name}
        agentBio={data.agent_bio}
        agentData={data.agent_data}
      />

      <LeadCaptureForm
        developerName={data.developer_name}
        agentName={data.agent_data?.name}
        projects={data.projects_list}
      />

      <footer className="w-full bg-[#050505] text-neutral-500 py-8 text-center text-[10px] uppercase tracking-widest font-jost">
        <p>© {new Date().getFullYear()} RIWAA All Rights Reserved.</p>
        <p className="mt-2 text-neutral-700">Powered by Solvetude</p>
      </footer>

    </main>
  );
}