import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const FormulaReferencesHeader: React.FC = () => {
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
          <BreadcrumbItem>
            Formula References
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Formula References</h1>
        <p className="text-muted-foreground mt-1">
          Mathematical formulas and calculations for pool construction
        </p>
      </div>
    </>
  );
};