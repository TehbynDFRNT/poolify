import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface QuoteFormData {
  // Core Customer Information
  customer_name: string;
  phone_number: string;
  email: string;
  site_address: string;
  pool_model: string;
  pool_color: string;
  coping_type: string;
  base_installation_cost: number;

  // Site Costs
  bobcat_runout: string;
  number_of_trucks: number;
  excavation_type: string;
  crane_hire: string;
  traffic_control: string;

  // Extra Paving
  paving_type: string;
  total_square_meters: number;
  laying_cost: number;

  // Extra Paving on Existing Concrete
  modification_type: string;
  additional_concrete_work: string;

  // Retaining Walls
  wall_type: string;
  wall_length: number;
  wall_installation_cost: number;

  // Add-ons
  equipment_upgrades: string[];
  drainage_upgrades: string;

  // Water Features
  feature_type: string;
  feature_installation_cost: number;

  // Third-Party Costs
  council_approvals: string;
  form_15_lodgement: string;
  engineering_reports: string;

  // Fencing
  temporary_pool_fence: string;
  permanent_fencing: string;

  // Electrical
  electrical_wiring: string;
  additional_power_requirements: string;
}

const NewQuote = () => {
  const form = useForm<QuoteFormData>();
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState({
    siteCosts: false,
    extraPaving: false,
    existingConcrete: false,
    retainingWalls: false,
    addOns: false,
    waterFeatures: false,
    thirdPartyCosts: false,
    fencing: false,
    electrical: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (data: QuoteFormData) => {
    console.log('Form submitted:', data);
    toast({
      title: "Quote created",
      description: "The quote has been created successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/sales-builder/quotes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Quote</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Core Customer Information */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Core Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="site_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter site address" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pool_model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pool Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pool model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Add pool models here */}
                            <SelectItem value="model1">Model 1</SelectItem>
                            <SelectItem value="model2">Model 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pool_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pool Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pool color" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Site Costs Section */}
              <Collapsible
                open={openSections.siteCosts}
                onOpenChange={() => toggleSection('siteCosts')}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h2 className="text-xl font-semibold">🏗️ Site Costs</h2>
                  <ChevronDown className={`w-6 h-6 transition-transform ${openSections.siteCosts ? 'transform rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bobcat_runout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bobcat Runout</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select yes/no" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excavation_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excavation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="micro">Micro Dig</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Add more collapsible sections here following the same pattern */}

              <div className="flex justify-end pt-6">
                <Button type="submit">Create Quote</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewQuote;
