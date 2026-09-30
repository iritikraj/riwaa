// riwaa/src/app/meta-agent/[accountId]/layout.tsx
import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import { headers } from 'next/headers';
import WorkspaceHeaderClient from './_workspace';

export default async function MetaWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ accountId: string }>;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;

  let accounts = [];

  try {
    const headersList = await headers();
    const res = await fetch(`${appUrl}/api/meta-agent/accounts`, {
      headers: headersList,
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) accounts = data.data;
  } catch (error) {
    console.error('Failed to fetch accounts for layout', error);
  }

  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen flex flex-col">
      <Navbar hideLoginButton={true} />

      <main className="grow text-[#14181F] antialiased p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <WorkspaceHeaderClient accounts={accounts} activeAccountId={activeAccountId} />
          <div className="mt-8">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}