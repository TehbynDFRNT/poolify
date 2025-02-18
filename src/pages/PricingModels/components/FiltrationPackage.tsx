
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { PackageWithComponents } from "@/types/filtration";
import { Star } from "lucide-react";

type FiltrationPackageProps = {
  selectedPackageId: string;
  onPackageChange: (value: string) => void;
  filtrationPackages: PackageWithComponents[];
  selectedPackage: PackageWithComponents;
  onSetStandard: () => void;
  isStandard: boolean;
};

const calculatePackageTotal = (pkg: PackageWithComponents) => {
  const handoverKitTotal = pkg.handover_kit?.components.reduce((total, comp) => {
    return total + ((comp.component?.price || 0) * comp.quantity);
  }, 0) || 0;

  return (
    (pkg.light?.price || 0) +
    (pkg.pump?.price || 0) +
    (pkg.sanitiser?.price || 0) +
    (pkg.filter?.price || 0) +
    handoverKitTotal
  );
};

export const FiltrationPackage = ({
  selectedPackageId,
  onPackageChange,
  filtrationPackages,
  selectedPackage,
  onSetStandard,
  isStandard,
}: FiltrationPackageProps) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <span>Filtration Package</span>
          {isStandard && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Button
            variant={isStandard ? "secondary" : "outline"}
            size="sm"
            onClick={onSetStandard}
            className="whitespace-nowrap"
          >
            {isStandard ? "Standard Package" : "Set as Standard"}
          </Button>
          <Select 
            value={selectedPackageId} 
            onValueChange={onPackageChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent>
              {filtrationPackages?.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  Option {pkg.display_order}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {selectedPackage && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Light</h3>
            {selectedPackage.light && (
              <div className="grid grid-cols-2 gap-2">
                <p>Model: {selectedPackage.light.model_number}</p>
                <p className="text-right">{formatCurrency(selectedPackage.light.price)}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium mb-2">Pump</h3>
            {selectedPackage.pump && (
              <div className="grid grid-cols-2 gap-2">
                <p>Model: {selectedPackage.pump.model_number}</p>
                <p className="text-right">{formatCurrency(selectedPackage.pump.price)}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium mb-2">Sanitiser</h3>
            {selectedPackage.sanitiser && (
              <div className="grid grid-cols-2 gap-2">
                <p>Model: {selectedPackage.sanitiser.model_number}</p>
                <p className="text-right">{formatCurrency(selectedPackage.sanitiser.price)}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium mb-2">Filter</h3>
            {selectedPackage.filter && (
              <div className="grid grid-cols-2 gap-2">
                <p>Model: {selectedPackage.filter.model_number}</p>
                <p className="text-right">{formatCurrency(selectedPackage.filter.price)}</p>
              </div>
            )}
          </div>
          {selectedPackage.handover_kit && (
            <div>
              <h3 className="font-medium mb-2">Handover Kit: {selectedPackage.handover_kit.name}</h3>
              <div className="space-y-2">
                {selectedPackage.handover_kit.components.map((comp) => (
                  <div key={comp.component_id} className="grid grid-cols-2 gap-2">
                    <p>{comp.component?.name} (x{comp.quantity})</p>
                    <p className="text-right">
                      {formatCurrency((comp.component?.price || 0) * comp.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="pt-4 mt-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <h3 className="font-medium">Total Package Price:</h3>
              <p className="text-right font-medium">
                {formatCurrency(calculatePackageTotal(selectedPackage))}
              </p>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);
