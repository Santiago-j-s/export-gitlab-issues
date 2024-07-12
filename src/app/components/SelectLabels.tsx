import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const SelectLabels = ({
  onClick,
  onRemove,
  options,
}: {
  onClick: (label: string) => void;
  onRemove?: (label: string) => void;
  options: { label: string; isSelected: boolean }[];
}) => {
  return (
    <div className="flex gap-2 w-96 max-w-96 flex-wrap">
      {options.map(({ label, isSelected }, i) => (
        <Badge
          variant={isSelected ? "secondary" : "outline"}
          className="shrink-0 cursor-pointer"
          key={`${label}-${i}`}
          onClick={() => onClick(label)}
        >
          {label}
          {onRemove ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(label);
              }}
              className="w-fit h-fit ml-1 p-1"
              variant="ghost"
            >
              <X className="size-3 pointer-events-none" />
            </Button>
          ) : null}
        </Badge>
      ))}
    </div>
  );
};
