import React from "react";

const LoadingAnimate = ({ isOpen, children = "Loading..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white mb-4"></div>
        <p className="text-white text-xl">{children}</p>
      </div>
    </div>
  );
};

export default LoadingAnimate;
