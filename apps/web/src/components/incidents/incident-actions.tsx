"use client";

import { updateIncidentStatus } from "@/actions/incidents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface IncidentActionsProps {
  incidentId: string;
  currentStatus: string;
}

export function IncidentActions({ incidentId, currentStatus }: IncidentActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (status: string | null) => {
    if (!status) return;
    setLoading(true);
    try {
      const result = await updateIncidentStatus(incidentId, status as any);
      if (result.success) {
        toast.success("Status updated");
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handleUpdate} defaultValue={currentStatus} disabled={loading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Update Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="INVESTIGATING">Investigating</SelectItem>
          <SelectItem value="IDENTIFIED">Identified</SelectItem>
          <SelectItem value="MONITORING">Monitoring</SelectItem>
          <SelectItem value="RESOLVED">Resolved</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
