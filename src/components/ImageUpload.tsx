
import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  bucket: string;
  acceptedFileTypes: string[];
}

export const ImageUpload = ({ onUploadComplete, bucket, acceptedFileTypes }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (!acceptedFileTypes.some(type => file.type.startsWith(type.replace('/*', '')))) {
      throw new Error('Invalid file type');
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  }, []);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFileTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        <div className="text-center">
          <Upload
            className={`mx-auto h-12 w-12 mb-4 transition-colors ${
              isDragging ? "text-primary" : "text-gray-400"
            }`}
          />
          <h3 className="text-lg font-semibold mb-2">
            {isUploading ? "Uploading..." : "Drag and drop your image here"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: PNG, JPG, JPEG
          </p>
        </div>
      </div>
    </div>
  );
};
