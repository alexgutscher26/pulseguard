import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDesignPartnersClient from "./admin-client";
import { getAllDesignPartnerApplications } from "@/actions/design-partners";
import { getAdminStatus } from "@/actions/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Partner Applications | Admin | SteadyStack",
  description: "Review, approve, and manage Design Partner applications.",
};

export default async function AdminDesignPartnersPage() {
  const admin = await getAdminStatus();
  if (!admin.isAdmin) {
    redirect("/dashboard");
  }

  const applications = await getAllDesignPartnerApplications();
  return (
    <AdminDesignPartnersClient
      initialApplications={applications}
      isAdmin={admin.isAdmin}
    />
  );
}
