import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CreateEchoModal from '@/components/modals/CreateEchoModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8",
          "ml-0 lg:ml-[280px]" // Dynamic margin: ml-0 on mobile, ml-[280px] on lg and up
        )}>
          <div className="max-w-8xl mx-auto">
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