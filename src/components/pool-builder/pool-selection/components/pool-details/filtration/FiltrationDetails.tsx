import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useFiltrationQueries } from "@/hooks/useFiltrationQueries";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { PackageWithComponents } from "@/types/filtration";
import { Pool } from "@/types/pool";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SaveButton } from "../../../components/SaveButton";
import { FiltrationComponentsGrid } from "./FiltrationComponentsGrid";
import { FiltrationTotalPrice } from "./FiltrationTotalPrice";
import { HandoverKitSection } from "./HandoverKitSection";

interface FiltrationDetailsProps {
  filtrationPackage: PackageWithComponents;
  pool?: Pool;
  customerId?: string;
}

export const FiltrationDetails: React.FC<FiltrationDetailsProps> = ({
  filtrationPackage: initialPackage,
  pool,
  customerId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackage.id);
  const [currentPackage, setCurrentPackage] = useState<PackageWithComponents>(initialPackage);
  const { packages } = useFiltrationQueries(null);
  const { updatePoolPackageMutation } = usePoolPackages();
  const queryClient = useQueryClient();

  // Update local state when the initial package changes from props
  useEffect(() => {
    setCurrentPackage(initialPackage);
    setSelectedPackageId(initialPackage.id);
  }, [initialPackage]);

  // When a new package is selected from the dropdown, find and update the local display
  useEffect(() => {
    if (packages && selectedPackageId && selectedPackageId !== currentPackage.id) {
      const newPackage = packages.find(p => p.id === selectedPackageId);
      if (newPackage) {
        setCurrentPackage(newPackage);
      }
    }
  }, [selectedPackageId, packages, currentPackage.id]);

  const handleUpdatePackage = () => {
    // Use customerId directly if provided, otherwise fall back to pool.id
    const projectId = customerId || pool?.id;
    if (projectId && selectedPackageId !== initialPackage.id) {
      updatePoolPackageMutation.mutate({
        poolId: projectId,
        packageId: selectedPackageId
      }, {
        onSuccess: () => {
          // Invalidate relevant queries to ensure fresh data
          queryClient.invalidateQueries({
            queryKey: ["filtration-package", selectedPackageId]
          });
          queryClient.invalidateQueries({
            queryKey: ["pools-with-packages"]
          });
          // Invalidate snapshot to trigger re-render of cost summary
          if (customerId) {
            queryClient.invalidateQueries({
              queryKey: ['project-snapshot', customerId]
            });
          }
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
          Filtration Package - Option {currentPackage.display_order}
        </h3>

        {pool && (
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPackageId(initialPackage.id);
                  setCurrentPackage(initialPackage);
                  setIsEditing(false);
                }}
                disabled={updatePoolPackageMutation.isPending}
              >
                Cancel
              </Button>
              <SaveButton
                onClick={handleUpdatePackage}
                isSubmitting={updatePoolPackageMutation.isPending}
                disabled={selectedPackageId === initialPackage.id}
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

      <FiltrationComponentsGrid filtrationPackage={currentPackage} />

      {currentPackage.handover_kit && (
        <HandoverKitSection handoverKit={currentPackage.handover_kit} />
      )}

      <FiltrationTotalPrice filtrationPackage={currentPackage} />
    </div>
  );
};
