
import React from "react";

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default FormSection;
