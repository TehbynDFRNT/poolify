import React from "react";
import { Pool } from "@/types/pool";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface AddonsSectionProps {
  pool: Pool;
  customerId: string | null;
}

export const AddonsSection: React.FC<AddonsSectionProps> = ({ pool, customerId }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Pool Add-ons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hand Grab Rails */}
          <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Hand Grab Rails</h3>
                <p className="text-sm text-muted-foreground">Add safety rails to your pool</p>
              </div>
            </div>
          </Card>
          
          {/* Lighting */}
          <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Lighting</h3>
                <p className="text-sm text-muted-foreground">Pool lighting options</p>
              </div>
            </div>
          </Card>
          
          {/* Pool Heating */}
          <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Pool Heating</h3>
                <p className="text-sm text-muted-foreground">Heat pump and installation</p>
              </div>
            </div>
          </Card>
          
          {/* Other Addons */}
          <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Other Add-ons</h3>
                <p className="text-sm text-muted-foreground">Pool cleaners, hardware upgrades</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-6 p-4 border rounded-lg bg-slate-50">
          <p className="text-sm text-muted-foreground">
            Add optional features to customize your pool. Select from various add-ons to enhance your pool experience.
          </p>
        </div>
      </div>
    </div>
  );
};
