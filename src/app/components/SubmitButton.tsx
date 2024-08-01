import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const SubmitButton = ({
  pendingLabel,
  submitLabel,
}: {
  pendingLabel: string;
  submitLabel: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : submitLabel}
    </Button>
  );
};
