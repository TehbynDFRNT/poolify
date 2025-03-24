
import { useState } from "react";
import { UseMicroDigReturn } from "./types";

export const useMicroDig = (): UseMicroDigReturn => {
  const [microDigRequired, setMicroDigRequired] = useState(false);
  const [microDigPrice, setMicroDigPrice] = useState(0);
  const [microDigNotes, setMicroDigNotes] = useState("");

  return {
    microDigRequired,
    setMicroDigRequired,
    microDigPrice,
    setMicroDigPrice,
    microDigNotes,
    setMicroDigNotes
  };
};
