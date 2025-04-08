
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { SiteRequirementsSection } from "./SiteRequirementsSection";
import { CustomSiteRequirements } from "./CustomSiteRequirements";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface CustomRequirement {
  id: string;
  description: string;
  price: number;
}

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
  const [craneId, setCraneId] = useState<string | undefined>(undefined);
  const [trafficControlId, setTrafficControlId] = useState<string | undefined>('none');
  const [bobcatId, setBobcatId] = useState<string | undefined>('none');
  const [customRequirements, setCustomRequirements] = useState<CustomRequirement[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Load existing site requirements if any
  useEffect(() => {
    const fetchExistingRequirements = async () => {
      if (!customerId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pool_projects')
          .select(`
            crane_id,
            traffic_control_id,
            bobcat_id,
            site_requirements_data,
            site_requirements_notes
          `)
          .eq('id', customerId)
          .single();
        
        if (error) {
          console.error("Error fetching site requirements:", error);
          return;
        }
        
        if (data) {
          // Set the form state from the loaded data
          setCraneId(data.crane_id || undefined);
          setTrafficControlId(data.traffic_control_id || 'none');
          setBobcatId(data.bobcat_id || 'none');
          
          // Safely handle the custom requirements data with proper type checking
          if (data.site_requirements_data && Array.isArray(data.site_requirements_data)) {
            // First convert to unknown, then to the specific type
            const requirementsData = data.site_requirements_data as unknown;
            // Validate the shape of each item in the array before setting the state
            const validRequirements = (requirementsData as any[]).filter(item => 
              typeof item === 'object' && 
              item !== null && 
              'id' in item && 
              'description' in item && 
              'price' in item
            ) as CustomRequirement[];
            
            setCustomRequirements(validRequirements);
          }
          
          setNotes(data.site_requirements_notes || "");
        }
      } catch (error) {
        console.error("Error fetching site requirements data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingRequirements();
  }, [customerId]);

  const handleSaveRequirements = () => {
    onSave({
      craneId,
      trafficControlId,
      bobcatId,
      customRequirements,
      notes
    });
  };

  const addRequirement = () => {
    setCustomRequirements([
      ...customRequirements,
      { id: uuidv4(), description: "", price: 0 }
    ]);
  };

  const removeRequirement = (id: string) => {
    setCustomRequirements(customRequirements.filter(req => req.id !== id));
  };

  const updateRequirement = (id: string, field: 'description' | 'price', value: string) => {
    setCustomRequirements(customRequirements.map(req => {
      if (req.id === id) {
        if (field === 'price') {
          return { ...req, [field]: parseFloat(value) || 0 };
        }
        return { ...req, [field]: value };
      }
      return req;
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SiteRequirementsSection
        craneId={craneId}
        onCraneChange={setCraneId}
        trafficControlId={trafficControlId}
        onTrafficControlChange={setTrafficControlId}
        bobcatId={bobcatId}
        onBobcatChange={setBobcatId}
      />
      
      <CustomSiteRequirements
        requirements={customRequirements}
        addRequirement={addRequirement}
        removeRequirement={removeRequirement}
        updateRequirement={updateRequirement}
      />
      
      <Card>
        <CardContent className="p-4">
          <Label htmlFor="site-notes" className="mb-2 block">Additional Notes</Label>
          <Textarea
            id="site-notes"
            placeholder="Enter any additional notes about site requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveRequirements}
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Site Requirements"}
        </Button>
      </div>
    </div>
  );
};
