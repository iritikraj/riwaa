// riwaa/src/app/meta-agent/unauthorized/page.tsx
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default async function UnauthorizedPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const resolvedParams = await searchParams;
  const reason = resolvedParams.reason;

  let title = "Access Restricted";
  let message = "You do not have permission to view this page. Please contact your administrator if you believe this is an error.";
  let Icon = ShieldAlert;
  let iconColor = "text-rose-600";
  let iconBg = "bg-rose-50 border-rose-100";

  // Customize the message based on the redirect reason
  if (reason === 'no_meta_accounts') {
    title = "No Accounts Assigned";
    message = "Your user profile has not been assigned to any Meta Ads accounts. Please contact your system administrator to request access to a client workspace.";
    Icon = Building2;
    iconColor = "text-[#9C7A3C]";
    iconBg = "bg-[#9C7A3C]/10 border-[#9C7A3C]/20";
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center justify-center p-6 font-jost">
      <div className="max-w-md w-full bg-white rounded-[28px] border border-[#14181F]/10 p-10 text-center shadow-sm">
        <div className={`mx-auto h-16 w-16 ${iconBg} border rounded-2xl flex items-center justify-center mb-6`}>
          <Icon size={28} className={iconColor} />
        </div>

        <h1 className="text-2xl md:text-4xl font-semibold text-[#14181F] font-jost uppercase tracking-wide mb-3">
          {title}
        </h1>

        <p className="text-[14px] leading-relaxed text-[#565C6B] mb-8">
          {message}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#14181F] text-[#FCFBF8] rounded-full text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#14181F]/80 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}