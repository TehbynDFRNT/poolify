
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CraneCost } from "@/types/crane-cost";
import { DigType } from "@/types/dig-type";

export const usePoolWizardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [craneCosts, setCraneCosts] = useState<CraneCost[]>();
  const [digTypes, setDigTypes] = useState<DigType[]>();

  // Load required data for the wizard
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch crane costs
        const { data: craneData, error: craneError } = await supabase
          .from("crane_costs")
          .select("*")
          .order("display_order");
          
        if (craneError) throw craneError;
        setCraneCosts(craneData);
        
        // Fetch dig types
        const { data: digTypeData, error: digTypeError } = await supabase
          .from("dig_types")
          .select("*");
          
        if (digTypeError) throw digTypeError;
        setDigTypes(digTypeData);
        
        // Fetch pool ranges for the dropdown (for validation)
        const { data: rangesData, error: rangesError } = await supabase
          .from("pool_ranges")
          .select("name")
          .order("display_order");
          
        if (rangesError) throw rangesError;
        
      } catch (error) {
        console.error("Error loading wizard data:", error);
        toast.error("Failed to load required data for the wizard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return {
    isLoading,
    craneCosts,
    digTypes
  };
};
