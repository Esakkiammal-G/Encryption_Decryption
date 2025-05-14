import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Track mouse position for subtle gradient movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set loaded state after a small delay for entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  
  // Calculate gradient position based on mouse
  const gradientStyle = {
    backgroundPosition: `${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%`,
  };
  
  return (
    <div 
      className={`min-h-screen transition-colors duration-1000 overflow-hidden relative bg-gradient-animate
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/90 to-gray-900' 
          : 'bg-gradient-to-br from-gray-100 via-purple-100/90 to-gray-100'
        }`}
      style={gradientStyle}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute top-[10%] right-[15%] w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-slow
            ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'}`}
        ></div>
        <div 
          className={`absolute bottom-[20%] left-[10%] w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow
            ${theme === 'dark' ? 'bg-teal-600' : 'bg-teal-400'}`}
          style={{ animationDelay: '1s' }}
        ></div>
      </div>
      
      <div 
        className={`container mx-auto px-4 py-8 flex flex-col min-h-screen relative z-10 transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Header />
        <main className="flex-grow my-8 animate-slideIn" style={{ animationDelay: '0.1s' }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;