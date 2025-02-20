
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Check, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PoolLineDiagramProps {
  pool: {
    id: string;
    name: string;
    length: number;
    width: number;
    depth_shallow: number;
    depth_deep: number;
    outline_image_url?: string | null;
  };
}

export const PoolLineDiagram = ({ pool }: PoolLineDiagramProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (url: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("pool_specifications")
        .update({ outline_image_url: url })
        .eq("id", pool.id);

      if (error) throw error;

      toast.success("Pool outline image updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating pool outline:", error);
      toast.error("Failed to update pool outline image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pool Outline</CardTitle>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="group"
            >
              <Pencil className="h-4 w-4 opacity-50 group-hover:opacity-100" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="flex justify-center">
            <img 
              src={pool.outline_image_url || "/lovable-uploads/590580b8-d08d-42ee-b7a5-d72d576b2263.png"}
              alt={`${pool.name} Pool Outline`}
              className="max-w-xl w-full h-auto"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <FileUpload
              accept="image/*"
              endpoint="pool-outlines"
              onUploadComplete={handleImageUpload}
            />
            <div className="text-sm text-muted-foreground">
              Upload a new pool outline image. Supported formats: PNG, JPG, JPEG.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
