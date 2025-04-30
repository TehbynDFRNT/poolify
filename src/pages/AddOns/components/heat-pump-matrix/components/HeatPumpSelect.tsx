
import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";

interface HeatPumpSelectProps {
  heatPumps: HeatPumpProduct[];
  selectedHeatPumpId: string | null;
  onSelect: (heatPumpId: string) => void;
  isDisabled?: boolean;
}

export function HeatPumpSelect({
  heatPumps,
  selectedHeatPumpId,
  onSelect,
  isDisabled = false,
}: HeatPumpSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedHeatPump = heatPumps.find((hp) => hp.id === selectedHeatPumpId);

  return (
    <Popover open={open && !isDisabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn(
            "justify-between w-full text-left font-normal",
            !selectedHeatPump && "text-muted-foreground"
          )}
        >
          {selectedHeatPump ? selectedHeatPump.hp_sku : "Select heat pump..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search heat pumps..." />
          <CommandEmpty>No heat pump found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {heatPumps.map((heatPump) => (
              <CommandItem
                key={heatPump.id}
                value={heatPump.id}
                onSelect={() => {
                  onSelect(heatPump.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedHeatPumpId === heatPump.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{heatPump.hp_sku}</span>
                  <span className="text-xs text-muted-foreground">
                    {heatPump.hp_description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
