import React from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCustomerData } from "@/hooks/useCustomerData";
import { ContractBuilderHeader } from "./components/ContractBuilderHeader";
import { ContractBuilderTabs } from "./components/ContractBuilderTabs";

const ContractBuilder = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  console.log("ContractBuilder: customerId from URL:", customerId);

  const { customer, selectedPool, loading } = useCustomerData(customerId);
  console.log("ContractBuilder: Data from useCustomerData hook:", { customer, selectedPool, loading });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <ContractBuilderHeader customer={customer} />
        <ContractBuilderTabs 
          customerId={customerId}
          customer={customer}
          selectedPool={selectedPool}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ContractBuilder;