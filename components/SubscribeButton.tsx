import React from 'react';

interface SubscribeButtonProps {
  onClick: () => void;
  isVisible?: boolean;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ onClick, isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Upgrade to Premium
    </button>
  );
};