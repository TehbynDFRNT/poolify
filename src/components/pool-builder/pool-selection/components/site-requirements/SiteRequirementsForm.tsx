
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Pool } from "@/types/pool";
import { LoadingIndicator } from "./LoadingIndicator";
import { StandardRequirementsSection } from "./StandardRequirementsSection";
import { CustomRequirementsSection } from "./CustomRequirementsSection";
import { AdditionalNotesSection } from "./AdditionalNotesSection";
import { SiteRequirementsSnapshotSummary } from "./SiteRequirementsSnapshotSummary";
import { SaveButton } from "./SaveButton";
import { useSiteRequirements } from "@/hooks/useSiteRequirements";
import { AutoCalculatedRequirements } from "./AutoCalculatedRequirements";

interface SiteRequirementsFormProps {
  pool: Pool;
  customerId: string;
  onSave: (formData: any) => void;
  isSubmitting: boolean;
}

export const SiteRequirementsForm: React.FC<SiteRequirementsFormProps> = ({
  pool,
  customerId,
  onSave,
  isSubmitting
}) => {
  const {
    craneId,
    setCraneId,
    trafficControlId,
    setTrafficControlId,
    bobcatId,
    setBobcatId,
    customRequirements,
    notes,
    setNotes,
    isLoading,
    craneCost,
    trafficControlCost,
    bobcatCost,
    defaultCraneCost,
    defaultCraneId,
    isDefaultCrane,
    totalCost,
    customRequirementsTotal,
    addRequirement,
    removeRequirement,
    updateRequirement,
    setAllRequirements,
    // Site conditions
    accessGrade,
    setAccessGrade,
    distanceFromTruck,
    setDistanceFromTruck,
    poolShellDelivery,
    setPoolShellDelivery,
    sewerDiversion,
    setSewerDiversion,
    stormwaterDiversion,
    setStormwaterDiversion,
    removeSlab,
    setRemoveSlab,
    earthmoving,
    setEarthmoving,
    removeSlabSqm,
    setRemoveSlabSqm,
    earthmovingCubicMeters,
    setEarthmovingCubicMeters
  } = useSiteRequirements(customerId);
  
  // Track auto-calculated requirements
  const [autoCalculatedReqs, setAutoCalculatedReqs] = useState<Array<{
    id: string;
    description: string;
    cost: number;
    margin: number;
    total: number;
  }>>([]);
  
  // Load auto requirements from saved data on initial load
  useEffect(() => {
    // Only run once when customRequirements first loads
    if (customRequirements.length > 0 && autoCalculatedReqs.length === 0) {
      const savedAutoReqs = customRequirements
        .filter(req => req.type === 'auto')
        .map(req => ({
          id: req.id,
          description: req.description,
          cost: req.cost,
          margin: req.margin,
          total: req.price
        }));
      
      if (savedAutoReqs.length > 0) {
        setAutoCalculatedReqs(savedAutoReqs);
      }
    }
  }, [customRequirements.length]); // Only depend on length to avoid re-running when contents change
  
  // Handle automatic requirement calculation
  const handleAutoAddRequirement = useCallback((requirement: {
    description: string;
    cost: number;
    margin: number;
  }) => {
    setAutoCalculatedReqs(prev => {
      // Determine the type of requirement
      const isEarthmoving = requirement.description.startsWith('Earthmoving -');
      const isSlabRemoval = requirement.description.startsWith('Concrete Slab Removal -');
      const isStormwater = requirement.description === 'Stormwater Diversion';
      
      // Find existing requirement of the same type
      const existingIndex = prev.findIndex(req => {
        if (isEarthmoving) return req.description.startsWith('Earthmoving -');
        if (isSlabRemoval) return req.description.startsWith('Concrete Slab Removal -');
        if (isStormwater) return req.description === 'Stormwater Diversion';
        return false;
      });
      
      const newReq = {
        id: existingIndex >= 0 ? prev[existingIndex].id : crypto.randomUUID(),
        description: requirement.description,
        cost: requirement.cost,
        margin: requirement.margin,
        total: requirement.cost + requirement.margin
      };
      
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = newReq;
        return updated;
      } else {
        // Add new
        return [...prev, newReq];
      }
    });
  }, []);
  
  // Remove auto-calculated requirements when selections change
  useEffect(() => {
    if (earthmoving === "none" || earthmoving === "No") {
      setAutoCalculatedReqs(prev => prev.filter(req => !req.description.startsWith('Earthmoving -')));
    }
    if (removeSlab === "none" || removeSlab === "No") {
      setAutoCalculatedReqs(prev => prev.filter(req => !req.description.startsWith('Concrete Slab Removal -')));
    }
    if (stormwaterDiversion === "none" || stormwaterDiversion === "No") {
      setAutoCalculatedReqs(prev => prev.filter(req => req.description !== 'Stormwater Diversion'));
    }
  }, [earthmoving, removeSlab, stormwaterDiversion]);

  // Auto-save auto-calculated requirements when they change
  useEffect(() => {
    // Skip if we're still loading
    if (isLoading) return;
    
    // Get current manual requirements (non-auto)
    const manualRequirements = customRequirements.filter(req => req.type !== 'auto');
    
    // Convert auto-calculated requirements to the save format
    const autoRequirements = autoCalculatedReqs.map(req => ({
      id: req.id,
      description: req.description,
      cost: req.cost,
      margin: req.margin,
      price: req.total,
      type: 'auto' as const
    }));
    
    // Combine manual and auto requirements
    const allRequirements = [...manualRequirements, ...autoRequirements];
    
    // Update the requirements, which will trigger auto-save
    setAllRequirements(allRequirements);
  }, [autoCalculatedReqs, isLoading, customRequirements, setAllRequirements]); // Include all dependencies

  const handleSaveRequirements = () => {
    // Filter out auto requirements from customRequirements to avoid duplicates
    const manualRequirements = customRequirements
      .filter(req => req.type !== 'auto')
      .map(req => ({
        ...req,
        type: req.type || 'manual' // preserve type or default to manual
      }));
    
    // Convert auto-calculated requirements to the save format
    const autoRequirements = autoCalculatedReqs.map(req => ({
      id: req.id,
      description: req.description,
      cost: req.cost,
      margin: req.margin,
      price: req.total,
      type: 'auto' as const
    }));
    
    // Combine manual and auto requirements for saving
    const allRequirements = [...manualRequirements, ...autoRequirements];
    
    onSave({
      craneId,
      trafficControlId,
      bobcatId,
      customRequirements: allRequirements,
      notes,
      accessGrade,
      distanceFromTruck,
      poolShellDelivery,
      sewerDiversion,
      stormwaterDiversion,
      removeSlab,
      earthmoving,
      removeSlabSqm,
      earthmovingCubicMeters
    });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      {/* Standard Site Requirements Section */}
      <StandardRequirementsSection
        craneId={craneId}
        onCraneChange={setCraneId}
        trafficControlId={trafficControlId}
        onTrafficControlChange={setTrafficControlId}
        bobcatId={bobcatId}
        onBobcatChange={setBobcatId}
        accessGrade={accessGrade}
        onAccessGradeChange={setAccessGrade}
        distanceFromTruck={distanceFromTruck}
        onDistanceFromTruckChange={setDistanceFromTruck}
        poolShellDelivery={poolShellDelivery}
        onPoolShellDeliveryChange={setPoolShellDelivery}
        sewerDiversion={sewerDiversion}
        onSewerDiversionChange={setSewerDiversion}
        stormwaterDiversion={stormwaterDiversion}
        onStormwaterDiversionChange={setStormwaterDiversion}
        removeSlab={removeSlab}
        onRemoveSlabChange={setRemoveSlab}
        earthmoving={earthmoving}
        onEarthmovingChange={setEarthmoving}
        removeSlabSqm={removeSlabSqm}
        onRemoveSlabSqmChange={setRemoveSlabSqm}
        earthmovingCubicMeters={earthmovingCubicMeters}
        onEarthmovingCubicMetersChange={setEarthmovingCubicMeters}
        onAutoAddRequirement={handleAutoAddRequirement}
      />
      
      {/* Custom Site Requirements Section - only show manual requirements */}
      <CustomRequirementsSection
        requirements={customRequirements.filter(req => req.type !== 'auto')}
        addRequirement={addRequirement}
        removeRequirement={removeRequirement}
        updateRequirement={updateRequirement}
      />
      
      {/* Auto-Calculated Requirements Display */}
      <AutoCalculatedRequirements requirements={autoCalculatedReqs} />
      
      {/* Additional Notes Section */}
      <AdditionalNotesSection
        notes={notes}
        setNotes={setNotes}
      />
      
      {/* Cost Summary Section */}
      <SiteRequirementsSnapshotSummary
        customerId={customerId}
      />
      
      {/* Save Button */}
      <SaveButton
        onSave={handleSaveRequirements}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
