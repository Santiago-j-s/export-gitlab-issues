import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { LabelOption, generateLabelOption } from "../hooks/useLabels";
import { IssueForm, parseIssueFormResult } from "./IssueForm";
import { Issue } from "./IssueItem";

export const EditModalDialog = ({
  editing,
  labelOptions,
  onClose,
  onUpdate,
}: {
  onClose: () => void;
  editing: Omit<Issue, "onRemove" | "onEdit"> | null;
  labelOptions: LabelOption[];
  onUpdate: (updatedIssue: Omit<Issue, "onRemove" | "onEdit">) => void;
}) => {
  const [localLabelOptions, setLocalLabelOptions] = useState(labelOptions);

  return (
    <Dialog open={!!editing} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editing issue</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          action={(data: FormData) => {
            onUpdate({
              ...editing!,
              ...parseIssueFormResult(data, localLabelOptions),
            });
          }}
        >
          <IssueForm
            labelOptions={localLabelOptions}
            labelsActions={<></>}
            onRemoveLabel={(label) => {
              setLocalLabelOptions(
                localLabelOptions.filter((l) => l.label !== label)
              );
            }}
            onAddLabel={(label) => {
              setLocalLabelOptions([
                ...localLabelOptions,
                generateLabelOption({ label }),
              ]);
            }}
            defaultValues={{
              title: editing?.title ?? "",
              description: editing?.description ?? "",
              labels: editing?.labels.map((label) => label.label) ?? [],
              milestone: editing?.milestone ?? "",
            }}
          />

          <Button type="submit">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
