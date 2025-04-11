
import { useState } from "react";

// Hand Grab Rails data
const handGrabRailsData = [
  {
    id: "1",
    model_number: "Black RTD-348BL",
    description: "Black Hand Grab Rail",
    cost_price: 793,
    margin: 357,
    total: 1150
  },
  {
    id: "2",
    model_number: "Taupe RTD 348T",
    description: "Taupe Hand Grab Rail",
    cost_price: 793,
    margin: 357,
    total: 1150
  },
  {
    id: "3",
    model_number: "White RTD-348W",
    description: "White Hand Grab Rail",
    cost_price: 793,
    margin: 357,
    total: 1150
  }
];

export const useHandGrabRails = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHandGrabRails = handGrabRailsData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.model_number.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    filteredHandGrabRails
  };
};
