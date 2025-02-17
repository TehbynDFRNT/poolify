
import { useState, useCallback } from "react";
import { Upload, File, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(csv|xlsx)$/)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV or XLSX file",
      });
      return;
    }

    setIsProcessing(true);
    // TODO: Implement file processing logic
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing
    setFile(file);
    setIsProcessing(false);
    
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been processed`,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fadeIn">
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
          accept=".csv,.xlsx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
        />
        <div className="text-center">
          <Upload
            className={`mx-auto h-12 w-12 mb-4 transition-colors ${
              isDragging ? "text-primary" : "text-gray-400"
            }`}
          />
          <h3 className="text-lg font-semibold mb-2">
            Drag and drop your file here
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: CSV, XLSX
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border animate-fadeIn">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-primary" />
            <span className="flex-1 text-sm font-medium truncate">
              {file.name}
            </span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </div>
      )}
    </div>
  );
};
