// src/app/privacy-policy/page.tsx
import Navbar from "@/components/navbar";
import { Footer } from "../(home)/_footer";

export default function PrivacyPolicy() {
  return (
    <main className="font-jost bg-[#FCFBF8]">
      <Navbar />
      <div className="px-6 py-16 text-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 uppercase font-cormorant">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-1 pl-1">Effective date: 26/06/2019</p>
          <p className="text-sm text-gray-500 mb-10 pl-1">Last updated: 05/10/2026</p>

          <div className="space-y-10 text-base leading-relaxed font-jost font-normal">

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
              <div className="space-y-4">
                <p>
                  This Privacy Policy explains how Solvetude Marketing Consultancy Ltd, trading as Solvetude (&quot;Solvetude&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), collects, uses, shares, and protects personal data when you use RIWAA by Solvetude (&quot;RIWAA&quot;) at <a href="https://riwaa.solvetude.com/" className="text-blue-600 hover:underline">riwaa.solvetude.com</a>&nbsp;and the services available through it (the &quot;Platform&quot;).
                </p>
                <p>
                  By accessing or using the Platform, you confirm that you have read this policy. If you do not agree with it, please do not use the Platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Who we are</h2>
              <div className="space-y-4">
                <p>
                  RIWAA is an AI-powered platform for real estate developers, brokerages, and advisors, owned and operated by Solvetude. For the purposes of applicable data protection law, Solvetude is the controller of personal data collected through RIWAA, except where we process data on behalf of a brokerage or developer, in which case we act as a processor on their instructions.
                </p>
                <p>
                  Our registered address is Building 280, Taweelah, Abu Dhabi. You can reach us at <a href="mailto:billing@solvetude.com" className="text-blue-600 hover:underline">billing@solvetude.com</a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Services covered by this policy</h2>
              <p className="mb-4">This policy applies to every service offered on the Platform, including the following.</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Advisor Portfolio Studio</li>
                <li>Social Intelligence</li>
                <li>Website Studio</li>
                <li>SEO Audit and Diagnostics Agent</li>
                <li>Competitor Gap Analysis</li>
                <li>Content Compliance</li>
                <li>Developer Advisors</li>
                <li>AI Creative Agent</li>
                <li>Meta Ads AI Agent</li>
              </ul>
              <p>
                We may add new services over time. This policy will apply to them from the date they launch.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Information we collect</h2>
              <p className="mb-4">We collect information in four ways: directly from you, from accounts you connect, from publicly available sources, and automatically when you use the Platform.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Information you provide to us</h3>
                  <p className="mb-2">When you create an account or use a service, you may give us your name, email address, phone number, job title, brokerage or company name, login credentials, and any messages you send us, including through WhatsApp.</p>
                  <p>You may also provide professional details for advisor profiles, such as biographies, photographs, languages spoken, areas of expertise, awards and achievements, license or registration numbers, and internal brokerage data such as listings, team structures, and brand materials. If you upload content briefs, documents, images, or logos, we collect those as well.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Information from accounts you connect</h3>
                  <p className="mb-2">You can link your Google, Facebook, Instagram, and LinkedIn accounts to the Platform. When you do, we receive the data that you authorize on the permission screen shown by each provider. Depending on the service, this may include:</p>
                  <ul className="list-disc pl-6 space-y-2 mb-2">
                    <li>Your basic profile details, such as name, email address, and profile picture</li>
                    <li>Business profile information, including Google Business Profile details</li>
                    <li>Reviews, ratings, comments, and replies posted on your business pages</li>
                    <li>Page and account identifiers, and advertising account information</li>
                    <li>Campaign, audience, budget, and performance data from your advertising accounts</li>
                  </ul>
                  <p>We only access the data needed to deliver the services you choose to use.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Information from publicly available sources</h3>
                  <p>To build advisor profiles and websites, our AI agents collect publicly available information about you or your business. This can include your public property listings, professional biography, reviews, ratings, awards, and brand information found on third-party property portals, business directories, and your own website or social media pages. Our SEO and competitor tools also analyze the publicly visible content, structure, and performance data of websites you ask us to review.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Information collected automatically</h3>
                  <p>When you use the Platform, we automatically collect technical data such as your IP address, browser type, device type, operating system, pages visited, features used, timestamps, and referring pages. We collect this through cookies and similar technologies, described in Section 12.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. How our AI agents use your information</h2>
              <p className="mb-4">RIWAA uses AI agents to carry out tasks on your behalf. These agents may access the data you provide, the data from accounts you connect, and publicly available data to do the following:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Generate advisor biographies, profiles, and microsites</li>
                <li>Import and update listings, reviews, and achievements</li>
                <li>Draft replies to Google reviews and to Facebook and Instagram comments</li>
                <li>Generate website sections, page content, and creative assets</li>
                <li>Audit websites for technical SEO, performance, schema, and content compliance</li>
                <li>Draft advertising campaign structures, targeting, and budgets</li>
              </ul>
              <p className="mb-4">Replies, content, and campaign changes are prepared and placed in a queue for your approval. They are not published or pushed to third-party platforms without your confirmation.</p>
              <p className="mb-4">AI outputs can contain errors. You are responsible for reviewing generated content before approving it.</p>
              <p>Some of our AI features are powered by third-party AI providers, including Google&apos;s Gemini models. Where we send data to these providers, we share only what is needed to perform the requested task.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Connected accounts and third-party platforms</h2>
              <div className="space-y-4">
                <p>
                  When you connect a Google, Facebook, Instagram, or LinkedIn account, you authorize us to access and, where the service requires it, act on that account within the permissions you grant. Our use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements. Our use of data received from Meta and LinkedIn follows their respective platform terms and policies.
                </p>
                <p>
                  We use data from connected accounts only to provide and improve the features you have requested. We do not sell it, and we do not use it for unrelated advertising.
                </p>
                <p>
                  You can disconnect any account at any time from the Platform settings or from the security settings of the provider itself. Once disconnected, we stop accessing that account&apos;s data. Data we have already stored will be handled under Section 10.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. How we use your information</h2>
              <p className="mb-4">We use personal data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your account and authenticate you</li>
                <li>Provide, operate, and personalize the services you request</li>
                <li>Generate, publish, and maintain advisor profiles, microsites, and websites</li>
                <li>Manage reviews, comments, and advertising activity on your behalf</li>
                <li>Run SEO audits, competitor analyses, and compliance checks</li>
                <li>Respond to your enquiries and provide support</li>
                <li>Send service updates, security alerts, and, where permitted, information about our services</li>
                <li>Monitor performance, fix errors, and improve the Platform and our AI features</li>
                <li>Protect the Platform against fraud, abuse, and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Legal basis for processing</h2>
              <p>
                Where the law requires a legal basis for processing, we rely on the following: performing our contract with you, your consent (for example, when you connect an account or accept cookies), our legitimate interests in operating and improving the Platform, and compliance with legal obligations. Where we process data under the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data, we do so in line with its requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. How we share your information</h2>
              <p className="mb-4">We do not sell your personal data. We share it only in the following situations.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service providers.</strong> We use trusted providers for cloud hosting, AI processing, analytics, email and messaging, and customer support. They may process data only on our instructions and under confidentiality obligations.</li>
                <li><strong>Connected platforms.</strong> When you approve an action, such as publishing a reply or launching a campaign, we send the relevant content to Google, Meta, or LinkedIn on your behalf.</li>
                <li><strong>Your brokerage or organization.</strong> If you use the Platform through a brokerage or developer account, administrators of that account may be able to see and manage your profile, activity, and content.</li>
                <li><strong>Published content.</strong> Advisor profiles, microsites, and websites that you choose to publish are visible to the public and may be indexed by search engines.</li>
                <li><strong>Legal and business reasons.</strong> We may disclose data to comply with law, respond to lawful requests, enforce our terms, or protect rights and safety. If Solvetude is involved in a merger, acquisition, or sale of assets, personal data may be transferred as part of that transaction, with notice to you where required.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Data retention</h2>
              <div className="space-y-4">
                <p>
                  We keep personal data for as long as your account is active and as needed to provide the services. After you close your account or disconnect a service, we delete or anonymize your data within a standard retention period, unless we must keep it longer to meet legal, accounting, or security obligations. Backups are overwritten on a regular cycle.
                </p>
                <p>
                  You can ask us to delete your data at any time using the contact details in Section 18.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. International data transfers</h2>
              <div className="space-y-4">
                <p>
                  RIWAA is operated from the United Arab Emirates, and our service providers may be located in other countries. When we transfer personal data outside your country, we take steps to ensure that it remains protected, such as using contractual safeguards and working with providers that maintain appropriate security standards.
                </p>
                <p>
                  Because buyers and visitors may view published profiles from anywhere in the world, public content on microsites and websites is accessible internationally.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Cookies and similar technologies</h2>
              <div className="space-y-4">
                <p>
                  We use cookies and similar technologies to keep you signed in, remember your preferences, understand how the Platform is used, and improve performance. These include essential cookies required for the Platform to work, and analytics cookies that help us measure usage.
                </p>
                <p>
                  You can control cookies through your browser settings. Blocking essential cookies may prevent parts of the Platform from working.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Data security</h2>
              <div className="space-y-4">
                <p>
                  We use technical and organizational measures to protect personal data, including encryption in transit, access controls, role-based permissions, and regular security reviews. Access tokens for connected accounts are stored securely and are used only for the services you enable.
                </p>
                <p>
                  No system is completely secure. If we become aware of a breach affecting your personal data, we will notify you and the relevant authorities as required by law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Your rights</h2>
              <p className="mb-4">Depending on where you live, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Restrict or object to certain processing</li>
                <li>Withdraw your consent at any time</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at <a href="mailto:billing@solvetude.com" className="text-blue-600 hover:underline">billing@solvetude.com</a>. We may need to verify your identity before responding, and we will reply within the period required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">15. Children&apos;s privacy</h2>
              <p>
                The Platform is intended for business use by adults. We do not knowingly collect personal data from anyone under 18. If you believe a child has given us personal data, please contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">16. Third-party links</h2>
              <p>
                The Platform may link to third-party websites and services, including the platforms you connect. We are not responsible for their privacy practices, and we encourage you to read their policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">17. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. When we make material changes, we will update the date at the top and notify you through the Platform or by email. Your continued use of the Platform after changes take effect means you accept the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">18. Contact us</h2>
              <p className="mb-4">If you have questions about this policy or how we handle your data, please contact:</p>
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