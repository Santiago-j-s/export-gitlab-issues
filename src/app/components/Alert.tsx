import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";

export const Alert = ({
  title,
  description,
  leftButton,
  rightButton,
  onOpenChange,
  open,
}: {
  title?: string;
  description?: string;
  leftButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  rightButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 p-6">
        <div className="flex flex-col gap-2">
          {title && (
            <DialogTitle className="text-subheading font-semibold">
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription className="text-foreground-lighter">
              {description}
            </DialogDescription>
          )}
        </div>

        <DialogFooter>
          {leftButton && (
            <Button
              variant="outline"
              disabled={leftButton.disabled}
              onClick={leftButton.onClick}
            >
              {leftButton.label}
            </Button>
          )}
          {rightButton && (
            <Button
              variant="default"
              disabled={rightButton.disabled}
              onClick={rightButton.onClick}
            >
              {rightButton.label}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
