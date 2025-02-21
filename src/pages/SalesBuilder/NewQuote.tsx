
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteFormData {
  owner1_name: string;
  owner1_phone: string;
  owner1_email: string;
  owner2_name: string;
  home_address: string;
  site_address: string;
  installation_area: string;
  pool_name: string;
  proposal_name: string;
  resident_homeowner: string;
  pool_colour: string;
  coping_category: string;
  grout_colour: string;
  temporary_safety_barrier: string;
  filtration_option: string;
  media_filter_upgrade: string;
  recess_drainage_provisions: string;
  price: string;
}

const NewQuote = () => {
  const form = useForm<QuoteFormData>();
  const { toast } = useToast();

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner 1 Details */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="owner1_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner 1 Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter owner 1 name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="owner1_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner 1 Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="owner1_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner 1 Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Owner 2 Details */}
                <FormField
                  control={form.control}
                  name="owner2_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner 2 Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner 2 name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="home_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter home address" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proposal_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter proposal name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="installation_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installation Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter installation area" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pool Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pool_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pool Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pool name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="resident_homeowner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resident Homeowner</FormLabel>
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
                  name="pool_colour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pool Colour</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pool colour" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Pool Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="coping_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coping Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter coping category" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grout_colour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grout Colour</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter grout colour" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pool Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="temporary_safety_barrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporary Safety Barrier</FormLabel>
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
                  name="filtration_option"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filtration Option</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter filtration option" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Final Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="media_filter_upgrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Filter Upgrade</FormLabel>
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
                  name="recess_drainage_provisions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recess Drainage Provisions</FormLabel>
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
              </div>

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
