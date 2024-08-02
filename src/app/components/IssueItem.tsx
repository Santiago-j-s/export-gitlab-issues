import { TableCell, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { LabelOption } from "../hooks/useLabels";
import { Labels } from "./Labels";

export interface Issue {
  id: string;
  title: string;
  labels: LabelOption[];
  description: string;
  milestone: string;
  onRemove: () => void;
  onEdit: () => void;
}

export function IssueItem({
  id,
  title,
  labels,
  milestone,
  onRemove,
  onEdit,
}: Issue) {
  return (
    <TableRow id={`${id}`}>
      <TableCell>
        <h3 className="text-base font-medium">{title}</h3>
      </TableCell>
      <TableCell>
        <Labels labels={labels} />
      </TableCell>
      <TableCell>
        <p className="text-zinc-300">{milestone}</p>
      </TableCell>
      <TableCell>
        <div className="flex gap-4">
          <Button
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
          >
            <Pencil />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
