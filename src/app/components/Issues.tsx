import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Issue, IssueItem } from "./IssueItem";

export interface IssuesProps {
  issues: Issue[];
  header: React.ReactNode;
}

export function Issues({ issues, header }: IssuesProps) {
  return (
    <div className="border overflow-scroll h-full w-full bg-background-secondary px-md2 py-md3 rounded-lg flex flex-col gap-md1">
      {header}
      <div className="max-h-[480px] h-full overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-48">Title</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead className="min-w-32">Milestone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <IssueItem key={issue.id} {...issue} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
