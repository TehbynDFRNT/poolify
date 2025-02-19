
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

interface PoolPricingBreadcrumbProps {
  poolName: string;
}

export const PoolPricingBreadcrumb = ({ poolName }: PoolPricingBreadcrumbProps) => {
  const navigate = useNavigate();

  return (
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
          <BreadcrumbItem>{poolName}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="outline" onClick={() => navigate('/price-builder')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Price Builder
      </Button>
    </div>
  );
};
