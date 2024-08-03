import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { forwardRef, useRef, useState, useTransition } from "react";

const useCombobox = (defaultValue?: { value: string; label: string }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{
    value: string;
    label: string;
  } | null>(defaultValue || null);

  const buttonTriggerRef = useRef<HTMLButtonElement>(null);

  return { open, setOpen, value, setValue, buttonTriggerRef };
};

const ComboboxTrigger = forwardRef<
  HTMLButtonElement,
  { open: boolean; pending?: boolean; selectedLabel: string | undefined }
>(({ open, pending, selectedLabel }, ref) => {
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        ref={ref}
      >
        {pending ? "Loading..." : selectedLabel || "Select option..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxContent = forwardRef<
  HTMLDivElement,
  {
    width: number | undefined;
    pending?: boolean;
    options: { value: string; label: string }[];
    selectedValue: string | null;
    onSelect: (value: string) => void;
    children: React.ReactNode;
  }
>(({ width, pending, options, selectedValue, onSelect, children }, ref) => {
  return (
    <PopoverContent
      className="p-0"
      style={{
        width,
      }}
      ref={ref}
    >
      <Command>
        {children}
        <CommandEmpty>
          {pending
            ? "Loading"
            : "No options found. Please try another search term."}
        </CommandEmpty>
        <CommandGroup>
          <CommandList>
            {options.map((option) => {
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandList>
        </CommandGroup>
      </Command>
    </PopoverContent>
  );
});
ComboboxContent.displayName = "ComboboxContent";

export const AsyncCombobox = ({
  search,
  name,
  required,
}: {
  search: (term: string) => Promise<{ value: string; label: string }[]>;
  name: string;
  required?: boolean;
}) => {
  let timeout: NodeJS.Timeout;

  const { open, setOpen, value, setValue, buttonTriggerRef } = useCombobox();

  const buttonTriggerRefRect =
    buttonTriggerRef.current?.getBoundingClientRect();
  const inputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );

  const [pending, searchWithTerm] = useTransition();

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <ComboboxTrigger
          open={open}
          pending={pending}
          selectedLabel={value?.label}
          ref={buttonTriggerRef}
        />

        <ComboboxContent
          width={buttonTriggerRefRect?.width}
          pending={pending}
          options={options}
          selectedValue={value?.value || null}
          onSelect={(currentValue) => {
            setValue(
              options.find((option) => option.value === currentValue) || null
            );
            setOptions([]);
            setOpen(false);

            if (inputRef.current) {
              inputRef.current.value = currentValue;
            }
          }}
        >
          <Input
            placeholder="Search option..."
            onChange={(e) => {
              clearTimeout(timeout);

              timeout = setTimeout(() => {
                searchWithTerm(() => search(e.target.value).then(setOptions));
              }, 500);
            }}
            className="mb-2 bg-background py-3 h-10 text-sm"
          />
        </ComboboxContent>
      </Popover>
      <input hidden readOnly ref={inputRef} name={name} required={required} />
    </>
  );
};

export const Combobox = ({
  options,
  name,
  defaultValue,
  required,
}: {
  options: { value: string; label: string }[];
  name: string;
  defaultValue?: { value: string; label: string };
  required?: boolean;
}) => {
  const { open, setOpen, value, setValue, buttonTriggerRef } =
    useCombobox(defaultValue);
  const buttonTriggerRefRect =
    buttonTriggerRef.current?.getBoundingClientRect();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <ComboboxTrigger
          open={open}
          selectedLabel={value?.label}
          ref={buttonTriggerRef}
        />

        <ComboboxContent
          width={buttonTriggerRefRect?.width}
          options={options}
          selectedValue={value?.value || null}
          onSelect={(currentValue) => {
            const newValue =
              options.find((option) => option.value === currentValue) || null;
            setValue(newValue);
            setOpen(false);

            if (inputRef.current) {
              inputRef.current.value = newValue?.value || "";
            }
          }}
        >
          <CommandInput />
        </ComboboxContent>
      </Popover>
      <input
        hidden
        readOnly
        ref={inputRef}
        name={name}
        defaultValue={defaultValue?.value ?? ""}
        required={required}
      />
    </>
  );
};
