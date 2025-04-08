
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
    columns: ["buy_price_ex_gst", "buy_price_inc_gst", "fixed_costs_total"] // Added fixed_costs_total
  }
];

// Map of column keys to display names
export const columnLabels: ColumnLabels = {
  "name": "Name",
  "range": "Range",
  "buy_price_ex_gst": "Buy Price (ex GST)",
  "buy_price_inc_gst": "Buy Price (inc GST)",
  "fixed_costs_total": "Fixed Costs",
};

// Default visible column groups - only show identification and pricing
export const defaultVisibleGroups = ["identification", "pricing"];

// Define essential column groups - only the ones we want to show
export const essentialGroups = ["identification", "pricing"];
