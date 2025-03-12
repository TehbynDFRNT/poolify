
export const QuoteLoadingState = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500">Loading quote data...</p>
      </div>
    </div>
  );
};
