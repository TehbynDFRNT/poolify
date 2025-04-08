
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Shovel, Layers } from "lucide-react";
import { SaveButton } from "../site-requirements/SaveButton";
import { LoadingIndicator } from "../site-requirements/LoadingIndicator";
import { toast } from "sonner";
import { ExtraPavingSection } from "./ExtraPavingSection";
import { ConcreteCutsSection } from "./ConcreteCutsSection";
import { ExtraConcretingSection } from "./ExtraConcretingSection";

interface ConcreteAndPavingFormProps {
  pool: Pool;
  customerId: string;
}

export const ConcreteAndPavingForm: React.FC<ConcreteAndPavingFormProps> = ({
  pool,
  customerId,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true);
    
    // Simulate saving data
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Concrete and paving options saved successfully");
    } catch (error) {
      console.error("Error saving concrete and paving options:", error);
      toast.error("Failed to save concrete and paving options");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="extra-paving" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="extra-paving" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Extra Paving
          </TabsTrigger>
          <TabsTrigger value="concrete-cuts" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Concrete Cuts
          </TabsTrigger>
          <TabsTrigger value="extra-concreting" className="flex items-center gap-2">
            <Shovel className="h-4 w-4" />
            Extra Concreting
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="extra-paving">
          <ExtraPavingSection />
        </TabsContent>
        
        <TabsContent value="concrete-cuts">
          <ConcreteCutsSection />
        </TabsContent>
        
        <TabsContent value="extra-concreting">
          <ExtraConcretingSection />
        </TabsContent>
      </Tabs>
      
      <SaveButton onSave={handleSave} isSubmitting={isSubmitting} />
    </div>
  );
};
