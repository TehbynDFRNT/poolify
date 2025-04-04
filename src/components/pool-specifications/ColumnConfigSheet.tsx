
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Critical columns that are always visible
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

// Define column groups for toggling
export const toggleableColumnGroups = [
  {
    id: "details",
    title: "Pool Details",
    description: "Dimensions, volume, and physical characteristics",
    columns: ["length", "width", "depth_shallow", "depth_deep", "waterline_l_m", "volume_liters", "weight_kg", "salt_volume_bags", "salt_volume_bags_fixed", "minerals_kg_initial", "minerals_kg_topup"]
  },
  {
    id: "pricing",
    title: "Pricing Details",
    description: "Buy price without GST and other pricing information",
    columns: ["buy_price_ex_gst"]
  },
  {
    id: "filtration",
    title: "Filtration Details",
    description: "Details about filtration packages",
    columns: ["default_package"]
  },
  {
    id: "crane",
    title: "Crane Details",
    description: "Details about crane types",
    columns: ["crane_type"]
  },
  {
    id: "excavation",
    title: "Excavation Details",
    description: "Details about excavation types",
    columns: ["dig_type"]
  },
  {
    id: "individual_costs",
    title: "Individual Cost Breakdown",
    description: "Breakdown of individual pool costs",
    columns: ["pea_gravel", "install_fee", "trucked_water", "salt_bags", "coping_supply", "beam", "coping_lay"]
  },
  {
    id: "fixed_costs",
    title: "Fixed Cost Breakdown",
    description: "Breakdown of fixed costs",
    columns: [] // This will be populated dynamically
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
  // Local state for the toggle groups
  const [tempVisibleGroups, setTempVisibleGroups] = useState<string[]>(visibleGroups);
  
  // Update local state when the props change
  useEffect(() => {
    setTempVisibleGroups(visibleGroups);
  }, [visibleGroups]);

  // Toggle a group
  const toggleGroup = (groupId: string) => {
    if (tempVisibleGroups.includes(groupId)) {
      setTempVisibleGroups(tempVisibleGroups.filter(id => id !== groupId));
    } else {
      setTempVisibleGroups([...tempVisibleGroups, groupId]);
    }
  };

  // Save changes and close the sheet
  const handleSave = () => {
    setVisibleGroups(tempVisibleGroups);
    toast.success("Column configuration saved");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="sm:max-w-md w-full">
        <SheetHeader className="mb-5">
          <SheetTitle>Configure Columns</SheetTitle>
          <SheetDescription>
            Select which column groups you want to display. Critical financial columns are always shown.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4 pb-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Display Mode</h3>
              <ToggleGroup type="single" value={tempVisibleGroups.length === toggleableColumnGroups.length ? "all" : "custom"}>
                <ToggleGroupItem value="all" onClick={() => setTempVisibleGroups(toggleableColumnGroups.map(g => g.id))}>
                  Show All
                </ToggleGroupItem>
                <ToggleGroupItem value="minimal" onClick={() => setTempVisibleGroups([])}>
                  Minimal (Financial Only)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="h-px bg-border my-4" />

            <div className="space-y-4">
              <h3 className="font-medium">Column Groups</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Toggle which additional information to display
              </p>

              {toggleableColumnGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between pb-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">{group.title}</div>
                    <div className="text-sm text-muted-foreground">{group.description}</div>
                  </div>
                  <Switch
                    checked={tempVisibleGroups.includes(group.id)}
                    onCheckedChange={() => toggleGroup(group.id)}
                  />
                </div>
              ))}
            </div>

            <div className="h-px bg-border my-4" />

            <div className="space-y-4">
              <h3 className="font-medium">Critical Columns (Always Visible)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These columns are always displayed and cannot be hidden
              </p>

              <div className="bg-muted/30 p-3 rounded-md space-y-2">
                <div>• Pool Name & Range (Columns 1-2)</div>
                <div>• Buy Price inc GST</div>
                <div>• Filtration Package Price</div>
                <div>• Crane Cost</div>
                <div>• Dig Total</div>
                <div>• Pool Individual Costs Total</div>
                <div>• Fixed Costs Total</div>
                <div>• True Cost</div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
