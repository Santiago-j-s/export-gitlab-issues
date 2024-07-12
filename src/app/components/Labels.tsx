import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

function LabelBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: (label: string) => void;
}) {
  return (
    <Badge
      variant="secondary"
      onClick={onRemove ? () => onRemove(label) : undefined}
      className="shrink-0"
    >
      {label}
      {onRemove ? <X className="size-3 pointer-events-none" /> : null}
    </Badge>
  );
}

export function Labels({
  labels,
  onRemove,
}: {
  labels: string[];
  onRemove?: (label: string) => void;
}) {
  return (
    <div className="flex gap-2 w-96 max-w-96 flex-wrap">
      {labels.map((label, i) => (
        <LabelBadge key={`${label}-${i}`} label={label} onRemove={onRemove} />
      ))}
    </div>
  );
}
