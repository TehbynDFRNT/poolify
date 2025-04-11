
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeatPumpPoolCompatibility } from "@/pages/Quotes/components/SiteRequirementsStep/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PoolCompatibilityListProps {
  compatibilities: HeatPumpPoolCompatibility[];
  heatPumpId: string;
  onAdd?: (compatibility: Omit<HeatPumpPoolCompatibility, "id">) => void;
  onDelete?: (compatibilityId: string) => void;
}

export const PoolCompatibilityList: React.FC<PoolCompatibilityListProps> = ({
  compatibilities,
  heatPumpId,
  onAdd,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRange, setNewRange] = useState("");
  const [newModel, setNewModel] = useState("");

  // Group compatibilities by pool range for better organization
  const groupedCompatibilities = compatibilities.reduce<Record<string, HeatPumpPoolCompatibility[]>>(
    (acc, item) => {
      if (!acc[item.pool_range]) {
        acc[item.pool_range] = [];
      }
      acc[item.pool_range].push(item);
      return acc;
    },
    {}
  );

  const handleAdd = () => {
    if (!newRange || !newModel) {
      toast.error("Please enter both pool range and model");
      return;
    }

    // Find the heat pump SKU and description from an existing entry
    const existingEntry = compatibilities[0];
    if (!existingEntry) {
      toast.error("Could not determine heat pump details");
      return;
    }

    onAdd?.({
      heat_pump_id: heatPumpId,
      pool_range: newRange,
      pool_model: newModel,
      hp_sku: existingEntry.hp_sku,
      hp_description: existingEntry.hp_description
    });

    // Reset form
    setNewRange("");
    setNewModel("");
    setIsAdding(false);
  };

  const handleDelete = (compatibilityId: string) => {
    if (window.confirm("Are you sure you want to remove this compatibility?")) {
      onDelete?.(compatibilityId);
    }
  };

  // Get unique pool ranges for dropdown
  const uniqueRanges = Array.from(new Set(compatibilities.map(c => c.pool_range)));

  return (
    <div className="p-4 space-y-4 bg-slate-50 rounded-md">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Compatible Pool Models</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
          className="h-8"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Pool
        </Button>
      </div>

      {isAdding && (
        <div className="flex flex-wrap gap-2 p-3 bg-white rounded-md border">
          <div className="flex-1 min-w-[200px]">
            <Select value={newRange} onValueChange={setNewRange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select Pool Range" />
              </SelectTrigger>
              <SelectContent>
                {uniqueRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
                <SelectItem value="other">Other (type below)</SelectItem>
              </SelectContent>
            </Select>
            {newRange === "other" && (
              <Input 
                className="mt-2 h-9" 
                placeholder="Enter pool range" 
                value={newRange === "other" ? "" : newRange}
                onChange={e => setNewRange(e.target.value)}
              />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input 
              className="h-9" 
              placeholder="Pool Model" 
              value={newModel}
              onChange={e => setNewModel(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="h-9" 
              onClick={handleAdd}
            >
              Add
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9" 
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {Object.entries(groupedCompatibilities).length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Pool Range</TableHead>
                <TableHead className="w-1/2">Pool Model</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedCompatibilities).map(([range, models]) => (
                <React.Fragment key={range}>
                  {models.map((item, index) => (
                    <TableRow key={item.id || index} className="hover:bg-muted/50">
                      <TableCell>
                        {index === 0 && (
                          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                            {range}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.pool_model}</TableCell>
                      <TableCell>
                        {item.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(item.id as string)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No compatible pools defined yet
        </div>
      )}
    </div>
  );
};
