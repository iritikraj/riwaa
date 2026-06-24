'use client';

export default function ConnectMetaButton({ workspaceId }: { workspaceId: string }) {
  const handleConnect = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // 1. Dynamically build the URI using the env variable
    const redirectUri = `${appUrl}/api/social-media-agent/auth/meta/callback`;

    // 2. Paste your new Configuration ID here
    const configId = "1029130432906146";

    // 3. Notice we removed the 'scope' parameter and replaced it with 'config_id'
    const metaAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${workspaceId}&config_id=${configId}`;

    window.location.href = metaAuthUrl;
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-[#1877F2] text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer"
    >
      Connect Facebook & Instagram
    </button>
  );
}