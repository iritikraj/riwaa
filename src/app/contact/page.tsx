import { Metadata } from "next";
import Navbar from "@/components/navbar";
import { Footer } from "../(home)/_footer";
import ContactForm from "./_client";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Riwaa - Real Estate AI Agents",
  description: "Ready to onboard your Real Estate AI Agents? Contact the Riwaa team to book a walkthrough, deploy autonomous agents for your brokerage, and scale your operations.",
  keywords: ["Real Estate AI", "Autonomous AI Agents", "Brokerage AI", "Riwaa Contact", "Proptech AI"],
  openGraph: {
    title: "Contact Us | Riwaa - Real Estate AI Agents",
    description: "Ready to scale your operations without adding headcount? Reach out to the Riwaa team to deploy autonomous marketing and SEO agents.",
    url: "https://riwaa.solvetude.com/contact",
    siteName: "Riwaa",
    type: "website",
  },
};

const waNumber = "971581980131";
const waMessage = encodeURIComponent("Hi, I would like to know more about RIWAA.");

const faqs = [
  {
    question: "How does the AI approval workflow work?",
    answer: "Riwaa operates on a strict 'Every agent drafts. You approve.' model. Whether Social Intelligence drafts a reply to an Instagram comment, or the Meta Ads Agent generates a new campaign structure, nothing is ever auto-published. You review and approve everything from your central console, ensuring your brand's voice is always protected."
  },
  {
    question: "What specific tasks can the Riwaa agents automate?",
    answer: "Our roster includes specialized agents built natively for real estate. They automatically generate luxury advisor portfolios using Property Finder and Bayut data, manage social media reviews, run technical SEO audits and competitor gap analyses, and build premium developer landing pages. Each agent is designed to do a single job exceptionally well."
  },
  {
    question: "Do I need technical knowledge or multiple software subscriptions to use this?",
    answer: "No. Riwaa consolidates your workflow into one single login. You don't need separate tools for SEO diagnostics, website building, social media management, or media buying. Our agents report into one powerful workspace and natively understand real estate listings, bios, and reviews without complex technical setup."
  },
  {
    question: "Can the workspace scale with a large enterprise brokerage?",
    answer: "Yes, Riwaa is built for enterprise habits with agent speed. Featuring role-based access and multi-brand support, the system works seamlessly whether you are a boutique agency with 5 advisors or an enterprise firm managing a 40-desk roster."
  },
  {
    question: "Is my brokerage's proprietary data and client information secure?",
    answer: "Absolutely. We strictly adhere to the Google API Services User Data Policy. We use secure OAuth 2.0 tokens for platform integrations, and we never use your proprietary brokerage data, CRM data, or API inputs to train generalized AI models."
  },
  {
    question: "How do I onboard the agents or contact support?",
    answer: "You can put our agents on your team without adding headcount. To get started, simply book a walkthrough using the form on this page—no setup required to look. If you are an existing partner needing immediate support, reach out to our team directly at ak@solvetude.com or call +971 58 198 0131."
  }
];

export default function ContactPage() {
  // Generate the FAQ JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <main className="font-jost bg-[#FCFBF8] min-h-screen flex flex-col">
      {/* Inject SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <div className="grow w-full max-w-7xl mx-auto px-6 py-20 lg:py-28">

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">

          {/* Left Column: Typography & Info */}
          <div className="flex flex-col pt-4">
            <span className="text-[#9C7A3C] text-sm font-semibold uppercase tracking-[0.3em] mb-6 block">
              Contact Us
            </span>

            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 font-jost leading-[1.1] mb-6">
              <span className="text-[#9C7A3C] text-xl md:text-2xl font-medium leading-relaxed">
                Ready to onboard your
              </span>
              <br />
              Real Estate AI Agents?
            </h1>

            <p className="text-[#565C6B] text-base leading-relaxed mb-12 max-w-md">
              Looking to deploy autonomous agents for your brokerage or need support with your current Riwaa workspace?
              Whether it&apos;s a quick question about our API integrations or something that requires a dedicated walkthrough,
              our team is ready to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#14181F]/5 shadow-sm">
                  <Mail className="h-5 w-5 text-[#9C7A3C]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#565C6B] mb-1">Email</p>
                  <a href="mailto:ak@solvetude.com" className="font-medium hover:text-[#9C7A3C] transition-colors">ak@solvetude.com</a>
                </div>
              </div>

              {/* <div className="flex items-center gap-4 text-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#14181F]/5 shadow-sm">
                  <Phone className="h-5 w-5 text-[#9C7A3C]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#565C6B] mb-1">Phone</p>
                  <a href="tel:+971581980131" className="font-medium hover:text-[#9C7A3C] transition-colors">+971 58 198 0131</a>
                </div>
              </div> */}

              <div className="flex items-center gap-4 text-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#14181F]/5 shadow-sm">
                  <MessageCircle className="h-5 w-5 text-[#9C7A3C]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#565C6B] mb-1">Whatsapp</p>
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-[#9C7A3C] transition-colors">
                    +971 58 198 0131
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form Card */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#14181F]/5 shadow-2xl shadow-[#14181F]/3">
            <h3 className="text-xl font-medium text-gray-900 mb-6 font-jost">Send a message</h3>
            <ContactForm />
          </div>

        </div>

        {/* FAQ Section (Bottom Full Width) */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-medium text-gray-900 font-cormorant mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-[#565C6B] text-sm">Everything you need to know about the Riwaa workspace.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-[#14181F]/10 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-2xl p-6 text-gray-900 font-medium">
                  {faq.question}
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9C7A3C]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-sm text-[#565C6B] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}