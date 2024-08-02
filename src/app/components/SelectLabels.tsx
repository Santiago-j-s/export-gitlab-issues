import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LabelOption } from "../hooks/useLabels";

interface SelectableLabelOption extends LabelOption {
  isSelected: boolean;
}

export const SelectLabels = ({
  onClick,
  onRemove,
  options,
}: {
  onClick: (label: string) => void;
  onRemove?: (label: string) => void;
  options: SelectableLabelOption[];
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(({ label, isSelected, backgroundColor, color }, i) => {
        return (
          <Button
            key={`${label}-${i}`}
            size="sm"
            onClick={() => onClick(label)}
            type="button"
            className="rounded-xs py-0 px-sm3 leading-5 text-sm font-semibold"
            style={{
              border: `1px solid ${backgroundColor}`,
              color: isSelected ? color : "var(--text-lighter)",
              backgroundColor: isSelected ? backgroundColor : "transparent",
            }}
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
        );
      })}
    </div>
  );
};
