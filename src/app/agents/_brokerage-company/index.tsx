// app/agents/_brokerage-company.tsx
import { brokerageRegistry } from "@/app/config/brokerage";

export function BrokerageFooter({ brokerName, logoUrl }: { brokerName: string, logoUrl?: string }) {
  // Normalize the incoming name
  const rawName = brokerName?.toLowerCase().trim() || "";

  // Smarter Matching Logic: Look for partial matches (e.g., "driven properties llc" matches "driven properties")
  const matchedKey = Object.keys(brokerageRegistry).find(key =>
    rawName.includes(key) || key.includes(rawName)
  );

  const brokerInfo = matchedKey ? brokerageRegistry[matchedKey] : null;

  // If we STILL don't find it, we don't render the footer
  if (!brokerInfo) {
    console.log("BrokerageFooter: Could not match broker name:", brokerName);
    return null;
  }

  return (
    <section className="bg-[#111111] py-20 px-6 text-[#d4af71] font-jost border-t border-white/10">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={brokerInfo.name}
            className="h-16 object-contain mb-8 mix-blend-screen invert opacity-80"
          />
        )}
        <h2 className="text-sm font-semibold tracking-[0.3em] uppercase mb-8">{brokerInfo.name}</h2>
        <div className="space-y-6 text-sm text-[#9a8f80] leading-relaxed font-light whitespace-pre-wrap text-justify">
          {brokerInfo.about}
        </div>
        <a
          href={brokerInfo.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 text-[10px] tracking-widest uppercase hover:text-white transition-colors border-b border-[#d4af71]/30 pb-1"
        >
          Visit Official Website
        </a>
      </div>
    </section>
  );
}