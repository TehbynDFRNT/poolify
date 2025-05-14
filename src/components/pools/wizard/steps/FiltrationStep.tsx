import React, { useEffect, useState } from "react";
import { usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { supabase } from "@/integrations/supabase/client";
import { useFormContext } from "react-hook-form";

interface FiltrationPackage {
  id: string;
  name: string;
  display_order: number;
  pump_id?: string;
  filter_id?: string;
  light_id?: string;
  sanitiser_id?: string;
  handover_kit_id?: string;
  filter_type?: string;
  totalPrice?: number;
}

interface FiltrationComponent {
  id: string;
  name: string;
  price_inc_gst: number;
}

const FiltrationStep: React.FC = () => {
  const [packages, setPackages] = useState<FiltrationPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { watch, setValue } = useFormContext();
  
  const poolName = watch("name");
  
  useEffect(() => {
    const fetchFiltrationPackages = async () => {
      setIsLoading(true);
      
      try {
        // Fetch filtration packages
        const { data: packagesData, error: packagesError } = await supabase
          .from("filtration_packages")
          .select("*")
          .order("display_order");
          
        if (packagesError) throw packagesError;
        
        if (!packagesData || packagesData.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Fetch components to calculate prices
        const { data: componentsData, error: componentsError } = await supabase
          .from("filtration_components")
          .select("id, name, price_inc_gst");
          
        if (componentsError) throw componentsError;
        
        // Map components to a lookup object
        const componentsMap = new Map<string, FiltrationComponent>();
        componentsData?.forEach((component) => {
          componentsMap.set(component.id, component as FiltrationComponent);
        });
        
        // Calculate package prices
        const packagesWithPrices = packagesData.map((pkg) => {
          let totalPrice = 0;
          
          // Add component prices if they exist
          if (pkg.pump_id && componentsMap.has(pkg.pump_id)) {
            totalPrice += componentsMap.get(pkg.pump_id)!.price_inc_gst || 0;
          }
          
          if (pkg.filter_id && componentsMap.has(pkg.filter_id)) {
            totalPrice += componentsMap.get(pkg.filter_id)!.price_inc_gst || 0;
          }
          
          if (pkg.light_id && componentsMap.has(pkg.light_id)) {
            totalPrice += componentsMap.get(pkg.light_id)!.price_inc_gst || 0;
          }
          
          if (pkg.sanitiser_id && componentsMap.has(pkg.sanitiser_id)) {
            totalPrice += componentsMap.get(pkg.sanitiser_id)!.price_inc_gst || 0;
          }
          
          return {
            ...pkg,
            totalPrice
          };
        });
        
        setPackages(packagesWithPrices);
        
        // Select the first package by default
        if (packagesWithPrices.length > 0 && !selectedPackageId) {
          setSelectedPackageId(packagesWithPrices[0].id);
          setValue("default_filtration_package_id", packagesWithPrices[0].id);
        }
      } catch (error) {
        console.error("Error loading filtration packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFiltrationPackages();
  }, [setValue, selectedPackageId]);
  
  const handlePackageChange = (packageId: string) => {
    setSelectedPackageId(packageId);
    setValue("default_filtration_package_id", packageId);
  };
  
  if (isLoading) {
    return <div className="py-4">Loading filtration packages...</div>;
  }
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select a filtration package for <span className="font-medium text-foreground">{poolName}</span>
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtration Packages</CardTitle>
          <CardDescription>
            Choose the appropriate filtration system for this pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <p className="text-muted-foreground">No filtration packages available. Please create packages first.</p>
          ) : (
            <RadioGroup value={selectedPackageId || ""} onValueChange={handlePackageChange}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Filter Type</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-0" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Label htmlFor={pkg.id} className="cursor-pointer">
                          {pkg.name}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={pkg.id} className="cursor-pointer">
                          {pkg.filter_type || "Standard"}
                        </Label>
                      </TableCell>
                      <TableCell className="text-right">
                        <Label htmlFor={pkg.id} className="cursor-pointer">
                          {formatCurrency(pkg.totalPrice || 0)}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FiltrationStep;
