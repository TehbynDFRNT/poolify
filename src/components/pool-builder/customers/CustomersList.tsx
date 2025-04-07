
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Phone, Mail, Home, User, ArrowRight } from "lucide-react";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pool_projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueQuote = (customer) => {
    // Store the customer ID in localStorage and navigate to the pool builder
    localStorage.setItem('currentCustomerId', customer.id);
    navigate(`/pool-builder?customerId=${customer.id}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Loading customers...</p>
        </Card>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="py-8">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No customers found.</p>
            <Button onClick={() => navigate("/pool-builder")}>Add New Customer</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Card key={customer.id} className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">
                {customer.owner1}
                {customer.owner2 && ` & ${customer.owner2}`}
              </h3>
            </div>
          </div>
          
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{customer.home_address}</span>
            </div>
            
            {customer.site_address && customer.site_address !== customer.home_address && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Site: {customer.site_address}</span>
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Project: {customer.proposal_name}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" size="sm" className="gap-1">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button 
              onClick={() => handleContinueQuote(customer)} 
              size="sm" 
              className="gap-1"
            >
              Continue Quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomersList;
