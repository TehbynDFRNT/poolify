
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuoteErrorStateProps {
  error: string;
}

export const QuoteErrorState = ({ error }: QuoteErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={() => navigate('/quotes')} variant="outline">
        Back to Quotes
      </Button>
    </div>
  );
};
