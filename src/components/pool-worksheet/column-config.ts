
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
    id: "pricing",
    title: "Pool Costs",
    color: "bg-blue-100 text-blue-800",
    columns: ["buy_price_inc_gst", "fixed_costs_total", "filtration_costs", "crane_cost", "excavation", "individual_costs", "true_cost", "margin_editable", "web_price"] // Added web_price column
  }
];

// Map of column keys to display names
export const columnLabels: ColumnLabels = {
  "name": "Name",
  "range": "Range",
  "buy_price_ex_gst": "Buy Price (ex GST)",
  "buy_price_inc_gst": "Buy Price (inc GST)",
  "fixed_costs_total": "Fixed Costs",
  "filtration_costs": "Filtration Costs",
  "crane_cost": "Crane Costs",
  "excavation": "Excavation Costs",
  "individual_costs": "Individual Costs",
  "true_cost": "True Cost",
  "margin_percentage": "Margin %",
  "margin_editable": "Margin %",
  "web_price": "RRP", // Added new column label for RRP
};

// Default visible column groups - only show identification and pricing
export const defaultVisibleGroups = ["identification", "pricing"];

// Define essential column groups - only the ones we want to show
export const essentialGroups = ["identification", "pricing"];
