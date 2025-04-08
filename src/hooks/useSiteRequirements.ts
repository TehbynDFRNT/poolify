
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSiteRequirements = (customerId: string) => {
  const [craneId, setCraneId] = useState<string | undefined>(undefined);
  const [trafficControlId, setTrafficControlId] = useState<string | undefined>('none');
  const [bobcatId, setBobcatId] = useState<string | undefined>('none');
  const [customRequirements, setCustomRequirements] = useState<CustomRequirement[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [craneCost, setCraneCost] = useState<number>(0);
  const [trafficControlCost, setTrafficControlCost] = useState<number>(0);
  const [bobcatCost, setBobcatCost] = useState<number>(0);
  const [defaultCraneCost, setDefaultCraneCost] = useState<number>(0);
  const [defaultCraneId, setDefaultCraneId] = useState<string | undefined>(undefined);

  // Load existing site requirements if any
  useEffect(() => {
    const fetchExistingRequirements = async () => {
      if (!customerId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pool_projects')
          .select(`
            crane_id,
            traffic_control_id,
            bobcat_id,
            site_requirements_data,
            site_requirements_notes
          `)
          .eq('id', customerId)
          .single();
        
        if (error) {
          console.error("Error fetching site requirements:", error);
          return;
        }
        
        if (data) {
          // Set the form state from the loaded data
          setCraneId(data.crane_id || undefined);
          setTrafficControlId(data.traffic_control_id || 'none');
          setBobcatId(data.bobcat_id || 'none');
          
          // Safely handle the custom requirements data with proper type checking
          if (data.site_requirements_data && Array.isArray(data.site_requirements_data)) {
            // First convert to unknown, then to the specific type
            const requirementsData = data.site_requirements_data as unknown;
            // Validate the shape of each item in the array before setting the state
            const validRequirements = (requirementsData as any[]).filter(item => 
              typeof item === 'object' && 
              item !== null && 
              'id' in item && 
              'description' in item && 
              'price' in item
            ) as CustomRequirement[];
            
            setCustomRequirements(validRequirements);
          }
          
          setNotes(data.site_requirements_notes || "");
        }
      } catch (error) {
        console.error("Error fetching site requirements data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingRequirements();
    fetchDefaultCraneCost();
  }, [customerId]);

  // Fetch the default crane cost (Franna Crane-S20T-L1)
  const fetchDefaultCraneCost = async () => {
    try {
      const { data, error } = await supabase
        .from('crane_costs')
        .select('id, price')
        .eq('name', 'Franna Crane-S20T-L1')
        .single();
      
      if (error) {
        console.error("Error fetching default crane cost:", error);
        return;
      }
      
      if (data) {
        setDefaultCraneCost(data.price);
        setDefaultCraneId(data.id);
      }
    } catch (error) {
      console.error("Error fetching default crane cost:", error);
    }
  };

  // Load cost data for selected items
  useEffect(() => {
    const fetchCosts = async () => {
      try {
        // Fetch crane cost if selected
        if (craneId && craneId !== 'none') {
          const { data: craneData } = await supabase
            .from('crane_costs')
            .select('price')
            .eq('id', craneId)
            .single();
          
          if (craneData) {
            setCraneCost(craneData.price);
          }
        } else {
          setCraneCost(0);
        }
        
        // Fetch traffic control cost if selected
        if (trafficControlId && trafficControlId !== 'none') {
          const { data: trafficData } = await supabase
            .from('traffic_control_costs')
            .select('price')
            .eq('id', trafficControlId)
            .single();
          
          if (trafficData) {
            setTrafficControlCost(trafficData.price);
          }
        } else {
          setTrafficControlCost(0);
        }
        
        // Fetch bobcat cost if selected
        if (bobcatId && bobcatId !== 'none') {
          const { data: bobcatData } = await supabase
            .from('bobcat_costs')
            .select('price')
            .eq('id', bobcatId)
            .single();
          
          if (bobcatData) {
            setBobcatCost(bobcatData.price);
          }
        } else {
          setBobcatCost(0);
        }
      } catch (error) {
        console.error("Error fetching costs:", error);
      }
    };
    
    fetchCosts();
  }, [craneId, trafficControlId, bobcatId]);

  // Calculate costs and related properties
  const customRequirementsTotal = customRequirements.reduce(
    (total, req) => total + (req.price || 0), 
    0
  );

  const isDefaultCrane = craneId === defaultCraneId;
  const totalCost = craneCost + trafficControlCost + bobcatCost + customRequirementsTotal;

  // Custom requirements handlers
  const addRequirement = () => {
    setCustomRequirements([
      ...customRequirements,
      { id: crypto.randomUUID(), description: "", price: 0 }
    ]);
  };

  const removeRequirement = (id: string) => {
    setCustomRequirements(customRequirements.filter(req => req.id !== id));
  };

  const updateRequirement = (id: string, field: 'description' | 'price', value: string) => {
    setCustomRequirements(customRequirements.map(req => {
      if (req.id === id) {
        if (field === 'price') {
          return { ...req, [field]: parseFloat(value) || 0 };
        }
        return { ...req, [field]: value };
      }
      return req;
    }));
  };

  return {
    craneId,
    setCraneId,
    trafficControlId,
    setTrafficControlId,
    bobcatId,
    setBobcatId,
    customRequirements,
    notes,
    setNotes,
    isLoading,
    craneCost,
    trafficControlCost,
    bobcatCost,
    defaultCraneCost,
    defaultCraneId,
    isDefaultCrane,
    totalCost,
    customRequirementsTotal,
    addRequirement,
    removeRequirement,
    updateRequirement
  };
};

export interface CustomRequirement {
  id: string;
  description: string;
  price: number;
}
