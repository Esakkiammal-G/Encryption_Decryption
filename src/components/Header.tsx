import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Lock, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md bg-opacity-30 shadow-lg transition-all duration-300 mb-6
      dark:bg-gray-800/30 dark:text-white 
      bg-white/30 text-gray-800">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-purple-500 rounded-full">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-purple-600 dark:text-purple-400">Crypto</span>
          <span>Vault</span>
        </h1>
      </div>
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-purple-700" />
        )}
      </button>
    </header>
  );
};

export default Header;