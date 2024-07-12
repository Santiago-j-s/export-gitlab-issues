import { Badge } from "@/components/ui/badge";

function LabelBadge({ label }: { label: string }) {
  return (
    <Badge variant="secondary" className="shrink-0">
      {label}
    </Badge>
  );
}

export function Labels({ labels }: { labels: string[] }) {
  return (
    <div className="flex gap-2 w-96 max-w-96 flex-wrap">
      {labels.map((label, i) => (
        <LabelBadge key={`${label}-${i}`} label={label} />
      ))}
    </div>
  );
}
