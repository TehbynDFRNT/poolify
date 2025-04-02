
// Define column groups for organizing the table columns
export const columnGroups = [
  {
    id: "identification",
    title: "Pool Identification",
    color: "bg-blue-100 text-blue-800",
    columns: ["name", "range"]
  },
  {
    id: "dimensions",
    title: "Pool Dimensions",
    color: "bg-blue-100 text-blue-800",
    columns: ["length", "width", "depth_shallow", "depth_deep"]
  },
  {
    id: "volume",
    title: "Volume Information",
    color: "bg-blue-100 text-blue-800",
    columns: ["waterline_l_m", "volume_liters", "weight_kg"]
  },
  {
    id: "minerals",
    title: "Salt & Minerals",
    color: "bg-blue-100 text-blue-800",
    columns: ["salt_volume_bags", "salt_volume_bags_fixed", "minerals_kg_initial", "minerals_kg_topup"]
  },
  {
    id: "pricing",
    title: "Pool Pricing",
    color: "bg-blue-100 text-blue-800",
    columns: ["buy_price_ex_gst", "buy_price_inc_gst"]
  },
  {
    id: "filtration",
    title: "Filtration Package",
    color: "bg-green-100 text-green-800",
    columns: ["default_package", "package_price"]
  },
  {
    id: "construction_costs",
    title: "Pool Individual Costs",
    color: "bg-amber-100 text-amber-800",
    columns: ["excavation", "pea_gravel", "install_fee", "trucked_water", "salt_bags", "coping_supply", "beam", "coping_lay", "total_cost"]
  },
  {
    id: "fixed_costs",
    title: "Fixed Costs",
    color: "bg-purple-100 text-purple-800",
    columns: [] // This will be populated dynamically, and total will be added automatically
  }
];

// Map of column keys to display names
export const columnLabels: Record<string, string> = {
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
  "fixed_costs_total": "FIXED COSTS TOTAL",
};
