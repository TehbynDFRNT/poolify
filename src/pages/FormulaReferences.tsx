import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FormulaReference } from "@/components/pool-builder/FormulaReference";
import { FormulaReferencesHeader } from "@/components/headers/FormulaReferencesHeader";

const FormulaReferences = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <FormulaReferencesHeader />
        <FormulaReference />
      </div>
    </DashboardLayout>
  );
};

export default FormulaReferences;