import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Labels } from "./Labels";

export function InputsRow({
  labels,
  milestone,
  onRemoveLabel,
}: {
  labels: string[];
  milestone: string | null;
  onRemoveLabel: (label: string) => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <Input
          type="text"
          name="title"
          placeholder="Enter new title"
          className="w-full"
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
        {labels.length > 0 && (
          <input
            form="issue-form"
            type="hidden"
            name="label"
            value={labels.join(",")}
            readOnly
          />
        )}
        <Labels labels={labels} onRemove={onRemoveLabel} />
      </TableCell>
      <TableCell>
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
