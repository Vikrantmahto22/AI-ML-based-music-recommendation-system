import React from 'react';
import { Music } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const { currentEmotion } = useAppContext();
  
  // Determine gradient based on emotion
  const gradientClass = `gradient-${currentEmotion}`;
  
  return (
    <header className={`${gradientClass} bg-opacity-90 backdrop-blur-sm shadow-md`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Music className="w-8 h-8 text-white mr-2" />
          <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">MoodMelody</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-4 text-white">
              <li>
                <a href="#" className="hover:text-white/80 transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-white/80 transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-white/80 transition-colors">History</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;