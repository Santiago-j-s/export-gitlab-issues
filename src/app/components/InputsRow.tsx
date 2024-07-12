import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SelectLabels } from "./SelectLabels";

export function InputsRow({
  labelOptions,
  milestone,
  onRemoveLabel,
}: {
  labelOptions: string[];
  milestone: string | null;
  onRemoveLabel: (label: string) => void;
}) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  return (
    <TableRow>
      <TableCell>
        <Input
          type="text"
          name="title"
          placeholder="Enter new title"
          className="w-full min-w-64"
          form="issue-form"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </TableCell>
      <TableCell className="w-96">
        {selectedLabels.length > 0 && (
          <input
            form="issue-form"
            type="hidden"
            name="label"
            value={selectedLabels.join(",")}
            readOnly
          />
        )}
        <SelectLabels
          options={labelOptions.map((label) => ({
            isSelected: selectedLabels.includes(label),
            label,
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
      </TableCell>
      <TableCell className="w-28">
        <p className="text-zinc-300">{milestone}</p>
      </TableCell>
      <TableCell>
        <Textarea
          form="issue-form"
          name="description"
          placeholder="Enter new description"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </TableCell>
    </TableRow>
  );
}
