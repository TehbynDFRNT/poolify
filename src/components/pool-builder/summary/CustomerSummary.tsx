import { PoolProject } from "@/types/pool";
import React from "react";
import { EditSectionLink } from "./EditSectionLink";

interface CustomerSummaryProps {
    customer: PoolProject | null;
    customerId?: string | null;
}

export const CustomerSummary: React.FC<CustomerSummaryProps> = ({ customer, customerId }) => {
    if (!customer) return null;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                {customerId && <EditSectionLink section="builder" customerId={customerId} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Primary Owner</p>
                    <p className="font-medium">{customer.owner1}</p>
                </div>

                {customer.owner2 && (
                    <div>
                        <p className="text-sm text-muted-foreground">Secondary Owner</p>
                        <p className="font-medium">{customer.owner2}</p>
                    </div>
                )}

                <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.email}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Home Address</p>
                    <p className="font-medium">{customer.home_address}</p>
                </div>

                {customer.site_address && (
                    <div>
                        <p className="text-sm text-muted-foreground">Site Address</p>
                        <p className="font-medium">{customer.site_address}</p>
                    </div>
                )}

                <div>
                    <p className="text-sm text-muted-foreground">Proposal Name</p>
                    <p className="font-medium">{customer.proposal_name}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Installation Area</p>
                    <p className="font-medium">{customer.installation_area}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Resident Homeowner</p>
                    <p className="font-medium">{customer.resident_homeowner ? "Yes" : "No"}</p>
                </div>
            </div>
        </div>
    );
}; 