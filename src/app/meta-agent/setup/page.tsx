import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import CampaignSetupClientPage from './_client';

export default function ReportEnginePage() {
  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen flex flex-col">
      {/* Server Component Navbar */}
      <Navbar hideLoginButton={true} />

      {/* Interactive Client Dashboard */}
      <CampaignSetupClientPage />

      {/* Footer */}
      <Footer />
    </div>
  );
}