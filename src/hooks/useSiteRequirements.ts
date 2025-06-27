import { supabase } from "@/integrations/supabase/client";
import { getFirstOrEmpty } from "@/utils/poolProjectHelpers";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useSiteRequirements = (customerId: string) => {
  const queryClient = useQueryClient();
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
  
  // Site conditions state
  const [accessGrade, setAccessGrade] = useState<string | undefined>("none");
  const [distanceFromTruck, setDistanceFromTruck] = useState<string | undefined>("none");
  const [poolShellDelivery, setPoolShellDelivery] = useState<string | undefined>("none");
  const [sewerDiversion, setSewerDiversion] = useState<string | undefined>("none");
  const [stormwaterDiversion, setStormwaterDiversion] = useState<string | undefined>("none");
  const [removeSlab, setRemoveSlab] = useState<string | undefined>("none");
  const [earthmoving, setEarthmoving] = useState<string | undefined>("none");
  const [removeSlabSqm, setRemoveSlabSqm] = useState<string>("");
  const [earthmovingCubicMeters, setEarthmovingCubicMeters] = useState<string>("");

  // Load existing site requirements if any
  useEffect(() => {
    const fetchExistingRequirements = async () => {
      if (!customerId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pool_projects')
          .select(`
            site_requirements_data,
            site_requirements_notes,
            pool_equipment_selections(
              crane_id,
              traffic_control_id,
              bobcat_id
            ),
            pool_site_conditions(
              access_grade,
              distance_from_truck,
              pool_shell_delivery,
              sewer_diversion,
              stormwater_diversion,
              remove_slab,
              earthmoving,
              remove_slab_sqm,
              earthmoving_cubic_meters
            )
          `)
          .eq('id', customerId)
          .single();

        if (error) {
          console.error("Error fetching site requirements:", error);
          return;
        }

        if (data) {
          console.log("Full data loaded:", data);
          console.log("pool_site_conditions raw data:", data.pool_site_conditions);
          
          // Extract equipment data from the junction table
          const equipmentData = getFirstOrEmpty(data.pool_equipment_selections);

          // Set the form state from the loaded data
          setCraneId(equipmentData.crane_id || undefined);
          setTrafficControlId(equipmentData.traffic_control_id || 'none');
          setBobcatId(equipmentData.bobcat_id || 'none');
          
          // Extract site conditions data from the new table
          // Check if pool_site_conditions exists and is an array
          let siteConditionsData: any = {};
          if (data.pool_site_conditions) {
            if (Array.isArray(data.pool_site_conditions)) {
              siteConditionsData = getFirstOrEmpty(data.pool_site_conditions);
            } else {
              // It might be a single object instead of an array
              siteConditionsData = data.pool_site_conditions;
            }
          }
          
          // Set site conditions
          console.log("Site conditions data processed:", siteConditionsData);
          setAccessGrade(siteConditionsData.access_grade || "none");
          setDistanceFromTruck(siteConditionsData.distance_from_truck || "none");
          setPoolShellDelivery(siteConditionsData.pool_shell_delivery || "none");
          setSewerDiversion(siteConditionsData.sewer_diversion || "none");
          setStormwaterDiversion(siteConditionsData.stormwater_diversion || "none");
          setRemoveSlab(siteConditionsData.remove_slab || "none");
          setEarthmoving(siteConditionsData.earthmoving || "none");
          setRemoveSlabSqm(siteConditionsData.remove_slab_sqm?.toString() || "");
          setEarthmovingCubicMeters(siteConditionsData.earthmoving_cubic_meters?.toString() || "");

          // Safely handle the custom requirements data with proper type checking
          if (data.site_requirements_data && Array.isArray(data.site_requirements_data)) {
            // First convert to unknown, then to the specific type
            const requirementsData = data.site_requirements_data as unknown;
            // Validate the shape of each item in the array before setting the state
            const validRequirements = (requirementsData as any[]).map(item => {
              if (typeof item === 'object' && item !== null && 'id' in item && 'description' in item) {
                // Handle legacy data structure (price only) and new structure (cost + margin)
                if ('cost' in item && 'margin' in item) {
                  // New structure with cost and margin
                  const cost = Number(item.cost) || 0;
                  const margin = Number(item.margin) || 0;
                  return {
                    ...item,
                    cost,
                    margin,
                    price: cost + margin,
                    type: item.type || 'manual' // default to manual if no type
                  } as CustomRequirement;
                } else if ('price' in item) {
                  // Legacy structure - migrate to new structure (assume price is cost with 0 margin)
                  const price = Number(item.price) || 0;
                  return {
                    ...item,
                    cost: price,
                    margin: 0,
                    price: price,
                    type: item.type || 'manual' // default to manual if no type
                  } as CustomRequirement;
                }
              }
              return null;
            }).filter(item => item !== null) as CustomRequirement[];

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

  // Auto-save equipment selections when they change
  useEffect(() => {
    const autoSaveEquipment = async () => {
      if (!customerId || isLoading) return;
      
      try {
        // First, check if equipment selection record exists
        const { data: existingData, error: checkError } = await supabase
          .from('pool_equipment_selections')
          .select('id')
          .eq('pool_project_id', customerId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking equipment selections:", checkError);
          return;
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('pool_equipment_selections')
            .update({
              crane_id: craneId === 'none' ? null : craneId,
              traffic_control_id: trafficControlId === 'none' ? null : trafficControlId,
              bobcat_id: bobcatId === 'none' ? null : bobcatId,
              updated_at: new Date().toISOString()
            })
            .eq('pool_project_id', customerId);

          if (updateError) {
            console.error("Error updating equipment selections:", updateError);
          } else {
            // Invalidate snapshot query after successful save
            queryClient.invalidateQueries({ 
              queryKey: ['project-snapshot', customerId] 
            });
          }
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from('pool_equipment_selections')
            .insert({
              pool_project_id: customerId,
              crane_id: craneId === 'none' ? null : craneId,
              traffic_control_id: trafficControlId === 'none' ? null : trafficControlId,
              bobcat_id: bobcatId === 'none' ? null : bobcatId
            });

          if (insertError) {
            console.error("Error inserting equipment selections:", insertError);
          } else {
            // Invalidate snapshot query after successful save
            queryClient.invalidateQueries({ 
              queryKey: ['project-snapshot', customerId] 
            });
          }
        }
      } catch (error) {
        console.error("Error auto-saving equipment selections:", error);
      }
    };

    autoSaveEquipment();
  }, [craneId, trafficControlId, bobcatId, customerId, isLoading, queryClient]);

  // Auto-save site conditions when they change
  useEffect(() => {
    const autoSaveSiteConditions = async () => {
      if (!customerId || isLoading) return;
      
      try {
        // First, check if site conditions record exists
        const { data: existingData, error: checkError } = await supabase
          .from('pool_site_conditions')
          .select('id')
          .eq('pool_project_id', customerId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking site conditions:", checkError);
          return;
        }

        const siteConditionsData = {
          access_grade: accessGrade === 'none' ? null : accessGrade,
          distance_from_truck: distanceFromTruck === 'none' ? null : distanceFromTruck,
          pool_shell_delivery: poolShellDelivery === 'none' ? null : poolShellDelivery,
          sewer_diversion: sewerDiversion === 'none' ? null : sewerDiversion,
          stormwater_diversion: stormwaterDiversion === 'none' ? null : stormwaterDiversion,
          remove_slab: removeSlab === 'none' ? null : removeSlab,
          earthmoving: earthmoving === 'none' ? null : earthmoving,
          remove_slab_sqm: removeSlabSqm ? parseFloat(removeSlabSqm) : null,
          earthmoving_cubic_meters: earthmovingCubicMeters ? parseFloat(earthmovingCubicMeters) : null
        };

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('pool_site_conditions')
            .update({
              ...siteConditionsData,
              updated_at: new Date().toISOString()
            })
            .eq('pool_project_id', customerId);

          if (updateError) {
            console.error("Error updating site conditions:", updateError);
          } else {
            // Invalidate snapshot query after successful save
            queryClient.invalidateQueries({ 
              queryKey: ['project-snapshot', customerId] 
            });
          }
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from('pool_site_conditions')
            .insert({
              pool_project_id: customerId,
              ...siteConditionsData
            });

          if (insertError) {
            console.error("Error inserting site conditions:", insertError);
          } else {
            // Invalidate snapshot query after successful save
            queryClient.invalidateQueries({ 
              queryKey: ['project-snapshot', customerId] 
            });
          }
        }
      } catch (error) {
        console.error("Error auto-saving site conditions:", error);
      }
    };

    autoSaveSiteConditions();
  }, [accessGrade, distanceFromTruck, poolShellDelivery, sewerDiversion, stormwaterDiversion, 
      removeSlab, earthmoving, removeSlabSqm, earthmovingCubicMeters, customerId, isLoading, queryClient]);

  // Auto-save custom requirements when they change
  useEffect(() => {
    const autoSaveCustomRequirements = async () => {
      if (!customerId || isLoading) return;
      
      try {
        const { error: updateError } = await supabase
          .from('pool_projects')
          .update({
            site_requirements_data: customRequirements,
            updated_at: new Date().toISOString()
          })
          .eq('id', customerId);

        if (updateError) {
          console.error("Error updating custom requirements:", updateError);
        } else {
          // Invalidate snapshot query after successful save
          queryClient.invalidateQueries({ 
            queryKey: ['project-snapshot', customerId] 
          });
        }
      } catch (error) {
        console.error("Error auto-saving custom requirements:", error);
      }
    };

    // Add a small delay to prevent too many saves
    const timeoutId = setTimeout(() => {
      autoSaveCustomRequirements();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customRequirements, customerId, isLoading, queryClient]);

  // Keep these for backward compatibility but calculations now done in calculator hook
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
      { id: crypto.randomUUID(), description: "", cost: 0, margin: 0, price: 0, type: 'manual' }
    ]);
  };

  const removeRequirement = (id: string) => {
    setCustomRequirements(customRequirements.filter(req => req.id !== id));
  };

  const updateRequirement = (id: string, field: 'description' | 'cost' | 'margin', value: string) => {
    setCustomRequirements(customRequirements.map(req => {
      if (req.id === id) {
        if (field === 'cost' || field === 'margin') {
          const numericValue = parseFloat(value) || 0;
          const updatedReq = { ...req, [field]: numericValue };
          // Recalculate price when cost or margin changes
          updatedReq.price = updatedReq.cost + updatedReq.margin;
          return updatedReq;
        }
        return { ...req, [field]: value };
      }
      return req;
    }));
  };

  // Function to update all requirements including auto-calculated ones
  const setAllRequirements = (requirements: CustomRequirement[]) => {
    setCustomRequirements(requirements);
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
    updateRequirement,
    setAllRequirements,
    // Site conditions
    accessGrade,
    setAccessGrade,
    distanceFromTruck,
    setDistanceFromTruck,
    poolShellDelivery,
    setPoolShellDelivery,
    sewerDiversion,
    setSewerDiversion,
    stormwaterDiversion,
    setStormwaterDiversion,
    removeSlab,
    setRemoveSlab,
    earthmoving,
    setEarthmoving,
    removeSlabSqm,
    setRemoveSlabSqm,
    earthmovingCubicMeters,
    setEarthmovingCubicMeters
  };
};

export interface CustomRequirement {
  id: string;
  description: string;
  cost: number;
  margin: number;
  price: number; // calculated as cost + margin
  type?: 'auto' | 'manual'; // determines rendering method
}
