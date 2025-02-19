
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import type { PackageWithComponents } from "@/types/filtration";

interface PoolFiltrationProps {
  filtrationPackage: PackageWithComponents | null;
  poolName: string;
}

export const PoolFiltration = ({ filtrationPackage, poolName }: PoolFiltrationProps) => {
  const calculatePackageTotal = () => {
    if (!filtrationPackage) return 0;
    
    const handoverKitTotal = filtrationPackage.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (filtrationPackage.light?.price || 0) +
      (filtrationPackage.pump?.price || 0) +
      (filtrationPackage.sanitiser?.price || 0) +
      (filtrationPackage.filter?.price || 0) +
      handoverKitTotal
    );
  };

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Standard Filtration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filtrationPackage ? (
          <>
            <div className="text-sm text-muted-foreground">
              Option {filtrationPackage.display_order}
            </div>
            <div className="space-y-2">
              {filtrationPackage.light && (
                <div className="flex justify-between text-sm">
                  <span>Light:</span>
                  <span className="text-right">
                    <div>{filtrationPackage.light.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(filtrationPackage.light.price)}</div>
                  </span>
                </div>
              )}
              {filtrationPackage.pump && (
                <div className="flex justify-between text-sm">
                  <span>Pool Pump:</span>
                  <span className="text-right">
                    <div>{filtrationPackage.pump.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(filtrationPackage.pump.price)}</div>
                  </span>
                </div>
              )}
              {filtrationPackage.sanitiser && (
                <div className="flex justify-between text-sm">
                  <span>Sanitiser:</span>
                  <span className="text-right">
                    <div>{filtrationPackage.sanitiser.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(filtrationPackage.sanitiser.price)}</div>
                  </span>
                </div>
              )}
              {filtrationPackage.filter && (
                <div className="flex justify-between text-sm">
                  <span>Filter:</span>
                  <span className="text-right">
                    <div>{filtrationPackage.filter.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(filtrationPackage.filter.price)}</div>
                  </span>
                </div>
              )}
              {filtrationPackage.handover_kit && (
                <div className="flex justify-between text-sm">
                  <span>Handover Kit:</span>
                  <span className="text-right">
                    <div>{filtrationPackage.handover_kit.name}</div>
                    <div className="text-muted-foreground">
                      {formatCurrency(
                        filtrationPackage.handover_kit.components.reduce(
                          (total, comp) => total + ((comp.component?.price || 0) * comp.quantity),
                          0
                        )
                      )}
                    </div>
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4 border-t text-base font-semibold">
              <span>Package Total:</span>
              <span>{formatCurrency(calculatePackageTotal())}</span>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            No filtration package assigned
          </div>
        )}
      </CardContent>
    </Card>
  );
};
