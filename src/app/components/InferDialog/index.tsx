import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { useFormState } from "react-dom";
import { Issue } from "../IssueItem";
import { Labels } from "../Labels";
import { SubmitButton } from "./SubmitButton";
import { FormState, inferFromCsv } from "./actions";

export const InferDialog = ({
  trigger,
  labels,
  milestone,
  onSuccess,
}: {
  trigger: ReactNode;
  labels: string[];
  milestone: string;
  onSuccess: (newIssues: Omit<Issue, "onRemove" | "onEdit">[]) => void;
}) => {
  const [isOpen, setOpen] = useState(false);

  const [_, action] = useFormState(
    async (_prevState: FormState, formData: FormData) => {
      const retVal = await inferFromCsv(formData);

      if (retVal.status === "error") {
        window.alert(retVal.message);
      }

      if (retVal.status === "success") {
        const issues: Omit<Issue, "onRemove" | "onEdit">[] = retVal.result.map(
          (result) => {
            const originalLabels = [...labels];
            const resultLabels = result.labels ?? [];
            const labelsToUse: string[] = [];

            resultLabels.forEach((label) => {
              const originalLabel = originalLabels.find(
                (_label) => _label.toLowerCase() === label.toLowerCase()
              );

              if (originalLabel) {
                labelsToUse.push(originalLabel);
              }
            });

            return {
              id: crypto.randomUUID(),
              title: result.title,
              description: result.description ?? "",
              labels:
                result.labels?.filter((label) => labels.includes(label)) ?? [],
              milestone,
            };
          }
        );

        onSuccess(issues);
        setOpen(false);
      }

      return retVal;
    },
    { status: "idle" }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Infer issues</DialogTitle>

        <form action={action} className="flex flex-col gap-4">
          <p>Upload a CSV file to infer issues.</p>

          <input type="file" accept=".csv" name="file" />
          <input type="hidden" name="labels" value={labels.join(";")} />

          <p>The following labels will be used as possible values</p>

          <Labels labels={labels} />

          <p>
            {milestone
              ? 'The following milestone will be used: "' + milestone + '"'
              : "No milestone will be used"}
          </p>

          <p>
            If you need changes in labels or milestone, please close this dialog
            and edit them
          </p>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
};
