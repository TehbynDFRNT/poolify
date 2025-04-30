
import React, { useState, useEffect } from "react";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { useHeatPumpPoolCompatibility, PoolCompatibility } from "@/hooks/useHeatPumpPoolCompatibility";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ManageCompatibilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heatPump: HeatPumpProduct | null;
  availablePools: { id: string; range: string; model: string }[];
}

export const ManageCompatibilityDialog: React.FC<ManageCompatibilityDialogProps> = ({
  open,
  onOpenChange,
  heatPump,
  availablePools,
}) => {
  const { fetchCompatibilities, addCompatibility, deleteCompatibility } = useHeatPumpPoolCompatibility();
  
  const [compatibilities, setCompatibilities] = useState<PoolCompatibility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing compatibilities when dialog opens
  useEffect(() => {
    if (open && heatPump) {
      loadCompatibilities();
    } else {
      // Reset state when dialog closes
      setSelectedPools([]);
      setSearchTerm("");
    }
  }, [open, heatPump]);

  const loadCompatibilities = async () => {
    if (!heatPump) return;
    
    setIsLoading(true);
    try {
      const data = await fetchCompatibilities(heatPump.id);
      setCompatibilities(data || []);
      
      // Initialize selected pools based on existing compatibilities
      const selectedPoolIds = (data || []).map(comp => `${comp.pool_range}:${comp.pool_model}`);
      setSelectedPools(selectedPoolIds);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!heatPump) return;
    
    setIsSaving(true);
    try {
      // Process each selected pool
      for (const poolKey of selectedPools) {
        // Check if this compatibility already exists
        const exists = compatibilities.some(comp => 
          `${comp.pool_range}:${comp.pool_model}` === poolKey
        );
        
        if (!exists) {
          // Parse the pool key to get range and model
          const [poolRange, poolModel] = poolKey.split(":");
          
          // Add new compatibility
          await addCompatibility({
            heat_pump_id: heatPump.id,
            pool_range: poolRange,
            pool_model: poolModel,
            hp_sku: heatPump.hp_sku,
            hp_description: heatPump.hp_description,
          });
        }
      }
      
      // Remove compatibilities that were deselected
      for (const comp of compatibilities) {
        const poolKey = `${comp.pool_range}:${comp.pool_model}`;
        if (!selectedPools.includes(poolKey)) {
          await deleteCompatibility(comp.id);
        }
      }
      
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPool = (poolKey: string) => {
    setSelectedPools(prev => {
      if (prev.includes(poolKey)) {
        return prev.filter(key => key !== poolKey);
      } else {
        return [...prev, poolKey];
      }
    });
  };

  const filteredPools = availablePools.filter(pool => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      pool.range.toLowerCase().includes(searchLower) ||
      pool.model.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Pool Compatibility</DialogTitle>
          <DialogDescription>
            {heatPump && (
              <div className="text-sm text-muted-foreground">
                Select which pool models are compatible with{" "}
                <Badge variant="outline">{heatPump.hp_sku}</Badge>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-72">
            <div className="space-y-1 p-1">
              {filteredPools.map((pool) => {
                const poolKey = `${pool.range}:${pool.model}`;
                return (
                  <div
                    key={poolKey}
                    className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
                  >
                    <Checkbox
                      id={poolKey}
                      checked={selectedPools.includes(poolKey)}
                      onCheckedChange={() => handleSelectPool(poolKey)}
                    />
                    <Label
                      htmlFor={poolKey}
                      className="flex-grow cursor-pointer text-sm"
                    >
                      <span className="font-medium">{pool.range}</span>: {pool.model}
                    </Label>
                  </div>
                );
              })}
              
              {filteredPools.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No pools found matching your search.
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>
            {selectedPools.length} pool{selectedPools.length !== 1 ? 's' : ''} selected
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
