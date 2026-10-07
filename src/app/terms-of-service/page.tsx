// src/app/terms-of-service/page.tsx
import Navbar from "@/components/navbar";
import { Footer } from "../(home)/_footer";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="font-jost bg-[#FCFBF8]">
      <Navbar />
      <div className="px-6 py-16 text-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 uppercase font-cormorant">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-1 pl-1">Effective date: 26/06/2019</p>
          <p className="text-sm text-gray-500 mb-10 pl-1">Last updated: 05/10/2026</p>

          <div className="space-y-10 text-base leading-relaxed font-jost font-normal">

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction and acceptance</h2>
              <div className="space-y-4">
                <p>
                  These Terms of Service (&quot;Terms&quot;) govern your access to and use of RIWAA by Solvetude (&quot;RIWAA&quot;), available at riwaa.solvetude.com, and the services offered through it (the &quot;Platform&quot;). The Platform is owned and operated by Solvetude Marketing Consultancy Ltd, trading as Solvetude (&quot;Solvetude&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
                </p>
                <p>
                  By creating an account, logging in, or using the Platform, you agree to these Terms and to our <Link href="/privacy-policy">Privacy Policy</Link>. If you are using the Platform on behalf of a brokerage, developer, or other organization, you confirm that you have the authority to bind that organization, and &quot;you&quot; includes it.
                </p>
                <p>
                  If you do not agree with these Terms, please do not use the Platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. The Platform and our services</h2>
              <p className="mb-4">
                RIWAA provides AI agents that help real estate developers, brokerages, and advisors build their online presence and manage their digital activity from one console. The services currently include the following.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Advisor Portfolio Studio</strong>, which generates advisor profiles and microsites using public listings, reviews, achievements, and your own brokerage data</li>
                <li><strong>Social Intelligence</strong>, which manages Google reviews and Facebook and Instagram comments and drafts replies</li>
                <li><strong>Website Studio</strong>, which generates developer and brokerage websites with editable sections and AI content</li>
                <li><strong>SEO Audit and Diagnostics Agent</strong>, which reviews technical SEO, performance, schema, and keyword health</li>
                <li><strong>Competitor Gap Analysis</strong>, which compares publicly available website metrics against competitors</li>
                <li><strong>Content Compliance</strong>, which checks live pages against your content briefs</li>
                <li><strong>Developer Advisors</strong>, which builds co-branded landing pages for specific master developers</li>
                <li><strong>AI Creative Agent</strong>, which generates advertising creatives</li>
                <li><strong>Meta Ads AI Agent</strong>, which drafts campaign structures, targeting, and budgets and can push them to Meta Ads Manager</li>
              </ul>
              <p>
                We may add, change, or remove features at any time. Some features may be labelled as new or in beta and may be less stable than others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Eligibility and accounts</h2>
              <div className="space-y-4">
                <p>
                  You must be at least 18 years old and legally able to enter into a contract to use the Platform. The Platform is intended for professional use by real estate businesses and professionals.
                </p>
                <p>
                  You are responsible for the accuracy of the information you give us, for keeping your login credentials confidential, and for all activity under your account. Please tell us immediately if you suspect unauthorized access.
                </p>
                <p>
                  If your organization has several users, an administrator may control access, roles, and permissions, and may see and manage the content created by users in that account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. How the AI agents work</h2>
              <div className="space-y-4">
                <p>
                  RIWAA&apos;s agents prepare content and actions on your behalf, such as biographies, website content, review and comment replies, creatives, and campaign drafts. Replies, content, and campaign changes are placed in a queue for your approval and are not published or sent to third-party platforms without your confirmation.
                </p>
                <p>
                  AI outputs can be inaccurate, incomplete, or unsuitable for your purpose. You are responsible for reviewing everything before you approve it, and for what is published under your name or brand.
                </p>
                <p>
                  We do not guarantee that AI-generated content is unique, error-free, or free of similarity to other content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Connected accounts and third-party services</h2>
              <div className="space-y-4">
                <p>
                  You can connect your Google, Facebook, Instagram, and LinkedIn accounts to the Platform. By connecting an account, you authorize us to access it and, where a service requires it, act on it within the permissions you grant. You confirm that you have the right to connect each account and to authorize those actions.
                </p>
                <p>
                  Your use of those platforms remains subject to their own terms and policies. We are not responsible for changes, restrictions, outages, or account actions taken by third-party platforms, including changes to their data access or advertising rules.
                </p>
                <p>
                  You can disconnect an account at any time from the Platform or from the provider&apos;s own settings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Your content and data</h2>
              <div className="space-y-4">
                <p>
                  You keep ownership of the content and data you provide to the Platform, including your brokerage data, photographs, logos, biographies, and documents (&quot;Your Content&quot;).
                </p>
                <p>
                  You grant us a limited, non-exclusive licence to use, store, process, and display Your Content, and to share it with our service providers, only as needed to operate the Platform and provide the services you request.
                </p>
                <p>
                  You confirm that you have all rights, permissions, and consents needed to provide Your Content and to have our agents use it, including the right to use any names, images, logos, or trademarks of developers, brokerages, colleagues, or clients. This applies in particular to Developer Advisors and other co-branded pages, where you must be authorized to use the relevant developer&apos;s brand.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Publicly available information</h2>
              <div className="space-y-4">
                <p>
                  To build profiles and websites, our agents collect publicly available information, such as listings, reviews, and achievements from third-party sources. We do not control that information and do not guarantee that it is accurate, complete, or current.
                </p>
                <p>
                  You are responsible for checking that imported information is correct, that you are entitled to display it, and that it complies with the terms of the sites it came from.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Real estate advertising and compliance</h2>
              <div className="space-y-4">
                <p>
                  You are solely responsible for making sure that your listings, advertisements, websites, profiles, and communications comply with all applicable laws and regulations, including real estate licensing, advertising and permit requirements, consumer protection rules, and data protection laws.
                </p>
                <p>
                  The Platform does not provide legal, regulatory, or professional advice, and our Content Compliance and SEO tools do not certify that your content meets any legal or regulatory standard.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Advertising and Meta Ads</h2>
              <div className="space-y-4">
                <p>
                  The Meta Ads AI Agent drafts campaigns, targeting, and budgets. You decide whether to approve them. Advertising spend is charged by the advertising platform, not by us, and you are responsible for all budgets, charges, and results from campaigns you approve.
                </p>
                <p>
                  You must comply with the advertising policies of the platforms you use. We do not guarantee that any campaign will be approved, will perform in a certain way, or will produce leads, sales, or any specific return.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. SEO, audits, and analysis</h2>
              <div className="space-y-4">
                <p>
                  SEO audits, scorecards, competitor comparisons, and similar outputs are provided for information and guidance. Search engine rankings depend on factors outside our control, and we do not guarantee any ranking, traffic, or performance result.
                </p>
                <p>
                  Competitor Gap Analysis uses publicly available information. You agree to use it only for lawful, legitimate business purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Published profiles and websites</h2>
              <div className="space-y-4">
                <p>
                  Advisor profiles, microsites, and websites that you choose to publish are public and may be indexed by search engines and viewed by anyone, anywhere. You are responsible for the content you publish and for removing anything you do not want to be public.
                </p>
                <p>
                  We may suspend or remove published content that breaches these Terms or the law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Acceptable use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Platform for anything unlawful, misleading, or fraudulent</li>
                <li>Publish false, defamatory, discriminatory, or infringing content</li>
                <li>Impersonate any person or business, or misrepresent your licence, credentials, or listings</li>
                <li>Use the Platform to send spam or to harass others</li>
                <li>Attempt to access accounts, data, or systems you are not authorized to use</li>
                <li>Interfere with, overload, or reverse engineer the Platform, or attempt to extract its underlying models or source code</li>
                <li>Use automated means to scrape or copy the Platform other than through features we provide</li>
                <li>Use the Platform to build a competing product</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Our intellectual property</h2>
              <div className="space-y-4">
                <p>
                  The Platform, including its software, design, templates, AI workflows, trademarks, and logos, belongs to Solvetude or its licensors and is protected by intellectual property laws. These Terms give you a limited, non-exclusive, non-transferable right to use the Platform for your internal business purposes while your account is active.
                </p>
                <p>
                  Subject to your rights in Your Content, you may use the content generated for you by the Platform for your business purposes. We may use feedback you give us to improve the Platform without obligation to you.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Fees and payment</h2>
              <p>
                Unless stated otherwise, fees are non-refundable, exclusive of applicable taxes such as VAT, and payable in the currency stated on your invoice. We may change our fees with reasonable notice before the change takes effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">15. Availability and changes</h2>
              <div className="space-y-4">
                <p>
                  We aim to keep the Platform available and working well, but we do not promise that it will be uninterrupted or error-free. We may suspend the Platform for maintenance, security, or reasons outside our control.
                </p>
                <p>
                  We may update the Platform and its features at any time.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">16. Disclaimers</h2>
              <div className="space-y-4">
                <p>
                  The Platform and all outputs are provided &quot;as is&quot; and &quot;as available&quot;. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement.
                </p>
                <p>
                  We do not warrant that AI-generated content, imported data, audits, or analysis will be accurate, complete, or suitable for your needs, or that using the Platform will achieve any business result.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">17. Limitation of liability</h2>
              <p>
                To the fullest extent permitted by law, Solvetude and its directors, employees, and partners will not be liable for any indirect, incidental, special, or consequential damages, or for loss of profits, revenue, data, goodwill, or business opportunities, arising from or related to your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">18. Indemnification</h2>
              <p>
                You agree to indemnify and hold Solvetude harmless from claims, losses, and expenses, including reasonable legal fees, arising from Your Content, content you approve and publish, your campaigns, your breach of these Terms, or your violation of any law or third-party right.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">19.Suspension and termination</h2>
              <div className="space-y-4">
                <p>
                  You can stop using the Platform and close your account at any time. We may suspend or terminate your access if you breach these Terms, if we are required to by law or by a third-party platform, or if your use creates risk for us or others.
                </p>
                <p>
                  When your account ends, your right to use the Platform stops, and we will handle your data as described in our <Link href="/privacy-policy">Privacy Policy</Link>. Sections that by their nature should continue, including those on intellectual property, disclaimers, liability, and indemnification, will remain in effect.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">20. Privacy</h2>
              <p>
                Our <Link href="/privacy-policy">Privacy Policy</Link> explains how we collect and use personal data. By using the Platform, you acknowledge it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">21. Governing law and disputes</h2>
              <p>
                These Terms are governed by the laws of the United Arab Emirates. We will try to resolve any dispute informally first. If that fails, the courts of Abu Dhabi will have exclusive jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">22. Changes to these Terms</h2>
              <p>
                We may update these Terms from time to time. When we make material changes, we will update the date at the top and notify you through the Platform or by email. Your continued use of the Platform after the changes take effect means you accept them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">23. General</h2>
              <p>
                These Terms, together with the <Link href="/privacy-policy">Privacy Policy</Link> and any written agreement with us, are the whole agreement between you and Solvetude about the Platform. If any part is found unenforceable, the rest will remain in effect. Our failure to enforce a right is not a waiver of it. You may not transfer your rights under these Terms without our written consent, but we may transfer ours as part of a business transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">24. Contact us</h2>
              <p className="mb-4">If you have questions about these Terms, please contact:</p>
              <address className="not-italic text-gray-800 space-y-1">
                <p><strong>RIWAA by Solvetude</strong></p>
                <p>Solvetude Marketing Consultancy Ltd, trading as Solvetude</p>
                <p>Building No. 280, Taweelah, Abu Dhabi, UAE</p>
                <p>Email: <a href="mailto:billing@solvetude.com" className="text-blue-600 hover:underline">billing@solvetude.com</a></p>
              </address>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}