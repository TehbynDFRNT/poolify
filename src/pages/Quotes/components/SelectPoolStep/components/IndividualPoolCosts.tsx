
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface IndividualPoolCostsProps {
  poolCosts: any;
}

export const IndividualPoolCosts = ({ poolCosts }: IndividualPoolCostsProps) => {
  // Check if there are any non-zero costs
  const hasNonZeroCosts = Object.entries(poolCosts).some(
    ([key, value]) => 
      key !== 'id' && 
      key !== 'pool_id' && 
      key !== 'created_at' && 
      key !== 'updated_at' && 
      typeof value === 'number' && 
      (value as number) > 0
  );

  if (!hasNonZeroCosts) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Individual Pool Costs</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {poolCosts.pea_gravel > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Pea Gravel</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.pea_gravel)}</dd>
            </div>
          )}
          {poolCosts.install_fee > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Install Fee</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.install_fee)}</dd>
            </div>
          )}
          {poolCosts.trucked_water > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Trucked Water</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.trucked_water)}</dd>
            </div>
          )}
          {poolCosts.salt_bags > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Salt Bags</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.salt_bags)}</dd>
            </div>
          )}
          {poolCosts.coping_supply > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Coping Supply</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.coping_supply)}</dd>
            </div>
          )}
          {poolCosts.beam > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Beam</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.beam)}</dd>
            </div>
          )}
          {poolCosts.coping_lay > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Coping Lay</dt>
              <dd className="mt-1 text-sm">{formatCurrency(poolCosts.coping_lay)}</dd>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
