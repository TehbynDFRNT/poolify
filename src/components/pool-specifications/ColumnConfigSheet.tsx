
import { Button } from "@/components/ui/button";
import { Settings, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Define critical columns that are always visible
export const criticalColumns = [
  "name", 
  "range", 
  "buy_price_inc_gst", 
  "package_price",
  "crane_cost",
  "dig_total",
  "total_cost", 
  "fixed_costs_total",
  "true_cost"
];

// Define column groups that can be toggled
export const toggleableColumnGroups = [
  {
    id: "details",
    title: "Pool Details (columns 3-13)",
    columns: ["length", "width", "depth_shallow", "depth_deep", "waterline_l_m", "volume_liters", "weight_kg", "salt_volume_bags", "salt_volume_bags_fixed", "minerals_kg_initial", "minerals_kg_topup"]
  },
  {
    id: "filtration_details",
    title: "Filtration Details (column 16)",
    columns: ["default_package"]
  },
  {
    id: "crane_details",
    title: "Crane Details (column 18)",
    columns: ["crane_type"]
  },
  {
    id: "excavation_details",
    title: "Excavation Details (column 20)",
    columns: ["dig_type"]
  },
  {
    id: "individual_costs",
    title: "Individual Cost Breakdown (columns 22-28)",
    columns: ["pea_gravel", "install_fee", "trucked_water", "salt_bags", "coping_supply", "beam", "coping_lay"]
  },
  {
    id: "fixed_costs_breakdown",
    title: "Fixed Costs Breakdown (columns 30-39)",
    columns: ["fixed_cost_1", "fixed_cost_2", "fixed_cost_3", "fixed_cost_4", "fixed_cost_5", "fixed_cost_6", "fixed_cost_7", "fixed_cost_8", "fixed_cost_9", "fixed_cost_10"]
  }
];

interface ColumnConfigSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  visibleGroups: string[];
  setVisibleGroups: (groups: string[]) => void;
}

export function ColumnConfigSheet({ 
  isOpen, 
  setIsOpen, 
  visibleGroups, 
  setVisibleGroups 
}: ColumnConfigSheetProps) {
  const [tempVisibleGroups, setTempVisibleGroups] = useState<string[]>(visibleGroups);
  
  // Update temp groups when the actual visible groups change
  useEffect(() => {
    setTempVisibleGroups(visibleGroups);
  }, [visibleGroups]);
  
  // Toggle individual column group visibility
  const toggleColumnGroup = (groupId: string) => {
    if (tempVisibleGroups.includes(groupId)) {
      setTempVisibleGroups(tempVisibleGroups.filter(id => id !== groupId));
    } else {
      setTempVisibleGroups([...tempVisibleGroups, groupId]);
    }
  };

  // Apply changes
  const applyChanges = () => {
    setVisibleGroups(tempVisibleGroups);
    toast.success("Column configuration updated");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure Columns
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure Visible Columns</SheetTitle>
          <SheetDescription>
            Critical financial columns are always visible. Toggle additional column groups.
          </SheetDescription>
        </SheetHeader>
        
        <div className="border-b pb-4 mt-4">
          <h3 className="font-medium mb-2">Always Visible Columns</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Pool Name & Range (columns 1-2)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Buy Price inc GST (column 15)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Filtration Package Price (column 17)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Crane Cost (column 19)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Dig Total (column 21)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Pool Individual Costs Total (column 29)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Fixed Costs Total (column 40)</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>True Cost</span>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-360px)] mt-4">
          <h3 className="font-medium mb-2">Optional Column Groups</h3>
          <div className="space-y-4">
            {toggleableColumnGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{group.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {group.columns.length} columns
                  </p>
                </div>
                <Switch
                  checked={tempVisibleGroups.includes(group.id)}
                  onCheckedChange={() => toggleColumnGroup(group.id)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </SheetClose>
          <Button size="sm" onClick={applyChanges}>
            Apply Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
