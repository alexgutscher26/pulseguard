import { getIncidents } from "@/actions/incidents";
import { getIncidentTemplates } from "@/actions/incident-templates";
import { getMonitors } from "@/actions/monitors";
import { IncidentTable } from "@/components/incidents/incident-table";
import { IncidentTemplateManager } from "@/components/incidents/incident-template-manager";
import { CreateIncidentModal } from "@/components/incidents/create-incident-modal";
import { getUserPreferences } from "@/actions/user";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";

export const metadata = {
  title: "Incidents | PulseGuard",
  description: "Manage system incidents",
};

export default async function IncidentsPage() {
  const [incidents, templates, monitors, preferences] = await Promise.all([
    getIncidents(),
    getIncidentTemplates(),
    getMonitors(),
    getUserPreferences(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">
            Track and manage service outages and investigations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogTitle className="sr-only">Incident Templates</DialogTitle>
              <IncidentTemplateManager templates={templates} />
            </DialogContent>
          </Dialog>

          <CreateIncidentModal monitors={monitors} templates={templates} />
        </div>
      </div>

      <IncidentTable
        incidents={incidents}
        userTimezone={preferences.timezone}
        userTimeFormat={preferences.timeFormat}
      />
    </div>
  );
}
