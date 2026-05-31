"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type StatusOption = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  className?: string;
};

interface StatusComboboxProps {
  statuses: StatusOption[];
  value: string;
  onValueChange: (value: string) => void;
  dict: {
    select_status_placeholder: string;
    search_placeholder: string;
    no_status_found_message: string;
  };
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
}

export function StatusCombobox({
  statuses,
  value,
  onValueChange,
  dict,
  className,
  triggerClassName,
  icon,
}: StatusComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedStatus = statuses.find((status) => status.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", triggerClassName)}
        >
          <span className="flex items-center gap-2 truncate">
            {selectedStatus?.icon || icon}
            {selectedStatus ? (
              <span className={cn("truncate", selectedStatus.className)}>{selectedStatus.title}</span>
            ) : (
              <span className="text-muted-foreground">
                {dict.select_status_placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 w-60", className)} align="start">
        <Command>
          <CommandInput placeholder={dict.search_placeholder} />
          <CommandList>
            <CommandEmpty>{dict.no_status_found_message}</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.id}
                  value={status.title}
                  onSelect={() => {
                    onValueChange(status.id === value ? "all" : status.id);
                    setOpen(false);
                  }}
                  className={cn("flex items-center gap-2", status.className)}
                >
                  <CheckIcon
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === status.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {status.icon}
                  <span className="truncate">{status.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
