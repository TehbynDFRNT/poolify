
import React from "react";
import { Pool } from "@/types/pool";
import { TabsContent } from "@/components/ui/tabs";

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
              <p className="font-medium">{pool.pool_type_id || "Standard"}</p>
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
            <h3 className="font-medium text-base mb-3">Filtration Package</h3>
            {pool.default_filtration_package_id ? (
              <div>
                <p className="font-medium">Default Filtration Package ID:</p>
                <p>{pool.default_filtration_package_id}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Detailed filtration package information will be available after connecting to the database.
                </p>
              </div>
            ) : (
              <p>No default filtration package assigned to this pool.</p>
            )}
          </>
        );
      case "pricing":
        return (
          <>
            <h3 className="font-medium text-base mb-3">Pricing Information</h3>
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
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">
                Additional pricing information and customization options will be 
                available after connecting to the database.
              </p>
            </div>
          </>
        );
      default:
        return <p>Select a tab to view details</p>;
    }
  };

  return (
    <TabsContent value={tabId} className="p-4 border rounded-md">
      <h3 className="font-medium text-base mb-3">{title}</h3>
      {renderContent()}
    </TabsContent>
  );
};
