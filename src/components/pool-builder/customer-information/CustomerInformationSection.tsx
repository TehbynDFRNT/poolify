
import React, { useState } from "react";
import OwnerDetailsSection from "./OwnerDetailsSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import ProposalInfoSection from "./ProposalInfoSection";

const CustomerInformationSection: React.FC = () => {
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
    </div>
  );
};

export default CustomerInformationSection;
