
import React from "react";
import { Pool } from "@/types/pool";
import { TabsContent } from "@/components/ui/tabs";
import { useFiltrationPackage } from "@/pages/Quotes/components/SelectPoolStep/hooks/useFiltrationPackage";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PoolDetailsTabProps {
  pool: Pool;
  selectedColor?: string;
  activeTab: string;
  tabId: string;
  title: string;
}

export const PoolDetailsTab: React.FC<PoolDetailsTabProps> = ({ 
  pool, 
  selectedColor, 
  activeTab, 
  tabId, 
  title 
}) => {
  // Get detailed filtration package data if needed
  const { filtrationPackage } = tabId === "filtration" ? 
    useFiltrationPackage(pool) : { filtrationPackage: null };

  // Fetch pool type information if we're on the details tab
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
    enabled: !!pool.pool_type_id && tabId === "details",
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

  // Generate content based on tab type
  const renderContent = () => {
    switch (tabId) {
      case "details":
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
      case "dimensions":
        return (
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <span className="text-muted-foreground">Length:</span>
              <p className="font-medium">{pool.length} m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Width:</span>
              <p className="font-medium">{pool.width} m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Shallow End Depth:</span>
              <p className="font-medium">{pool.depth_shallow} m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deep End Depth:</span>
              <p className="font-medium">{pool.depth_deep} m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Waterline:</span>
              <p className="font-medium">{pool.waterline_l_m ? `${pool.waterline_l_m} L/m` : "N/A"}</p>
            </div>
          </div>
        );
      case "filtration":
        return (
          <>
            {!pool.default_filtration_package_id ? (
              <p>No default filtration package assigned to this pool.</p>
            ) : !filtrationPackage ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-medium text-lg">
                  {filtrationPackage.name} (Option {filtrationPackage.display_order})
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {filtrationPackage.pump && (
                    <div>
                      <span className="text-muted-foreground text-sm">Pump:</span>
                      <p className="font-medium">{filtrationPackage.pump.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(filtrationPackage.pump.price)}</p>
                    </div>
                  )}
                  
                  {filtrationPackage.filter && (
                    <div>
                      <span className="text-muted-foreground text-sm">Filter:</span>
                      <p className="font-medium">{filtrationPackage.filter.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(filtrationPackage.filter.price)}</p>
                    </div>
                  )}
                  
                  {filtrationPackage.light && (
                    <div>
                      <span className="text-muted-foreground text-sm">Light:</span>
                      <p className="font-medium">{filtrationPackage.light.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(filtrationPackage.light.price)}</p>
                    </div>
                  )}
                  
                  {filtrationPackage.sanitiser && (
                    <div>
                      <span className="text-muted-foreground text-sm">Sanitiser:</span>
                      <p className="font-medium">{filtrationPackage.sanitiser.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(filtrationPackage.sanitiser.price)}</p>
                    </div>
                  )}
                </div>
                
                {filtrationPackage.handover_kit && (
                  <div className="mt-2">
                    <span className="text-muted-foreground text-sm">Handover Kit:</span>
                    <p className="font-medium">{filtrationPackage.handover_kit.name}</p>
                    {filtrationPackage.handover_kit.components && filtrationPackage.handover_kit.components.length > 0 && (
                      <div className="mt-1 pl-2 border-l-2 border-muted">
                        {filtrationPackage.handover_kit.components.map((item) => (
                          <div key={item.id} className="text-sm flex justify-between items-center">
                            <span>{item.quantity}x {item.component?.name}</span>
                            <span className="text-muted-foreground">{formatCurrency((item.component?.price || 0) * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center">
                  <span className="font-medium">Total Package Price:</span>
                  <span className="font-bold text-lg">{formatCurrency(calculatePackagePrice(filtrationPackage))}</span>
                </div>
              </div>
            )}
          </>
        );
      case "pricing":
        return (
          <>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <span className="text-muted-foreground">Base Price (ex GST):</span>
                <p className="font-medium">
                  {pool.buy_price_ex_gst 
                    ? `$${pool.buy_price_ex_gst.toLocaleString()}` 
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Base Price (inc GST):</span>
                <p className="font-medium">
                  {pool.buy_price_inc_gst 
                    ? `$${pool.buy_price_inc_gst.toLocaleString()}` 
                    : "N/A"}
                </p>
              </div>
            </div>
          </>
        );
      default:
        return <p>Select a tab to view details</p>;
    }
  };

  return (
    <TabsContent value={tabId} className="p-4 border rounded-md">
      {renderContent()}
    </TabsContent>
  );
};
