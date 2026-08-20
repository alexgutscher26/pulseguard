import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@steadystack/auth";
import { getInvitationDetails } from "@/actions/team";
import { InvitationClient } from "./invitation-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const invitation = await getInvitationDetails(resolved.id);

  if (!invitation) {
    return {
      title: "Invitation Not Found | SteadyStack",
      description: "This team invitation is invalid or has expired.",
    };
  }

  return {
    title: `Join ${invitation.organization.name} | SteadyStack`,
    description: `You have been invited to join the ${invitation.organization.name} workspace on SteadyStack.`,
  };
}

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const invitation = await getInvitationDetails(resolved.id);

  if (!invitation) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <InvitationClient
        invitation={invitation}
        currentUserEmail={session?.user?.email}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
