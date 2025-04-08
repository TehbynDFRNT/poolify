
import React, { useState } from "react";
import { PackageWithComponents } from "@/types/filtration";
import { FiltrationComponentsGrid } from "./FiltrationComponentsGrid";
import { HandoverKitSection } from "./HandoverKitSection";
import { FiltrationTotalPrice } from "./FiltrationTotalPrice";
import { useFiltrationQueries } from "@/hooks/useFiltrationQueries";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { Pool } from "@/types/pool";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit2, Check, Save } from "lucide-react";
import { SaveButton } from "../../../components/SaveButton";

interface FiltrationDetailsProps {
  filtrationPackage: PackageWithComponents;
  pool?: Pool;
}

export const FiltrationDetails: React.FC<FiltrationDetailsProps> = ({ 
  filtrationPackage,
  pool
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(filtrationPackage.id);
  const { packages } = useFiltrationQueries(null);
  const { updatePoolPackageMutation } = usePoolPackages();

  const handleUpdatePackage = () => {
    if (pool?.id && selectedPackageId !== filtrationPackage.id) {
      updatePoolPackageMutation.mutate({
        poolId: pool.id,
        packageId: selectedPackageId
      }, {
        onSuccess: () => {
          setIsEditing(false);
        }
      });
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">
          Filtration Package - Option {filtrationPackage.display_order}
        </h3>
        
        {pool && (
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedPackageId(filtrationPackage.id);
                  setIsEditing(false);
                }}
                disabled={updatePoolPackageMutation.isPending}
              >
                Cancel
              </Button>
              <SaveButton 
                onClick={handleUpdatePackage}
                isSubmitting={updatePoolPackageMutation.isPending}
                disabled={selectedPackageId === filtrationPackage.id}
                buttonText="Save Filtration"
                className="bg-green-600 hover:bg-green-700"
              />
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Change
            </Button>
          )
        )}
      </div>

      {isEditing && packages ? (
        <div className="p-4 border border-border rounded-md">
          <Select 
            value={selectedPackageId} 
            onValueChange={setSelectedPackageId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a filtration package" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  Option {pkg.display_order}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      
      <FiltrationComponentsGrid filtrationPackage={filtrationPackage} />
      
      {filtrationPackage.handover_kit && (
        <HandoverKitSection handoverKit={filtrationPackage.handover_kit} />
      )}
      
      <FiltrationTotalPrice filtrationPackage={filtrationPackage} />
    </div>
  );
};
