import { fetchActiveGoogleAccounts } from '@/lib/google-ads-agent/strapi';
import SettingsClient from './_client';
import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';

export default async function SettingsPage() {
  // Fetch the active Google Ads connection for the logged-in user
  let activeAccount = null;

  try {
    const accounts = await fetchActiveGoogleAccounts();
    if (accounts && accounts.length > 0) {
      activeAccount = accounts[0].attributes || accounts[0];
    }
  } catch (error) {
    console.error("Failed to fetch Google accounts:", error);
  }

  return (
    <div className="bg-[#FCFBF8] font-jost">
      <Navbar />
      <SettingsClient activeAccount={activeAccount} />;
      <Footer />
    </div>
  )
}