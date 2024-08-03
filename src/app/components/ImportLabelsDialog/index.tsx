import { labelsSchema } from "@/app/services/gitlab/labels";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { useFormState } from "react-dom";
import { z } from "zod";
import { ProjectsCombobox } from "../ProjectsCombobox";
import { SubmitButton } from "../SubmitButton";
import { FormState, importLabels } from "./actions";

export const ImportLabelsDialog = ({
  trigger,
  onSuccess,
}: {
  trigger: ReactNode;
  onSuccess: (payload: z.infer<typeof labelsSchema>) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [, action] = useFormState(
    async (_prevState: FormState, formData: FormData) => {
      const retVal = await importLabels(formData);

      if (retVal.status === "success") {
        onSuccess(retVal.result);
        setOpen(false);
      }

      if (retVal.status === "error") {
        alert(retVal.message);
      }

      return retVal;
    },
    {
      status: "idle" as const,
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Import labels</DialogTitle>
        <DialogDescription className="mb-2">
          <p>Import labels from Aerolab Gitlab project.</p>
        </DialogDescription>

        <form className="flex flex-col gap-5" action={action}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project">Name of project</Label>
            <ProjectsCombobox name="project" required />
          </div>

          <SubmitButton pendingLabel="Importing..." submitLabel="Import" />
        </form>
      </DialogContent>
    </Dialog>
  );
};
