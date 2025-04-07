
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface Customer {
  id: string;
  owner1: string;
  owner2: string | null;
  phone: string;
  email: string;
  home_address: string;
  site_address: string | null;
  installation_area: string;
  resident_homeowner: boolean;
  proposal_name: string;
  created_at: string;
}

const CustomersList: React.FC = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('pool_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setCustomers(data as Customer[]);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: "Failed to load customer data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col justify-center items-center h-60 gap-4">
          <Users className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-medium">No Customers Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You haven't added any customers yet. Use the Pool Builder form to add your first customer.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <span className="text-muted-foreground">{customers.length} customer{customers.length !== 1 ? 's' : ''}</span>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Installation Area</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.proposal_name}</TableCell>
                  <TableCell>
                    {customer.owner1}
                    {customer.owner2 && <span className="text-muted-foreground text-sm"> & {customer.owner2}</span>}
                  </TableCell>
                  <TableCell>
                    <div>{customer.phone}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell>{customer.installation_area}</TableCell>
                  <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersList;
