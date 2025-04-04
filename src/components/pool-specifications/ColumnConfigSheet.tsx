
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Define critical columns that are always visible
export const criticalColumns = ["name", "range", "buy_price_inc_gst", "package_price", "crane_cost", "dig_total", "total_cost", "fixed_costs_total"];

// Essential columns - column numbers 1,2,15,17,19,21,29,40,41
export const essentialColumnSet = ["name", "range", "buy_price_inc_gst", "package_price", "crane_cost", "dig_total", "total_cost", "fixed_costs_total"];

// Define column groups for toggling
export const toggleableColumnGroups = [
  {
    id: "details",
    title: "Pool Details (Columns 3-13)",
    columns: ["length", "width", "depth_shallow", "depth_deep", "waterline_l_m", "volume_liters", "weight_kg", "salt_volume_bags", "salt_volume_bags_fixed", "minerals_kg_initial", "minerals_kg_topup"]
  },
  {
    id: "pricing_details",
    title: "Pricing Details (Column 14)",
    columns: ["buy_price_ex_gst"]
  },
  {
    id: "filtration_details",
    title: "Filtration Details (Column 16)",
    columns: ["default_package"]
  },
  {
    id: "crane_details",
    title: "Crane Details (Column 18)",
    columns: ["crane_type"]
  },
  {
    id: "excavation_details",
    title: "Excavation Details (Column 20)",
    columns: ["dig_type"]
  },
  {
    id: "individual_costs",
    title: "Individual Cost Breakdown (Columns 22-28)",
    columns: ["pea_gravel", "install_fee", "trucked_water", "salt_bags", "coping_supply", "beam", "coping_lay"]
  },
  {
    id: "fixed_costs",
    title: "Fixed Cost Breakdown (Columns 30-39)",
    columns: ["fixed_cost_permits", "fixed_cost_engineer", "fixed_cost_delivery", "fixed_cost_site_toilet", "fixed_cost_waste_bin", "fixed_cost_administration", "fixed_cost_project_management", "fixed_cost_aftersales_service", "fixed_cost_equipment_maintenance", "fixed_cost_miscellaneous"]
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
  // Keep a temporary copy of the visible groups for editing
  const [tempVisibleGroups, setTempVisibleGroups] = useState<string[]>(visibleGroups);

  // Update temp groups when the actual visible groups change
  useEffect(() => {
    if (isOpen) {
      setTempVisibleGroups(visibleGroups);
    }
  }, [visibleGroups, isOpen]);

  // Toggle individual column groups in the temp state
  const toggleColumnGroup = (groupId: string) => {
    if (tempVisibleGroups.includes(groupId)) {
      setTempVisibleGroups(tempVisibleGroups.filter(id => id !== groupId));
    } else {
      setTempVisibleGroups([...tempVisibleGroups, groupId]);
    }
  };

  // Show all groups
  const showAllGroups = () => {
    setTempVisibleGroups(toggleableColumnGroups.map(group => group.id));
  };

  // Hide all optional groups
  const hideAllGroups = () => {
    setTempVisibleGroups([]);
  };

  // Show only essential columns (1,2,15,17,19,21,29,40,41)
  const showEssentialColumnsOnly = () => {
    setTempVisibleGroups([]);
    toast.info("Showing only essential columns (1,2,15,17,19,21,29,40,41)");
  };

  // Save the changes back to the parent component
  const saveChanges = () => {
    setVisibleGroups(tempVisibleGroups);
    toast.success("Column configuration saved!");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Configure Visible Columns</SheetTitle>
          <SheetDescription>
            Toggle which column groups to display in the table. Critical financial columns are always visible.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-wrap gap-2 py-2 mt-4">
          <Button 
            onClick={showAllGroups} 
            variant="outline" 
            size="sm"
          >
            Show All Groups
          </Button>
          <Button 
            onClick={hideAllGroups} 
            variant="outline" 
            size="sm"
          >
            Hide All Groups
          </Button>
          <Button 
            onClick={showEssentialColumnsOnly} 
            variant="default" 
            size="sm"
          >
            Essential Columns Only
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] mt-6 pr-4">
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Always Visible Columns</h3>
              <div className="text-sm text-muted-foreground">
                <p>Columns 1-2: Pool Name, Range</p>
                <p>Column 15: Buy Price (inc GST)</p>
                <p>Column 17: Filtration Package Price</p>
                <p>Column 19: Crane Cost</p>
                <p>Column 21: Dig Total</p>
                <p>Column 29: Pool Individual Costs Total</p>
                <p>Column 40: Fixed Costs Total</p>
              </div>
            </div>

            {toggleableColumnGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">{group.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {group.columns.length} column{group.columns.length !== 1 ? 's' : ''}
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
          <Button onClick={saveChanges} size="sm">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
