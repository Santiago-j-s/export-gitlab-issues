import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InputsRow } from "./InputsRow";
import { Issue, IssueItem } from "./IssueItem";

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
