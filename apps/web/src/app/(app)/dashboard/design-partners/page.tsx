import type { Metadata } from "next";
import AdminDesignPartnersClient from "./admin-client";
import { getAllDesignPartnerApplications } from "@/actions/design-partners";

export const metadata: Metadata = {
  title: "Design Partner Applications | Admin | PulseGuard",
  description: "Review, approve, and manage Design Partner applications.",
};

export default async function AdminDesignPartnersPage() {
  const applications = await getAllDesignPartnerApplications();
  return <AdminDesignPartnersClient initialApplications={applications} />;
}
