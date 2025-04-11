
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeatingInstallation } from "@/types/heating-installation";

const formSchema = z.object({
  installation_type: z.string().min(1, "Installation type is required"),
  installation_cost: z.coerce.number().positive("Installation cost must be positive"),
  installation_inclusions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHeatingInstallationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<HeatingInstallation, "id" | "created_at">) => void;
  initialValues?: HeatingInstallation | null;
  isEditMode?: boolean;
}

export const AddHeatingInstallationForm = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  isEditMode = false,
}: AddHeatingInstallationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      installation_type: "",
      installation_cost: 0,
      installation_inclusions: "",
    },
  });

  // Reset form when initialValues change or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.reset({
          installation_type: initialValues.installation_type,
          installation_cost: initialValues.installation_cost,
          installation_inclusions: initialValues.installation_inclusions || "",
        });
      } else {
        form.reset({
          installation_type: "",
          installation_cost: 0,
          installation_inclusions: "",
        });
      }
    }
  }, [form, initialValues, open]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        installation_type: values.installation_type,
        installation_cost: values.installation_cost,
        installation_inclusions: values.installation_inclusions || "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Heating Installation" : "Add Heating Installation"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the details of this heating installation." 
              : "Add a new heating installation option to your catalog."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="installation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Heat Pump">Heat Pump</SelectItem>
                      <SelectItem value="Blanket & Roller">Blanket & Roller</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installation_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Cost ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installation_inclusions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Inclusions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List inclusions here..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
