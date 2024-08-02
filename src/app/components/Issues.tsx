import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InputsRow } from "./InputsRow";
import { Issue, IssueItem } from "./IssueItem";
import { LabelOption } from "./SelectLabels";

export interface IssuesProps {
  labels: LabelOption[];
  issues: Issue[];
  onRemoveLabel: (label: string) => void;
  milestoneForm: React.ReactNode;
}

export function Issues({
  labels,
  issues,
  milestoneForm,
  onRemoveLabel,
}: IssuesProps) {
  return (
    <div className="border overflow-hidden w-full bg-background-secondary px-md2 py-md3 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead>Labels</TableHead>
            <TableHead>Milestone</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <InputsRow
            labelOptions={labels}
            milestoneForm={milestoneForm}
            onRemoveLabel={onRemoveLabel}
          />
          {issues.map((issue) => (
            <IssueItem key={issue.id} {...issue} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
