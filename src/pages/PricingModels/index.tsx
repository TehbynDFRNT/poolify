
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";

const PricingModels = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pricing Models</h1>
            <p className="text-gray-500 mt-1">Manage and calculate pricing models</p>
          </div>
          <DollarSign className="h-6 w-6 text-gray-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/pricing-models/worksheet">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Pricing Worksheet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Calculate comprehensive pricing models combining all cost factors
                </p>
              </CardContent>
            </Card>
          </Link>
          
          {/* Additional pricing model sections can be added here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PricingModels;
