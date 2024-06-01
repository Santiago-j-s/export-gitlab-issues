"use client";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useEffect, useReducer, useState } from "react";

interface Issue {
  id: string;
  title: string;
  labels: string[];
  description: string;
  milestone: string;
  onRemove: () => void;
}

interface IssuesProps {
  labels: string[];
  issues: Issue[];
  milestone: string | null;
  onRemoveLabel: (label: string) => void;
}

function Issues({ labels, issues, milestone, onRemoveLabel }: IssuesProps) {
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
              <TableRow key={`${issue.id}`} id={`issue-${issue.id}`}>
                <TableCell>
                  <h3 className="text-base font-medium">{issue.title}</h3>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 max-w-96 flex-wrap">
                    {issue.labels.map((label, i) => (
                      <Badge variant="secondary" key={`${label}-${i}`}>
                        {label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-zinc-300">{issue.milestone}</p>
                </TableCell>
                <TableCell>
                  <p className="text-zinc-300">{issue.description}</p>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      issue.onRemove();
                    }}
                  >
                    <X />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter new title"
                  className="w-40"
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
                <div className="flex gap-2 flex-wrap">
                  {labels.map((label, i) => (
                    <Badge
                      variant="secondary"
                      key={`${label}-${i}`}
                      onClick={() => {
                        onRemoveLabel(label);
                      }}
                      className="shrink-0"
                    >
                      {label}
                      <X className="size-3 pointer-events-none" />
                    </Badge>
                  ))}
                </div>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function useLabels() {
  const [labels, dispatchLabels] = useReducer(
    (
      state: string[],
      action:
        | {
            type: "ADD_LABEL";
            label: string;
          }
        | { type: "REMOVE_LABEL"; label: string }
        | { type: "RESET_LABELS" }
    ) => {
      switch (action.type) {
        case "ADD_LABEL":
          return [...state, action.label];
        case "REMOVE_LABEL":
          return state.filter((label) => label !== action.label);
        case "RESET_LABELS":
          return [];
        default:
          // @ts-expect-error - check for unhandled action types
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Unhandled action type: ${action.type}`);
      }
    },
    []
  );

  const addLabel = (label: string) => {
    dispatchLabels({ type: "ADD_LABEL", label });
  };

  const removeLabel = (label: string) => {
    dispatchLabels({ type: "REMOVE_LABEL", label });
  };

  const resetLabels = () => {
    dispatchLabels({ type: "RESET_LABELS" });
  };

  return [labels, addLabel, removeLabel, resetLabels] as const;
}

type IssueAction =
  | {
      type: "ADD_ISSUE";
      issue: Pick<Issue, "title" | "labels" | "description" | "milestone">;
    }
  | { type: "REMOVE_ISSUE"; id: string };

function useIssues() {
  const [issues, dispatchIssues] = useReducer(
    (state: Issue[], action: IssueAction) => {
      switch (action.type) {
        case "ADD_ISSUE": {
          const id = crypto.randomUUID();

          return [
            ...state,
            {
              ...action.issue,
              id,
              onRemove: () => {
                dispatchIssues({ type: "REMOVE_ISSUE", id });
              },
            },
          ];
        }
        case "REMOVE_ISSUE":
          return state.filter((issue) => issue.id !== action.id);
        default:
          // @ts-expect-error - check for unhandled action types
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Unhandled action type: ${action.type}`);
      }
    },
    []
  );

  const addIssue = (
    issue: Extract<IssueAction, { type: "ADD_ISSUE" }>["issue"]
  ) => {
    dispatchIssues({ type: "ADD_ISSUE", issue });
  };

  return [issues, addIssue] as const;
}

function createCsv(issues: Issue[]) {
  const headers = ["title", "due_date", "milestone", "description"].join(",");

  const rows = issues.map((issue) => {
    const labels = issue.labels.map((label) => `~""${label}""`).join(" ");

    return `"${issue.title}",,"${issue.milestone}","${issue.description}\n/label ${labels}",`;
  });

  return [headers, ...rows].join("\n");
}

export default function Home() {
  const [labels, addLabel, removeLabel, resetLabels] = useLabels();
  const [issues, addIssue] = useIssues();
  const [milestone, setMilestone] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([createCsv(issues)], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    setExportUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [issues]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 gap-8 w-full grid grid-cols-8">
        <div className="col-span-8 flex gap-8">
          <form
            className="col-span-8 flex items-end gap-4"
            action={(data: FormData) => {
              addLabel(data.get("label") as string);
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="label">Add label</Label>
              <Input
                type="text"
                id="label"
                name="label"
                placeholder="Add label"
                className="w-40"
              />
            </div>
            <Button type="button" variant="secondary" onClick={resetLabels}>
              Reset labels
            </Button>
          </form>

          <form
            className="col-span-8 flex items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="milestone">Milestone</Label>
              <Input
                type="text"
                id="milestone"
                name="milestone"
                placeholder="Add milestone"
                className="w-40"
                onChange={(e) => {
                  setMilestone(e.target.value);
                }}
                value={milestone ?? ""}
              />
            </div>
          </form>
        </div>

        <div className="col-span-8">
          <Issues
            labels={labels}
            issues={issues}
            milestone={milestone}
            onRemoveLabel={removeLabel}
          />
          <form
            id="issue-form"
            action={(data: FormData) => {
              const labels = data.get("label");

              addIssue({
                title: data.get("title") as string,
                labels:
                  labels && typeof labels === "string" ? labels.split(",") : [],
                description: data.get("description") as string,
                milestone: data.get("milestone") as string,
              });
            }}
          >
            <input hidden readOnly name="milestone" value={milestone ?? ""} />
          </form>
        </div>

        <Button asChild>
          <a href={exportUrl ?? undefined} download="issues.csv">
            Export Issues
          </a>
        </Button>
      </div>
    </main>
  );
}
