"use client";
import { Button } from "@/components/ui/button";
import { getRandomHex, getTextColor } from "@/lib/colors";
import { Bot, Tag, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { AddIssuesDialog } from "./components/AddIssuesDialog";
import { AddLabelForm } from "./components/AddLabelForm";
import { EditModalDialog } from "./components/EditModalDialog";
import { ImportLabelsDialog } from "./components/ImportLabelsDialog";
import { InferDialog } from "./components/InferDialog";
import { Issue } from "./components/IssueItem";
import { Issues } from "./components/Issues";
import { MilestoneForm } from "./components/MilestoneForm";
import { ResetLabels } from "./components/ResetLabels";
import { useIssues } from "./hooks/useIssues";
import { useLabels } from "./hooks/useLabels";

export default function ClientPage() {
  const [labels, addLabel, removeLabel, resetLabels] = useLabels();
  const [issues, addIssue, clearIssues, { editing, setEditing }, removeIssue] =
    useIssues();
  const [milestone, setMilestone] = useState<string | null>(null);

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-sm1 rounded-lg min-w-80 p-4 border border-muted">
          <div className="flex w-full justify-between gap-4">
            <p className="font-semibold">Labels</p>

            <div className="flex gap-2">
              <ResetLabels resetLabels={resetLabels} />
              <ImportLabelsDialog
                trigger={
                  <Button size="icon" className="size-6">
                    <Tag className="size-4" />
                  </Button>
                }
                onSuccess={(payload) => {
                  resetLabels();
                  payload.forEach(({ name, color }) => addLabel(name, color));
                }}
              />
            </div>
          </div>

          <AddLabelForm addLabel={addLabel} />
        </div>

        <div className="flex gap-4">
          <AddIssuesDialog
            trigger={
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload Issues
              </Button>
            }
            issuesToAdd={issues}
          />

          <InferDialog
            trigger={
              <Button variant="secondary" onClick={clearIssues}>
                <Bot className="mr-2 h-4 w-4" /> AI Infer
              </Button>
            }
            labels={labels.map((label) => label.label)}
            milestone={milestone ?? ""}
            onSuccess={(newIssues) => {
              clearIssues();
              newIssues.forEach(addIssue);
            }}
          />
        </div>
      </div>

      <div className="col-span-8">
        <div>
          <div className="flex justify-between w-full">
            <h2 className="text-2xl font-bold mb-4">Issues</h2>

            <Button variant="secondary" onClick={clearIssues}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear Issues
            </Button>
          </div>
          <Issues
            labels={labels}
            issues={issues}
            milestoneForm={
              <MilestoneForm
                milestone={milestone}
                setMilestone={setMilestone}
              />
            }
            onRemoveLabel={removeLabel}
          />
        </div>
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
          new Set(
            [...labels.map((label) => label.label), ...(editing?.labels ?? [])]
              .filter(Boolean)
              .map((label) => {
                const existingLabel = labels.find((l) => l.label === label);

                if (!existingLabel) {
                  const backgroundColor = getRandomHex();
                  return {
                    label,
                    backgroundColor,
                    color: getTextColor(backgroundColor),
                  };
                }

                return existingLabel;
              })
          )
        )}
      />
    </>
  );
}
