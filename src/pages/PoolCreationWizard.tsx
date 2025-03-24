
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PoolCreationWizard from "@/components/pools/wizard/PoolCreationWizard";

const PoolWizardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/pool-specifications" className="transition-colors hover:text-foreground">
                Pool Specifications
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Create New Pool
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Pool</h1>
          <p className="text-muted-foreground mt-1">
            Follow the wizard to create a new pool with all associated configurations
          </p>
        </div>
        
        <PoolCreationWizard />
      </div>
    </DashboardLayout>
  );
};

export default PoolWizardPage;
