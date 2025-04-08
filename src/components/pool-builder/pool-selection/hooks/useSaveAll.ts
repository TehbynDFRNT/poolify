
import { useState } from "react";
import { toast } from "sonner";

export const useSaveAll = (customerId: string | null | undefined, handleSavePoolSelection: () => Promise<void>) => {
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);

  // Function to save all sections
  const handleSaveAll = async () => {
    if (!customerId) {
      toast("Please save customer information first.", {
        className: "bg-destructive text-destructive-foreground"
      });
      return;
    }

    setIsSubmittingAll(true);
    try {
      // First save the pool selection
      await handleSavePoolSelection();
      
      // Add other section saves here if needed in the future
      
      toast("All sections saved successfully");
    } catch (error) {
      console.error("Error saving all sections:", error);
      toast("Failed to save all sections. Please try again.", {
        className: "bg-destructive text-destructive-foreground"
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  return {
    isSubmittingAll,
    handleSaveAll
  };
};
