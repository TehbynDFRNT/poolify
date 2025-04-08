
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SiteRequirementsFormHeader } from "./SiteRequirementsFormHeader";

interface AdditionalNotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const AdditionalNotesSection: React.FC<AdditionalNotesSectionProps> = ({
  notes,
  setNotes
}) => {
  return (
    <Card>
      <SiteRequirementsFormHeader title="Additional Notes" />
      <CardContent>
        <Textarea
          id="site-notes"
          placeholder="Enter any additional notes about site requirements..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};
