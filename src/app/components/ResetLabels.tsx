import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "./Alert";

export const ResetLabels = ({ resetLabels }: { resetLabels: () => void }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className="size-6"
        onClick={() => {
          setIsAlertOpen(true);
        }}
      >
        <Trash2 className="size-4" />
      </Button>
      <Alert
        onOpenChange={setIsAlertOpen}
        open={isAlertOpen}
        title="Remove all labels"
        description="Are you sure you want to remove all labels?"
        leftButton={{
          label: "Cancel",
          onClick: () => setIsAlertOpen(false),
        }}
        rightButton={{
          label: "Remove",
          onClick: () => {
            resetLabels();
            setIsAlertOpen(false);
          },
        }}
      />
    </>
  );
};
