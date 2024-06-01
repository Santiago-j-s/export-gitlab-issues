import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

const Textarea = ({ className, ref, ...props }: TextareaProps) => {
  /**
   * https://twitter.com/wesbos/status/1790378998628786227
   */
  return (
    <textarea
      className={cn(
        "flex w-full leading-6 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [--padding:10px] [field-sizing:content] p-[var(--padding)] px-[calc(var(--padding)+(1lh-1ex)/2)] min-h-[calc(2lh+2*var(--padding))] max-h-[calc(4lh+2*var(--padding))]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
