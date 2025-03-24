
import { ReactNode } from "react";

interface FormHeaderProps {
  children: ReactNode;
}

export const FormHeader = ({ children }: FormHeaderProps) => {
  return (
    <p className="text-muted-foreground">
      {children}
    </p>
  );
};
