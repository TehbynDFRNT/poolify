
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { Construction, MapPin, Save } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { SiteRequirementsForm } from "./SiteRequirementsForm";

interface SiteRequirementsPlaceholderProps {
  pool: Pool;
  customerId?: string | null;
}

export const SiteRequirementsPlaceholder: React.FC<SiteRequirementsPlaceholderProps> = ({
  pool,
  customerId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: any) => {
    if (!customerId) {
      toast.error("Please save customer information first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Start a transaction to update both tables

      // 1. First check if we already have an equipment selection record
      const { data: existingEquipment } = await supabase
        .from('pool_equipment_selections')
        .select('id')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (existingEquipment?.id) {
        // Update existing equipment selections
        const { error: equipmentError } = await supabase
          .from('pool_equipment_selections')
          .update({
            crane_id: formData.craneId === 'none' ? null : formData.craneId,
            traffic_control_id: formData.trafficControlId === 'none' ? null : formData.trafficControlId,
            bobcat_id: formData.bobcatId === 'none' ? null : formData.bobcatId
          })
          .eq('id', existingEquipment.id);

        if (equipmentError) throw equipmentError;
      } else {
        // Create new equipment selections record
        const { error: equipmentError } = await supabase
          .from('pool_equipment_selections')
          .insert({
            pool_project_id: customerId,
            crane_id: formData.craneId === 'none' ? null : formData.craneId,
            traffic_control_id: formData.trafficControlId === 'none' ? null : formData.trafficControlId,
            bobcat_id: formData.bobcatId === 'none' ? null : formData.bobcatId
          });

        if (equipmentError) throw equipmentError;
      }

      // 2. Update site requirements data and notes in pool_projects
      const { error: projectError } = await supabase
        .from('pool_projects')
        .update({
          site_requirements_data: formData.customRequirements,
          site_requirements_notes: formData.notes
        })
        .eq('id', customerId);

      if (projectError) throw projectError;

      toast.success("Site requirements saved successfully");
    } catch (error) {
      console.error("Error saving site requirements:", error);
      toast.error("Failed to save site requirements");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-secondary/50 pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Site Requirements
            </CardTitle>

            {customerId && (
              <Button
                size="sm"
                disabled={isSubmitting}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save All"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {!customerId ? (
            <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
              <Construction className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Please Save Customer Information First</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Site requirements need to be associated with a customer record.
                Please complete and save the customer information in the Customer Info tab.
              </p>
            </div>
          ) : (
            <SiteRequirementsForm
              pool={pool}
              customerId={customerId}
              onSave={handleSave}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
