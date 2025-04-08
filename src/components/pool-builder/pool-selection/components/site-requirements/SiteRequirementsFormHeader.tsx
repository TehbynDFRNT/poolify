
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface SiteRequirementsFormHeaderProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SiteRequirementsFormHeader: React.FC<SiteRequirementsFormHeaderProps> = ({
  title,
  icon,
  className
}) => {
  return (
    <CardHeader className={className}>
      <CardTitle className="text-xl flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </CardTitle>
    </CardHeader>
  );
};
