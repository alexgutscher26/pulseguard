"use server";

import prisma from "@pulseguard/db";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { $Enums } from "@prisma/client";

export type IncidentTemplateData = {
  name: string;
  title: string;
  description: string;
  severity: $Enums.Severity;
  status: $Enums.IncidentStatus;
};

/**
 * Retrieve incident templates created by the authenticated user.
 *
 * The function first obtains the user session using the auth.api.getSession method. If the session does not contain a user, it returns an empty array.
 * If the session is valid, it fetches the incident templates from the database using prisma.incidentTemplate.findMany, filtering by the user's ID and ordering by creation date in descending order.
 * In case of an error during the fetch operation, it logs the error and returns an empty array.
 *
 * @returns An array of incident templates created by the authenticated user or an empty array if no templates are found or an error occurs.
 */
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

/**
 * Create an incident template in the database.
 *
 * This function first retrieves the user session to ensure the request is authorized. If the session is valid, it attempts to create a new incident template using the provided data. Upon successful creation, it revalidates specific paths to ensure the latest data is reflected in the application. If any error occurs during the creation process, it logs the error and returns a failure response.
 *
 * @param data - The data for the incident template to be created.
 * @returns An object indicating the success status and any error message if applicable.
 */
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

/**
 * Deletes an incident template based on the provided ID.
 *
 * The function first retrieves the user session to ensure the user is authorized. It then checks if the incident template exists and is owned by the user. If found, it deletes the template and revalidates the path for the dashboard. In case of any errors during the process, it logs the error and returns a failure response.
 *
 * @param id - The ID of the incident template to be deleted.
 * @returns An object indicating the success status and any associated error message.
 */
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
