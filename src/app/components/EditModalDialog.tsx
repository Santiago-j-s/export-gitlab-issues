import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Issue } from "./IssueItem";
import { SelectLabels } from "./SelectLabels";

export const EditModalDialog = ({
  editing,
  labelOptions,
  onClose,
  onUpdate,
  onAddLabel,
  onRemoveLabel,
}: {
  onClose: () => void;
  editing: Omit<Issue, "onRemove" | "onEdit"> | null;
  labelOptions: string[];
  onUpdate: (updatedIssue: Omit<Issue, "onRemove" | "onEdit">) => void;
  onAddLabel: (label: string) => void;
  onRemoveLabel: (label: string) => void;
}) => {
  return (
    <Dialog open={!!editing} onOpenChange={onClose}>
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

            const newIssue: Omit<Issue, "onRemove" | "onEdit"> = {
              ...editing!,
              title,
              description,
              labels:
                labels && typeof labels === "string" ? labels.split(",") : [],
              milestone,
            };

            onUpdate(newIssue);
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              placeholder="Edit description"
              className="w-full"
              defaultValue={editing?.description}
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
                    onAddLabel(label);
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
            <SelectLabels
              options={labelOptions.map((label) => ({
                label,
                isSelected: editing?.labels.includes(label) ?? false,
              }))}
              onClick={(label) => {
                if (editing?.labels.includes(label)) {
                  onRemoveLabel(label);
                } else {
                  onAddLabel(label);
                }
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
              defaultValue={editing?.milestone ?? ""}
            />
          </div>

          <Button type="submit">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
