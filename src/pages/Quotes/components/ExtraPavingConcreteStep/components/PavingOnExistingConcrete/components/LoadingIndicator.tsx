
import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading paving options..."
}) => {
  return (
    <div className="py-4 text-center text-gray-500">
      {message}
    </div>
  );
};
