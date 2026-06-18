// app/agents/_brokerage-company.tsx
import { Quote, Globe, Building2, MapPin, Trophy, CheckCircle2 } from "lucide-react";
import { brokerageRegistry } from "@/config/brokerage";

export function BrokerageFooter({ brokerName, logoUrl }: { brokerName: string, logoUrl?: string }) {
  const rawName = brokerName?.toLowerCase().trim() || "";
  const matchedKey = Object.keys(brokerageRegistry).find(key =>
    rawName.includes(key) || key.includes(rawName)
  );

  const brokerInfo = matchedKey ? brokerageRegistry[matchedKey] : null;

  if (!brokerInfo) return null;

  return (
    <section className="bg-[#0a0a0a] text-white font-jost border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#b8924a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">

        {/* TOP: Logo & Stats Ribbon */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20 pb-16 border-b border-white/10">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brokerInfo.name}
                className="h-16 w-auto object-contain mix-blend-screen invert opacity-90"
              />
            ) : (
              <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-[#b8924a]">{brokerInfo.name}</h2>
            )}
          </div>

          {brokerInfo.stats && (
            <div className="flex flex-wrap justify-center lg:justify-end gap-8 md:gap-16">
              {brokerInfo.stats.map((stat: any, i: number) => (
                <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="font-cormorant text-4xl md:text-5xl text-[#b8924a] leading-none mb-2">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MIDDLE: CEO Message & Global Presence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column: Executive Vision */}
          {brokerInfo.ceo && (
            <div className="lg:col-span-7 flex flex-col justify-center">
              <Quote size={40} className="text-[#b8924a]/20 mb-6" />
              <p className="font-cormorant text-2xl md:text-3xl leading-relaxed text-white/90 italic mb-8">
                "{brokerInfo.ceo.message}"
              </p>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#b8924a]">{brokerInfo.ceo.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{brokerInfo.ceo.title}</p>
              </div>
            </div>
          )}

          {/* Right Column: Offices */}
          {brokerInfo.offices && (
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <Globe size={18} className="text-[#b8924a]" />
                <h3 className="text-xs font-semibold tracking-[0.3em] uppercase">Global Presence</h3>
              </div>

              <div className="space-y-8">
                {brokerInfo.offices.uae && (
                  <div>
                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Building2 size={12} /> United Arab Emirates
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {brokerInfo.offices.uae.map((office: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <MapPin size={12} className="text-[#b8924a] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-white/90">{office.name}</p>
                            <p className="text-[9px] text-white/40 truncate">{office.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {brokerInfo.offices.international && (
                  <div>
                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Globe size={12} /> International
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {brokerInfo.offices.international.map((office: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <MapPin size={12} className="text-[#b8924a] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-white/90">{office.name}</p>
                            <p className="text-[9px] text-white/40 truncate">{office.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* LOWER MIDDLE: Commitments & Awards */}
        {(brokerInfo.commitments || brokerInfo.awards) && (
          <div className="mt-20 pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-16">
            {brokerInfo.commitments && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 size={20} className="text-[#b8924a]" />
                  <h3 className="text-sm font-semibold tracking-[0.3em] uppercase">Our Commitment</h3>
                </div>
                <ul className="space-y-4">
                  {brokerInfo.commitments.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#9a8f80] font-light leading-relaxed">
                      <span className="text-[#b8924a] mt-1.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {brokerInfo.awards && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={20} className="text-[#b8924a]" />
                  <h3 className="text-sm font-semibold tracking-[0.3em] uppercase">Awards & Recognition</h3>
                </div>
                <p className="text-sm text-[#9a8f80] font-light leading-relaxed text-justify">
                  {brokerInfo.awards}
                </p>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM: Imageries Grid */}
        {brokerInfo.imageries && brokerInfo.imageries.length > 0 && (
          <div className="mt-20">
            <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-center mb-8 text-white/50">Inside Our Offices</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brokerInfo.imageries.map((img: string, i: number) => (
                <div key={i} className="relative h-48 md:h-64 rounded-xl overflow-hidden group">
                  <img
                    src={img}
                    alt={`${brokerInfo.name} Office`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href={brokerInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[10px] tracking-widest uppercase text-[#b8924a] hover:text-white transition-colors border-b border-[#b8924a]/30 hover:border-white pb-1"
              >
                Visit Official Website
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}