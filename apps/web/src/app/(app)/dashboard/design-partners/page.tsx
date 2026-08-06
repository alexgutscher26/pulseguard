import type { Metadata } from "next";
import AdminDesignPartnersClient from "./admin-client";
import { getAllDesignPartnerApplications } from "@/actions/design-partners";
import { getAdminStatus } from "@/actions/admin";

export const metadata: Metadata = {
  title: "Design Partner Applications | Admin | PulseGuard",
  description: "Review, approve, and manage Design Partner applications.",
};

export default async function AdminDesignPartnersPage() {
  const admin = await getAdminStatus();
  const applications = await getAllDesignPartnerApplications();
  return <AdminDesignPartnersClient initialApplications={applications} isAdmin={admin.isAdmin} />;
}
