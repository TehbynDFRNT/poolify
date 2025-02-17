
import { useState, useCallback } from "react";
import { Upload, File, CheckCircle2, AlertCircle, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface SheetData {
  name: string;
  data: any[][];
}

interface FileUploadProps {
  onSheetData: (data: any[][]) => void;
}

export const FileUpload = ({ onSheetData }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sheets, setSheets] = useState<SheetData[]>([]);
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
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      const processedSheets: SheetData[] = workbook.SheetNames.map(name => ({
        name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }),
      }));

      setSheets(processedSheets);
      setFile(file);
      
      toast({
        title: "File processed successfully",
        description: `Found ${processedSheets.length} sheets in ${file.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error processing file",
        description: "There was an error reading the file. Please try again.",
      });
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
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
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
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
            {isProcessing ? "Processing file..." : "Drag and drop your file here"}
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
        <div className="mt-6 space-y-6">
          <div className="p-4 bg-white rounded-lg shadow-sm border animate-fadeIn">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium truncate">
                {file.name}
              </span>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>

          {sheets.map((sheet, sheetIndex) => (
            <div key={sheet.name} className="bg-white rounded-lg shadow-sm border p-6 animate-fadeIn">
              <div className="flex items-center space-x-2 mb-4">
                <Table className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{sheet.name}</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {sheet.data[0]?.map((header: any, index: number) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sheet.data.slice(1, 6).map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell: any, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sheet.data.length > 6 && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Showing first 5 rows of {sheet.data.length - 1} rows
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
