
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface QuoteFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  poolType: string;
  notes: string;
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
    // TODO: Add quote creation logic here
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

        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter installation address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="poolType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pool type" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter any additional notes" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
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
