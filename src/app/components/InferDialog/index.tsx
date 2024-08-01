import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { useFormState } from "react-dom";
import { Issue } from "../IssueItem";
import { Labels } from "../Labels";
import { SubmitButton } from "../SubmitButton";
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
              milestone: result.milestone,
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
        <DialogTitle>AI Infer</DialogTitle>
        <DialogDescription className="mb-2">
          <p>Infer issues from any CSV file.</p>
        </DialogDescription>

        <form action={action} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file">Upload a CSV file</Label>
            <input type="file" accept=".csv" name="file" id="file" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              type="text"
              name="apiKey"
              id="apiKey"
              // If we are in development mode, we don't require the API key, we take it from the environment
              required={process.env.NODE_ENV !== "development"}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label>The following labels will be used as possible values:</Label>
            <input type="hidden" name="labels" value={labels.join(";")} />
            <Labels labels={labels} />
            <p className="text-sm text-gray-300">
              If you need changes in labels please close this dialog and edit
              them
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="milestone">Milestone</Label>
            <Input
              type="text"
              name="milestone"
              id="milestone"
              defaultValue={milestone}
              required
            />
          </div>

          <SubmitButton pendingLabel="Infering..." submitLabel="Infer" />
        </form>
      </DialogContent>
    </Dialog>
  );
};
