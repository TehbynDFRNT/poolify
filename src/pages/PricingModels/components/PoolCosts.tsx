
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { initialPoolCosts } from "@/pages/ConstructionCosts/constants";

type PoolCostsProps = {
  poolName: string;
};

export const PoolCosts = ({ poolName }: PoolCostsProps) => {
  const poolCosts = initialPoolCosts[poolName] || {
    truckedWater: 0,
    saltBags: 0,
    misc: 2700,
    copingSupply: 0,
    beam: 0,
    copingLay: 0,
    peaGravel: 0,
    installFee: 0
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Pool Specific Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Installation Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pea Gravel/Backfill:</span>
                  <span>{formatCurrency(poolCosts.peaGravel)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Install Fee:</span>
                  <span>{formatCurrency(poolCosts.installFee)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Trucked Water:</span>
                  <span>{formatCurrency(poolCosts.truckedWater)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salt Bags:</span>
                  <span>{formatCurrency(poolCosts.saltBags)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Coping Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Coping Supply:</span>
                  <span>{formatCurrency(poolCosts.copingSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coping Lay:</span>
                  <span>{formatCurrency(poolCosts.copingLay)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Additional Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Beam:</span>
                  <span>{formatCurrency(poolCosts.beam)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Miscellaneous:</span>
                  <span>{formatCurrency(poolCosts.misc)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between">
              <h3 className="font-medium">Total Costs:</h3>
              <span className="font-medium">
                {formatCurrency(
                  poolCosts.truckedWater +
                  poolCosts.saltBags +
                  poolCosts.misc +
                  poolCosts.copingSupply +
                  poolCosts.beam +
                  poolCosts.copingLay +
                  poolCosts.peaGravel +
                  poolCosts.installFee
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
