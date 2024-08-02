import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { LabelOption, generateLabelOption } from "../hooks/useLabels";
import { SelectLabels } from "./SelectLabels";

export function IssueForm({
  labelOptions,
  labelsActions,
  onRemoveLabel,
  onAddLabel,
  defaultValues,
}: {
  labelOptions: LabelOption[];
  labelsActions: React.ReactNode;
  onRemoveLabel: (label: string) => void;
  onAddLabel?: (label: string) => void;
  defaultValues?: {
    title: string;
    labels: string[];
    milestone: string;
  };
}) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    defaultValues?.labels ?? []
  );
  const [milestone, setMilestone] = useState<string>(
    defaultValues?.milestone || ""
  );
  const labelsInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="Enter new title"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="milestone">Milestone</Label>
        <Input
          type="text"
          id="milestone"
          name="milestone"
          placeholder="Add milestone"
          className="w-full"
          onChange={(e) => setMilestone(e.target.value)}
          defaultValue={milestone}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </div>

      <div className="w-full flex justify-between items-center">
        <Label htmlFor="label">
          Labels
          <span className="text-xs"> (Select all who apply)</span>
        </Label>
        {labelsActions}
      </div>

      <ScrollArea className="max-h-52">
        <SelectLabels
          options={labelOptions.map(({ label, backgroundColor, color }) => ({
            isSelected: selectedLabels.includes(label),
            label,
            backgroundColor,
            color,
          }))}
          onClick={(label) => {
            const newSelectedLabels = selectedLabels.includes(label)
              ? selectedLabels.filter((l) => l !== label)
              : [...selectedLabels, label];
            setSelectedLabels(newSelectedLabels);

            if (labelsInputRef.current) {
              labelsInputRef.current.value = newSelectedLabels.join(",");
            }
          }}
          onRemove={(label) => {
            onRemoveLabel(label);

            const newSelectedLabels = selectedLabels.filter((l) => l !== label);
            setSelectedLabels(newSelectedLabels);

            if (labelsInputRef.current) {
              labelsInputRef.current.value = newSelectedLabels.join(",");
            }
          }}
        />
        <input
          type="hidden"
          name="label"
          readOnly
          defaultValue={defaultValues?.labels.join(",") ?? ""}
          ref={labelsInputRef}
        />
      </ScrollArea>

      <Input
        type="text"
        id="label"
        name="add-label"
        placeholder="Add label"
        className="w-full"
        form="add-label"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (onAddLabel) {
              onAddLabel(e.currentTarget.value);
              return;
            }
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
    </>
  );
}

export const parseIssueFormResult = (data: FormData, labels: LabelOption[]) => {
  return {
    title: data.get("title") as string,
    labels: (data.get("label") as string)
      .split(",")
      .filter(Boolean)
      .map(
        (label) =>
          labels.find((l) => l.label === label) ??
          generateLabelOption({ label })
      ),
    description: data.get("description") as string,
    milestone: data.get("milestone") as string,
  };
};
