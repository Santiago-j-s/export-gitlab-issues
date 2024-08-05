"use client";
import { Button } from "@/components/ui/button";
import { Bot, CloudDownload, Trash2, Upload } from "lucide-react";
import { AddIssuesDialog } from "./components/AddIssuesDialog";
import { EditModalDialog } from "./components/EditModalDialog";
import { ImportLabelsDialog } from "./components/ImportLabelsDialog";
import { InferDialog } from "./components/InferDialog";
import { IssueForm, parseIssueFormResult } from "./components/IssueForm";
import { Issues } from "./components/Issues";
import { ResetLabels } from "./components/ResetLabels";
import { RemovableLabelOption } from "./components/SelectLabels";
import { TwoResizableColumns } from "./components/TwoResizableColumns";
import { useIssues } from "./hooks/useIssues";
import { generateLabelOption, useLabels } from "./hooks/useLabels";

const combineEditingLabelsWithLabels = (
  editingLabels: RemovableLabelOption[],
  labels: RemovableLabelOption[]
) => {
  const labelsNotRepeated = [
    ...labels.map((label) => label.label),
    ...editingLabels.map((l) => l.label),
  ].filter(Boolean);

  const uniqueLabels = Array.from(new Set(labelsNotRepeated));

  return uniqueLabels.map((label) => {
    const existingLabel = labels.find((l) => l.label === label);

    if (!existingLabel) {
      return { ...generateLabelOption({ label }), removable: true };
    }

    return existingLabel;
  });
};

export default function ClientPage() {
  const [labels, addLabel, removeLabel, resetLabels] = useLabels();
  const [issues, addIssue, clearIssues, { editing, setEditing }, removeIssue] =
    useIssues();

  return (
    <>
      <div className="flex justify-end w-full">
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
            labels={labels}
            onSuccess={(newIssues) => {
              clearIssues();
              newIssues.forEach(addIssue);
            }}
          />
        </div>
      </div>

      <TwoResizableColumns
        columnA={
          <form
            action={(data: FormData) => {
              addIssue(parseIssueFormResult(data, labels));
            }}
            className="h-full flex flex-col gap-md1 px-md2 py-md3 rounded-lg bg-background-secondary border"
          >
            <p className="text-h4 font-semibold">Add issue</p>
            <IssueForm
              labelOptions={labels.map((label) => ({
                ...label,
                removable: true,
              }))}
              labelsActions={
                <div className="flex gap-2">
                  <ResetLabels resetLabels={resetLabels} />
                  <ImportLabelsDialog
                    trigger={
                      <Button size="icon" className="size-6">
                        <CloudDownload className="size-4" />
                      </Button>
                    }
                    onSuccess={(payload) => {
                      resetLabels();
                      payload.forEach(({ name, color }) =>
                        addLabel(name, color)
                      );
                    }}
                  />
                </div>
              }
              onRemoveLabel={removeLabel}
            />
          </form>
        }
        columnB={
          <Issues
            header={
              <div className="flex justify-between w-full">
                <p className="text-h4 font-semibold mb-4">Issues</p>

                <Button variant="secondary" onClick={clearIssues}>
                  <Trash2 className="mr-2 h-4 w-4" /> Clear Issues
                </Button>
              </div>
            }
            issues={issues}
          />
        }
      />

      <form
        action={(data: FormData) => {
          addLabel(data.get("label") as string);
        }}
        className="flex flex-col gap-2"
        id="add-label"
      />

      <EditModalDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onUpdate={(issue) => {
          removeIssue(issue.id);
          addIssue(issue);
          setEditing(null);
        }}
        labelOptions={combineEditingLabelsWithLabels(
          editing?.labels.map((label) => ({
            ...label,
            removable: true,
          })) ?? [],
          labels.map((label) => ({
            ...label,
            removable: false,
          }))
        )}
      />
    </>
  );
}
