
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RetainingWall } from "@/types/retaining-wall";
import { toast } from "sonner";

interface UseRetainingWallSectionProps {
  customerId: string | null;
  wallNumber: number;
  retainingWalls?: RetainingWall[];
  onWallUpdate?: () => void;
}

export const useRetainingWallSection = ({
  customerId,
  wallNumber,
  retainingWalls,
  onWallUpdate,
}: UseRetainingWallSectionProps) => {
  // Form state
  const [selectedWallType, setSelectedWallType] = useState<string>("");
  const [height1, setHeight1] = useState<number>(0);
  const [height2, setHeight2] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedWall, setSelectedWall] = useState<RetainingWall | null>(null);
  const [marginAmount, setMarginAmount] = useState<number>(0);
  
  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);

  // Database column names for this wall number
  const typeField = `retaining_wall${wallNumber}_type`;
  const height1Field = `retaining_wall${wallNumber}_height1`;
  const height2Field = `retaining_wall${wallNumber}_height2`;
  const lengthField = `retaining_wall${wallNumber}_length`;
  const totalCostField = `retaining_wall${wallNumber}_total_cost`;

  // Fetch existing data when component mounts
  useEffect(() => {
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);

  const fetchExistingData = async () => {
    if (!customerId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select(`${typeField}, ${height1Field}, ${height2Field}, ${lengthField}, ${totalCostField}`)
        .eq('id', customerId)
        .single();

      if (error) {
        console.error(`Error fetching retaining wall ${wallNumber} data:`, error);
      } else if (data) {
        // Check if we have valid data before trying to set state
        if (data[typeField]) {
          setSelectedWallType(data[typeField]);
          setHasExistingData(true);
        }
        
        if (data[height1Field] !== null) {
          setHeight1(data[height1Field]);
        }
        
        if (data[height2Field] !== null) {
          setHeight2(data[height2Field]);
        }
        
        if (data[lengthField] !== null) {
          setLength(data[lengthField]);
        }
      }
    } catch (error) {
      console.error(`Error fetching retaining wall ${wallNumber} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate square meters when dimensions change
  useEffect(() => {
    if (height1 && height2 && length) {
      // Formula: ((Height 1 + Height 2) ÷ 2) × Length
      const calculatedSquareMeters = ((Number(height1) + Number(height2)) / 2) * Number(length);
      setSquareMeters(parseFloat(calculatedSquareMeters.toFixed(2)));
    } else {
      setSquareMeters(0);
    }
  }, [height1, height2, length]);

  // Calculate total cost when square meters or wall type changes
  useEffect(() => {
    if (squareMeters && selectedWall) {
      // Formula: Square Meters × Total Rate
      const calculatedTotalCost = squareMeters * selectedWall.total;
      setTotalCost(parseFloat(calculatedTotalCost.toFixed(2)));
      
      // Calculate margin amount based on the margin percentage in the selected wall
      const calculatedMarginAmount = squareMeters * selectedWall.margin;
      setMarginAmount(parseFloat(calculatedMarginAmount.toFixed(2)));
    } else {
      setTotalCost(0);
      setMarginAmount(0);
    }
  }, [squareMeters, selectedWall]);

  // Update selected wall when wall type changes
  useEffect(() => {
    if (retainingWalls && selectedWallType) {
      const wall = retainingWalls.find(w => w.type === selectedWallType);
      setSelectedWall(wall || null);
    } else {
      setSelectedWall(null);
    }
  }, [selectedWallType, retainingWalls]);

  const handleHeightChange = (field: "height1" | "height2", value: number) => {
    if (field === "height1") {
      setHeight1(value);
    } else {
      setHeight2(value);
    }
  };

  const handleLengthChange = (value: number) => {
    setLength(value);
  };

  const handleSave = async () => {
    if (!customerId) {
      toast.error("No customer ID provided");
      return;
    }

    if (!selectedWallType || !height1 || !height2 || !length) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      // Create an update object with the correct field names
      const updates: Record<string, any> = {
        [typeField]: selectedWallType,
        [height1Field]: height1,
        [height2Field]: height2,
        [lengthField]: length,
        [totalCostField]: totalCost
      };

      const { error } = await supabase
        .from('pool_projects')
        .update(updates)
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success(`Retaining wall ${wallNumber} details saved successfully`);
      setHasExistingData(true);
      
      // Call the onWallUpdate callback to trigger a refetch in the summary component
      if (onWallUpdate) {
        onWallUpdate();
      }
    } catch (error) {
      console.error(`Error saving retaining wall ${wallNumber} data:`, error);
      toast.error(`Failed to save retaining wall ${wallNumber} details`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!customerId) {
      toast.error("No customer ID provided");
      return;
    }

    setIsDeleting(true);
    try {
      // Create an update object with null values for this wall's fields
      const updates: Record<string, any> = {
        [typeField]: null,
        [height1Field]: null,
        [height2Field]: null,
        [lengthField]: null,
        [totalCostField]: null
      };

      const { error } = await supabase
        .from('pool_projects')
        .update(updates)
        .eq('id', customerId);

      if (error) throw error;
      
      // Reset form
      setSelectedWallType('');
      setHeight1(0);
      setHeight2(0);
      setLength(0);
      setTotalCost(0);
      setMarginAmount(0);
      
      setShowDeleteConfirm(false);
      setHasExistingData(false);
      toast.success(`Retaining wall ${wallNumber} removed successfully`);
      
      // Call the onWallUpdate callback to trigger a refetch in the summary component
      if (onWallUpdate) {
        onWallUpdate();
      }
    } catch (error) {
      console.error(`Error removing retaining wall ${wallNumber} data:`, error);
      toast.error(`Failed to remove retaining wall ${wallNumber}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // State
    selectedWallType,
    height1,
    height2,
    length,
    squareMeters,
    totalCost,
    selectedWall,
    marginAmount,
    isSaving,
    isDeleting,
    showDeleteConfirm,
    isLoading,
    hasExistingData,
    
    // Actions
    setSelectedWallType,
    handleHeightChange,
    handleLengthChange,
    handleSave,
    handleDelete,
    setShowDeleteConfirm
  };
};
