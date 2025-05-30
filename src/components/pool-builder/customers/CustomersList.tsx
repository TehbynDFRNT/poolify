
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSnapshots } from "@/hooks/useSnapshots";
import { Home, User, ArrowRight, FileText, Filter, Clock } from "lucide-react";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get customer IDs for snapshot fetching
  const customerIds = customers.map(customer => customer.id);
  const { snapshots = new Map(), loading: snapshotsLoading } = useSnapshots(customerIds);

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

  const handleContinueContract = (customer) => {
    // Store the customer ID in localStorage and navigate to the contract builder
    localStorage.setItem('currentCustomerId', customer.id);
    navigate(`/contract-builder?customerId=${customer.id}`);
  };

  // Helper function to get status badge variant and label
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return { variant: "secondary", label: "Proposal Created", className: "" };
    
    const statusConfig = {
      created: { variant: "secondary", label: "Proposal Created", className: "bg-gray-300 text-gray-800 hover:bg-gray-400" },
      sent: { variant: "default", label: "Proposal Sent", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
      viewed: { variant: "default", label: "Proposal Viewed", className: "bg-teal-100 text-teal-800 hover:bg-teal-200" },
      accepted: { variant: "default", label: "Proposal Accepted", className: "bg-green-600 text-white hover:bg-green-700" },
      change_requested: { variant: "destructive", label: "Proposal Change Requested", className: "" }
    };
    
    return statusConfig[status] || { variant: "secondary", label: status, className: "" };
  };

  // Helper function to get the appropriate date for display
  const getStatusDate = (statusData: any) => {
    if (!statusData) return null;
    
    switch (statusData.status) {
      case 'viewed':
        return statusData.last_viewed;
      case 'change_requested':
        return statusData.last_change_requested;
      case 'accepted':
        return statusData.accepted_datetime;
      case 'created':
        return statusData.created_at;
      default:
        return statusData.created_at;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter customers based on selected status
  const filteredCustomers = useMemo(() => {
    if (statusFilter === "all") return customers;
    
    return customers.filter(customer => {
      const statusData = snapshots?.get(customer.id);
      const status = statusData?.status || "created";
      return status === statusFilter;
    });
  }, [customers, snapshots, statusFilter]);

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
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by status:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="change_requested">Change Requested</SelectItem>
          </SelectContent>
        </Select>
        {statusFilter !== "all" && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        )}
      </div>

      {/* Empty state for filtered results */}
      {filteredCustomers.length === 0 && statusFilter !== "all" ? (
        <Card className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">No customers found with status "{statusFilter}".</p>
          </div>
        </Card>
      ) : (
        /* Customer Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
        <Card key={customer.id} className="p-6 flex flex-col h-full">
          <div className="mb-4">
            {(() => {
              const statusData = snapshots?.get(customer.id);
              const status = statusData?.status || "created";
              const { variant, label, className } = getStatusBadge(status);
              return (
                <Badge variant={variant as any} className={className}>
                  {label}
                </Badge>
              );
            })()}
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-lg capitalize">{customer.proposal_name}</h3>
          </div>
          
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">
                {customer.owner1}
                {customer.owner2 && ` & ${customer.owner2}`}
              </span>
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
            
            {(() => {
              const statusData = snapshots?.get(customer.id);
              const statusDate = getStatusDate(statusData);
              const formattedDate = formatDate(statusDate);
              const formattedUpdatedAt = formatDate(statusData?.updated_at);
              
              return (
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                  {formattedDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {statusData?.status === 'viewed' && 'Last viewed: '}
                        {statusData?.status === 'change_requested' && 'Change requested: '}
                        {statusData?.status === 'accepted' && 'Accepted: '}
                        {statusData?.status === 'created' && 'Created: '}
                        {statusData?.status === 'sent' && 'Created: '}
                        {formattedDate}
                      </span>
                    </div>
                  )}
                  {formattedUpdatedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Updated: {formattedUpdatedAt}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              onClick={() => handleContinueQuote(customer)} 
              size="sm" 
              className="gap-1 flex-1 min-w-[240px]"
            >
              Continue Quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button 
              onClick={() => handleContinueContract(customer)} 
              size="sm" 
              variant="outline"
              disabled={snapshots?.get(customer.id)?.status !== "accepted"}
              className="gap-1 flex-1 min-w-[240px] border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Contract
              <FileText className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
        </div>
      )}
    </div>
  );
};

export default CustomersList;
