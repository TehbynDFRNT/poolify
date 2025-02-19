
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
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePools } from "./hooks/usePools";
import { PricingTable } from "./components/PricingTable";

const PricingWorksheet = () => {
  const navigate = useNavigate();
  const { data: pools, isLoading: isLoadingPools } = usePools();

  if (isLoadingPools) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          Loading...
        </div>
      </DashboardLayout>
    );
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
                <Link to="/pricing-models/pools">Pools</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Worksheet</BreadcrumbItem>
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
            <h1 className="text-2xl font-semibold text-gray-900">Pool Worksheet</h1>
            <p className="text-gray-500 mt-1">Pool overview</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pools</CardTitle>
          </CardHeader>
          <CardContent>
            {pools && <PricingTable pools={pools} />}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PricingWorksheet;
