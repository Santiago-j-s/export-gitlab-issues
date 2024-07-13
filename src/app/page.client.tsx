"use client";
import { Button } from "@/components/ui/button";
import { Bot, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { EditModalDialog } from "./components/EditModalDialog";
import { InferDialog } from "./components/InferDialog";
import { Issue } from "./components/IssueItem";
import { Issues } from "./components/Issues";
import { LabelsAndMilestoneForm } from "./components/LabelsAndMilestoneForm";
import { useIssues } from "./hooks/useIssues";
import { useLabels } from "./hooks/useLabels";

function createCsv(issues: Issue[]) {
  const headers = ["title", "due_date", "milestone", "description"].join(",");

  const rows = issues.map((issue) => {
    const labels = issue.labels.map((label) => `~""${label}""`).join(" ");

    return `"${issue.title}",,"${issue.milestone}","${issue.description}\n/label ${labels}",`;
  });

  return [headers, ...rows].join("\n");
}

export default function ClientPage() {
  const [labels, addLabel, removeLabel, resetLabels] = useLabels();
  const [issues, addIssue, clearIssues, { editing, setEditing }, removeIssue] =
    useIssues();
  const [milestone, setMilestone] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([createCsv(issues)], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    setExportUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [issues, setExportUrl]);

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <LabelsAndMilestoneForm
          addLabel={addLabel}
          resetLabels={resetLabels}
          milestone={milestone ?? ""}
          setMilestone={setMilestone}
        />

        <div className="flex gap-4">
          <Button asChild>
            <a href={exportUrl ?? undefined} download="issues.csv">
              <Download className="mr-2 h-4 w-4" /> Export Issues
            </a>
          </Button>

          <Button variant="secondary" onClick={clearIssues}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear Issues
          </Button>

          <InferDialog
            trigger={
              <Button variant="secondary" onClick={clearIssues}>
                <Bot className="mr-2 h-4 w-4" /> AI Infer
              </Button>
            }
            labels={labels}
            milestone={milestone ?? ""}
            onSuccess={(newIssues) => {
              clearIssues();
              newIssues.forEach(addIssue);
            }}
          />
        </div>
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

      <EditModalDialog
        editing={editing}
        onAddLabel={(label) => {
          setEditing({
            ...editing,
            labels: [...(editing?.labels ?? []), label],
          } as Issue);
        }}
        onClose={() => setEditing(null)}
        onRemoveLabel={(label) => {
          setEditing({
            ...editing,
            labels: editing?.labels.filter((l) => l !== label) ?? [],
          } as Issue);
        }}
        onUpdate={(issue) => {
          removeIssue(issue.id);
          addIssue(issue);
          setEditing(null);
        }}
        labelOptions={Array.from(
          new Set([...labels, ...(editing?.labels ?? [])].filter(Boolean))
        )}
      />
    </>
  );
}
