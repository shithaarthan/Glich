import React from 'react';
import { FaBrain, FaBars } from 'react-icons/fa'; // Replaced BrainCircuit and Menu with FaBrain and FaBars
import { useUIStore } from '@/store/uiStore';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  return (
    <header className="lg:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
      <div className="flex items-center space-x-2">
        <FaBrain className="text-primary" size={28} /> {/* Used FaBrain */}
        <h1 className="text-xl font-bold text-text">Glitchary</h1>
      </div>
      <Button variant="ghost" size="sm" onClick={toggleSidebar} className="!rounded-full w-10 h-10 p-0">
        <FaBars size={24} /> {/* Used FaBars */}
      </Button>
    </header>
  );
};

export default Header;
