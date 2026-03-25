import type { PrismaClient } from "@pulseguard/db";

export enum IncidentEventType {
  STATE_CHANGE = "STATE_CHANGE",
  ALERT_SENT = "ALERT_SENT",
  COMMENT = "COMMENT",
  AUTO_RESOLVE = "AUTO_RESOLVE",
}

export enum IncidentStatus {
  INVESTIGATING = "INVESTIGATING",
  IDENTIFIED = "IDENTIFIED",
  MONITORING = "MONITORING",
  RESOLVED = "RESOLVED",
}

export enum Severity {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export class IncidentService {
  constructor(private prisma: PrismaClient) {}

  async findActiveIncident(monitorId: string) {
    return this.prisma.incident.findFirst({
      where: {
        monitorId,
        resolvedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findActiveIncidentsForMonitors(monitorIds: string[]) {
    return this.prisma.incident.findMany({
      where: {
        monitorId: { in: monitorIds },
        resolvedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createIncident(monitorId: string, title: string, description: string) {
    // 1. Double check we don't already have one (concurrency safety)
    const existing = await this.findActiveIncident(monitorId);
    if (existing) return existing;

    // 1b. Check for RECENTLY resolved incident (Flapping mitigation)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recent = await this.prisma.incident.findFirst({
      where: {
        monitorId,
        resolvedAt: { gt: fiveMinutesAgo },
      },
      orderBy: { resolvedAt: "desc" },
    });

    if (recent) {
      // RE-OPEN
      console.log(`[Incident] Re-opening incident ${recent.id} due to flapping`);
      return this.prisma.incident.update({
        where: { id: recent.id },
        data: {
          status: IncidentStatus.INVESTIGATING,
          resolvedAt: null,
          events: {
            create: {
              type: IncidentEventType.STATE_CHANGE,
              message: `Monitor unstable. Incident re-opened. (Flapping detected)`,
            },
          },
        },
        include: { events: true },
      });
    }

    // 2. Create Incident
    const incident = await this.prisma.incident.create({
      data: {
        monitorId,
        title,
        description,
        status: IncidentStatus.INVESTIGATING,
        severity: Severity.HIGH,
        events: {
          create: {
            type: IncidentEventType.STATE_CHANGE,
            message: `Incident started: ${title}`,
          },
        },
      },
      include: { events: true }, // Return with events for context
    });

    console.log(`[Incident] Created new incident ${incident.id} for monitor ${monitorId}`);
    return incident;
  }

  async resolveIncident(incidentId: string) {
    const incident = await this.prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: IncidentStatus.RESOLVED,
        resolvedAt: new Date(),
        events: {
          create: {
            type: IncidentEventType.AUTO_RESOLVE,
            message: "Monitor recovered. Auto-resolving incident.",
          },
        },
      },
    });

    console.log(`[Incident] Resolved incident ${incident.id}`);
    return incident;
  }

  async logStillDown(incidentId: string) {
    // Optional: Log a heartbeat event if you want verbose logs,
    // but for now we'll skip spamming the DB unless status changes.
    // We could update 'updatedAt' to show it's still active.
    await this.prisma.incident.update({
      where: { id: incidentId },
      data: { updatedAt: new Date() },
    });
  }

  async findActiveRegionalIncident(monitorId: string, region: string) {
    return this.prisma.regionalIncident.findFirst({
      where: {
        monitorId,
        region,
        resolvedAt: null,
      },
      orderBy: { startedAt: "desc" },
    });
  }

  async createRegionalIncident(monitorId: string, region: string) {
    const existing = await this.findActiveRegionalIncident(monitorId, region);
    if (existing) return existing;

    const incident = await this.prisma.regionalIncident.create({
      data: {
        monitorId,
        region,
        status: IncidentStatus.INVESTIGATING,
      },
    });

    console.log(`[RegionalIncident] Created for ${monitorId} in ${region}`);
    return incident;
  }

  async resolveRegionalIncident(incidentId: string) {
    const incident = await this.prisma.regionalIncident.update({
      where: { id: incidentId },
      data: {
        status: IncidentStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });

    console.log(`[RegionalIncident] Resolved ${incidentId}`);
    return incident;
  }
}
