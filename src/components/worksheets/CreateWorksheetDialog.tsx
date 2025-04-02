
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePoolWorksheets, useCreatePoolWorksheet } from "@/hooks/usePoolWorksheets";
import { usePools } from "@/hooks/usePools";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorksheetFormData {
  name: string;
  pool_id: string;
  notes: string;
}

export function CreateWorksheetDialog() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<WorksheetFormData>();
  
  const { data: pools, isLoading: isLoadingPools } = usePools();
  const createWorksheetMutation = useCreatePoolWorksheet();

  const onSubmit = async (data: WorksheetFormData) => {
    try {
      await createWorksheetMutation.mutateAsync(data);
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating worksheet:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button id="create-worksheet-trigger" className="hidden">Create Worksheet</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Pool Worksheet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Worksheet Name</Label>
            <Input 
              id="name" 
              placeholder="Enter a name for this worksheet" 
              {...register("name", { required: true })}
            />
            {errors.name && <p className="text-sm text-red-500">Name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pool_id">Select Pool</Label>
            <Select 
              onValueChange={(value) => setValue("pool_id", value)}
              disabled={isLoadingPools || !pools}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a pool" />
              </SelectTrigger>
              <SelectContent>
                {pools?.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id}>
                    {pool.name} ({pool.range})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pool_id && <p className="text-sm text-red-500">Pool selection is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes"
              {...register("notes")}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-teal-500 hover:bg-teal-600"
              disabled={createWorksheetMutation.isPending}
            >
              {createWorksheetMutation.isPending ? "Creating..." : "Create Worksheet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
