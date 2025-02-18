
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Upload } from "lucide-react";

export const PoolOutline = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState("/lovable-uploads/df5d055b-4d38-49ed-8a2f-b0625c3b09d5.png");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${id}-outline.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('pool-outlines')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pool-outlines')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setIsEditing(false);
      toast.success("Pool outline updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pool Outline</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <Upload className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Accepted formats: PNG, JPG, JPEG. Max size: 5MB
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <img 
              src={imageUrl}
              alt="Pool outline"
              className="max-w-[400px] w-full h-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
