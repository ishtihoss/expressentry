import React from 'react';

interface SubscribeButtonProps {
  className?: string;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ className = '' }) => {
  return (
    <button
      className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group ${className}`}
      onClick={() => {/* Add your subscription logic here */}}
    >
      <span className="relative z-10">Upgrade to Premium</span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition duration-300 ease-in-out"></div>
    </button>
  );
};