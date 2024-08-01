import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddLabelForm({
  addLabel,
}: {
  addLabel: (label: string) => void;
}) {
  return (
    <form
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
          className="w-full"
        />
      </div>
    </form>
  );
}
