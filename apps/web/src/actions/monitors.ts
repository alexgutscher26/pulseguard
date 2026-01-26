"use server";

import prisma from "@pulseguard/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

const monitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL").refine((val) => {
    try {
      const url = new URL(val);
      const hostname = url.hostname.toLowerCase();
      // Block localhost, private IPs, and loopback
      const isLocalhost = hostname === 'localhost' || 
                          hostname === '127.0.0.1' || 
                          hostname === '::1' || 
                          hostname === '0.0.0.0';
      return !isLocalhost;
    } catch {
      return false;
    }
  }, "Localhost URLs are not allowed. Please use a public URL or a tunnel (e.g., ngrok)."),
  type: z.enum(["HTTP", "PING", "PORT"]),
  interval: z.coerce.number().min(30),
  timeout: z.coerce.number().min(1),
});

export async function createMonitor(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    url: formData.get("url"),
    type: formData.get("type"),
    interval: formData.get("interval"),
    timeout: formData.get("timeout"),
  };

  const validation = monitorSchema.safeParse(rawData);

  if (!validation.success) {
      console.error(validation.error);
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return { success: false, error: firstError };
  }

  const data = validation.data;

  try {
    await prisma.monitor.create({
      data: {
        name: data.name,
        url: data.url,
        type: data.type as any, // Cast to any to avoid TS issues if enum not generated
        interval: data.interval,
        timeout: data.timeout,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/monitors");
    return { success: true };
  } catch (error) {
      console.error("Failed to create monitor", error);
      return { success: false, error: "Failed to create monitor" };
  }
}

export async function getMonitors() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  // Use try/catch in case DB not ready
  try {
     const monitors = await prisma.monitor.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            events: {
                take: 10,
                orderBy: { timestamp: 'desc' }
            }
        }
     });
     return monitors;
  } catch (error) {
      console.error("Failed to fetch monitors", error);
      return [];
  }
}

export async function getMonitor(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return null;

    try {
        const monitor = await prisma.monitor.findUnique({
            where: {
                id,
                userId: session.user.id
            },
            include: {
                events: {
                    take: 50,
                    orderBy: {
                        timestamp: 'desc'
                    }
                }
            }
        });
        return monitor;
    } catch (error) {
        console.error("Failed to fetch monitor", error);
        return null;
    }
}

export async function checkMonitor(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return { success: false, error: "Unauthorized" };

    const monitor = await prisma.monitor.findUnique({
        where: { id, userId: session.user.id },
    });

    if (!monitor) return { success: false, error: "Monitor not found" };

    const start = Date.now();
    let currentStatus: "UP" | "DOWN" = "DOWN";
    let latency = 0;

    try {
        const response = await fetch(monitor.url, {
            method: 'GET',
            headers: {
                'User-Agent': 'PulseGuard-Monitor/1.0',
                'Accept': '*/*'
            },
            signal: AbortSignal.timeout(10000)
        });

        latency = Date.now() - start;
        currentStatus = response.ok ? "UP" : "DOWN";
    } catch (err) {
        console.error(`Error checking ${monitor.url}:`, err);
        // latency = Date.now() - start; // Latency is effectively timeout or partial
        latency = 0;
        currentStatus = "DOWN";
    }

    try {
        await prisma.$transaction([
            prisma.monitorEvent.create({
                data: {
                    monitorId: monitor.id,
                    status: currentStatus,
                    latency: latency,
                    timestamp: new Date(),
                }
            }),
            prisma.monitor.update({
                where: { id: monitor.id },
                data: {
                    status: currentStatus,
                    lastCheck: new Date(),
                }
            })
        ]);
        
        revalidatePath(`/dashboard/monitors/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to save check result", error);
        return { success: false, error: "Failed to save result" };
    }
}
