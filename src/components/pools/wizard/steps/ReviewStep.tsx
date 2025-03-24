
import React from "react";
import { usePoolWizard } from "@/contexts/PoolWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Calculator, Construction, Target, Truck, Droplets } from "lucide-react";

const ReviewStep: React.FC = () => {
  const { 
    form, 
    craneCosts, 
    digTypes, 
    selectedCraneId, 
    selectedDigTypeId,
    marginPercentage,
    isSubmitting
  } = usePoolWizard();
  
  const { watch } = useFormContext();
  
  // Get all form values
  const values = watch();
  
  // Get selected items
  const selectedCrane = craneCosts?.find(crane => crane.id === selectedCraneId);
  const selectedDigType = digTypes?.find(dig => dig.id === selectedDigTypeId);
  
  // Pool costs are simplified for this prototype
  const poolCosts = {
    pea_gravel: 0,
    install_fee: 0,
    trucked_water: 0,
    salt_bags: 0,
    misc: 2700,
    coping_supply: 0,
    beam: 0,
    coping_lay: 0
  };
  
  // Format dimensions with 2 decimal places
  const formatDimension = (value: number) => {
    return value.toFixed(2);
  };
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review all information before creating the pool.
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{values.name}</h3>
            <Badge variant="outline">{values.range}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Droplets className="h-4 w-4 mr-2" />
                <span>Pool Dimensions</span>
              </div>
              <div className="pl-6 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Length:</span>
                  <span>{formatDimension(values.length)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Width:</span>
                  <span>{formatDimension(values.width)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Depth:</span>
                  <span>{formatDimension(values.depth_shallow)} - {formatDimension(values.depth_deep)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span>{values.volume_liters?.toLocaleString()} L</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Construction className="h-4 w-4 mr-2" />
                <span>Construction Details</span>
              </div>
              <div className="pl-6 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Excavation:</span>
                  <span>{selectedDigType?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crane:</span>
                  <span>{selectedCrane?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Filtration:</span>
                  <span>{values.default_filtration_package_id ? "Selected" : "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buy Price:</span>
                  <span>{formatCurrency(values.buy_price_ex_gst || 0)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Calculator className="h-4 w-4 mr-2" />
              <span>Costs Summary</span>
            </div>
            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price:</span>
                <span>{formatCurrency(values.buy_price_ex_gst || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crane Cost:</span>
                <span>{formatCurrency(selectedCrane?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Excavation Cost:</span>
                <span>{formatCurrency(selectedDigType ? 
                  (selectedDigType.excavation_hourly_rate * selectedDigType.excavation_hours) + 
                  (selectedDigType.truck_hourly_rate * selectedDigType.truck_hours * selectedDigType.truck_quantity) : 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Individual Costs:</span>
                <span>{formatCurrency(Object.values(poolCosts).reduce((sum, cost) => sum + cost, 0))}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Target className="h-4 w-4 mr-2" />
              <span>Pricing</span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin:</span>
                <span>{marginPercentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isSubmitting && (
        <div className="text-center py-4 text-muted-foreground">
          Creating pool... Please wait.
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
