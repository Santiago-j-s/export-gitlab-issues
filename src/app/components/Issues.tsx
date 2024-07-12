import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, X } from "lucide-react";

export function Labels({
  labels,
  onRemove,
}: {
  labels: string[];
  onRemove?: (label: string) => void;
}) {
  return (
    <div className="flex gap-2 w-96 max-w-96 flex-wrap">
      {labels.map((label, i) => (
        <LabelBadge key={`${label}-${i}`} label={label} onRemove={onRemove} />
      ))}
    </div>
  );
}

function LabelBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: (label: string) => void;
}) {
  return (
    <Badge
      variant="secondary"
      onClick={onRemove ? () => onRemove(label) : undefined}
      className="shrink-0"
    >
      {label}
      {onRemove ? <X className="size-3 pointer-events-none" /> : null}
    </Badge>
  );
}

export interface Issue {
  id: string;
  title: string;
  labels: string[];
  description: string;
  milestone: string;
  onRemove: () => void;
  onEdit: () => void;
}

function IssueItem({
  id,
  title,
  labels,
  description,
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
        <p className="text-zinc-300">{description}</p>
      </TableCell>
      <TableCell className="flex gap-4">
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
      </TableCell>
    </TableRow>
  );
}

function InputsRow({
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

export interface IssuesProps {
  labels: string[];
  issues: Issue[];
  milestone: string | null;
  onRemoveLabel: (label: string) => void;
}

export function Issues({
  labels,
  issues,
  milestone,
  onRemoveLabel,
}: IssuesProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Issues</h2>
      <div className="border rounded-md overflow-hidden w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>Milestone</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <IssueItem key={issue.id} {...issue} />
            ))}
            <InputsRow
              labels={labels}
              milestone={milestone}
              onRemoveLabel={onRemoveLabel}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
