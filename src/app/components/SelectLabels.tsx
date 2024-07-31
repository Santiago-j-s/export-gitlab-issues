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
        <Button
          key={`${label}-${i}`}
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          onClick={() => onClick(label)}
          type="button"
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
              type="button"
            >
              <X className="size-3 pointer-events-none" />
            </Button>
          ) : null}
        </Button>
      ))}
    </div>
  );
};
