import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LabelOption } from "../hooks/useLabels";

function LabelBadge({
  label,
  backgroundColor,
  color,
}: {
  label: string;
  backgroundColor: string;
  color: string;
}) {
  return (
    <Badge
      className={buttonVariants({
        size: "sm",
        className: "shrink-0 rounded-xs py-0 px-sm3 leading-5 text-xs h-5",
      })}
      style={{
        border: `1px solid ${backgroundColor}`,
        color,
        backgroundColor,
      }}
    >
      {label}
    </Badge>
  );
}

export function Labels({ labels }: { labels: LabelOption[] }) {
  return (
    <div className="flex gap-2 w-96 max-w-96 flex-wrap">
      {labels.map((label, i) => (
        <LabelBadge key={`${label.label}-${i}`} {...label} />
      ))}
    </div>
  );
}
