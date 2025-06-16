import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Percent } from "lucide-react";
import { DiscountPromotionSection } from "./components/DiscountPromotionSection";
import { AddDiscountPromotionForm } from "./components/AddDiscountPromotionForm";
import { useDiscountPromotions } from "@/hooks/useDiscountPromotions";

const DiscountPromotions = () => {
  const {
    discountPromotions,
    isLoading,
    editingId,
    editingValue,
    isAdding,
    setIsAdding,
    startEditing,
    handleSave,
    handleCancel,
    setEditingValue,
  } = useDiscountPromotions();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/discount-promotions" className="transition-colors hover:text-foreground">
                Discount Promotions
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Discount Promotions</h1>
            <p className="text-gray-500 mt-1">Manage discount promotions and special offers</p>
          </div>
          <Percent className="h-6 w-6 text-gray-500" />
        </div>

        <DiscountPromotionSection
          discountPromotions={discountPromotions}
          isLoading={isLoading}
          isAdding={isAdding}
          editingId={editingId}
          editingValue={editingValue}
          onAddToggle={() => setIsAdding(!isAdding)}
          onEdit={startEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onValueChange={setEditingValue}
          AddForm={AddDiscountPromotionForm}
        />
      </div>
    </DashboardLayout>
  );
};

export default DiscountPromotions;