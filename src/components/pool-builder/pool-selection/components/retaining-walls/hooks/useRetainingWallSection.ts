import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { RetainingWall } from "@/types/retaining-wall";
import { useEffect, useState } from "react";
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
  const [retainingWallId, setRetainingWallId] = useState<string | null>(null);

  // Guarded save mutation
  const {
    mutateAsync: saveRetainingWallAsync,
    isPending: isSavingGuarded,
    StatusWarningDialog: SaveStatusWarningDialog
  } = useGuardedMutation({
    projectId: customerId || '',
    mutationFn: async () => {
      if (!customerId) {
        throw new Error("No customer ID provided");
      }

      if (!selectedWallType || !height1 || !height2 || !length) {
        throw new Error("Please fill in all required fields");
      }

      // Create a wall record with a type that includes the wall number identifier
      const wallData = {
        wall_type: `Wall ${wallNumber}: ${selectedWallType}`,
        height1,
        height2,
        length,
        total_cost: totalCost,
        margin: marginAmount // Add the margin amount to be stored in the database
      };

      let result;

      if (retainingWallId) {
        // Update existing wall record
        result = await supabase
          .from('pool_retaining_walls')
          .update(wallData)
          .eq('id', retainingWallId);
      } else {
        // Create new wall record
        result = await supabase
          .from('pool_retaining_walls')
          .insert({
            ...wallData,
            pool_project_id: customerId
          });
      }

      if (result.error) throw result.error;

      // If we just inserted a new record, get its ID for future updates
      if (!retainingWallId && result.data && result.data.length > 0) {
        setRetainingWallId(result.data[0].id);
      }

      setHasExistingData(true);

      return { success: true };
    },
    mutationOptions: {
      onSuccess: () => {
        toast.success(`Retaining wall ${wallNumber} details saved successfully`);

        // Call the onWallUpdate callback to trigger a refetch in the summary component
        if (onWallUpdate) {
          onWallUpdate();
        }
      },
      onError: (error) => {
        console.error(`Error saving retaining wall ${wallNumber} data:`, error);
        toast.error(`Failed to save retaining wall ${wallNumber} details`);
      }
    }
  });

  // Guarded delete mutation
  const {
    mutateAsync: deleteRetainingWallAsync,
    isPending: isDeletingGuarded,
    StatusWarningDialog: DeleteStatusWarningDialog
  } = useGuardedMutation({
    projectId: customerId || '',
    mutationFn: async () => {
      if (!customerId || !retainingWallId) {
        throw new Error("No wall data to delete");
      }

      // Delete the wall record entirely
      const { error } = await supabase
        .from('pool_retaining_walls')
        .delete()
        .eq('id', retainingWallId);

      if (error) throw error;

      return { success: true };
    },
    mutationOptions: {
      onSuccess: () => {
        // Reset form and state
        setSelectedWallType('');
        setHeight1(0);
        setHeight2(0);
        setLength(0);
        setTotalCost(0);
        setMarginAmount(0);
        setRetainingWallId(null);

        setShowDeleteConfirm(false);
        setHasExistingData(false);
        toast.success(`Retaining wall ${wallNumber} removed successfully`);

        // Call the onWallUpdate callback to trigger a refetch in the summary component
        if (onWallUpdate) {
          onWallUpdate();
        }
      },
      onError: (error) => {
        console.error(`Error removing retaining wall ${wallNumber} data:`, error);
        toast.error(`Failed to remove retaining wall ${wallNumber}`);
      }
    }
  });

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
      // Find a wall entry for this wall number, using the wall_type field to distinguish
      // We'll identify wall 1, 2, 3, 4 by a tag in the wall_type string
      // This is a temporary measure until we have a proper migration to add a wall_number field
      const wallIdentifier = `Wall ${wallNumber}:`;

      const { data, error } = await supabase
        .from('pool_retaining_walls')
        .select('*')
        .eq('pool_project_id', customerId)
        .like('wall_type', `%${wallIdentifier}%`)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
        console.error(`Error fetching retaining wall ${wallNumber} data:`, error);
      } else if (data) {
        // Store the wall ID for updates
        setRetainingWallId(data.id);

        // Display the wall type without the identifier
        if (data.wall_type) {
          const actualWallType = data.wall_type.replace(wallIdentifier, '').trim();
          setSelectedWallType(actualWallType);
          setHasExistingData(true);
        }

        if (data.height1 !== null) {
          setHeight1(data.height1);
        }

        if (data.height2 !== null) {
          setHeight2(data.height2);
        }

        if (data.length !== null) {
          setLength(data.length);
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
      await saveRetainingWallAsync();
    } catch (error) {
      console.error(`Error in handleSave for retaining wall ${wallNumber}:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!customerId || !retainingWallId) {
      toast.error("No wall data to delete");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRetainingWallAsync();
    } catch (error) {
      console.error(`Error in handleDelete for retaining wall ${wallNumber}:`, error);
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
    isSaving: isSaving || isSavingGuarded,
    isDeleting: isDeleting || isDeletingGuarded,
    showDeleteConfirm,
    isLoading,
    hasExistingData,
    retainingWallId,

    // Actions
    setSelectedWallType,
    handleHeightChange,
    handleLengthChange,
    handleSave,
    handleDelete,
    setShowDeleteConfirm,

    // Status Warning Dialogs
    SaveStatusWarningDialog,
    DeleteStatusWarningDialog
  };
};
