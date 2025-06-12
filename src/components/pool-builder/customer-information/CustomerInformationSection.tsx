
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useContractCustomerDetails } from "@/components/contract/hooks/useContractCustomerDetails";
import { useContractDetailsConfirmed } from "@/components/contract/hooks/useContractDetailsConfirmed";
import OwnerDetailsSection from "./OwnerDetailsSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import ProposalInfoSection from "./ProposalInfoSection";

interface CustomerInformationSectionProps {
  existingCustomer?: any; // Consider using a more specific type like PoolProject | null
  readonly?: boolean;
}

const CustomerInformationSection: React.FC<CustomerInformationSectionProps> = ({ existingCustomer, readonly = false }) => {
  console.log("CustomerInformationSection: Component rendered. Received existingCustomer prop:", existingCustomer);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if we're in contract context
  const isContractContext = location.pathname.includes('/contract-builder');
  const customerId = searchParams.get('customerId');
  
  // Contract customer details hook
  const { saveContractCustomerDetails, loadContractCustomerDetails, isSubmitting: isContractSubmitting } = useContractCustomerDetails();
  
  // Contract confirmation hook (for refreshing after save)
  const { isConfirmed: contractDetailsExist, refreshConfirmationStatus } = useContractDetailsConfirmed(customerId);
  
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
  
  // Load existing customer data
  useEffect(() => {
    console.log("CustomerInformationSection: useEffect triggered with existingCustomer:", existingCustomer);
    if (existingCustomer) {
      setOwner1(existingCustomer.owner1 || "");
      setOwner2(existingCustomer.owner2 || "");
      setPhone(existingCustomer.phone || "");
      setEmail(existingCustomer.email || "");
      setHomeAddress(existingCustomer.home_address || "");
      setSiteAddress(existingCustomer.site_address || "");
      setInstallationArea(existingCustomer.installation_area || "");
      setIsResidentHomeowner(existingCustomer.resident_homeowner === undefined ? true : existingCustomer.resident_homeowner); // Handle undefined
      setProposalName(existingCustomer.proposal_name || "");
      console.log("CustomerInformationSection: Form populated with existingCustomer data.");
    } else {
      console.log("CustomerInformationSection: existingCustomer is null or undefined. Resetting form fields for new entry.");
      // Reset form for a truly new customer or if data isn't loaded
      setOwner1("");
      setOwner2("");
      setPhone("");
      setEmail("");
      setHomeAddress("");
      setSiteAddress("");
      setInstallationArea("");
      setIsResidentHomeowner(true);
      setProposalName("");
    }
  }, [existingCustomer]);
  
  // Form validation
  const isFormValid = () => {
    if (!owner1.trim()) return false;
    if (!phone.trim()) return false;
    if (!email.trim()) return false; // Consider adding email format validation
    if (!homeAddress.trim()) return false;
    if (isContractContext) {
      // In contract context, we don't require installation_area and proposal_name
      return true;
    }
    if (!installationArea.trim()) return false;
    if (!proposalName.trim()) return false;
    return true;
  };
  
  const handleSubmit = async () => {
    console.log("CustomerInformationSection: handleSubmit called. existingCustomer:", existingCustomer, "Form valid:", isFormValid());
    console.log("🎯 Context detection:", { isContractContext, customerId, pathname: location.pathname });
    
    if (!isFormValid()) {
      const description = isContractContext 
        ? "Please fill in all required fields. Owner 1, Phone, Email, and Home Address are mandatory."
        : "Please fill in all required fields. Owner 1, Phone, Email, Home Address, Installation Area, and Proposal Name are mandatory.";
      
      toast({
        title: "Validation Error",
        description,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If we're in contract context and have a customerId, save to contract table
      if (isContractContext && customerId) {
        console.log("🔗 Saving to contract table for customerId:", customerId);
        
        const contractData = {
          owner1,
          owner2: owner2 || null,
          phone,
          email,
          home_address: homeAddress,
          site_address: siteAddress || homeAddress,
          resident_homeowner: isResidentHomeowner,
        };
        
        await saveContractCustomerDetails(customerId, contractData);
        
        // Refresh the confirmation status after successful save
        console.log("🔄 Refreshing contract confirmation status after successful save");
        await refreshConfirmationStatus();
        
        return; // Exit early for contract context
      }
      
      // Default pool_projects table logic for pool builder context
      const projectData = {
        owner1,
        owner2: owner2 || null,
        phone,
        email,
        home_address: homeAddress,
        site_address: siteAddress || homeAddress, // Default site_address to home_address if empty
        installation_area: installationArea,
        resident_homeowner: isResidentHomeowner,
        proposal_name: proposalName,
      };
      console.log("CustomerInformationSection: Submitting data to pool_projects:", projectData);
      
      let response: any;
      
      if (existingCustomer && existingCustomer.id) {
        console.log("CustomerInformationSection: Updating existing customer with ID:", existingCustomer.id);
        response = await supabase
          .from('pool_projects')
          .update(projectData)
          .eq('id', existingCustomer.id)
          .select();
      } else {
        console.log("CustomerInformationSection: Inserting new customer.");
        response = await supabase
          .from('pool_projects')
          .insert(projectData)
          .select();
      }
      
      const { data, error } = response;
      
      if (error) {
        console.error("CustomerInformationSection: Error saving customer information:", error);
        throw error;
      }
      
      toast({
        title: "Success!",
        description: (existingCustomer && existingCustomer.id)
          ? "Customer information updated successfully." 
          : "Customer information saved successfully.",
      });
      
      console.log("CustomerInformationSection: Saved project data:", data);
      
      if (data && data.length > 0 && data[0].id) {
        const savedCustomerId = data[0].id;
        localStorage.setItem('currentCustomerId', savedCustomerId); // Update local storage if needed
        
        if (!(existingCustomer && existingCustomer.id)) { // If it was a new customer insert
          // Navigate to customers page or to this customer's pool builder page
          navigate(`/pool-builder?customerId=${savedCustomerId}`); // Navigate to the newly created/updated customer's builder
        } else {
          // Potentially refresh data or indicate success without navigation
          // For now, no navigation on update to stay on the page
        }
      } else {
         console.warn("CustomerInformationSection: Save operation did not return expected data or ID.");
      }
      
      // Do not reset form on update, only on new customer creation that navigates away.
      // The useEffect will repopulate if existingCustomer changes, or if we navigate and it becomes a new one.

    } catch (error) {
      // Error already logged by the specific supabase call or here
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
      <h2 className="text-2xl font-bold">
        {readonly ? "Proposal Customer Information" : existingCustomer ? "Edit Customer Information" : "New Customer Information"}
      </h2>
      
      <OwnerDetailsSection
        owner1={owner1}
        setOwner1={setOwner1}
        owner2={owner2}
        setOwner2={setOwner2}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
        readonly={readonly}
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
        readonly={readonly}
      />
      
      {!isContractContext && (
        <ProposalInfoSection
          owner1={owner1}
          owner2={owner2}
          proposalName={proposalName}
          setProposalName={setProposalName}
          readonly={readonly}
        />
      )}
      
      {(isContractContext || !readonly) && (
        <Card className="p-6">
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || isContractSubmitting}
              className="bg-primary hover:bg-primary-400" // Ensure 'primary' is defined in your Tailwind config or use a standard color like 'bg-blue-600 hover:bg-blue-700'
            >
              {(isSubmitting || isContractSubmitting) ? "Saving..." : 
                isContractContext ? (contractDetailsExist ? "Update Contract Details" : "Confirm Contract Details") :
                (existingCustomer && existingCustomer.id)
                  ? "Update Customer Information" 
                  : "Save Customer Information"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CustomerInformationSection;

