
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface FiltrationPackageProps {
  filtrationPackage: any;
}

export const FiltrationPackageDetails = ({ filtrationPackage }: FiltrationPackageProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Filtration Package - Option {filtrationPackage.display_order}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtrationPackage.light && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Light</dt>
              <dd className="mt-1 text-sm">{filtrationPackage.light.name}</dd>
              <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.light.price)}</dd>
            </div>
          )}
          {filtrationPackage.pump && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Pump</dt>
              <dd className="mt-1 text-sm">{filtrationPackage.pump.name}</dd>
              <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.pump.price)}</dd>
            </div>
          )}
          {filtrationPackage.sanitiser && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Sanitiser</dt>
              <dd className="mt-1 text-sm">{filtrationPackage.sanitiser.name}</dd>
              <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.sanitiser.price)}</dd>
            </div>
          )}
          {filtrationPackage.filter && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Filter</dt>
              <dd className="mt-1 text-sm">{filtrationPackage.filter.name}</dd>
              <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.filter.price)}</dd>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

