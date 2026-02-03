import ManagePageClient from "./manage-client";

interface ManagePageProps {
  params: Promise<{ token: string }>;
}

export default async function ManageSubscriptionPage({
  params,
}: ManagePageProps) {
  const { token } = await params;

  return <ManagePageClient manageToken={token} />;
}

export const dynamic = "force-dynamic";
