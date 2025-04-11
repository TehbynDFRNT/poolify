
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type HeatPumpProduct = {
  id: string;
  hp_sku: string;
  hp_description: string;
  cost: number;
  margin: number;
  rrp: number;
  created_at?: string;
};

export const useHeatPumpProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [heatPumpProducts, setHeatPumpProducts] = useState<HeatPumpProduct[]>([]);
  const { toast } = useToast();

  const fetchHeatPumpProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heat_pump_products")
        .select("*")
        .order("hp_sku", { ascending: true }) as { data: HeatPumpProduct[] | null; error: any };

      if (error) {
        throw error;
      }

      setHeatPumpProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching heat pump products:", error);
      toast({
        title: "Error fetching heat pump products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addHeatPumpProduct = async (product: Omit<HeatPumpProduct, "id" | "created_at">) => {
    setIsLoading(true);
    try {
      // Always ensure margin is calculated correctly (RRP - Cost)
      const calculatedMargin = Math.max(0, product.rrp - product.cost);
      const productToAdd = {
        ...product,
        margin: calculatedMargin
      };

      const { data, error } = await supabase
        .from("heat_pump_products")
        .insert(productToAdd)
        .select("*")
        .single() as { data: HeatPumpProduct | null; error: any };

      if (error) {
        throw error;
      }

      setHeatPumpProducts([...heatPumpProducts, data as HeatPumpProduct]);
      toast({
        title: "Heat pump product added",
        description: `${product.hp_sku} has been added successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error adding heat pump product:", error);
      toast({
        title: "Error adding heat pump product",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeatPumpProduct = async (id: string, updates: Partial<HeatPumpProduct>) => {
    setIsLoading(true);
    try {
      // If cost or rrp is being updated, recalculate margin
      let updatesWithMargin = { ...updates };
      
      if ('cost' in updates || 'rrp' in updates) {
        // Get current product to use existing values if not in updates
        const currentProduct = heatPumpProducts.find(p => p.id === id);
        if (currentProduct) {
          const cost = 'cost' in updates ? updates.cost! : currentProduct.cost;
          const rrp = 'rrp' in updates ? updates.rrp! : currentProduct.rrp;
          updatesWithMargin.margin = Math.max(0, rrp - cost);
        }
      }

      const { data, error } = await supabase
        .from("heat_pump_products")
        .update(updatesWithMargin)
        .eq("id", id)
        .select("*")
        .single() as { data: HeatPumpProduct | null; error: any };

      if (error) {
        throw error;
      }

      setHeatPumpProducts(
        heatPumpProducts.map((product) => (product.id === id ? data as HeatPumpProduct : product))
      );
      
      toast({
        title: "Heat pump product updated",
        description: `${(data as HeatPumpProduct).hp_sku} has been updated successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error updating heat pump product:", error);
      toast({
        title: "Error updating heat pump product",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHeatPumpProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const productToDelete = heatPumpProducts.find(p => p.id === id);
      
      const { error } = await supabase
        .from("heat_pump_products")
        .delete()
        .eq("id", id) as { error: any };

      if (error) {
        throw error;
      }

      setHeatPumpProducts(heatPumpProducts.filter((product) => product.id !== id));
      
      toast({
        title: "Heat pump product deleted",
        description: productToDelete ? `${productToDelete.hp_sku} has been deleted.` : "Product has been deleted.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting heat pump product:", error);
      toast({
        title: "Error deleting heat pump product",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    heatPumpProducts,
    isLoading,
    fetchHeatPumpProducts,
    addHeatPumpProduct,
    updateHeatPumpProduct,
    deleteHeatPumpProduct,
  };
};
