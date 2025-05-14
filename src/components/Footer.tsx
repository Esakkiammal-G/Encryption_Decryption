import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto p-4 rounded-xl backdrop-blur-md bg-opacity-30 shadow-lg
      dark:bg-gray-800/30 dark:text-gray-300
      bg-white/30 text-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {currentYear} CryptoVault. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a 
            href="#" 
            className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            aria-label="Github"
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;