import React from "react";
import { Link } from "react-router-dom";
import { User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PoolProject } from "@/types/pool";

interface ContractBuilderHeaderProps {
  customer: PoolProject | null;
}

export const ContractBuilderHeader: React.FC<ContractBuilderHeaderProps> = ({ customer }) => {
  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {customer && (
            <>
              <BreadcrumbItem>
                <Link to="/customers" className="transition-colors hover:text-foreground">
                  Customers
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            Contract Builder
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage pool contracts
          </p>
        </div>
        
        {customer ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-md">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                {customer.owner1}{customer.owner2 ? ` & ${customer.owner2}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">{customer.proposal_name}</p>
            </div>
          </div>
        ) : (
          <Link to="/customers">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              View Customers
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};