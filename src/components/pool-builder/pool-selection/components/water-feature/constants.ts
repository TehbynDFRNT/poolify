
// Constants for water feature options
export const WATER_FEATURE_SIZES = [
  { 
    id: "small", 
    size: "1.6m x 0.8m", 
    basePrice: 3200,
    margin: 800,
    total: 3200, 
  },
  { 
    id: "medium", 
    size: "2m x 1m", 
    basePrice: 3500,
    margin: 900,
    total: 3500, 
  },
];

export const FRONT_FINISH_OPTIONS = [
  { value: "none", label: "None" },
  { value: "bag_washed", label: "Bag Washed" },
  { value: "stackstone", label: "Stackstone" },
  { value: "other", label: "Other" },
];

export const FINISH_OPTIONS = [
  { value: "none", label: "None" },
  { value: "coping_style", label: "Coping Style" },
  { value: "other", label: "Other" },
];

export const LED_BLADE_OPTIONS = [
  { value: "none", label: "None", price: 0, margin: 0 },
  { value: "900mm", label: "900mm LED Blade", price: 300, margin: 100 },
  { value: "1200mm", label: "1200mm LED Blade", price: 400, margin: 100 },
];

export const BACK_CLADDING_PRICE = 1000;
export const BACK_CLADDING_MARGIN = 300;
