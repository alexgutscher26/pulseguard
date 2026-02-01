import { getIncidents } from "@/actions/incidents";
import { IncidentTable } from "@/components/incidents/incident-table";

export const metadata = {
  title: "Incidents | PulseGuard",
  description: "Manage system incidents",
};

import { getUserPreferences } from "@/actions/user";

/**
 * Renders the incidents page with a table of incidents and user preferences.
 */
export default async function IncidentsPage() {
  const incidents = await getIncidents();
  const preferences = await getUserPreferences();

  return (
    <div className="space-y-6">
      <IncidentTable
        incidents={incidents}
        userTimezone={preferences.timezone}
        userTimeFormat={preferences.timeFormat}
      />
    </div>
  );
}
