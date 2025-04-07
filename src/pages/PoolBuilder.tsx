
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Waves, Calculator, Users, CheckSquare, ListFilter, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaReference } from "@/components/pool-builder/FormulaReference";
import CustomerInformationSection from "@/components/pool-builder/customer-information/CustomerInformationSection";
import PoolSelectionSection from "@/components/pool-builder/pool-selection/PoolSelectionSection";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PoolProject } from "@/types/pool";

const PoolBuilder = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [customer, setCustomer] = useState<PoolProject | null>(null);
  const [loading, setLoading] = useState(!!customerId);
  const { toast } = useToast();
  
  useEffect(() => {
    // If there's a customerId in the URL, fetch the customer data
    if (customerId) {
      fetchCustomerData(customerId);
    }
  }, [customerId]);
  
  const fetchCustomerData = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pool_projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCustomer(data as PoolProject);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast({
        title: "Error",
        description: "Failed to load customer data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
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
              Pool Builder
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pool Builder</h1>
            <p className="text-muted-foreground mt-1">
              Design and customize swimming pools
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

        {loading ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">Loading customer data...</p>
          </Card>
        ) : (
          <Tabs defaultValue="builder" className="space-y-4">
            <TabsList>
              <TabsTrigger value="builder" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Customer Info
              </TabsTrigger>
              <TabsTrigger value="pool-selection" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                Pool Selection
              </TabsTrigger>
              <TabsTrigger value="formula-reference" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Formula Reference
              </TabsTrigger>
            </TabsList>
            <TabsContent value="builder">
              <Card className="p-6">
                <CustomerInformationSection existingCustomer={customer} />
              </Card>
            </TabsContent>
            <TabsContent value="pool-selection">
              <Card className="p-6">
                <PoolSelectionSection customerId={customerId} />
              </Card>
            </TabsContent>
            <TabsContent value="formula-reference">
              <FormulaReference />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PoolBuilder;
