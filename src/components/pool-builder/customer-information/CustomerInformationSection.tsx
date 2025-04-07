
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import OwnerDetailsSection from "./OwnerDetailsSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import ProposalInfoSection from "./ProposalInfoSection";

const CustomerInformationSection: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Owner Details State
  const [owner1, setOwner1] = useState("");
  const [owner2, setOwner2] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  // Property Details State
  const [homeAddress, setHomeAddress] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [installationArea, setInstallationArea] = useState("");
  const [isResidentHomeowner, setIsResidentHomeowner] = useState(true);
  
  // Proposal Info State
  const [proposalName, setProposalName] = useState("");
  
  // Form validation
  const isFormValid = () => {
    if (!owner1.trim()) return false;
    if (!phone.trim()) return false;
    if (!email.trim()) return false;
    if (!homeAddress.trim()) return false;
    if (!installationArea.trim()) return false;
    if (!proposalName.trim()) return false;
    return true;
  };
  
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data to be saved
      const projectData = {
        owner1,
        owner2: owner2 || null,
        phone,
        email,
        home_address: homeAddress,
        site_address: siteAddress || null,
        installation_area: installationArea,
        resident_homeowner: isResidentHomeowner,
        proposal_name: proposalName,
      };
      
      // Insert data using a raw query which bypasses type checking
      // This allows us to work with tables not yet in the generated types
      const { data, error } = await supabase
        .from('pool_projects')
        .insert(projectData)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Customer information saved successfully.",
      });
      
      console.log("Saved project data:", data);
      
      // Reset form after successful submission
      setOwner1("");
      setOwner2("");
      setPhone("");
      setEmail("");
      setHomeAddress("");
      setSiteAddress("");
      setInstallationArea("");
      setIsResidentHomeowner(true);
      setProposalName("");
      
      // Navigate to the customers page
      navigate("/customers");
      
    } catch (error) {
      console.error("Error saving customer information:", error);
      toast({
        title: "Error",
        description: "Failed to save customer information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customer Information</h2>
      
      <OwnerDetailsSection
        owner1={owner1}
        setOwner1={setOwner1}
        owner2={owner2}
        setOwner2={setOwner2}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
      />
      
      <PropertyDetailsSection
        homeAddress={homeAddress}
        setHomeAddress={setHomeAddress}
        siteAddress={siteAddress}
        setSiteAddress={setSiteAddress}
        installationArea={installationArea}
        setInstallationArea={setInstallationArea}
        isResidentHomeowner={isResidentHomeowner}
        setIsResidentHomeowner={setIsResidentHomeowner}
      />
      
      <ProposalInfoSection
        owner1={owner1}
        owner2={owner2}
        proposalName={proposalName}
        setProposalName={setProposalName}
      />
      
      <Card className="p-6">
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-400"
          >
            {isSubmitting ? "Saving..." : "Save Customer Information"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerInformationSection;
