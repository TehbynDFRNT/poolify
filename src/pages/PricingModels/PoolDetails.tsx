
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calculator, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";
import { useState } from "react";

const PoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");

  const { data: pool, isLoading: poolLoading } = useQuery({
    queryKey: ["pool-specification", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Pool;
    },
  });

  const { data: filtrationPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          *,
          light:light_id(*),
          pump:pump_id(*),
          sanitiser:sanitiser_id(*),
          filter:filter_id(*),
          handover_kit:handover_kit_id(
            id,
            name,
            components:handover_kit_package_components(
              quantity,
              component:component_id(*)
            )
          )
        `)
        .order('display_order');

      if (error) throw error;
      return data as unknown as PackageWithComponents[];
    },
    onSuccess: (data) => {
      if (data?.[0] && !selectedPackageId) {
        setSelectedPackageId(data[0].id);
      }
    }
  });

  if (poolLoading || packagesLoading) {
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  const selectedPackage = filtrationPackages?.find(pkg => pkg.id === selectedPackageId) || filtrationPackages?.[0];

  const calculatePackageTotal = (pkg: PackageWithComponents) => {
    const handoverKitTotal = pkg.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      handoverKitTotal
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/pricing-models">Pricing Models</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/pricing-models/worksheet">Pools</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{pool.name}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">{pool.name}</h1>
            <p className="text-gray-500 mt-1">{pool.range} Range</p>
          </div>
          <Calculator className="h-6 w-6 text-gray-500" />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pool Outline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/df5d055b-4d38-49ed-8a2f-b0625c3b09d5.png" 
                alt="Pool outline"
                className="max-w-[400px] w-full h-auto"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pool Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Dimensions</h3>
                <p>Length: {pool.length}m</p>
                <p>Width: {pool.width}m</p>
                <p>Depth (Shallow): {pool.depth_shallow}m</p>
                <p>Depth (Deep): {pool.depth_deep}m</p>
              </div>
              <div>
                <h3 className="font-medium">Specifications</h3>
                <p>Volume: {pool.volume_liters ? `${pool.volume_liters}L` : 'N/A'}</p>
                <p>Weight: {pool.weight_kg ? `${pool.weight_kg}kg` : 'N/A'}</p>
                <p>Price (ex GST): {pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : 'N/A'}</p>
                <p>Price (inc GST): {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Filtration Package</span>
              <Select 
                value={selectedPackageId} 
                onValueChange={setSelectedPackageId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {filtrationPackages?.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      Option {pkg.display_order}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPackage && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Light</h3>
                  {selectedPackage.light && (
                    <div className="grid grid-cols-2 gap-2">
                      <p>Model: {selectedPackage.light.model_number}</p>
                      <p className="text-right">{formatCurrency(selectedPackage.light.price)}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Pump</h3>
                  {selectedPackage.pump && (
                    <div className="grid grid-cols-2 gap-2">
                      <p>Model: {selectedPackage.pump.model_number}</p>
                      <p className="text-right">{formatCurrency(selectedPackage.pump.price)}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Sanitiser</h3>
                  {selectedPackage.sanitiser && (
                    <div className="grid grid-cols-2 gap-2">
                      <p>Model: {selectedPackage.sanitiser.model_number}</p>
                      <p className="text-right">{formatCurrency(selectedPackage.sanitiser.price)}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Filter</h3>
                  {selectedPackage.filter && (
                    <div className="grid grid-cols-2 gap-2">
                      <p>Model: {selectedPackage.filter.model_number}</p>
                      <p className="text-right">{formatCurrency(selectedPackage.filter.price)}</p>
                    </div>
                  )}
                </div>
                {selectedPackage.handover_kit && (
                  <div>
                    <h3 className="font-medium mb-2">Handover Kit: {selectedPackage.handover_kit.name}</h3>
                    <div className="space-y-2">
                      {selectedPackage.handover_kit.components.map((comp) => (
                        <div key={comp.component_id} className="grid grid-cols-2 gap-2">
                          <p>{comp.component?.name} (x{comp.quantity})</p>
                          <p className="text-right">
                            {formatCurrency((comp.component?.price || 0) * comp.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <h3 className="font-medium">Total Package Price:</h3>
                    <p className="text-right font-medium">
                      {formatCurrency(calculatePackageTotal(selectedPackage))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
