import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { LabelOption } from "../hooks/useLabels";
import { Combobox } from "./Combobox";

export interface RemovableLabelOption extends LabelOption {
  removable: boolean;
}
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
  options: (SelectableLabelOption & RemovableLabelOption)[];
}) => {
  const disabled = options.length === 0;

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        name="labels"
        disabled={disabled}
        options={options.map(({ label }) => ({ label, value: label }))}
        disabledText={
          disabled ? "Import labels from a project first" : undefined
        }
      />
      <div className="flex gap-2 flex-wrap">
        {options
          .filter(({ isSelected }) => isSelected)
          .map(
            ({ label, isSelected, backgroundColor, color, removable }, i) => {
              return (
                <Button
                  key={`${label}-${i}`}
                  size="sm"
                  onClick={() => onClick(label)}
                  type="button"
                  className={cn(
                    "rounded-xs py-0 px-sm3 leading-5 text-sm font-semibold",
                    onRemove && removable ? "pr-0" : undefined
                  )}
                  style={{
                    border: `1px solid ${backgroundColor}`,
                    color: isSelected ? color : "var(--text-lighter)",
                    backgroundColor: isSelected
                      ? backgroundColor
                      : "transparent",
                  }}
                >
                  {label}
                  {onRemove && removable ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(label);
                      }}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-fit h-fit ml-1",
                      })}
                      role="button"
                      tabIndex={0}
                    >
                      <X className="size-3 pointer-events-none" />
                    </div>
                  ) : null}
                </Button>
              );
            }
          )}
      </div>
    </div>
  );
};
