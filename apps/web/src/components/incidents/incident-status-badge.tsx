import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IncidentStatusBadgeProps {
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
  className?: string;
}

const statusMap = {
  INVESTIGATING: {
    label: "Investigating",
    color: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
  },
  IDENTIFIED: {
    label: "Identified",
    color:
      "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
  },
  MONITORING: {
    label: "Monitoring",
    color:
      "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  },
  RESOLVED: {
    label: "Resolved",
    color:
      "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  },
};

export function IncidentStatusBadge({
  status,
  className,
}: IncidentStatusBadgeProps) {
  const config = statusMap[status] || statusMap.INVESTIGATING;

  return (
    <Badge variant="outline" className={cn(config.color, className)}>
      {config.label}
    </Badge>
  );
}
