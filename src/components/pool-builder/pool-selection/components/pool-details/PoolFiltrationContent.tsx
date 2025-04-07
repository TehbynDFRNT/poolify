
import React from "react";
import { Pool } from "@/types/pool";
import { useFiltrationPackage } from "@/pages/Quotes/components/SelectPoolStep/hooks/useFiltrationPackage";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";

interface PoolFiltrationContentProps {
  pool: Pool;
}

export const PoolFiltrationContent: React.FC<PoolFiltrationContentProps> = ({ pool }) => {
  // Get detailed filtration package data
  const { filtrationPackage } = useFiltrationPackage(pool);

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
          <h3 className="font-medium text-lg">
            {filtrationPackage.name} (Option {filtrationPackage.display_order})
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
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
};
