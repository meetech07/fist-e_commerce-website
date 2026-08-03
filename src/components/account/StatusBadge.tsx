import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  confirmed: "bg-blue-500/15 text-blue-500",
  processing: "bg-accent/15 text-accent",
  dispatched: "bg-accent/15 text-accent",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
  returned: "bg-muted-foreground/15 text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        STYLES[status] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      {status}
    </span>
  );
}
