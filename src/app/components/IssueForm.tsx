import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { LabelOption } from "../hooks/useLabels";
import { SelectLabels } from "./SelectLabels";

export function IssueForm({
  labelOptions,
  labelsActions,
  onRemoveLabel,
  defaultValues,
}: {
  labelOptions: LabelOption[];
  labelsActions: React.ReactNode;
  onRemoveLabel: (label: string) => void;
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

      <input
        type="hidden"
        name="label"
        value={selectedLabels.join(",")}
        readOnly
      />

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
            setSelectedLabels((prev) =>
              prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
            );
          }}
          onRemove={onRemoveLabel}
        />
      </ScrollArea>
      <Input
        type="text"
        id="label"
        name="label"
        placeholder="Add label"
        className="w-full"
        form="add-label"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
    </>
  );
}
