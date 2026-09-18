import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, FileCheck, LayoutDashboard, MessageCircleMore, Search, Swords, UserCircle, Wand2 } from "lucide-react"
import Link from "next/link"

const ROSTER = [
  {
    id: "01",
    icon: UserCircle,
    name: "Advisor Portfolio Studio",
    role: "Builds and maintains advisor profiles",
    desc: "Pulls from Property Finder and Bayut, then writes each advisor's biography, achievements and live listings in your brokerage's voice — no copywriter required.",
    cta: "Launch Studio",
    href: "/real-estate/advisors/create",
  },
  {
    id: "02",
    icon: MessageCircleMore,
    name: "Social Intelligence",
    role: "Reads and answers every comment",
    desc: "Watches Google Reviews, Facebook and Instagram, drafts a reply in context, and holds it for your sign-off before it ever goes out.",
    cta: "Open Console",
    href: "/social-media-agent",
  },
  {
    id: "03",
    icon: LayoutDashboard,
    name: "Website Studio",
    role: "Assembles brokerage websites",
    desc: "Generates editable, on-brand developer and brokerage sites from real listing data — sections you can rearrange, not a locked template.",
    cta: "Start Building",
    href: "/real-estate/web-studio/create",
  },
  {
    id: "04",
    icon: Search,
    name: "SEO & Competitor Agent",
    role: "Audits you against the market",
    desc: "Crawls your site and the ones outranking you, checks Core Web Vitals and schema, and tells you exactly what to fix first.",
    cta: "Run Audit",
    href: "/seo-agent/audit",
  },
  {
    id: "05",
    icon: Building2,
    name: "Developer Advisors",
    role: "Builds co-branded landing pages",
    desc: "Generates high-converting credibility pages featuring off-plan projects, interactive maps, and lead capture for specific master developers.",
    cta: "Open Builder",
    href: "/real-estate/developer-advisors",
  },
];

const Roster = () => {
  return (
    <section className="mx-auto max-w-350 px-6 py-20 lg:px-10" id="roster">
      <div className="max-w-xl">
        <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
          The roster
        </span>
        <h2 className="mt-5 text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          Four agents. One powerful workspace.
        </h2>
        <p className="mt-5 text-[15px] leading-7 text-[#565C6B]">
          Each one is built to do a single job well, instead of one
          model trying to do everything badly.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-14">
        {/* ADVISOR PORTFOLIO */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute right-0 top-0 h-75 w-75 rounded-full bg-[#b8924a]/10 blur-[120px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9C7A3C]/15 bg-[#9C7A3C]/5">
                <UserCircle size={28} className="text-[#9C7A3C]" />
              </div>
              <span className="rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#9C7A3C]">
                Flagship
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              Advisor
              <br />
              Portfolio Studio
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Automatically generate luxury advisor profiles using Property
              Finder, Bayut and your internal brokerage data.
            </p>

            <div className="mt-8 space-y-2.5">
              {[
                "Property Finder Import",
                "AI Generated Biography",
                "Live Listings",
                "Achievements & Awards",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[#14181F]/5 bg-[#FCFBF8] px-4 py-3"
                >
                  <CheckCircle2 size={16} className="text-[#9C7A3C]" />
                  <span className="text-[13px] text-[#565C6B]">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/real-estate/advisors/create"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Launch Studio
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* SOCIAL INTELLIGENCE */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
          <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-pink-500/5 blur-[90px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50">
                <MessageCircleMore size={26} className="text-purple-600" />
              </div>
              <span className="rounded-full border border-purple-200 bg-purple-100 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-purple-700">
                LIVE
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              Social
              <br />
              Intelligence
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Manage Google Reviews, Facebook and Instagram comments from
              one intelligent AI dashboard.
            </p>

            {/* Inbox Preview */}
            <div className="mt-8 flex-1 overflow-hidden rounded-2xl border border-[#14181F]/10 bg-[#FCFBF8]">
              <div className="border-b border-[#14181F]/5 px-5 py-3">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#565C6B]">
                  Live Feed
                </p>
              </div>
              <div className="space-y-3 p-4">
                <div className="rounded-xl border border-[#14181F]/5 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400" />
                    <div>
                      <p className="text-xs font-medium text-[#14181F]">Instagram</p>
                      <p className="text-[10px] text-[#565C6B]">New Comment</p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[13px] text-[#565C6B]">
                    Amazing experience buying our villa ❤️
                  </p>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-[#14181F]">Facebook</p>
                      <p className="text-[10px] text-purple-600">AI Reply Generated</p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[13px] text-[#565C6B]">
                    &quot;Thank you Sarah. We truly appreciate...&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/social-media-agent"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Open Console
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* WEBSITE STUDIO */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#1B2A4A]/5 blur-[100px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1B2A4A]/15 bg-[#1B2A4A]/5">
                <LayoutDashboard size={26} className="text-[#1B2A4A]" />
              </div>
              <span className="rounded-full border border-[#1B2A4A]/20 bg-[#1B2A4A]/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#1B2A4A]">
                AI Builder
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              Website
              <br />
              Studio
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Generate premium developer and brokerage websites with
              editable sections, AI content and luxury templates.
            </p>

            {/* Browser Preview */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#14181F]/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#14181F]/5 bg-[#FCFBF8] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-3 p-5">
                <div className="h-20 rounded-xl bg-gradient-to-r from-[#1B2A4A]/10 to-[#1B2A4A]/5" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 rounded-lg bg-[#FCFBF8] border border-[#14181F]/5" />
                  <div className="h-12 rounded-lg bg-[#FCFBF8] border border-[#14181F]/5" />
                </div>
                <div className="h-8 rounded-lg bg-[#FCFBF8] border border-[#14181F]/5" />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/real-estate/web-studio/create"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Start Building
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* SEO AGENT AUDIT MODULE */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute right-0 top-0 h-75 w-75 rounded-full bg-emerald-500/10 blur-[120px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Search size={26} className="text-[#1F4D3A]" />
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#1F4D3A]">
                SEO Agent
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              SEO Audit &<br />
              Diagnostics Agent
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Automate technical SEO crawling, Core Web Vitals diagnostics, Schema verification, and keyword health.
            </p>

            {/* Mini Diagnostic Score Card Preview */}
            <div className="mt-8 rounded-2xl border border-[#14181F]/10 bg-[#FCFBF8] p-5">
              <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#565C6B]">
                  Audit Scorecard
                </span>
                <span className="text-xs font-jost font-bold text-[#1F4D3A]">
                  92/100
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center font-jost">
                <div className="rounded-lg border border-[#14181F]/5 bg-white p-2 shadow-sm">
                  <p className="text-[9px] uppercase text-[#565C6B]">Perf</p>
                  <p className="mt-1 text-sm text-[#1F4D3A]">94</p>
                </div>
                <div className="rounded-lg border border-[#14181F]/5 bg-white p-2 shadow-sm">
                  <p className="text-[9px] uppercase text-[#565C6B]">Health</p>
                  <p className="mt-1 text-sm text-[#1F4D3A]">98</p>
                </div>
                <div className="rounded-lg border border-[#14181F]/5 bg-white p-2 shadow-sm">
                  <p className="text-[9px] uppercase text-[#565C6B]">Schema</p>
                  <p className="mt-1 text-sm text-[#9C7A3C]">Valid</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/seo-agent/audit"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Run SEO Audit
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* COMPETITOR COMPARISON MODULE */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute right-0 top-0 h-75 w-75 rounded-full bg-red-500/10 blur-[120px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50">
                <Swords size={26} className="text-rose-600" />
              </div>
              <span className="rounded-full border border-rose-200 bg-rose-100 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-rose-700">
                Gap Analysis
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              Competitor
              <br />
              Gap Analysis
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Extract parallel DOM metrics, Google NLP salience entities, and Core Web Vitals to uncover critical deficits.
            </p>

            {/* Versus Comparison Scoreboard Preview */}
            <div className="mt-8 rounded-2xl border border-[#14181F]/10 bg-[#FCFBF8] p-5">
              <div className="flex items-center justify-between font-jost text-xs">
                <div className="text-left">
                  <p className="font-sans text-[9px] uppercase tracking-widest text-[#1F4D3A]">
                    Target
                  </p>
                  <p className="mt-1 font-medium text-[#14181F]">drivenproperties.com</p>
                </div>
                <div className="rounded-full border border-[#14181F]/10 bg-white px-2.5 py-1 text-[10px] uppercase text-[#565C6B] shadow-sm">
                  VS
                </div>
                <div className="text-right">
                  <p className="font-sans text-[9px] uppercase tracking-widest text-rose-600">
                    Competitor
                  </p>
                  <p className="mt-1 font-medium text-[#14181F]">famproperties.com</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/seo-agent/competitor"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Compare Competitor
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CONTENT COMPLIANCE MODULE */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute right-0 top-0 h-75 w-75 rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50">
                {/* Remember to import FileCheck from 'lucide-react' */}
                <FileCheck size={26} className="text-blue-600" />
              </div>
              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-blue-700">
                QA Engine
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              Content
              <br />
              Compliance
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Deterministically verify live page architecture and JSON-LD schemas directly against your .docx content briefs.
            </p>

            {/* Expected vs Actual Preview */}
            <div className="mt-8 rounded-2xl border border-[#14181F]/10 bg-[#FCFBF8] p-5">
              <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#565C6B]">
                  Deep Diff Analysis
                </span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-amber-600">
                  Warning
                </span>
              </div>
              <div className="mt-4 space-y-3 font-jost">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#565C6B]">Expected (Brief)</span>
                  <span className="font-medium text-[#14181F]">7 FAQ Schemas</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#565C6B]">Actual (Live)</span>
                  <span className="font-medium text-rose-600">6 FAQ Schemas</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/seo-agent/compliance"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Initiate Audit
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* DEVELOPER ADVISORS MODULE */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute -right-20 -top-20 h-75 w-75 rounded-full bg-[#b8924a]/10 blur-[120px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b8924a]/20 bg-[#b8924a]/5">
                <Building2 size={26} className="text-[#b8924a]" />
              </div>
              <span className="rounded-full border border-[#b8924a]/20 bg-[#b8924a]/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#b8924a]">
                New
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              Developer
              <br />
              Advisors
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Build high-converting, co-branded landing pages for specific master developers with interactive project maps.
            </p>

            {/* Mini Preview */}
            <div className="mt-8 rounded-2xl border border-[#14181F]/10 bg-[#FCFBF8] p-5">
              <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#565C6B]">
                  Active Master Developers
                </span>
              </div>
              <div className="mt-4 space-y-3 font-jost">
                <div className="flex items-center gap-3 rounded-xl border border-[#14181F]/5 bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b8924a]/10">
                    <Building2 size={12} className="text-[#b8924a]" />
                  </div>
                  <span className="text-xs font-medium text-[#14181F]">Emaar Properties</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-[#14181F]/5 bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b8924a]/10">
                    <Building2 size={12} className="text-[#b8924a]" />
                  </div>
                  <span className="text-xs font-medium text-[#14181F]">Aldar Properties</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/real-estate/developer-advisors"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Open Builder
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CREATIVE AGENT MODULE */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35 }}
          className="group relative flex min-h-117.5 flex-col overflow-hidden rounded-3xl border border-[#14181F]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute right-0 top-0 h-75 w-75 rounded-full bg-indigo-500/10 blur-[120px]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50">
                <Wand2 size={26} className="text-indigo-600" />
              </div>
              <span className="rounded-full border border-indigo-200 bg-indigo-100 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-indigo-700">
                Art Director
              </span>
            </div>

            <h2 className="mt-8 text-3xl font-medium tracking-tight text-[#14181F]">
              AI Creative
              <br />
              Agent
            </h2>

            <p className="mt-4 text-[14.5px] leading-7 text-[#565C6B]">
              Programmatically generate professional, agency-grade luxury ad creatives using Gemini Vision and dynamic templates.
            </p>

            {/* Mini Ad Satori Preview */}
            <div className="mt-8 rounded-2xl border border-[#14181F]/10 bg-[#FCFBF8] p-5">
              <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#565C6B]">
                  Layout Render
                </span>
                <span className="rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-green-600">
                  Ready
                </span>
              </div>

              {/* Miniature representation of the Luxury Ad layout */}
              <div className="mt-4 relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#14181F] to-neutral-900 flex flex-col justify-between p-4 shadow-inner">
                <div className="h-3 w-12 rounded-sm bg-white/30 self-end" />
                <div className="mt-auto relative z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#b8924a]" />
                    <div className="h-1.5 w-16 rounded-sm bg-[#b8924a]" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-white/90 mb-2.5" />
                  <div className="h-5 w-20 rounded border border-[#b8924a]/50 bg-[#14181F]/60" />
                </div>
                {/* Gradient fade simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/creative-agent"
                className="inline-flex items-center gap-3 rounded-full border border-[#14181F]/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14181F] transition-colors hover:border-[#14181F]/30"
              >
                Launch Studio
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const RosterOld = () => {
  return (
    <section className="border-t border-[#14181F]/8 bg-white">
      <div className="mx-auto max-w-350 px-6 py-24 lg:px-10">
        <div className="max-w-xl">
          <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
            The roster
          </span>
          <h2 className="mt-5 text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
            Four agents. One login.
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-[#565C6B]">
            Each one is built to do a single job well, instead of one
            model trying to do everything badly.
          </p>
        </div>

        <div className="mt-16 divide-y divide-[#14181F]/8 border-t border-[#14181F]/8">
          {ROSTER.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group grid grid-cols-1 gap-6 py-10 md:grid-cols-[80px_1fr_auto] md:items-center md:gap-10"
            >
              <span className="font-jost text-sm text-[#14181F]/25">
                {agent.id}
              </span>

              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#14181F]/10 bg-[#FCFBF8]">
                  <agent.icon size={20} className="text-[#1B2A4A]" />
                </div>
                <div>
                  <p className="font-jost text-[10px] uppercase tracking-[0.18em] text-[#9C7A3C]">
                    {agent.role}
                  </p>
                  <h3 className="mt-1.5 text-xl font-medium">
                    {agent.name}
                  </h3>
                  <p className="mt-2 max-w-lg text-[14px] leading-7 text-[#565C6B]">
                    {agent.desc}
                  </p>
                </div>
              </div>

              <Link
                href={agent.href}
                className="inline-flex items-center gap-2 self-start rounded-full border border-[#14181F]/12 px-5 py-2.5 text-[12.5px] font-medium text-[#14181F] transition-colors group-hover:border-[#1B2A4A] group-hover:text-[#1B2A4A] md:self-center"
              >
                {agent.cta}
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Roster;