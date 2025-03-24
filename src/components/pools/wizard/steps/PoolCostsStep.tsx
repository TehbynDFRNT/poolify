import React from "react";
import { usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { formatCurrency } from "@/utils/format";

const PoolCostsStep: React.FC = () => {
  // In a real implementation, this would connect to the poolCosts state
  // For now we'll just show the fields that would be updated
  
  const { form } = usePoolWizard();
  const { watch } = useFormContext();
  
  const poolName = watch("name");
  
  // Default values for individual pool costs
  const [poolCosts, setPoolCosts] = React.useState({
    pea_gravel: 0,
    install_fee: 0,
    trucked_water: 0,
    salt_bags: 0,
    misc: 2700,
    coping_supply: 0,
    beam: 0,
    coping_lay: 0
  });
  
  const handleCostChange = (field: keyof typeof poolCosts, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setPoolCosts(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };
  
  const totalCosts = Object.values(poolCosts).reduce((sum, cost) => sum + cost, 0);
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configure individual costs for <span className="font-medium text-foreground">{poolName}</span>
      </p>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pea_gravel">Pea Gravel</Label>
              <Input
                id="pea_gravel"
                type="number"
                value={poolCosts.pea_gravel}
                onChange={(e) => handleCostChange('pea_gravel', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="install_fee">Installation Fee</Label>
              <Input
                id="install_fee"
                type="number"
                value={poolCosts.install_fee}
                onChange={(e) => handleCostChange('install_fee', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trucked_water">Trucked Water</Label>
              <Input
                id="trucked_water"
                type="number"
                value={poolCosts.trucked_water}
                onChange={(e) => handleCostChange('trucked_water', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salt_bags">Salt Bags</Label>
              <Input
                id="salt_bags"
                type="number"
                value={poolCosts.salt_bags}
                onChange={(e) => handleCostChange('salt_bags', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="misc">Miscellaneous</Label>
              <Input
                id="misc"
                type="number"
                value={poolCosts.misc}
                onChange={(e) => handleCostChange('misc', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coping_supply">Coping Supply</Label>
              <Input
                id="coping_supply"
                type="number"
                value={poolCosts.coping_supply}
                onChange={(e) => handleCostChange('coping_supply', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="beam">Beam</Label>
              <Input
                id="beam"
                type="number"
                value={poolCosts.beam}
                onChange={(e) => handleCostChange('beam', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coping_lay">Coping Lay</Label>
              <Input
                id="coping_lay"
                type="number"
                value={poolCosts.coping_lay}
                onChange={(e) => handleCostChange('coping_lay', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end border-t pt-4">
        <div className="text-lg font-medium">
          Total Costs: {formatCurrency(totalCosts)}
        </div>
      </div>
    </div>
  );
};

export default PoolCostsStep;
