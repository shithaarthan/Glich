import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CreateEchoModal from '@/components/modals/CreateEchoModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';

const MainLayout: React.FC = () => {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Modals */}
      <CreateEchoModal />
      <EditProfileModal />
    </div>
  );
};

export default MainLayout;
