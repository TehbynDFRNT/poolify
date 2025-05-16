
import React from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCustomerData } from "@/hooks/useCustomerData";
import { PoolBuilderHeader } from "./components/PoolBuilderHeader";
import { PoolBuilderTabs } from "./components/PoolBuilderTabs";

const PoolBuilder = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  console.log("PoolBuilder: customerId from URL:", customerId);

  const { customer, selectedPool, loading } = useCustomerData(customerId);
  console.log("PoolBuilder: Data from useCustomerData hook:", { customer, selectedPool, loading });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <PoolBuilderHeader customer={customer} />
        <PoolBuilderTabs 
          customerId={customerId}
          customer={customer}
          selectedPool={selectedPool}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default PoolBuilder;
