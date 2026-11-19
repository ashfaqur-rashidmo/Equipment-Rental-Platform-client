import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusVariants: Record<string, string> = {
  Pending: "badge-warning",
  Approved: "badge-success",
  Rejected: "badge-error",
  Available: "badge-success",
  Rented: "badge-warning",
  Maintenance: "badge-error",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusVariants[status] || "badge-outline"}>
      {status || "Unknown"}
    </Badge>
  );
}