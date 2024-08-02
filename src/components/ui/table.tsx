import * as React from "react";

import { cn } from "@/lib/utils";

type TableProps = React.ComponentProps<"table">;

const Table = ({ className, ref, ...props }: TableProps) => (
  <div className="relative w-full flex-grow">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
);

Table.displayName = "Table";

type TableHeaderProps = React.ComponentProps<"thead">;

const TableHeader = ({ className, ref, ...props }: TableHeaderProps) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b font-semibold text-text-lighter", className)}
    {...props}
  />
);

TableHeader.displayName = "TableHeader";

type TableBodyProps = React.ComponentProps<"tbody">;

const TableBody = ({ className, ref, ...props }: TableBodyProps) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
);

TableBody.displayName = "TableBody";

type TableFooterProps = React.ComponentProps<"tfoot">;

const TableFooter = ({ className, ref, ...props }: TableFooterProps) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
);

TableFooter.displayName = "TableFooter";

type TableRowProps = React.ComponentProps<"tr">;

const TableRow = ({ className, ref, ...props }: TableRowProps) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
);

TableRow.displayName = "TableRow";

type TableHeadProps = React.ComponentProps<"th">;

const TableHead = ({ className, ref, ...props }: TableHeadProps) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
);

TableHead.displayName = "TableHead";

type TableCellProps = React.ComponentProps<"td">;

const TableCell = ({ className, ref, ...props }: TableCellProps) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
);

TableCell.displayName = "TableCell";

type TableCaptionProps = React.ComponentProps<"caption">;

const TableCaption = ({ className, ref, ...props }: TableCaptionProps) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
);

TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
