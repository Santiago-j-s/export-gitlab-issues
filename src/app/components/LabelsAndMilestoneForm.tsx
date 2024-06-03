import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function MilestoneForm({
  milestone,
  setMilestone,
}: {
  milestone: string;
  setMilestone: (milestone: string) => void;
}) {
  return (
    <form
      className="col-span-8 flex items-end gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="milestone">Milestone</Label>
        <Input
          type="text"
          id="milestone"
          name="milestone"
          placeholder="Add milestone"
          className="w-40"
          onChange={(e) => {
            setMilestone(e.target.value);
          }}
          value={milestone ?? ""}
        />
      </div>
    </form>
  );
}

function LabelsForm({
  addLabel,
  resetLabels,
}: {
  addLabel: (label: string) => void;
  resetLabels: () => void;
}) {
  return (
    <form
      className="col-span-8 flex items-end gap-4"
      action={(data: FormData) => {
        addLabel(data.get("label") as string);
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Add label</Label>
        <Input
          type="text"
          id="label"
          name="label"
          placeholder="Add label"
          className="w-40"
        />
      </div>
      <Button type="button" variant="secondary" onClick={resetLabels}>
        Reset labels
      </Button>
    </form>
  );
}

export function LabelsAndMilestoneForm({
  addLabel,
  resetLabels,
  milestone,
  setMilestone,
}: {
  addLabel: (label: string) => void;
  resetLabels: () => void;
  milestone: string;
  setMilestone: (milestone: string) => void;
}) {
  return (
    <div className="col-span-8 flex gap-8">
      <LabelsForm addLabel={addLabel} resetLabels={resetLabels} />
      <MilestoneForm milestone={milestone} setMilestone={setMilestone} />
    </div>
  );
}
