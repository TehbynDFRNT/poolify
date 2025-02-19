
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";

interface FiltrationPackageDetailsProps {
  filtrationPackage: PackageWithComponents | null;
}

export const FiltrationPackageDetails = ({ filtrationPackage }: FiltrationPackageDetailsProps) => {
  if (!filtrationPackage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Filtration Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-8 text-center text-muted-foreground">
            No filtration package selected for this pool
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtration Package</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Light */}
            {filtrationPackage.light && (
              <div className="space-y-2">
                <h4 className="font-medium">Light</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm">{filtrationPackage.light.model_number}</div>
                  <div className="text-sm text-muted-foreground">{filtrationPackage.light.name}</div>
                  <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.light.price)}</div>
                </div>
              </div>
            )}

            {/* Pump */}
            {filtrationPackage.pump && (
              <div className="space-y-2">
                <h4 className="font-medium">Pool Pump</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm">{filtrationPackage.pump.model_number}</div>
                  <div className="text-sm text-muted-foreground">{filtrationPackage.pump.name}</div>
                  <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.pump.price)}</div>
                </div>
              </div>
            )}

            {/* Sanitiser */}
            {filtrationPackage.sanitiser && (
              <div className="space-y-2">
                <h4 className="font-medium">Sanitiser</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm">{filtrationPackage.sanitiser.model_number}</div>
                  <div className="text-sm text-muted-foreground">{filtrationPackage.sanitiser.name}</div>
                  <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.sanitiser.price)}</div>
                </div>
              </div>
            )}

            {/* Filter */}
            {filtrationPackage.filter && (
              <div className="space-y-2">
                <h4 className="font-medium">Filter</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm">{filtrationPackage.filter.model_number}</div>
                  <div className="text-sm text-muted-foreground">{filtrationPackage.filter.name}</div>
                  <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.filter.price)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Handover Kit */}
          {filtrationPackage.handover_kit && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Handover Kit: {filtrationPackage.handover_kit.name}</h4>
              <div className="space-y-2">
                {filtrationPackage.handover_kit.components.map((component) => (
                  <div key={component.id} className="bg-muted/30 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="text-sm">{component.component.model_number}</div>
                      <div className="text-sm text-muted-foreground">{component.component.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">x{component.quantity}</div>
                      <div className="font-medium">
                        {formatCurrency(component.component.price * component.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-6 border-t flex justify-between items-center">
            <div className="text-lg font-medium">Total Package Price</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculatePackagePrice(filtrationPackage))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
