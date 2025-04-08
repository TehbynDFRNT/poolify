
import React from "react";
import { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PoolDetailsContentProps {
  pool: Pool;
  selectedColor?: string;
}

export const PoolDetailsContent: React.FC<PoolDetailsContentProps> = ({ 
  pool, 
  selectedColor 
}) => {
  // Fetch pool type information
  const { data: poolType } = useQuery({
    queryKey: ['pool-type', pool.pool_type_id],
    queryFn: async () => {
      if (!pool.pool_type_id) return null;
      
      const { data, error } = await supabase
        .from('pool_types')
        .select('name')
        .eq('id', pool.pool_type_id)
        .single();
        
      if (error) {
        console.error('Error fetching pool type:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!pool.pool_type_id,
  });

  // Helper to get color class for preview
  const getColorClass = (color: string) => {
    switch(color) {
      case "Silver Mist": return "bg-gray-300";
      case "Horizon": return "bg-gray-800";
      case "Twilight": return "bg-gray-700";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-y-4">
      <div>
        <span className="text-muted-foreground">Pool Range:</span>
        <p className="font-medium">{pool.range}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Pool Type:</span>
        <p className="font-medium">
          {poolType ? poolType.name : (pool.pool_type_id ? "Loading..." : "Standard")}
        </p>
      </div>
      <div>
        <span className="text-muted-foreground">Weight:</span>
        <p className="font-medium">{pool.weight_kg ? `${pool.weight_kg} kg` : "N/A"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Volume:</span>
        <p className="font-medium">{pool.volume_liters ? `${pool.volume_liters.toLocaleString()} liters` : "N/A"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Color:</span>
        <div className="flex items-center gap-2 mt-1">
          <div className={`h-4 w-4 rounded-full ${getColorClass(selectedColor || "")}`}></div>
          <p className="font-medium">{selectedColor}</p>
        </div>
      </div>
    </div>
  );
};
