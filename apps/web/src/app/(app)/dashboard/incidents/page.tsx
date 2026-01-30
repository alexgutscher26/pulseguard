import { getIncidents } from "@/actions/incidents";
import { IncidentTable } from "@/components/incidents/incident-table";

export const metadata = {
  title: "Incidents | PulseGuard",
  description: "Manage system incidents",
};

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <div className="space-y-6">
      <IncidentTable incidents={incidents} />
    </div>
  );
}
