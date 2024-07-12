"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { EditModalDialog } from "./components/EditModalDialog";
import { Issue } from "./components/IssueItem";
import { Issues } from "./components/Issues";
import { Labels } from "./components/Labels";
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
      <LabelsAndMilestoneForm
        addLabel={addLabel}
        resetLabels={resetLabels}
        milestone={milestone ?? ""}
        setMilestone={setMilestone}
      />

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

      <div className="flex gap-4">
        <Button asChild>
          <a href={exportUrl ?? undefined} download="issues.csv">
            <Download className="mr-2 h-4 w-4" /> Export Issues
          </a>
        </Button>
        <Button variant="secondary" onClick={clearIssues}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Issues
        </Button>
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing issue</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            action={(data: FormData) => {
              const labels = data.get("label");
              const title = data.get("title") as string;
              const description = data.get("description") as string;
              const milestone = data.get("milestone") as string;

              const newIssue = {
                id: editing?.id,
                title,
                description,
                labels:
                  labels && typeof labels === "string" ? labels.split(",") : [],
                milestone,
              };

              removeIssue(editing!.id);
              addIssue(newIssue);

              setEditing(null);
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Edit title"
                className="w-full"
                defaultValue={editing?.title}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Labels</Label>
              {editing?.labels && editing.labels.length > 0 && (
                <input
                  type="hidden"
                  name="label"
                  value={editing.labels.join(",")}
                  readOnly
                />
              )}
              <Input
                type="text"
                id="label"
                name="label"
                placeholder="Add label"
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const label = e.currentTarget.value;
                    if (label) {
                      setEditing({
                        ...editing,
                        labels: [...(editing?.labels ?? []), label],
                      } as Issue);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
              <Labels
                labels={editing?.labels ?? []}
                onRemove={(label) => {
                  setEditing({
                    ...editing,
                    labels: editing?.labels.filter((l) => l !== label) ?? [],
                  } as Issue);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="milestone">Milestone</Label>
              <Input
                type="text"
                id="milestone"
                name="milestone"
                placeholder="Edit milestone"
                className="w-full"
                onChange={(e) => {
                  setMilestone(e.target.value);
                }}
                defaultValue={editing?.milestone ?? ""}
              />
            </div>

            <Button type="submit">Save changes</Button>
          </form>
        </DialogContent>
      </Dialog>

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
      />
    </>
  );
}
