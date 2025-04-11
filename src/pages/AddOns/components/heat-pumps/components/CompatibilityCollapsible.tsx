
import React, { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter, Loader2 } from "lucide-react";
import { PoolCompatibilityList } from "./PoolCompatibilityList";
import { useHeatPumpCompatibility } from "@/hooks/useHeatPumpCompatibility";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";

interface CompatibilityCollapsibleProps {
  product: HeatPumpProduct;
}

export const CompatibilityCollapsible: React.FC<CompatibilityCollapsibleProps> = ({ 
  product 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // We'll use product SKU for filtering in this demo 
  // (in a real implementation, we'd use the product ID)
  const { 
    compatibilities, 
    fetchCompatibilities, 
    addCompatibility, 
    deleteCompatibility
  } = useHeatPumpCompatibility();

  useEffect(() => {
    if (isOpen && compatibilities.length === 0) {
      setIsLoading(true);
      fetchCompatibilities(product.hp_sku)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, product.hp_sku]);

  const handleAdd = async (compatibility: any) => {
    await addCompatibility({
      ...compatibility,
      heat_pump_id: product.id
    });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-2 border rounded-md overflow-hidden"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex w-full justify-between p-2 h-auto hover:bg-slate-50"
        >
          <div className="flex items-center text-xs font-medium text-muted-foreground">
            <ListFilter className="mr-2 h-3.5 w-3.5" />
            Compatible Pools
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <PoolCompatibilityList 
            compatibilities={compatibilities} 
            heatPumpId={product.id}
            onAdd={handleAdd}
            onDelete={deleteCompatibility}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
