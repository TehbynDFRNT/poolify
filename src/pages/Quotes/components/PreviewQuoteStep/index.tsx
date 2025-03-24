
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Save, FileText, Send } from "lucide-react";

interface PreviewQuoteStepProps {
  onPrevious: () => void;
}

export const PreviewQuoteStep = ({ onPrevious }: PreviewQuoteStepProps) => {
  const { quoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.error("Please complete the previous steps first");
    }
  }, [quoteData.pool_id]);

  const handleSaveDraft = async () => {
    if (!quoteData.id) {
      toast.error("Quote ID not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status: "draft" })
        .eq("id", quoteData.id);

      if (error) throw error;
      
      toast.success("Quote saved as draft");
      navigate("/quotes");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuote = async () => {
    if (!quoteData.id) {
      toast.error("Quote ID not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status: "pending" })
        .eq("id", quoteData.id);

      if (error) throw error;
      
      toast.success("Quote sent to customer");
      navigate("/quotes");
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Failed to send quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Preview the final quote before saving or sending to the customer.
      </p>
      
      {/* This will be implemented with the actual quote preview */}
      <Card>
        <CardContent className="pt-6">
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Quote preview coming soon. This will show a formatted preview of the quote document.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          
          <Button 
            variant="outline"
            disabled={isSubmitting}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          
          <Button 
            onClick={handleSendQuote}
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Quote
          </Button>
        </div>
      </div>
    </div>
  );
};
