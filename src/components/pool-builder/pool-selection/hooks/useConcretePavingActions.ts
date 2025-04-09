
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useConcretePavingActions = (customerId: string | null | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (data: any, tableName = 'pool_projects') => {
    if (!customerId) {
      toast.error("Please save customer information first");
      return false;
    }
    
    setIsSubmitting(true);
    try {
      // Use type assertion to ensure tableName is recognized as a valid table name
      const { error } = await supabase
        .from(tableName as 'pool_projects')
        .update(data)
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Successfully saved");
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (field: string, tableName = 'pool_projects') => {
    if (!customerId) {
      toast.error("Please save customer information first");
      return false;
    }
    
    setIsDeleting(true);
    try {
      // Create an update object with the field set to null
      const updateData: Record<string, null> = {};
      updateData[field] = null;
      
      // Use type assertion to ensure tableName is recognized as a valid table name
      const { error } = await supabase
        .from(tableName as 'pool_projects')
        .update(updateData)
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Successfully removed");
      return true;
    } catch (error) {
      console.error("Error removing data:", error);
      toast.error("Failed to remove data");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSubmitting,
    isDeleting,
    handleSave,
    handleDelete
  };
};
