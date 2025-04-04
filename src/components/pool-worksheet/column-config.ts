
import { ColumnGroup, ColumnLabels } from "./types";

// Define some default fixed costs columns that will be used as fallback
export const defaultFixedCostColumns = ["fixed_costs_total"];

// Define column groups for organizing the table columns
export const columnGroups: ColumnGroup[] = [
  {
    id: "identification",
    title: "Pool Identification",
    color: "bg-blue-100 text-blue-800",
    columns: ["name", "range"]  // Columns 1, 2
  },
  {
    id: "dimensions",
    title: "Pool Dimensions",
    color: "bg-blue-100 text-blue-800",
    columns: ["length", "width", "depth_shallow", "depth_deep"] // Columns 3, 4, 5, 6
  },
  {
    id: "volume",
    title: "Volume Information",
    color: "bg-blue-100 text-blue-800",
    columns: ["waterline_l_m", "volume_liters", "weight_kg"] // Columns 7, 8, 9
  },
  {
    id: "minerals",
    title: "Salt & Minerals",
    color: "bg-blue-100 text-blue-800",
    columns: ["salt_volume_bags", "salt_volume_bags_fixed", "minerals_kg_initial", "minerals_kg_topup"] // Columns 10, 11, 12, 13
  },
  {
    id: "pricing",
    title: "Pool Pricing",
    color: "bg-blue-100 text-blue-800",
    columns: ["buy_price_ex_gst", "buy_price_inc_gst"] // Columns 14, 15
  },
  {
    id: "filtration",
    title: "Filtration Package",
    color: "bg-green-100 text-green-800",
    columns: ["default_package", "package_price"] // Columns 16, 17
  },
  {
    id: "crane",
    title: "Crane Information",
    color: "bg-amber-100 text-amber-800",
    columns: ["crane_type", "crane_cost"] // Columns 18, 19
  },
  {
    id: "excavation",
    title: "Excavation",
    color: "bg-orange-100 text-orange-800",
    columns: ["dig_type", "dig_total"] // Columns 20, 21
  },
  {
    id: "construction_costs",
    title: "Pool Individual Costs",
    color: "bg-amber-100 text-amber-800",
    columns: ["pea_gravel", "install_fee", "trucked_water", "salt_bags", "coping_supply", "beam", "coping_lay", "total_cost"] // Columns 22-29
  },
  {
    id: "fixed_costs",
    title: "Fixed Costs",
    color: "bg-purple-100 text-purple-800",
    columns: defaultFixedCostColumns // Columns 30-39 (variable)
  },
  {
    id: "true_cost",
    title: "True Cost",
    color: "bg-red-100 text-red-800",
    columns: ["true_cost"] // Column 40, 41
  }
];

// Map of column keys to display names
export const columnLabels: ColumnLabels = {
  "name": "Name",
  "range": "Range",
  "length": "Length",
  "width": "Width",
  "depth_shallow": "Depth (Shallow)",
  "depth_deep": "Depth (Deep)",
  "waterline_l_m": "Waterline (L/m)",
  "volume_liters": "Volume (L)",
  "weight_kg": "Weight (kg)",
  "salt_volume_bags": "Salt Bags",
  "salt_volume_bags_fixed": "Salt Bags (Fixed)",
  "minerals_kg_initial": "Initial Minerals (kg)",
  "minerals_kg_topup": "Topup Minerals (kg)",
  "buy_price_ex_gst": "Buy Price (ex GST)",
  "buy_price_inc_gst": "Buy Price (inc GST)",
  "default_package": "Filtration Package",
  "package_price": "Package Price",
  "excavation": "Excavation",
  "pea_gravel": "Pea Gravel",
  "install_fee": "Install Fee",
  "trucked_water": "Trucked Water",
  "salt_bags": "Salt Bags",
  "coping_supply": "Coping Supply",
  "beam": "Beam",
  "coping_lay": "Coping Lay",
  "total_cost": "Total Cost",
  
  // Add new crane column labels
  "crane_type": "Crane Type",
  "crane_cost": "Crane Cost",
  
  // Initialize fixed costs total
  "fixed_costs_total": "Fixed Costs Total",
  
  // Add new True Cost column label
  "true_cost": "True Cost",
  
  // Excavation
  "dig_type": "Dig Type",
  "dig_total": "Dig Total"
};

// Default visible column groups - ensure fixed_costs and true_cost are included
export const defaultVisibleGroups = [
  "identification", "dimensions", "pricing", "crane", "excavation", "construction_costs", "fixed_costs", "true_cost"
];

// Define essential column groups to include columns 1,2,15,17,19,21,29,40,41
export const essentialGroups = ["identification", "pricing", "filtration", "crane", "excavation", "construction_costs", "true_cost"];

