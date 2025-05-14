import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`rounded-2xl p-6 backdrop-blur-lg transition-all duration-300
        dark:bg-gray-800/30 dark:text-white dark:shadow-purple-900/20
        bg-white/40 text-gray-800 shadow-lg shadow-purple-300/20 
        border border-gray-200/20 dark:border-gray-700/20
        ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}
        ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;