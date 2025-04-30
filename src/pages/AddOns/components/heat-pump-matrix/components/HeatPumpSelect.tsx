
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";

interface HeatPumpSelectProps {
  heatPumps: HeatPumpProduct[];
  selectedHeatPumpId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export const HeatPumpSelect: React.FC<HeatPumpSelectProps> = ({ 
  heatPumps, 
  selectedHeatPumpId, 
  onSelect,
  disabled = false 
}) => {
  return (
    <Select 
      value={selectedHeatPumpId} 
      onValueChange={onSelect}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {heatPumps.find(hp => hp.id === selectedHeatPumpId)?.hp_sku || "Select heat pump"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {heatPumps.map((heatPump) => (
          <SelectItem key={heatPump.id} value={heatPump.id}>
            {heatPump.hp_sku} - {heatPump.hp_description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
