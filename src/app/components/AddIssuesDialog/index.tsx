import { Button } from "@/components/ui/button";
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
import { Issue } from "../IssueItem";
import { ProjectsCombobox } from "../ProjectsCombobox";
import { SubmitButton } from "../SubmitButton";
import { FormState, saveIssues } from "./actions";

export const AddIssuesDialog = ({
  trigger,
  issuesToAdd,
}: {
  trigger: ReactNode;
  issuesToAdd: Issue[];
}) => {
  const [isOpen, setOpen] = useState(false);
  const [, action] = useFormState(
    async (_formState: FormState, formData: FormData) => {
      const retVal = await saveIssues(formData);

      if (retVal.status === "success") {
        alert(`${issuesToAdd.length} issues imported`);
        setOpen(false);
      }

      if (retVal.status === "error") {
        alert(retVal.message);
      }

      return retVal;
    },
    {
      status: "idle",
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Issues</DialogTitle>
        <DialogDescription className="mb-2">
          Import {issuesToAdd.length} issues to a project.
        </DialogDescription>

        <form className="flex flex-col gap-6" action={action}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project">Name of project</Label>
            <ProjectsCombobox name="project" required />
          </div>

          <input
            hidden
            readOnly
            name="issues"
            value={JSON.stringify(issuesToAdd)}
          />

          <div className="flex gap-4">
            <Button variant="secondary">Cancel</Button>
            <SubmitButton pendingLabel="Importing..." submitLabel="Import" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
