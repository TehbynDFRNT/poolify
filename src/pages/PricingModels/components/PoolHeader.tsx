
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PoolHeaderProps = {
  name: string;
  range: string;
};

export const PoolHeader = ({ name, range }: PoolHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
        <p className="text-gray-500 mt-1">{range} Range</p>
      </div>
      <Calculator className="h-6 w-6 text-gray-500" />
    </div>
  );
};
