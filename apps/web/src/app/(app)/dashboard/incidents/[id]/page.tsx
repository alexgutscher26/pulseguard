import { getIncident } from "@/actions/incidents";
import { DashboardHeader } from "@/components/dashboard/header";
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { IncidentActions } from "@/components/incidents/incident-actions";
import { IncidentTimeline } from "@/components/incidents/incident-timeline";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await getIncident(id);

  if (!incident) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/incidents"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm mb-4 w-fit"
        >
          <ArrowLeft className="size-4" /> Back to Incidents
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <IncidentActions
            incidentId={incident.id}
            currentStatus={incident.status}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-md border p-6 bg-card">
            <h3 className="font-semibold mb-2 text-lg">Description</h3>
            <p className="text-sm text-muted-foreground">
              {incident.description || "No description provided."}
            </p>
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground font-mono">
              Monitor URL:{" "}
              <span className="text-foreground">{incident.monitor.url}</span>
            </div>
          </div>

          <div className="rounded-md border p-6 bg-card">
            <IncidentTimeline events={incident.events} />
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="rounded-md border p-6 bg-card space-y-4">
            <h3 className="font-semibold text-lg">Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <IncidentStatusBadge status={incident.status} />
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Severity</span>
                <span className="font-medium text-destructive">
                  {incident.severity}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Started</span>
                <span className="font-mono">
                  {new Date(incident.startedAt).toLocaleString()}
                </span>
              </div>
              {incident.resolvedAt && (
                <div className="flex justify-between items-center py-2 border-b bg-green-500/5 -mx-2 px-2">
                  <span className="text-muted-foreground">Resolved</span>
                  <span className="font-mono text-green-500">
                    {new Date(incident.resolvedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
