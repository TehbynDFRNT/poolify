import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PoolPricing = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();

  const { data: pool, isLoading } = useQuery({
    queryKey: ["pool-pricing", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .eq("id", poolId)
        .single();

      if (error) throw error;
      return data;
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
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/price-builder">Price Builder</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{pool.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button 
            variant="outline" 
            onClick={() => navigate('/price-builder')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Price Builder
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{pool.name} Price Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {/* We'll start building the pricing configuration here */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
