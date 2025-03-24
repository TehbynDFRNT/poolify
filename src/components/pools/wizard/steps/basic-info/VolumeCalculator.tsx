
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const VolumeCalculator: React.FC = () => {
  const { watch, setValue } = useFormContext();
  
  const length = watch("length");
  const width = watch("width");
  const depthShallow = watch("depth_shallow");
  const depthDeep = watch("depth_deep");
  
  // Calculate volume when dimensions change
  useEffect(() => {
    if (length && width && depthShallow && depthDeep) {
      // Average depth calculation
      const avgDepth = (Number(depthShallow) + Number(depthDeep)) / 2;
      
      // Volume calculation in cubic meters, then converted to liters
      const volumeCubicMeters = Number(length) * Number(width) * avgDepth;
      const volumeLiters = volumeCubicMeters * 1000;
      
      // Waterline calculation (simplified assumption)
      const waterlineLM = 2 * (Number(length) + Number(width));
      
      setValue("volume_liters", volumeLiters);
      setValue("waterline_l_m", waterlineLM);
    }
  }, [length, width, depthShallow, depthDeep, setValue]);
  
  return null; // This is a utility component with no UI
};

export default VolumeCalculator;
