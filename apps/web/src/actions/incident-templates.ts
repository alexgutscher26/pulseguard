"use server";

import prisma from "@pulseguard/db";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { $Enums } from "@pulseguard/db";

export type IncidentTemplateData = {
  name: string;
  title: string;
  description: string;
  severity: $Enums.Severity;
  status: $Enums.IncidentStatus;
};

export async function getIncidentTemplates() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  try {
    const templates = await prisma.incidentTemplate.findMany({
      where: {
        createdById: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return templates;
  } catch (error) {
    console.error("Failed to fetch incident templates", error);
    return [];
  }
}

export async function createIncidentTemplate(data: IncidentTemplateData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.incidentTemplate.create({
      data: {
        ...data,
        severity: data.severity as any,
        status: data.status as any,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/incidents");
    revalidatePath("/dashboard/settings"); // Assuming usage there
    return { success: true };
  } catch (error) {
    console.error("Failed to create incident template", error);
    return { success: false, error: "Failed to create template" };
  }
}

export async function updateIncidentTemplate(id: string, data: IncidentTemplateData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const template = await prisma.incidentTemplate.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!template) return { success: false, error: "Template not found" };

    await prisma.incidentTemplate.update({
      where: { id },
      data: {
        ...data,
        severity: data.severity as any,
        status: data.status as any,
      },
    });

    revalidatePath("/dashboard/incidents");
    return { success: true };
  } catch (error) {
    console.error("Failed to update incident template", error);
    return { success: false, error: "Failed to update template" };
  }
}

export async function deleteIncidentTemplate(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const template = await prisma.incidentTemplate.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!template) return { success: false, error: "Template not found" };

    await prisma.incidentTemplate.delete({
      where: { id },
    });

    revalidatePath("/dashboard/incidents");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete incident template", error);
    return { success: false, error: "Failed to delete template" };
  }
}
