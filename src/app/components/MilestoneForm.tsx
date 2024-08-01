import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MilestoneForm({
  milestone,
  setMilestone,
}: {
  milestone: string | null;
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
