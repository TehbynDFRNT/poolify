
import React, { useState } from "react";
import { useHeatPumpProducts } from "@/hooks/useHeatPumpProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialProducts = [
  {
    hp_sku: "IX9",
    hp_description: "Sunlover Oasis 9kW Heat Pump",
    cost: 2835,
    margin: 1895,
    rrp: 4730
  },
  {
    hp_sku: "IX13",
    hp_description: "Sunlover Oasis 13kW Heat Pump",
    cost: 3419,
    margin: 2406,
    rrp: 5825
  },
  {
    hp_sku: "IX19",
    hp_description: "Sunlover Oasis 19kW Heat Pump",
    cost: 4521,
    margin: 3234,
    rrp: 7755
  },
  {
    hp_sku: "IX24",
    hp_description: "Sunlover Oasis 24kW Heat Pump",
    cost: 6513,
    margin: 4642,
    rrp: 11155
  }
];

export const HeatPumpSeedData = () => {
  const { addHeatPumpProduct } = useHeatPumpProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { toast } = useToast();

  const handleAddProducts = async () => {
    setIsLoading(true);
    try {
      for (const product of initialProducts) {
        await addHeatPumpProduct(product);
      }
      setIsDone(true);
      toast({
        title: "Products added",
        description: "All heat pump products have been added successfully.",
      });
    } catch (error) {
      console.error("Error adding products:", error);
      toast({
        title: "Error adding products",
        description: "There was an error adding the heat pump products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return <div className="text-sm text-green-600">Products have been added successfully</div>;
  }

  return (
    <Button 
      onClick={handleAddProducts} 
      variant="outline" 
      size="sm" 
      disabled={isLoading}
      className="mb-4"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding Products...
        </>
      ) : (
        "Add Sample Products"
      )}
    </Button>
  );
};
