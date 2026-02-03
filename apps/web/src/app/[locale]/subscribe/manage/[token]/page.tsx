import ManagePageClient from "./manage-client";

interface ManagePageProps {
  params: Promise<{ token: string }>;
}

/**
 * Renders the ManageSubscriptionPage component with the provided token.
 */
export default async function ManageSubscriptionPage({
  params,
}: ManagePageProps) {
  const { token } = await params;

  return <ManagePageClient manageToken={token} />;
}

export const dynamic = "force-dynamic";
