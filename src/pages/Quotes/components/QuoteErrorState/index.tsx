
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

interface QuoteErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const QuoteErrorState = ({ error, onRetry }: QuoteErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8 space-y-4">
      <p className="text-red-500 mb-4">{error}</p>
      
      <div className="flex justify-center gap-4">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        )}
        
        <Button onClick={() => navigate('/quotes')} variant="outline">
          Back to Quotes
        </Button>
      </div>
    </div>
  );
};
