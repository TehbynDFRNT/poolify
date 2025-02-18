
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
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calculator, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import { PoolFiltrationPackagesSection } from "@/components/filtration/PoolFiltrationPackagesSection";
import type { PackageWithComponents } from "@/types/filtration";

const PoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pool, isLoading } = useQuery({
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

  const { data: filtrationPackages } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          *,
          light:light_id(id, name, model_number, price),
          pump:pump_id(id, name, model_number, price),
          sanitiser:sanitiser_id(id, name, model_number, price),
          filter:filter_id(id, name, model_number, price),
          handover_kit:handover_kit_id(
            id,
            name,
            components:handover_kit_package_components(
              quantity,
              component:component_id(id, name, model_number, price)
            )
          )
        `)
        .order('display_order');

      if (error) throw error;
      return data as PackageWithComponents[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

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

        <PoolFiltrationPackagesSection packages={filtrationPackages} />
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
