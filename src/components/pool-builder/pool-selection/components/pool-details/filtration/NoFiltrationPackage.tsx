
import React from "react";
import { Button } from "@/components/ui/button";
import { useFiltrationQueries } from "@/hooks/useFiltrationQueries";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { Pool } from "@/types/pool";

interface NoFiltrationPackageProps {
  pool?: Pool;
}

export const NoFiltrationPackage: React.FC<NoFiltrationPackageProps> = ({ pool }) => {
  const { packages } = useFiltrationQueries(null);
  const { updatePoolPackageMutation } = usePoolPackages();
  const [selectedPackageId, setSelectedPackageId] = React.useState<string>("");

  if (!pool) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-md bg-amber-50 text-amber-800">
        <AlertCircle className="h-5 w-5" />
        <p>No pool selected.</p>
      </div>
    );
  }

  const handleAssignPackage = () => {
    if (selectedPackageId && pool.id) {
      updatePoolPackageMutation.mutate({
        poolId: pool.id,
        packageId: selectedPackageId
      });
    }
  };

  if (!packages || packages.length === 0) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-md bg-amber-50 text-amber-800">
        <AlertCircle className="h-5 w-5" />
        <p>No filtration packages available. Please create packages first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 rounded-md bg-amber-50 text-amber-800">
        <AlertCircle className="h-5 w-5" />
        <p>No default filtration package assigned to this pool.</p>
      </div>
      
      <div className="space-y-4 p-4 border border-border rounded-md">
        <h3 className="font-medium">Assign a filtration package:</h3>
        
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
                {pkg.name} (Option {pkg.display_order})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleAssignPackage}
          disabled={!selectedPackageId || updatePoolPackageMutation.isPending}
        >
          {updatePoolPackageMutation.isPending ? "Assigning..." : "Assign Package"}
        </Button>
      </div>
    </div>
  );
};
